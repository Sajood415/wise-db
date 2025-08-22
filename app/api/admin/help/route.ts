import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import dbConnect from '@/lib/mongodb'
import HelpRequest from '@/models/HelpRequest'

export async function GET(request: NextRequest) {
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

        // Get query parameters
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const q = searchParams.get('q') || ''
        const status = searchParams.get('status') || ''
        const issueType = searchParams.get('issueType') || ''

        // Build filter query
        const filter: any = {}

        if (q) {
            filter.$or = [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
                { subject: { $regex: q, $options: 'i' } },
                { message: { $regex: q, $options: 'i' } }
            ]
        }

        if (status) {
            filter.status = status
        }

        if (issueType) {
            filter.issueType = issueType
        }

        // Calculate skip value for pagination
        const skip = (page - 1) * limit

        // Execute queries
        const [items, total] = await Promise.all([
            HelpRequest.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            HelpRequest.countDocuments(filter)
        ])

        // Calculate pagination info
        const totalPages = Math.ceil(total / limit)

        return NextResponse.json({
            items,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        })

    } catch (error) {
        console.error('Admin help requests fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch help requests' },
            { status: 500 }
        )
    }
}
