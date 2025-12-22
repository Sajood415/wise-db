import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import EnterpriseRequest from "@/models/EnterpriseRequest";

export async function POST(request: NextRequest) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }
    const stripe = new Stripe(stripeSecret);

    await dbConnect();

    const role = request.headers.get("x-user-role") || "";
    const userId = request.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (role !== "enterprise_admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const admin = await User.findById(userId).select("email company").lean();
    if (!admin || Array.isArray(admin))
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    const adminEmail = String((admin as any).email || "").toLowerCase();
    if (!adminEmail)
      return NextResponse.json({ error: "Admin email missing" }, { status: 400 });

    // Use the latest paid enterprise request for this admin's email
    const er: any = await EnterpriseRequest.findOne({
      enterpriseAdminEmail: adminEmail,
      paymentReceived: true,
    })
      .sort({ paymentTxnDate: -1, createdAt: -1 })
      .lean();

    if (
      !er ||
      !(er.pricingAmount > 0) ||
      !(er.allowanceSearches >= 1) ||
      !(er.allowanceUsers >= 1)
    ) {
      return NextResponse.json(
        { error: "No paid enterprise plan found. Contact support to renew." },
        { status: 400 }
      );
    }

    const pricingAmount = Number(er.pricingAmount);
    const pricingCurrency = String(er.pricingCurrency || "USD").toUpperCase();
    const allowanceSearches = Number(er.allowanceSearches);
    const allowanceUsers = Number(er.allowanceUsers);
    const enterpriseAdminEmail = String(er.enterpriseAdminEmail || adminEmail);
    const companyName = er.companyName || "Enterprise Package";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: pricingCurrency.toLowerCase(),
            product_data: {
              name: `Enterprise Package - ${companyName}`,
              description: `${allowanceSearches} searches • ${allowanceUsers} users`,
            },
            unit_amount: Math.round(pricingAmount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/enterprise?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/enterprise?payment=cancel`,
      customer_email: enterpriseAdminEmail,
      metadata: {
        enterpriseRequestId: String(er._id),
        allowanceSearches: String(allowanceSearches),
        allowanceUsers: String(allowanceUsers),
        pricingAmount: String(pricingAmount),
        pricingCurrency,
        enterpriseAdminEmail,
        source: "self_renewal",
      },
    });

    if (!session.url || !session.id) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }

    return NextResponse.json({ sessionUrl: session.url });
  } catch (err) {
    console.error("Enterprise self-renewal checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

