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
    if (email) and.push({ $or: [{ 'fraudDetails.suspiciousEmail': new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }] })
    if (phone) and.push({ $or: [{ 'fraudDetails.suspiciousPhone': new RegExp(phone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }] })
    if (typeof minAmount === 'number') and.push({ 'fraudDetails.amount': { $gte: minAmount } })
    if (typeof maxAmount === 'number') and.push({ 'fraudDetails.amount': { ...(filter['fraudDetails.amount'] || {}), $lte: maxAmount } })
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

        const isUnlimited = user.subscription.searchLimit === -1
        const trialExpired = user.isTrialExpired()
        if (user.subscription?.type === 'free_trial' && user.subscription?.trialEndsAt && trialExpired && user.subscription.status !== 'expired') {
            user.subscription.status = 'expired'
            try { await user.save() } catch { }
        }

        // Block searches for individual users whose free trial is expired
        const isFreeTrial = user.subscription?.type === 'free_trial'
        if (user.role === 'individual' && isFreeTrial && trialExpired) {
            return NextResponse.json({ error: 'Your free trial has expired. Upgrade to continue searching.' }, { status: 403 })
        }

        // Determine data source
        const canUseReal = user.subscription.canAccessRealData && !trialExpired

        let results: any[] = []

        if (canUseReal) {
            const filter = buildFilter({ q, type, severity, email, phone, minAmount, maxAmount })
            results = await Fraud.find(filter).sort({ createdAt: -1 }).limit(50).lean()
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
                if (typeof minAmount === 'number' && (r.fraudDetails?.amount ?? 0) < minAmount) return false
                if (typeof maxAmount === 'number' && (r.fraudDetails?.amount ?? 0) > maxAmount) return false
                if (rx && !(rx.test(r.title) || rx.test(r.description) || (r.tags || []).some((t: string) => rx!.test(t)))) return false
                if (emailRx && !(emailRx.test(r.fraudDetails?.suspiciousEmail || '') || emailRx.test((r as any).contact?.email || ''))) return false
                if (phoneRx && !(phoneRx.test(r.fraudDetails?.suspiciousPhone || '') || phoneRx.test((r as any).contact?.phone || ''))) return false
                return true
            }).slice(0, 50)
        }

        // Increment searchesUsed when not unlimited
        if (!isUnlimited) {
            user.subscription.searchesUsed = (user.subscription.searchesUsed || 0) + 1
            await user.save()
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

        return NextResponse.json({
            source: canUseReal ? 'real' : 'dummy',
            items: results,
            searchesUsed: user.subscription.searchesUsed,
            searchLimit: user.subscription.searchLimit,
        })
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


