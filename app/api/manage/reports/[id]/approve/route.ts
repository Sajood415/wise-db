import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Fraud from '@/models/Fraud'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()

        const { id } = await params
        const userId = request.headers.get('x-user-id')
        const userRole = request.headers.get('x-user-role')

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only sub_admin, enterprise_admin, and super_admin can approve
        if (!['sub_admin', 'enterprise_admin', 'super_admin'].includes(userRole || '')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Find the fraud report
        const fraud = await Fraud.findById(id)
        if (!fraud) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 })
        }

        // Check if report is pending
        if (fraud.status !== 'pending') {
            return NextResponse.json({ error: 'Report is not pending for review' }, { status: 400 })
        }

        // Update the report
        fraud.status = 'approved'
        fraud.reviewedBy = userId
        fraud.reviewedAt = new Date()
        await fraud.save()

        return NextResponse.json({
            message: 'Report approved successfully',
            reportId: id
        })

    } catch (error) {
        console.error('Failed to approve report:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
