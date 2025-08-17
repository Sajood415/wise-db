import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Fraud from '@/models/Fraud'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const userId = request.headers.get('x-user-id')
        const userRole = request.headers.get('x-user-role')

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only sub_admin, enterprise_admin, and super_admin can access
        if (!['sub_admin', 'enterprise_admin', 'super_admin'].includes(userRole || '')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const status = searchParams.get('status')
        const type = searchParams.get('type')
        const q = searchParams.get('q') || ''
        const severity = searchParams.get('severity') || ''
        const email = searchParams.get('email') || ''
        const phone = searchParams.get('phone') || ''
        const minAmount = searchParams.get('minAmount')
        const maxAmount = searchParams.get('maxAmount')

        const skip = (page - 1) * limit

        // Build filter (align with user search filters)
        const filter: any = {}
        const and: any[] = []
        if (status) and.push({ status })
        if (type) and.push({ type })
        if (severity) and.push({ severity })
        if (q) {
            const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            and.push({ $or: [{ title: rx }, { description: rx }, { tags: rx }] })
        }
        if (email) {
            const rx = new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            and.push({ $or: [{ 'fraudDetails.suspiciousEmail': rx }, { 'guestSubmission.email': rx }] })
        }
        if (phone) {
            const rx = new RegExp(phone.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            and.push({ $or: [{ 'fraudDetails.suspiciousPhone': rx }] })
        }
        const minA = minAmount ? parseFloat(minAmount) : undefined
        const maxA = maxAmount ? parseFloat(maxAmount) : undefined
        if (typeof minA === 'number' && !Number.isNaN(minA)) and.push({ 'fraudDetails.amount': { $gte: minA } })
        if (typeof maxA === 'number' && !Number.isNaN(maxA)) and.push({ 'fraudDetails.amount': { $lte: maxA } })
        if (and.length) filter.$and = and

        // Get reports with pagination
        const reports = await Fraud.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        // Get total count for pagination
        const total = await Fraud.countDocuments(filter)

        return NextResponse.json({
            reports,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.error('Failed to fetch reports:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
