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

        // Get user details
        const user = await User.findById(userId).select('email firstName lastName').lean()
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Type assertion to ensure user has the expected properties
        const userData = user as any

        // Parse request body
        const { packageId, packageName, packageType, amount, searchesIncluded } = await request.json()

        if (!packageId || !packageName || !packageType || !amount || !searchesIncluded) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Calculate trial extension days
        const trialExtensionDays = packageType === 'yearly' ? 365 : 30

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: packageName,
                            description: `${searchesIncluded} searches with real fraud data access`,
                            metadata: {
                                packageId,
                                searchesIncluded: searchesIncluded.toString(),
                                trialExtensionDays: trialExtensionDays.toString()
                            }
                        },
                        unit_amount: Math.round(amount * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/payment/cancel`,
            customer_email: userData.email,
            metadata: {
                userId: userId,
                packageId,
                packageName,
                packageType,
                amount: amount.toString(),
                searchesIncluded: searchesIncluded.toString(),
                trialExtensionDays: trialExtensionDays.toString()
            }
        })

        // Create payment record in database
        await Payment.create({
            userId,
            packageName,
            packageType,
            amount,
            currency: 'USD',
            stripeSessionId: session.id,
            status: 'pending',
            searchesIncluded,
            trialExtensionDays,
            metadata: {
                description: `${searchesIncluded} searches with real fraud data access`,
                features: [
                    'Access to real fraud data',
                    'Priority support',
                    'Export capabilities'
                ]
            }
        })

        return NextResponse.json({ sessionUrl: session.url })

    } catch (error) {
        console.error('Create checkout session error:', error)
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }
}
