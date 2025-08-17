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
        const { reason } = await request.json()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!['sub_admin', 'enterprise_admin', 'super_admin'].includes(userRole || '')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        if (!reason || typeof reason !== 'string' || !reason.trim()) {
            return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 })
        }

        const fraud = await Fraud.findById(id)
        if (!fraud) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 })
        }

        if (fraud.status !== 'pending') {
            return NextResponse.json({ error: 'Report is not pending for review' }, { status: 400 })
        }

        fraud.status = 'rejected'
            ; (fraud as any).reviewNotes = reason.trim()
            ; (fraud as any).reviewedBy = userId
            ; (fraud as any).reviewedAt = new Date()
        await fraud.save()

        return NextResponse.json({ message: 'Report rejected successfully', reportId: id })

    } catch (error) {
        console.error('Failed to reject report:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}



