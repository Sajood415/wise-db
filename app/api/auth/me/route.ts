import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        // Get token from cookies
        const token = request.cookies.get('auth-token')?.value

        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 })
        }

        try {
            // Verify the token
            const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key')
            const { payload } = await jwtVerify(token, secret)

            const userId = payload.userId as string

            if (!userId) {
                return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
            }

            // Get user details from database
            const user = await User.findById(userId).select('firstName lastName email role isActive subscription').lean()

            if (!user) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 })
            }

            // Type assertion to ensure user has the expected properties
            const userData = user as any

            if (userData.isActive === false) {
                return NextResponse.json({ error: 'User account is disabled' }, { status: 403 })
            }

            return NextResponse.json({
                user: {
                    id: userData._id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    role: userData.role,
                    isActive: userData.isActive,
                    subscription: userData.subscription
                }
            })

        } catch (jwtError) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

    } catch (error) {
        console.error('Auth check error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
