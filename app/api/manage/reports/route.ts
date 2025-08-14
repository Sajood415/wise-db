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

        const skip = (page - 1) * limit

        // Build filter
        const filter: any = {}
        if (status) filter.status = status
        if (type) filter.type = type

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
