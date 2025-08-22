import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Fraud from '@/models/Fraud'

export async function GET(
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

        // Only sub_admin, enterprise_admin, and super_admin can access
        if (!['sub_admin', 'enterprise_admin', 'super_admin'].includes(userRole || '')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const report = await Fraud.findById(id)
            .populate('reviewedBy', 'firstName lastName email role')
            .populate('submittedBy', 'firstName lastName email phone')
            .lean()
        if (!report) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 })
        }

        return NextResponse.json({ report })

    } catch (error) {
        console.error('Failed to fetch report:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect()

        const { id } = await params
        const userId = request.headers.get('x-user-id')
        const userRole = request.headers.get('x-user-role')
        const body = await request.json()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only sub_admin, enterprise_admin, and super_admin can edit
        if (!['sub_admin', 'enterprise_admin', 'super_admin'].includes(userRole || '')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const report = await Fraud.findById(id)
        if (!report) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 })
        }

        // Only allow edits while pending
        if (report.status !== 'pending') {
            return NextResponse.json({ error: 'Only pending reports can be edited' }, { status: 400 })
        }

        // Update all editable fields
        const allowedFields = [
            'title',
            'description',
            'type',
            'severity',
            'fraudsterDetails',
            'evidence',
            'location',
            'tags',
            'guestSubmission'
        ]

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                report[field] = body[field]
            }
        }

        await report.save()

        return NextResponse.json({
            message: 'Report updated successfully',
            reportId: id
        })

    } catch (error) {
        console.error('Failed to update report:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
