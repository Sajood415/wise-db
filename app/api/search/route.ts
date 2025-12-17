import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import mongoose from 'mongoose'
import dbConnect from '@/lib/mongodb'
import Fraud from '@/models/Fraud'
import User from '@/models/User'
import SearchLog from '@/models/SearchLog'
import { sendMail } from '@/lib/mailer'
import { emailTemplates } from '@/lib/emailTemplates'

type SearchQuery = {
    q?: string
    type?: string
    severity?: 'low' | 'medium' | 'high' | 'critical'
    email?: string
    phone?: string
    minAmount?: number
    maxAmount?: number
    fuzziness?: number // 0-100 percentage controlling fuzzy token gap matching
    // removed: country, status from UI
}

function escapeRegexLiteral(input: string) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildFuzzyRegex(q: string, fuzzinessPct: number) {
    const safe = q.trim().replace(/\s+/g, ' ')
    const tokens = safe.split(' ').map(t => escapeRegexLiteral(t))
    if (tokens.length === 0) return null
    const pct = Math.max(0, Math.min(100, Math.floor(fuzzinessPct)))
    // Allow up to N arbitrary characters between tokens based on pct
    // 0% => strict spaces only; 100% => up to 50 chars gap between tokens
    const maxGap = pct === 0 ? 1 : Math.min(50, Math.max(3, Math.round(pct / 2)))
    const gap = pct === 0 ? '\\s+' : `[\\s\\S]{0,${maxGap}}`
    const pattern = tokens.join(gap)
    try {
        return new RegExp(pattern, 'i')
    } catch {
        return null
    }
}

