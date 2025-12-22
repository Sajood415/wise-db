import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Payment from '@/models/Payment';
import EnterpriseRequest from '@/models/EnterpriseRequest';
import EnterprisePayment from '@/models/EnterprisePayment';
import { sendMail } from '@/lib/mailer';
import { emailTemplates } from '@/lib/emailTemplates';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const runtime = 'nodejs';

async function processIndividualPayment(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const userId = metadata.userId;
  const sessionId = session.id;

  if (!userId) {
    console.error('Individual payment: No userId in session metadata');
    return;
  }

  await dbConnect();

  const payment = await Payment.findOne({ stripeSessionId: sessionId });
  if (!payment) {
    console.error(`Individual payment: Payment record not found for session ${sessionId}`);
    return;
  }

  if (payment.status === 'completed') {
    return;
  }

  payment.status = 'completed';
  if (session.payment_intent) {
    payment.stripePaymentIntentId = session.payment_intent as string;
  }
  await payment.save();

  const user = await User.findById(userId);
  if (!user) {
    console.error(`Individual payment: User not found ${userId}`);
    return;
  }

  const packageType = payment.packageType;
  const searchesIncluded = payment.searchesIncluded;
  const trialExtensionDays = payment.trialExtensionDays;
  const creditsPurchased = payment.creditsPurchased;

  if (packageType === 'pay_as_you_go') {
    const currentLimit = user.subscription.searchLimit || 0;
    const creditsToAdd = creditsPurchased || 0;
    if (creditsToAdd <= 0) {
      console.error('Individual payment: Invalid credits purchased');
      return;
    }
    const newLimit = currentLimit + creditsToAdd;

    const currentDate = new Date();
    const packageEndDate = new Date(currentDate);
    packageEndDate.setDate(packageEndDate.getDate() + 30);

    user.subscription = {
      ...user.subscription.toObject(),
      type: 'pay_as_you_go',
      status: 'active',
      searchLimit: newLimit,
      canAccessRealData: true,
      packageEndsAt: packageEndDate,
      lowQuotaNotified: false,
    };
    (user as any).packageName = 'Pay As You Go';
  } else {
    const currentDate = new Date();
    const newPackageEnd = new Date(currentDate);
    newPackageEnd.setDate(newPackageEnd.getDate() + trialExtensionDays);

    user.subscription = {
      ...user.subscription.toObject(),
      type: 'paid_package',
      status: 'active',
      packageEndsAt: newPackageEnd,
      searchLimit: searchesIncluded,
      searchesUsed: 0,
      canAccessRealData: true,
      lowQuotaNotified: false,
      expiryReminderSent: false,
    };

    (user as any).packageName = payment.packageName;
  }

  await user.save();
}

async function processEnterprisePayment(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const enterpriseRequestId = metadata.enterpriseRequestId;
  const sessionId = session.id;

  if (!enterpriseRequestId) {
    console.error('Enterprise payment: No enterpriseRequestId in session metadata');
    return;
  }

  await dbConnect();

  const allowanceSearches = Number(metadata.allowanceSearches || 0);
  const allowanceUsers = Number(metadata.allowanceUsers || 0);
  const pricingAmount = Number(metadata.pricingAmount || 0);
  const pricingCurrency = String(metadata.pricingCurrency || 'USD').toUpperCase();
  const enterpriseAdminEmail = metadata.enterpriseAdminEmail || undefined;

  const doc: any = await EnterpriseRequest.findByIdAndUpdate(
    enterpriseRequestId,
    {
      $set: {
        paymentReceived: true,
        paymentMethod: 'stripe',
        paymentTxnId: session.payment_intent ? String(session.payment_intent) : session.id || undefined,
        paymentTxnDate: new Date(),
        pricingAmount,
        pricingCurrency,
        allowanceSearches,
        allowanceUsers,
        enterpriseAdminEmail,
      },
    },
    { new: true }
  ).lean();

  if (!doc) {
    console.error(`Enterprise payment: Enterprise request not found ${enterpriseRequestId}`);
    return;
  }

  try {
    await EnterprisePayment.findOneAndUpdate(
      { stripeSessionId: session.id },
      {
        $set: {
          enterpriseRequestId,
          status: 'completed',
          stripePaymentIntentId: session.payment_intent ? String(session.payment_intent) : undefined,
          method: 'stripe',
          paidAt: new Date(),
          amount: pricingAmount,
          currency: pricingCurrency,
          allowanceSearches,
          allowanceUsers,
          enterpriseAdminEmail,
          metadata: metadata.source ? { source: String(metadata.source) } : undefined,
        },
      },
      { upsert: true }
    );
  } catch (e) {
    console.error('Failed to upsert enterprise payment:', e);
  }

  if (enterpriseAdminEmail) {
    try {
      const adminUser = await User.findOne({
        email: enterpriseAdminEmail.toLowerCase(),
        role: 'enterprise_admin'
      });

      if (adminUser) {
        const currentDate = new Date();
        const newPackageEnd = new Date(currentDate);
        newPackageEnd.setDate(newPackageEnd.getDate() + 30);

        adminUser.subscription = {
          ...adminUser.subscription.toObject(),
          type: 'enterprise_package',
          status: 'active',
          searchLimit: allowanceSearches,
          searchesUsed: 0,
          canAccessRealData: true,
          packageEndsAt: newPackageEnd,
          lowQuotaNotified: false,
          expiryReminderSent: false,
        };
        await adminUser.save();
      }
    } catch (e) {
      console.error('Failed to update enterprise admin subscription:', e);
    }
  }

  if (doc.signupToken && doc.enterpriseAdminEmail) {
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL || '';
      const params = new URLSearchParams();
      params.set('enterprise', String(enterpriseRequestId));
      params.set('token', String(doc.signupToken));
      if (doc.enterpriseAdminEmail) params.set('email', String(doc.enterpriseAdminEmail));
      const link = base ? `${base}/signup?${params.toString()}` : '';
      const t = emailTemplates.enterprisePaymentReceivedSignup;
      await sendMail({
        to: doc.enterpriseAdminEmail,
        subject: t.subject({}),
        text: t.text({ signupLink: link }),
        html: t.html({ signupLink: link }),
      });
    } catch (e) {
      console.error('Failed to send enterprise signup email:', e);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Webhook signature missing');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status !== 'paid' && session.status !== 'complete') {
          return NextResponse.json({ received: true, skipped: 'not_paid' });
        }

        const metadata = session.metadata || {};

        if (metadata.enterpriseRequestId) {
          await processEnterprisePayment(session);
        } else if (metadata.userId) {
          await processIndividualPayment(session);
        } else {
          console.error('Webhook: Unknown payment type - no enterpriseRequestId or userId');
        }
      }

      return NextResponse.json({ received: true });
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Webhook request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

