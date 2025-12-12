import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import Stripe from 'stripe'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Payment from '@/models/Payment'

export async function POST(request: NextRequest) {
    try {
        // Check Stripe configuration
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY
        if (!stripeSecretKey) {
            console.error('STRIPE_SECRET_KEY is not configured')
            return NextResponse.json({ error: 'Payment service not configured' }, { status: 500 })
        }

        // Initialize Stripe
        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2025-07-30.basil'
        })

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

        if (!userData.email) {
            return NextResponse.json({ error: 'User email not found' }, { status: 400 })
        }

        // Parse request body
        const body = await request.json()
        const { packageId, packageName, packageType, amount, searchesIncluded, creditsPurchased } = body

        // Validate required fields
        if (!packageId || !packageName || !packageType) {
            return NextResponse.json({
                error: 'Missing required fields: packageId, packageName, or packageType'
            }, { status: 400 })
        }

        // Validate amount
        const amountNum = Number(amount)
        if (isNaN(amountNum) || amountNum <= 0) {
            return NextResponse.json({
                error: 'Invalid amount. Amount must be a positive number'
            }, { status: 400 })
        }

        // Validate searchesIncluded
        const searchesNum = Number(searchesIncluded)
        if (isNaN(searchesNum) || searchesNum < 1) {
            return NextResponse.json({
                error: 'Invalid searchesIncluded. Must be at least 1'
            }, { status: 400 })
        }

        // Calculate trial extension days (not applicable for pay-as-you-go)
        const trialExtensionDays = packageType === 'pay_as_you_go' ? 0 : (packageType === 'yearly' ? 365 : 30)

        // Validate packageType
        const validPackageTypes = ['monthly', 'yearly', 'pay_as_you_go']
        if (!validPackageTypes.includes(packageType)) {
            return NextResponse.json({
                error: `Invalid packageType: "${packageType}". Must be one of: ${validPackageTypes.join(', ')}`
            }, { status: 400 })
        }

        // Validate packageName based on packageType
        const validPackageNames = ['Basic Monthly', 'Basic Yearly', 'Premium Monthly', 'Premium Yearly', 'Pay As You Go']
        if (!validPackageNames.includes(packageName)) {
            return NextResponse.json({
                error: `Invalid packageName: "${packageName}". Must be one of: ${validPackageNames.join(', ')}`
            }, { status: 400 })
        }

        // Ensure packageName matches packageType for pay_as_you_go
        if (packageType === 'pay_as_you_go' && packageName !== 'Pay As You Go') {
            return NextResponse.json({
                error: 'Package name must be "Pay As You Go" for pay_as_you_go package type'
            }, { status: 400 })
        }

        // Calculate unit amount in cents (minimum $0.50)
        const unitAmount = Math.round(amountNum * 100)
        if (unitAmount < 50) {
            return NextResponse.json({
                error: 'Amount must be at least $0.50'
            }, { status: 400 })
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: packageName,
                            description: packageType === 'pay_as_you_go'
                                ? `${searchesNum} search credits (Pay As You Go)`
                                : `${searchesNum} searches with real fraud data access`,
                            metadata: {
                                packageId,
                                searchesIncluded: searchesNum.toString(),
                                trialExtensionDays: trialExtensionDays.toString(),
                                ...(creditsPurchased ? { creditsPurchased: creditsPurchased.toString() } : {})
                            }
                        },
                        unit_amount: unitAmount,
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
                amount: amountNum.toString(),
                searchesIncluded: searchesNum.toString(),
                trialExtensionDays: trialExtensionDays.toString(),
                ...(creditsPurchased ? { creditsPurchased: creditsPurchased.toString() } : {})
            }
        })

        if (!session || !session.id) {
            throw new Error('Failed to create Stripe session')
        }

        // Create payment record in database
        // Ensure values match enum exactly
        const paymentData = {
            userId,
            packageName: packageName as 'Basic Monthly' | 'Basic Yearly' | 'Premium Monthly' | 'Premium Yearly' | 'Pay As You Go',
            packageType: packageType as 'monthly' | 'yearly' | 'pay_as_you_go',
            amount: amountNum,
            currency: 'USD' as const,
            stripeSessionId: session.id,
            status: 'pending' as const,
            searchesIncluded: searchesNum,
            creditsPurchased: creditsPurchased ? Number(creditsPurchased) : undefined,
            trialExtensionDays,
            metadata: {
                description: packageType === 'pay_as_you_go'
                    ? `${searchesNum} search credits (Pay As You Go)`
                    : `${searchesNum} searches with real fraud data access`,
                features: packageType === 'pay_as_you_go'
                    ? [
                        'Pay as you go - $2 per search',
                        'Access to real fraud data'
                    ]
                    : [
                        'Access to real fraud data',
                        'Priority support',
                        'Export capabilities'
                    ]
            }
        }

        await Payment.create(paymentData)

        if (!session.url) {
            throw new Error('Stripe session URL is missing')
        }

        return NextResponse.json({ sessionUrl: session.url })

    } catch (error: any) {
        console.error('Create checkout session error:', error)

        // Provide more specific error messages
        if (error instanceof Stripe.errors.StripeError) {
            return NextResponse.json({
                error: `Stripe error: ${error.message}`
            }, { status: 500 })
        }

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors: string[] = []
            if (error.errors) {
                Object.keys(error.errors).forEach(key => {
                    validationErrors.push(`${key}: ${error.errors[key].message}`)
                })
            }
            return NextResponse.json({
                error: `Validation error: ${validationErrors.length > 0 ? validationErrors.join(', ') : error.message}`,
                details: process.env.NODE_ENV === 'development' ? error : undefined
            }, { status: 400 })
        }

        // Handle Mongoose cast errors
        if (error.name === 'CastError') {
            return NextResponse.json({
                error: `Invalid data format: ${error.message}`
            }, { status: 400 })
        }

        // Return generic error with more details in development
        const errorMessage = process.env.NODE_ENV === 'development'
            ? error.message || 'Failed to create checkout session'
            : 'Failed to create checkout session'

        return NextResponse.json({
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 })
    }
}
