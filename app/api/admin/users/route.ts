import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import mongoose from 'mongoose'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const role = request.headers.get('x-user-role') || ''
        if (role !== 'super_admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const q = (searchParams.get('q') || '').trim()
        const roleFilter = (searchParams.get('role') || '').trim()
        const subStatus = (searchParams.get('subscriptionStatus') || '').trim()
        const isActiveParam = (searchParams.get('isActive') || '').trim()

        const filter: any = {}
        const and: any[] = []
        // Always exclude super admins, sub admins, and enterprise users from this listing
        and.push({ role: { $nin: ['super_admin', 'sub_admin', 'enterprise_user'] } })
        if (q) {
            const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            and.push({ $or: [{ firstName: rx }, { lastName: rx }, { email: rx }] })
        }
        if (roleFilter) and.push({ role: roleFilter })
        if (subStatus) and.push({ 'subscription.status': subStatus })
        if (isActiveParam === 'true') and.push({ isActive: true })
        if (isActiveParam === 'false') and.push({ isActive: false })
        if (and.length) filter.$and = and

        const skip = (page - 1) * limit
        const users = await User.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-password')
            .lean()

        const total = await User.countDocuments(filter)

        // For enterprise_admin rows, compute count of associated enterprise users
        const enterpriseAdminIds = users.filter((u: any) => u.role === 'enterprise_admin').map((u: any) => u._id)
        let counts: Array<{ _id: any; count: number }> = []
        if (enterpriseAdminIds.length) {
            counts = await User.aggregate([
                { $match: { role: 'enterprise_user', createdBy: { $in: enterpriseAdminIds as any } } },
                { $group: { _id: '$createdBy', count: { $sum: 1 } } }
            ]) as any
        }
        const idToCount = new Map<string, number>(counts.map(c => [String(c._id), c.count]))
        const itemsWithCounts = users.map((u: any) => (
            u.role === 'enterprise_admin' ? { ...u, enterpriseUserCount: idToCount.get(String(u._id)) || 0 } : u
        ))

        return NextResponse.json({
            items: itemsWithCounts,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        })
    } catch (err) {
        console.error('Admin users list error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


