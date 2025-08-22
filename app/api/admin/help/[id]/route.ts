import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import dbConnect from '@/lib/mongodb'
import HelpRequest from '@/models/HelpRequest'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect()

        // Get token from cookies
        const token = request.cookies.get('auth-token')?.value
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 })
        }

        // Verify the token
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key')
        const { payload } = await jwtVerify(token, secret)
        const userRole = payload.role as string

        // Only super admins can access this endpoint
        if (userRole !== 'super_admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Get request ID from params
        const { id } = await params
        if (!id) {
            return NextResponse.json({ error: 'Help request ID is required' }, { status: 400 })
        }

        // Parse request body
        const body = await request.json()
        const { status } = body

        // Validate status
        const validStatuses = ['pending', 'in_progress', 'resolved', 'closed']
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        // Find and update the help request
        const helpRequest = await HelpRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        )

        if (!helpRequest) {
            return NextResponse.json({ error: 'Help request not found' }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: 'Help request status updated successfully',
            helpRequest
        })

    } catch (error) {
        console.error('Admin help request update error:', error)
        return NextResponse.json(
            { error: 'Failed to update help request' },
            { status: 500 }
        )
    }
}
