import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import EnterpriseRequest from '@/models/EnterpriseRequest'
import EnterprisePayment from '@/models/EnterprisePayment'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect()
        const { id } = await params
        const doc = await EnterpriseRequest.findById(id).lean()
        if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ item: doc })
    } catch (err) {
        console.error('Admin enterprise get error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect()

        const role = request.headers.get('x-user-role') || ''
        if (role !== 'super_admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { id } = await params
        const body = await request.json().catch(() => ({}))

        const update: any = {}

        // Status
        if (typeof body.status === 'string') {
            const allowed: string[] = ['new', 'in_review', 'contacted', 'closed']
            if (!allowed.includes(body.status)) {
                return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
            }
            update.status = body.status
        }

        // Pricing & allowances
        if (body.pricingAmount !== undefined) update.pricingAmount = Number(body.pricingAmount)
        if (body.pricingCurrency !== undefined) update.pricingCurrency = String(body.pricingCurrency).toUpperCase()
        if (body.allowanceSearches !== undefined) update.allowanceSearches = Number(body.allowanceSearches)
        if (body.allowanceUsers !== undefined) update.allowanceUsers = Number(body.allowanceUsers)

        // Stripe checkout link
        if (body.stripeCheckoutUrl !== undefined) update.stripeCheckoutUrl = String(body.stripeCheckoutUrl)

        // Manual payment
        if (body.paymentReceived !== undefined) {
            update.paymentReceived = Boolean(body.paymentReceived)
            if (update.paymentReceived) {
                update.status = 'closed'
            }
        }
        if (body.paymentMethod !== undefined) update.paymentMethod = body.paymentMethod
        if (body.paymentTxnId !== undefined) update.paymentTxnId = String(body.paymentTxnId)
        if (body.paymentTxnDate !== undefined) update.paymentTxnDate = body.paymentTxnDate ? new Date(body.paymentTxnDate) : undefined
        if (body.paymentNotes !== undefined) update.paymentNotes = String(body.paymentNotes)

        // Enterprise admin email (for signup)
        if (body.enterpriseAdminEmail !== undefined) update.enterpriseAdminEmail = String(body.enterpriseAdminEmail).toLowerCase()

        // Generate signup token if requested
        let generatedSignupLink: string | undefined
        if (body.action === 'generate_signup_token') {
            // Enforce payment requirement from DB
            const existing: any = await EnterpriseRequest.findById(id).lean()
            if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
            if (!existing.paymentReceived) {
                return NextResponse.json({ error: 'Payment not received yet' }, { status: 400 })
            }
            const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
            const hours = Number(body.signupTokenTtlHours) || 72
            const expires = new Date(Date.now() + hours * 60 * 60 * 1000)
            update.signupToken = token
            update.signupTokenExpiresAt = expires
            // Construct link from request origin
            try {
                const url = new URL(request.url)
                const origin = `${url.protocol}//${url.host}`
                const params = new URLSearchParams()
                params.set('enterprise', id)
                params.set('token', token)
                if (body.enterpriseAdminEmail) params.set('email', String(body.enterpriseAdminEmail))
                generatedSignupLink = `${origin}/signup?${params.toString()}`
            } catch { }
        }

        const doc: any = await EnterpriseRequest.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true }
        ).lean()
        if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        // If manual payment or pricing fields were updated, record a payment entry
        const touchedPaymentFields = ['paymentReceived', 'paymentMethod', 'paymentTxnId', 'paymentTxnDate', 'paymentNotes', 'pricingAmount', 'pricingCurrency', 'allowanceSearches', 'allowanceUsers']
            .some((k) => Object.prototype.hasOwnProperty.call(body, k))
        if (touchedPaymentFields) {
            const method = body.paymentMethod || (body.paymentReceived ? 'bank_transfer' : undefined)
            const status = body.paymentReceived ? 'completed' : 'pending'
            const paidAt = body.paymentReceived ? (body.paymentTxnDate ? new Date(body.paymentTxnDate) : new Date()) : undefined
            const amount = body.pricingAmount !== undefined ? Number(body.pricingAmount) : (doc.pricingAmount || 0)
            const currency = (body.pricingCurrency || doc.pricingCurrency || 'USD').toString().toUpperCase()
            const allowanceSearches = body.allowanceSearches !== undefined ? Number(body.allowanceSearches) : (doc.allowanceSearches || 0)
            const allowanceUsers = body.allowanceUsers !== undefined ? Number(body.allowanceUsers) : (doc.allowanceUsers || 0)
            const enterpriseAdminEmail = body.enterpriseAdminEmail || doc.enterpriseAdminEmail
            try {
                await EnterprisePayment.create({
                    enterpriseRequestId: id as any,
                    method,
                    amount,
                    currency,
                    status,
                    allowanceSearches,
                    allowanceUsers,
                    enterpriseAdminEmail,
                    paidAt,
                    metadata: { paymentTxnId: body.paymentTxnId || undefined, paymentNotes: body.paymentNotes || undefined, source: 'manual_update' }
                })
            } catch (e) {
                console.error('Failed to record enterprise payment:', e)
            }
        }
        return NextResponse.json({ item: doc, signupLink: generatedSignupLink })
    } catch (err) {
        console.error('Admin enterprise update error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


