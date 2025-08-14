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

        const now = new Date()
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        // Get pending reviews count
        const pendingReviews = await Fraud.countDocuments({ status: 'pending' })

        // Get verified today count (approved or rejected today)
        const verifiedToday = await Fraud.countDocuments({
            status: { $in: ['approved', 'rejected'] },
            reviewedAt: { $gte: startOfToday }
        })

        // Get total reviewed this month
        const totalReviewed = await Fraud.countDocuments({
            status: { $in: ['approved', 'rejected'] },
            reviewedAt: { $gte: startOfMonth }
        })

        return NextResponse.json({
            pendingReviews,
            verifiedToday,
            totalReviewed
        })

    } catch (error) {
        console.error('Failed to fetch stats:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
