import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import EnterpriseRequest from '@/models/EnterpriseRequest'

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
        const statusQuery = (searchParams.get('status') || '').trim()
        const industry = (searchParams.get('industry') || '').trim()

        const filter: any = {}
        const and: any[] = []
        if (q) {
            const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            and.push({
                $or: [
                    { companyName: rx },
                    { contactName: rx },
                    { businessEmail: rx },
                    { phoneNumber: rx },
                    { industry: rx },
                ]
            })
        }
        if (industry) and.push({ industry })
        if (statusQuery) {
            const parts = statusQuery.split(',').map(s => s.trim()).filter(Boolean)
            if (parts.length) and.push({ status: { $in: parts } })
        }
        if (and.length) filter.$and = and

        const skip = (page - 1) * limit
        const items = await EnterpriseRequest.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        const total = await EnterpriseRequest.countDocuments(filter)

        return NextResponse.json({
            items,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        })
    } catch (err) {
        console.error('Admin enterprise list error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


