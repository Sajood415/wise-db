import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import dbConnect from '@/lib/mongodb'
import EnterpriseRequest from '@/models/EnterpriseRequest'
import EnterprisePayment from '@/models/EnterprisePayment'

export async function POST(request: NextRequest) {
    try {
        const stripeSecret = process.env.STRIPE_SECRET_KEY
        if (!stripeSecret) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
        const stripe = new Stripe(stripeSecret, { apiVersion: '2025-07-30.basil' })

        const url = new URL(request.url)
        const searchParams = url.searchParams
        const body = await request.json().catch(() => ({}))
        const sessionId = searchParams.get('session_id') || body.sessionId
        if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 })

        const session = await stripe.checkout.sessions.retrieve(sessionId)
        if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

        const isPaid = (session.payment_status === 'paid') || (session.status === 'complete')
        const metadata = session.metadata || {}
        const enterpriseRequestId = metadata['enterpriseRequestId']
        if (!enterpriseRequestId) return NextResponse.json({ error: 'No enterpriseRequestId in metadata' }, { status: 400 })

        await dbConnect()
        if (isPaid) {
            const allowanceSearches = Number(metadata['allowanceSearches'] || 0)
            const allowanceUsers = Number(metadata['allowanceUsers'] || 0)
            const pricingAmount = Number(metadata['pricingAmount'] || 0)
            const pricingCurrency = String(metadata['pricingCurrency'] || 'USD').toUpperCase()
            const enterpriseAdminEmail = metadata['enterpriseAdminEmail'] || undefined

            const doc = await EnterpriseRequest.findByIdAndUpdate(
                enterpriseRequestId,
                {
                    $set: {
                        paymentReceived: true,
                        paymentMethod: 'stripe',
                        paymentTxnId: session.payment_intent ? String(session.payment_intent) : (session.id || undefined),
                        paymentTxnDate: new Date(),
                        pricingAmount,
                        pricingCurrency,
                        allowanceSearches,
                        allowanceUsers,
                        enterpriseAdminEmail,
                    }
                },
                { new: true }
            ).lean()

            if (!doc) return NextResponse.json({ error: 'Enterprise request not found' }, { status: 404 })
            try {
                await EnterprisePayment.findOneAndUpdate(
                    { stripeSessionId: session.id },
                    { $set: { status: 'completed', stripePaymentIntentId: session.payment_intent ? String(session.payment_intent) : undefined, method: 'stripe', paidAt: new Date(), amount: pricingAmount, currency: pricingCurrency, allowanceSearches, allowanceUsers, enterpriseAdminEmail } },
                    { upsert: true }
                )
            } catch (e) {
                console.error('Failed to upsert enterprise payment (verify):', e)
            }
            return NextResponse.json({ ok: true, item: doc })
        } else {
            return NextResponse.json({ ok: false, reason: 'unpaid' }, { status: 400 })
        }
    } catch (err) {
        console.error('Enterprise verify error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


