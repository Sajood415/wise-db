import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs/promises'
import path from 'node:path'
import mongoose from 'mongoose'
import dbConnect from '@/lib/mongodb'
import Fraud from '@/models/Fraud'
import User from '@/models/User'
import SearchLog from '@/models/SearchLog'

type SearchQuery = {
    q?: string
    type?: string
    severity?: 'low' | 'medium' | 'high' | 'critical'
    email?: string
    phone?: string
    minAmount?: number
    maxAmount?: number
    // removed: country, status from UI
}

function buildFilter({ q, type, severity, email, phone, minAmount, maxAmount }: SearchQuery) {
    const filter: any = {}
    const and: any[] = []
    if (q) {
        const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
        and.push({ $or: [{ title: rx }, { description: rx }, { tags: rx }] })
    }
    if (type) and.push({ type })
    if (severity) and.push({ severity })
    if (email) and.push({ $or: [{ 'fraudsterDetails.suspiciousEmail': new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }] })
    if (phone) and.push({ $or: [{ 'fraudsterDetails.suspiciousPhone': new RegExp(phone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }] })
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
        const { q, type, severity, email, phone, minAmount, maxAmount } = (body || {}) as SearchQuery

        const trialExpired = user.isTrialExpired()
        if (user.subscription?.type === 'free_trial' && user.subscription?.trialEndsAt && trialExpired && user.subscription.status !== 'expired') {
            user.subscription.status = 'expired'
            try { await user.save() } catch { }
        }

        const isFreeTrial = user.subscription?.type === 'free_trial'

        // Determine effective quota (enterprise_user uses creator's quota)
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
        if ((user.role === 'individual' && isFreeTrial && trialExpired) || (!isUnlimited && effectiveUsed >= effectiveLimit)) {
            const msg = (user.role === 'individual' && isFreeTrial && trialExpired)
                ? 'Your free trial has expired. Upgrade to continue searching.'
                : 'You have reached your search limit. Upgrade to continue searching.'
            return NextResponse.json({ error: msg }, { status: 403 })
        }

        // Determine data source
        const canUseReal = user.subscription.canAccessRealData && !trialExpired

        let results: any[] = []

        if (canUseReal) {
            const filter = buildFilter({ q, type, severity, email, phone, minAmount, maxAmount })
            results = await Fraud.find(filter).sort({ _id: -1 }).limit(50).lean()
        } else {
            // Dummy data
            const filePath = path.join(process.cwd(), 'data', 'dummy-frauds.json')
            const raw = await fs.readFile(filePath, 'utf8')
            const all: any[] = JSON.parse(raw)
            const rx = q ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null
            const emailRx = email ? new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null
            const phoneRx = phone ? new RegExp(phone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null
            results = all.filter((r) => {
                if (type && r.type !== type) return false
                if (severity && r.severity !== severity) return false
                if (typeof minAmount === 'number' && (r.fraudsterDetails?.amount ?? 0) < minAmount) return false
                if (typeof maxAmount === 'number' && (r.fraudsterDetails?.amount ?? 0) > maxAmount) return false
                if (rx && !(rx.test(r.title) || rx.test(r.description) || (r.tags || []).some((t: string) => rx!.test(t)))) return false
                if (emailRx && !(emailRx.test(r.fraudsterDetails?.suspiciousEmail || '') || emailRx.test((r as any).contact?.email || ''))) return false
                if (phoneRx && !(phoneRx.test(r.fraudsterDetails?.suspiciousPhone || '') || phoneRx.test((r as any).contact?.phone || ''))) return false
                return true
            }).slice(0, 50)
        }

        // Increment search usage (enterprise_user deducts from creator/admin)
        if (!isUnlimited) {
            if (user.role === 'enterprise_user' && user.createdBy) {
                // Deduct from enterprise admin (creator)
                try {
                    const admin = await User.findById(user.createdBy)
                    if (admin && admin.subscription && admin.subscription.type === 'enterprise_package' && admin.subscription.searchLimit !== -1) {
                        admin.subscription.searchesUsed = (admin.subscription.searchesUsed || 0) + 1
                        await admin.save()
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
            source: canUseReal ? 'real' : 'dummy',
        })

        // Respond with effective quota values for UI
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
        })
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


