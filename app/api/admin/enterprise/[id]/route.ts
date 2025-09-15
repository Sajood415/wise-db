import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import EnterpriseRequest from '@/models/EnterpriseRequest'
import EnterprisePayment from '@/models/EnterprisePayment'
import Stripe from 'stripe'
import { sendMail } from '@/lib/mailer'
import { emailTemplates } from '@/lib/emailTemplates'

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
        const stripeSecret = process.env.STRIPE_SECRET_KEY

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

            // Optionally email the signup link if email is available
            try {
                const to = update.enterpriseAdminEmail || (body.enterpriseAdminEmail ? String(body.enterpriseAdminEmail) : '')
                if (to) {
                    const t = emailTemplates.enterpriseSignupLink
                    await sendMail({ to, subject: t.subject({}), text: t.text({ signupLink: generatedSignupLink }), html: t.html({ signupLink: generatedSignupLink, expires: update.signupTokenExpiresAt?.toISOString() }) })
                }
            } catch (e) {
                console.error('Failed to send signup link email:', e)
            }
        }

        // Send payment email (Stripe or Bank)
        if (body.action === 'send_payment_email') {
            const { paymentMethod } = body
            // Ensure we have the latest document
            const existing: any = await EnterpriseRequest.findById(id).lean()
            if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

            // Prepare pricing/allowances/admin email
            const pricingAmount = Number(body.pricingAmount || existing.pricingAmount || 0)
            const pricingCurrency = String(body.pricingCurrency || existing.pricingCurrency || 'USD').toUpperCase()
            const allowanceSearches = Number(body.allowanceSearches || existing.allowanceSearches || 0)
            const allowanceUsers = Number(body.allowanceUsers || existing.allowanceUsers || 0)
            const enterpriseAdminEmail = String(body.enterpriseAdminEmail || existing.enterpriseAdminEmail || existing.businessEmail || '')

            // Persist these to the request
            await EnterpriseRequest.findByIdAndUpdate(id, {
                $set: {
                    pricingAmount,
                    pricingCurrency,
                    allowanceSearches,
                    allowanceUsers,
                    enterpriseAdminEmail,
                }
            })

            // Generate or reuse signup token
            let signupToken = existing.signupToken
            let signupTokenExpiresAt: Date | undefined = existing.signupTokenExpiresAt
            if (!signupToken || (signupTokenExpiresAt && new Date(signupTokenExpiresAt) < new Date())) {
                signupToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
                signupTokenExpiresAt = new Date(Date.now() + (Number(body.signupTokenTtlHours) || 72) * 60 * 60 * 1000)
                await EnterpriseRequest.findByIdAndUpdate(id, { $set: { signupToken, signupTokenExpiresAt } })
            }

            // Build signup link
            let signupLink = ''
            try {
                const url = new URL(request.url)
                const origin = `${url.protocol}//${url.host}`
                const params = new URLSearchParams()
                params.set('enterprise', id)
                params.set('token', String(signupToken))
                if (enterpriseAdminEmail) params.set('email', enterpriseAdminEmail)
                signupLink = `${origin}/signup?${params.toString()}`
            } catch { }

            // Payment email per method
            if (paymentMethod === 'stripe') {
                if (!stripeSecret) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
                const stripe = new Stripe(stripeSecret, { apiVersion: '2025-07-30.basil' })
                if (!(pricingAmount > 0) || !(allowanceSearches >= 1) || !(allowanceUsers >= 1)) {
                    return NextResponse.json({ error: 'Provide valid amount, searches and users' }, { status: 400 })
                }
                const session = await stripe.checkout.sessions.create({
                    mode: 'payment',
                    payment_method_types: ['card'],
                    line_items: [
                        {
                            price_data: {
                                currency: pricingCurrency.toLowerCase(),
                                product_data: { name: `Enterprise Package - ${existing.companyName}`, description: `${allowanceSearches} searches • ${allowanceUsers} users` },
                                unit_amount: Math.round(pricingAmount * 100),
                            },
                            quantity: 1,
                        },
                    ],
                    success_url: `${(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')}/enterprise?payment=success&session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')}/enterprise?payment=cancel`,
                    customer_email: enterpriseAdminEmail || undefined,
                    metadata: {
                        enterpriseRequestId: String(id),
                        allowanceSearches: String(allowanceSearches),
                        allowanceUsers: String(allowanceUsers),
                        pricingAmount: String(pricingAmount),
                        pricingCurrency,
                        enterpriseAdminEmail,
                    },
                })

                try {
                    await EnterprisePayment.create({
                        enterpriseRequestId: id as any,
                        stripeSessionId: session.id,
                        method: 'stripe',
                        amount: pricingAmount,
                        currency: pricingCurrency,
                        status: 'pending',
                        allowanceSearches,
                        allowanceUsers,
                        enterpriseAdminEmail,
                        metadata: { source: 'send_email' }
                    })
                } catch { }

                // Email with Stripe link and signup link
                const shortStripe = session.url?.replace(/^https?:\/\//, '')
                const shortSignup = signupLink?.replace(/^https?:\/\//, '')
                const contact = existing.contactName ? ` ${existing.contactName}` : ''
                try {
                    if (enterpriseAdminEmail) {
                        const t = emailTemplates.enterpriseStripePaymentAndSignup
                        await sendMail({ to: enterpriseAdminEmail, subject: t.subject({}), text: t.text({ stripeUrl: (session.url || ''), signupLink }), html: t.html({ contactName: existing.contactName, companyName: existing.companyName, amount: pricingAmount, currency: pricingCurrency, searches: allowanceSearches, users: allowanceUsers, stripeUrl: (session.url || ''), shortStripeUrl: shortStripe, signupLink, shortSignupLink: shortSignup }) })
                    }
                } catch (e) { console.error('Failed to send stripe email:', e) }

                const updated: any = await EnterpriseRequest.findByIdAndUpdate(id, { $set: { stripeCheckoutUrl: session.url } }, { new: true }).lean()
                return NextResponse.json({ item: updated, sessionUrl: session.url, signupLink })
            }

            if (paymentMethod === 'bank_transfer') {
                // Compose bank details email
                const bank = {
                    accountName: String(body.bankAccountName || ''),
                    accountNumber: String(body.bankAccountNumber || ''),
                    bankName: String(body.bankName || ''),
                    swift: String(body.bankSwift || ''),
                    reference: String(body.paymentReference || ''),
                }
                const shortSignup2 = signupLink?.replace(/^https?:\/\//, '')
                const contact2 = existing.contactName ? ` ${existing.contactName}` : ''
                try {
                    if (enterpriseAdminEmail) {
                        const t = emailTemplates.enterpriseBankAndSignup
                        await sendMail({ to: enterpriseAdminEmail, subject: t.subject({}), text: t.text({ amount: pricingAmount, currency: pricingCurrency, searches: allowanceSearches, users: allowanceUsers, signupLink }), html: t.html({ contactName: existing.contactName, companyName: existing.companyName, amount: pricingAmount, currency: pricingCurrency, searches: allowanceSearches, users: allowanceUsers, bankAccountName: bank.accountName, bankAccountNumber: bank.accountNumber, bankName: bank.bankName, bankSwift: bank.swift, paymentReference: bank.reference, signupLink, shortSignupLink: shortSignup2 }) })
                    }
                } catch (e) { console.error('Failed to send bank email:', e) }
                const updated: any = await EnterpriseRequest.findById(id).lean()
                return NextResponse.json({ item: updated, signupLink })
            }

            return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 })
        }

        const doc: any = await EnterpriseRequest.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true }
        ).lean()
        if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        // Validate required fields when touching payment/pricing
        const touchedPaymentOrPricing = ['paymentReceived', 'paymentMethod', 'paymentTxnId', 'paymentTxnDate', 'paymentNotes', 'pricingAmount', 'pricingCurrency', 'allowanceSearches', 'allowanceUsers']
            .some((k) => Object.prototype.hasOwnProperty.call(body, k))
        if (touchedPaymentOrPricing) {
            const amountNum = body.pricingAmount !== undefined ? Number(body.pricingAmount) : undefined
            const currencyStr = body.pricingCurrency !== undefined ? String(body.pricingCurrency) : undefined
            const searchesNum = body.allowanceSearches !== undefined ? Number(body.allowanceSearches) : undefined
            const usersNum = body.allowanceUsers !== undefined ? Number(body.allowanceUsers) : undefined
            if (amountNum !== undefined && !(amountNum > 0)) {
                return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 })
            }
            if (currencyStr !== undefined && !currencyStr.trim()) {
                return NextResponse.json({ error: 'Currency is required' }, { status: 400 })
            }
            if (searchesNum !== undefined && !(searchesNum >= 1)) {
                return NextResponse.json({ error: 'Searches Included must be ≥ 1' }, { status: 400 })
            }
            if (usersNum !== undefined && !(usersNum >= 1)) {
                return NextResponse.json({ error: 'Users Allowed must be ≥ 1' }, { status: 400 })
            }
        }

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

            // If payment is completed and we have an admin email with a signup token set previously, email instructions
            if (status === 'completed') {
                try {
                    const current: any = await EnterpriseRequest.findById(id).lean()
                    if (current?.enterpriseAdminEmail && current?.signupToken) {
                        const origin = (() => { try { const u = new URL(request.url); return `${u.protocol}//${u.host}` } catch { return '' } })()
                        const params = new URLSearchParams()
                        params.set('enterprise', String(id))
                        params.set('token', String(current.signupToken))
                        if (current.enterpriseAdminEmail) params.set('email', String(current.enterpriseAdminEmail))
                        const link = origin ? `${origin}/signup?${params.toString()}` : ''
                        const t = emailTemplates.enterprisePaymentReceivedSignup
                        await sendMail({ to: current.enterpriseAdminEmail, subject: t.subject({}), text: t.text({ signupLink: link }), html: t.html({ signupLink: link }) })
                    }
                } catch (e) {
                    console.error('Failed to send payment receipt/signup email:', e)
                }
            }
        }
        return NextResponse.json({ item: doc, signupLink: generatedSignupLink })
    } catch (err) {
        console.error('Admin enterprise update error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


