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
    minAmount?: number
    maxAmount?: number
    country?: string
    status?: string
}

function buildFilter({ q, type, minAmount, maxAmount, country, status }: SearchQuery) {
    const filter: any = {}
    const and: any[] = []
    if (q) {
        const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
        and.push({ $or: [{ title: rx }, { description: rx }, { tags: rx }] })
    }
    if (type) and.push({ type })
    if (status) and.push({ status })
    if (country) and.push({ 'location.country': country })
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
        const { q, type, minAmount, maxAmount, country, status } = (body || {}) as SearchQuery

        const isUnlimited = user.subscription.searchLimit === -1
        const trialExpired = user.isTrialExpired()

        // Determine data source
        const canUseReal = user.subscription.canAccessRealData && !trialExpired

        let results: any[] = []

        if (canUseReal) {
            const filter = buildFilter({ q, type, minAmount, maxAmount, country, status })
            results = await Fraud.find(filter).sort({ createdAt: -1 }).limit(50).lean()
        } else {
            // Dummy data
            const filePath = path.join(process.cwd(), 'data', 'dummy-frauds.json')
            const raw = await fs.readFile(filePath, 'utf8')
            const all: any[] = JSON.parse(raw)
            const rx = q ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null
            results = all.filter((r) => {
                if (type && r.type !== type) return false
                if (status && r.status !== status) return false
                if (country && (r.location?.country || '').toLowerCase() !== country.toLowerCase()) return false
                if (typeof minAmount === 'number' && (r.fraudDetails?.amount ?? 0) < minAmount) return false
                if (typeof maxAmount === 'number' && (r.fraudDetails?.amount ?? 0) > maxAmount) return false
                if (rx && !(rx.test(r.title) || rx.test(r.description) || (r.tags || []).some((t: string) => rx!.test(t)))) return false
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
            q, type, status, country,
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


