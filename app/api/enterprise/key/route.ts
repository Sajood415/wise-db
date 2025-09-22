import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { jwtVerify } from 'jose'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

async function getAuthFromRequest(request: NextRequest) {
    const headerUserId = request.headers.get('x-user-id') || ''
    const headerRole = request.headers.get('x-user-role') || ''
    if (headerUserId && headerRole) return { userId: headerUserId, role: headerRole }
    const cookieToken = request.cookies.get('auth-token')?.value
    if (!cookieToken) return { userId: '', role: '' }
    try {
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key')
        const { payload } = await jwtVerify(cookieToken, secret)
        return { userId: String(payload.userId || ''), role: String(payload.role || '') }
    } catch {
        return { userId: '', role: '' }
    }
}

// GET: return existing token (enterprise_admin only)
export async function GET(request: NextRequest) {
    try {
        await dbConnect()
        const { userId, role: userRole } = await getAuthFromRequest(request)
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if (userRole !== 'enterprise_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const existing: any = await User.findById(userId).lean()
        if (!existing) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        if (!existing.apiAuthToken || typeof existing.apiAuthToken !== 'string' || existing.apiAuthToken.length < 16) {
            const newToken = crypto.randomBytes(32).toString('hex')
            const now = new Date()
            await User.updateOne({ _id: userId }, { $set: { apiAuthToken: newToken, apiAuthTokenCreatedAt: now } })
            return NextResponse.json({ token: newToken, createdAt: now.toISOString() })
        }

        return NextResponse.json({
            token: existing.apiAuthToken || null,
            createdAt: existing.apiAuthTokenCreatedAt ? new Date(existing.apiAuthTokenCreatedAt).toISOString() : null,
        })
    } catch (err) {
        console.error('Enterprise key GET error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST: generate/regenerate token (enterprise_admin only)
export async function POST(request: NextRequest) {
    try {
        await dbConnect()
        const { userId, role: userRole } = await getAuthFromRequest(request)
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if (userRole !== 'enterprise_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const token = crypto.randomBytes(32).toString('hex')
        const updated = await User.findByIdAndUpdate(
            userId,
            { $set: { apiAuthToken: token, apiAuthTokenCreatedAt: new Date() } },
            { new: true }
        ).select('apiAuthToken apiAuthTokenCreatedAt').lean()
        if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 })
        return NextResponse.json({
            token: (updated as any).apiAuthToken || null,
            createdAt: (updated as any).apiAuthTokenCreatedAt ? new Date((updated as any).apiAuthTokenCreatedAt).toISOString() : null,
        })
    } catch (err) {
        console.error('Enterprise key POST error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


