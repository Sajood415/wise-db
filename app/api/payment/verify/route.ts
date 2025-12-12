import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import Stripe from 'stripe'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Payment from '@/models/Payment'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
})

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    // Get token from cookies
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // Verify the token
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key')
    const { payload } = await jwtVerify(token, secret)
    const userId = payload.userId as string

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Parse request body
    const { sessionId } = await request.json()
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    // Get userId from Stripe session metadata (more reliable than cookies)
    const stripeUserId = session.metadata?.userId
    if (!stripeUserId) {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 })
    }

    // Verify that the authenticated user matches the Stripe session user
    if (stripeUserId !== userId) {
      return NextResponse.json({ error: 'User mismatch' }, { status: 403 })
    }

    // Find the payment record
    const payment = await Payment.findOne({ stripeSessionId: sessionId })
    if (!payment) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 })
    }

    // Check if payment has already been processed (idempotency check)
    if (payment.status === 'completed') {
      // Payment already processed, return current user state without modifying
      const user = await User.findById(userId)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json({
        success: true,
        message: 'Payment already processed',
        payment: {
          packageName: payment.packageName,
          amount: payment.amount,
          searchesIncluded: payment.searchesIncluded,
          creditsPurchased: payment.creditsPurchased,
          status: payment.status
        },
        user: {
          searchLimit: user.subscription.searchLimit,
          searchesUsed: user.subscription.searchesUsed,
          canAccessRealData: user.subscription.canAccessRealData,
          packageEndsAt: user.subscription.packageEndsAt,
          subscriptionType: user.subscription.type
        }
      })
    }

    // Update payment status
    payment.status = 'completed'
    if (session.payment_intent) {
      payment.stripePaymentIntentId = session.payment_intent as string
    }
    await payment.save()

    // Update user subscription
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user subscription based on package
    const packageType = payment.packageType
    const searchesIncluded = payment.searchesIncluded
    const trialExtensionDays = payment.trialExtensionDays
    const creditsPurchased = payment.creditsPurchased

    if (packageType === 'pay_as_you_go') {
      // Pay-as-you-go: Add credits to searchLimit (accumulate like other plans)
      // Use creditsPurchased specifically for pay-as-you-go (not searchesIncluded)
      const currentLimit = user.subscription.searchLimit || 0
      const creditsToAdd = creditsPurchased || 0 // Only use creditsPurchased for pay-as-you-go
      if (creditsToAdd <= 0) {
        return NextResponse.json({ error: 'Invalid credits purchased' }, { status: 400 })
      }
      const newLimit = currentLimit + creditsToAdd

      // Set packageEndsAt to 30 days from now (credits expire after 30 days)
      const currentDate = new Date()
      const packageEndDate = new Date(currentDate)
      packageEndDate.setDate(packageEndDate.getDate() + 30) // 30 days from now

      user.subscription = {
        ...user.subscription,
        type: 'pay_as_you_go',
        status: 'active',
        searchLimit: newLimit,
        canAccessRealData: true,
        packageEndsAt: packageEndDate // Credits expire after 30 days
      }
        ; (user as any).packageName = 'Pay As You Go'
    } else {
      // Regular package: Set subscription with limits
      // Calculate new package end date
      const currentDate = new Date()
      const newPackageEnd = new Date(currentDate)
      newPackageEnd.setDate(newPackageEnd.getDate() + trialExtensionDays)

      // Update user subscription
      user.subscription = {
        ...user.subscription,
        type: 'paid_package',
        status: 'active',
        packageEndsAt: newPackageEnd,
        searchLimit: searchesIncluded,
        canAccessRealData: true
      }

        // Add package name to user
        ; (user as any).packageName = payment.packageName
    }

    await user.save()

    return NextResponse.json({
      success: true,
      payment: {
        packageName: payment.packageName,
        amount: payment.amount,
        searchesIncluded: payment.searchesIncluded,
        creditsPurchased: payment.creditsPurchased,
        status: payment.status
      },
      user: {
        searchLimit: user.subscription.searchLimit,
        searchesUsed: user.subscription.searchesUsed,
        canAccessRealData: user.subscription.canAccessRealData,
        packageEndsAt: user.subscription.packageEndsAt,
        subscriptionType: user.subscription.type
      }
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}
