import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import dbConnect from '@/lib/mongodb'
import EnterpriseRequest from '@/models/EnterpriseRequest'
import EnterprisePayment from '@/models/EnterprisePayment'

const stripeSecret = process.env.STRIPE_SECRET_KEY
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!stripeSecret) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
        const stripe = new Stripe(stripeSecret, { apiVersion: '2025-07-30.basil' })

        const role = request.headers.get('x-user-role') || ''
        if (role !== 'super_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { id } = await params
        await dbConnect()
        const existing: any = await EnterpriseRequest.findById(id).lean()
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        const body = await request.json().catch(() => ({}))
        const pricingAmount = Number(body.pricingAmount)
        const pricingCurrency = String(body.pricingCurrency || 'USD').toUpperCase()
        const allowanceSearches = Number(body.allowanceSearches || 0)
        const allowanceUsers = Number(body.allowanceUsers || 0)
        const enterpriseAdminEmail = String(body.enterpriseAdminEmail || existing.enterpriseAdminEmail || existing.businessEmail)

        if (!pricingAmount || pricingAmount <= 0) {
            return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 })
        }
        if (!pricingCurrency || !String(pricingCurrency).trim()) {
            return NextResponse.json({ error: 'Currency is required' }, { status: 400 })
        }
        if (!(allowanceSearches >= 1)) {
            return NextResponse.json({ error: 'Searches Included must be ≥ 1' }, { status: 400 })
        }
        if (!(allowanceUsers >= 1)) {
            return NextResponse.json({ error: 'Users Allowed must be ≥ 1' }, { status: 400 })
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: pricingCurrency.toLowerCase(),
                        product_data: {
                            name: `Enterprise Package - ${existing.companyName}`,
                            description: `${allowanceSearches || 0} searches • ${allowanceUsers || 0} users`,
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
                enterpriseRequestId: id,
                allowanceSearches: String(allowanceSearches || 0),
                allowanceUsers: String(allowanceUsers || 0),
                pricingAmount: String(pricingAmount),
                pricingCurrency,
                enterpriseAdminEmail,
            },
        })

        const updated = await EnterpriseRequest.findByIdAndUpdate(
            id,
            {
                $set: {
                    pricingAmount,
                    pricingCurrency,
                    allowanceSearches,
                    allowanceUsers,
                    paymentMethod: 'stripe',
                    paymentReceived: false,
                    enterpriseAdminEmail,
                }
            },
            { new: true }
        ).lean()

        // upsert enterprise payment record
        await EnterprisePayment.create({
            enterpriseRequestId: id,
            stripeSessionId: session.id,
            method: 'stripe',
            amount: pricingAmount,
            currency: pricingCurrency,
            status: 'pending',
            allowanceSearches,
            allowanceUsers,
            enterpriseAdminEmail,
            metadata: { type: 'initial' }
        })

        return NextResponse.json({ sessionUrl: session.url, item: { ...updated, stripeCheckoutUrl: session.url } })
    } catch (err) {
        console.error('Create enterprise checkout error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