function buildFilter({ q, type, severity, email, phone, minAmount, maxAmount, fuzziness }: SearchQuery) {
    const filter: any = {}
    const and: any[] = []
    if (q) {
        const fuzzyRx = buildFuzzyRegex(q, typeof fuzziness === 'number' ? fuzziness : 0)
        const strictRx = new RegExp(escapeRegexLiteral(q), 'i')
        const rx = fuzzyRx || strictRx
        and.push({ $or: [{ title: rx }, { description: rx }, { tags: rx }] })
    }
    if (type) and.push({ type })
    if (severity) and.push({ severity })
    if (email) and.push({ $or: [{ 'fraudsterDetails.suspiciousEmail': new RegExp(escapeRegexLiteral(email), 'i') }] })
    if (phone) and.push({ $or: [{ 'fraudsterDetails.suspiciousPhone': new RegExp(escapeRegexLiteral(phone), 'i') }] })
    if (typeof minAmount === 'number') and.push({ 'fraudsterDetails.amount': { $gte: minAmount } })
    if (typeof maxAmount === 'number') and.push({ 'fraudsterDetails.amount': { ...(filter['fraudsterDetails.amount'] || {}), $lte: maxAmount } })
    if (and.length) filter.$and = and
    return filter
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect()

        const userId = request.headers.get('x-user-id')
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // Load user and gate access / increment usage for non-unlimited
        const user = await User.findById(userId)
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const body = await request.json()
        const { q, type, severity, email, phone, minAmount, maxAmount, fuzziness, page, limit } = (body || {}) as SearchQuery & { page?: number; limit?: number }
        
        // Pagination defaults
        const pageNum = typeof page === 'number' && page > 0 ? page : 1
        const pageLimit = typeof limit === 'number' && limit > 0 ? Math.min(limit, 100) : 20 // Max 100 per page
        const skip = (pageNum - 1) * pageLimit

        const trialExpired = user.isTrialExpired()
        // Package expiry enforcement for paid and enterprise
        const now = new Date()
        const pkgEnds = user.subscription?.packageEndsAt ? new Date(user.subscription.packageEndsAt) : undefined
        const isPackageExpired = !!(pkgEnds && now > pkgEnds && user.subscription?.type !== 'free_trial')
        if (user.subscription?.type === 'free_trial' && user.subscription?.trialEndsAt && trialExpired && user.subscription.status !== 'expired') {
            user.subscription.status = 'expired'
            try { await user.save() } catch { }
        }

        const isFreeTrial = user.subscription?.type === 'free_trial'
        const isPayAsYouGo = user.subscription?.type === "pay_as_you_go";

        // Determine effective quota (enterprise_user uses creator's quota, pay-as-you-go uses own limit)
        let effectiveUsed = user.subscription.searchesUsed || 0
        let effectiveLimit = typeof user.subscription.searchLimit === 'number' ? user.subscription.searchLimit : 0
        if (user.role === 'enterprise_user' && user.createdBy) {
            try {
                const admin: any = await User.findById(user.createdBy)
                if (admin && admin.subscription) {
                    effectiveUsed = admin.subscription.searchesUsed || 0
                    effectiveLimit = typeof admin.subscription.searchLimit === 'number' ? admin.subscription.searchLimit : 0
                }
            } catch { }
        }

        const isUnlimited = effectiveLimit === -1
        if (isPackageExpired) {
            // Mark expired and block searches for all plans, including pay-as-you-go credits
            if (user.subscription.status !== 'expired') {
                user.subscription.status = 'expired'
                try { await user.save() } catch { }
            }
            const msg = isPayAsYouGo
                ? 'Your pay-as-you-go credits have expired. Purchase more credits to continue searching.'
                : 'Your plan has expired. Renew to continue searching.'
            return NextResponse.json({ error: msg }, { status: 403 })
        }
        // Check limits (works same for all plans including pay-as-you-go)
        if ((user.role === 'individual' && isFreeTrial && trialExpired) || (!isUnlimited && effectiveUsed >= effectiveLimit)) {
            const msg = isPayAsYouGo ? "You have no credits remaining. Purchase more credits to continue searching." : (user.role === 'individual' && isFreeTrial && trialExpired)
                ? 'Your free trial has expired. Upgrade to continue searching.'
                : 'You have reached your search limit. Upgrade to continue searching.'
            return NextResponse.json({ error: msg }, { status: 403 })
        }

        // Determine data source
        const canUseReal = user.subscription.canAccessRealData && !trialExpired

        let results: any[] = []
        let total = 0

        if (canUseReal) {
            const filter = buildFilter({ q, type, severity, email, phone, minAmount, maxAmount, fuzziness })
            // Get total count
            total = await Fraud.countDocuments(filter)
            // Get paginated results
            results = await Fraud.find(filter)
                .sort({ _id: -1 })
                .skip(skip)
                .limit(pageLimit)
                .lean()
        } else {
            // Dummy data
            const filePath = path.join(process.cwd(), 'data', 'dummy-frauds.json')
            const raw = await fs.readFile(filePath, 'utf8')
            const all: any[] = JSON.parse(raw)
            const rx = q ? (buildFuzzyRegex(q, typeof fuzziness === 'number' ? fuzziness : 0) || new RegExp(escapeRegexLiteral(q), 'i')) : null
            const emailRx = email ? new RegExp(escapeRegexLiteral(email), 'i') : null
            const phoneRx = phone ? new RegExp(escapeRegexLiteral(phone), 'i') : null
            const filtered = all.filter((r) => {
                if (type && r.type !== type) return false
                if (severity && r.severity !== severity) return false
                if (typeof minAmount === 'number' && (r.fraudsterDetails?.amount ?? 0) < minAmount) return false
                if (typeof maxAmount === 'number' && (r.fraudsterDetails?.amount ?? 0) > maxAmount) return false
                if (rx && !(rx.test(r.title) || rx.test(r.description) || (r.tags || []).some((t: string) => rx!.test(t)))) return false
                if (emailRx && !(emailRx.test(r.fraudsterDetails?.suspiciousEmail || '') || emailRx.test((r as any).contact?.email || ''))) return false
                if (phoneRx && !(phoneRx.test(r.fraudsterDetails?.suspiciousPhone || '') || phoneRx.test((r as any).contact?.phone || ''))) return false
                return true
            })
            total = filtered.length
            results = filtered.slice(skip, skip + pageLimit)
        }

        // Increment search usage (enterprise_user deducts from creator/admin, pay-as-you-go uses same pattern)
        if (!isUnlimited) {
            if (user.role === 'enterprise_user' && user.createdBy) {
                // Deduct from enterprise admin (creator)
                try {
                    const admin = await User.findById(user.createdBy)
                    if (admin && admin.subscription && admin.subscription.type === 'enterprise_package' && admin.subscription.searchLimit !== -1) {
                        admin.subscription.searchesUsed = (admin.subscription.searchesUsed || 0) + 1
                        await admin.save()

                        // Notify enterprise admin at 90% usage if not already notified
                        try {
                            const used = admin.subscription.searchesUsed || 0
                            const limit = admin.subscription.searchLimit || 0
                            const pct = limit > 0 ? (used / limit) : 0
                            if (limit > 0 && pct >= 0.9 && !admin.subscription.lowQuotaNotified) {
                                const remaining = Math.max(0, limit - used)
                                if (admin.email) {
                                    const t = emailTemplates.lowQuotaEnterpriseAdmin
                                    await sendMail({ to: admin.email, subject: t.subject({}), text: t.text({ firstName: admin.firstName, used, limit, remaining }), html: t.html({ firstName: admin.firstName, used, limit, remaining }) })
                                    admin.subscription.lowQuotaNotified = true
                                    await admin.save()
                                }
                            }
                        } catch { }
                    }
                } catch { }
                // Also track this user's personal search count
                try {
                    user.subscription.searchesUsed = (user.subscription.searchesUsed || 0) + 1
                    await user.save()
                } catch { }
            } else {
                user.subscription.searchesUsed = (user.subscription.searchesUsed || 0) + 1
                await user.save()

                // Notify paid individual at 90% usage if not already notified
                try {
                    if (user.subscription && user.subscription.type === 'paid_package' && user.subscription.searchLimit && user.subscription.searchLimit > 0) {
                        const used = user.subscription.searchesUsed || 0
                        const limit = user.subscription.searchLimit || 0
                        const pct = limit > 0 ? (used / limit) : 0
                        if (pct >= 0.9 && !user.subscription.lowQuotaNotified) {
                            const remaining = Math.max(0, limit - used)
                            if (user.email) {
                                const t = emailTemplates.lowQuotaIndividual
                                await sendMail({ to: user.email, subject: t.subject({}), text: t.text({ firstName: user.firstName, used, limit, remaining }), html: t.html({ firstName: user.firstName, used, limit, remaining }) })
                                user.subscription.lowQuotaNotified = true
                                await user.save()
                            }
                        }
                    }
                } catch { }
            }
        }

        // Log search action
        await SearchLog.create({
            user: user._id,
            q: q || '',
            type,
            // status and country not used in current UI; omit
            minAmount: typeof minAmount === 'number' ? minAmount : undefined,
            maxAmount: typeof maxAmount === 'number' ? maxAmount : undefined,
            fuzziness: typeof fuzziness === 'number' ? Math.max(0, Math.min(100, Math.floor(fuzziness))) : undefined,
            source: canUseReal ? 'real' : 'dummy',
        })

        // Respond with effective quota values for UI (same pattern for all plans)
        const responseSearchesUsed = (user.role === 'enterprise_user' && user.createdBy)
            ? (isUnlimited ? effectiveUsed : effectiveUsed + 1)
            : user.subscription.searchesUsed
        const responseSearchLimit = (user.role === 'enterprise_user' && user.createdBy)
            ? effectiveLimit
            : user.subscription.searchLimit

        return NextResponse.json({
            source: canUseReal ? 'real' : 'dummy',
            items: results,
            searchesUsed: responseSearchesUsed,
            searchLimit: responseSearchLimit,
            pagination: {
                page: pageNum,
                limit: pageLimit,
                total,
                totalPages: Math.ceil(total / pageLimit)
            }
        })
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


