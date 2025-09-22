import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Fraud from '@/models/Fraud'

// Token auth via header: Authorization: Bearer <token>
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const auth = request.headers.get('authorization') || ''
        const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : ''
        if (!token) return NextResponse.json({ error: 'Missing Bearer token' }, { status: 401 })

        // Find enterprise admin with this token
        const user = await User.findOne({ apiAuthToken: token }).lean()
        if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

        const u: any = user
        if (u.role !== 'enterprise_admin' && u.role !== 'enterprise_user') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Determine effective quota (enterprise_user uses creator/admin quota)
        let quotaUserId = u._id
        if (u.role === 'enterprise_user' && u.createdBy) quotaUserId = u.createdBy
        const quotaUser: any = await User.findById(quotaUserId)
        if (!quotaUser) return NextResponse.json({ error: 'Account not found' }, { status: 404 })

        const sub = quotaUser.subscription || {}
        const limit: number = typeof sub.searchLimit === 'number' ? sub.searchLimit : 0
        const used: number = sub.searchesUsed || 0
        const unlimited = limit === -1

        // Enforce package expiry
        const now = new Date()
        const pkgEnds = quotaUser.subscription?.packageEndsAt ? new Date(quotaUser.subscription.packageEndsAt) : undefined
        const isExpired = !!(pkgEnds && now > pkgEnds && quotaUser.subscription?.type !== 'free_trial')
        if (isExpired) return NextResponse.json({ error: 'Plan expired' }, { status: 403 })

        if (!unlimited && used >= limit) {
            return NextResponse.json({ error: 'Quota exceeded' }, { status: 403 })
        }

        // Basic filters (optional): q, email, phone, limit
        const { searchParams } = new URL(request.url)
        const q = searchParams.get('q')?.trim()
        const email = searchParams.get('email')?.trim()
        const phone = searchParams.get('phone')?.trim()
        const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 20)))

        const and: any[] = []
        if (q) {
            const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            and.push({ $or: [{ title: rx }, { description: rx }, { tags: rx }] })
        }
        if (email) {
            const rx = new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            and.push({ 'fraudsterDetails.suspiciousEmail': rx })
        }
        if (phone) {
            const rx = new RegExp(phone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            and.push({ 'fraudsterDetails.suspiciousPhone': rx })
        }
        const filter = and.length ? { $and: and } : {}

        // Only return limited fields
        const items = await Fraud.find(filter).sort({ _id: -1 }).limit(pageSize).select({
            'fraudsterDetails.suspiciousName': 1,
            'fraudsterDetails.suspiciousEmail': 1,
            'fraudsterDetails.suspiciousPhone': 1,
        }).lean()

        // Deduct one count per request (not per item)
        if (!unlimited) {
            quotaUser.subscription.searchesUsed = (quotaUser.subscription.searchesUsed || 0) + 1
            try { await quotaUser.save() } catch {}
        }

        return NextResponse.json({
            items: items.map((it: any) => ({
                name: it?.fraudsterDetails?.suspiciousName || null,
                email: it?.fraudsterDetails?.suspiciousEmail || null,
                phone: it?.fraudsterDetails?.suspiciousPhone || null,
            })),
            remaining: unlimited ? -1 : Math.max(0, limit - (used + 1)),
        })
    } catch (err) {
        console.error('External frauds API error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


