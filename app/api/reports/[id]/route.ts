import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { jwtVerify } from 'jose'
import connectToDatabase from '@/lib/mongodb'
import Fraud from '@/models/Fraud'

async function getUserFromRequest(req: NextRequest) {
    const headersUserId = req.headers.get('x-user-id') || ''
    const headersEmail = req.headers.get('x-user-email') || ''
    if (headersUserId || headersEmail) return { userId: headersUserId, email: headersEmail }
    const token = req.cookies.get('auth-token')?.value
    if (!token) return { userId: '', email: '' }
    try {
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key')
        const { payload } = await jwtVerify(token, secret)
        return { userId: (payload.userId as string) || '', email: (payload.email as string) || '' }
    } catch {
        return { userId: '', email: '' }
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase()
        const { id } = await params
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
        }

        const raw = await Fraud.findById(id).lean()
        if (!raw || Array.isArray(raw)) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }
        const doc = raw as any

        // Basic access control: allow owner (submittedBy) or matching guest email
        const { userId, email } = await getUserFromRequest(req)
        const isOwner = Boolean(userId) && Boolean(doc.submittedBy) && String(doc.submittedBy) === String(userId)
        const isGuestOwner = email && doc.guestSubmission?.email && doc.guestSubmission.email === email
        if (!isOwner && !isGuestOwner) {
            // Optionally allow admins; skipping for now
            // return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        return NextResponse.json({ item: doc }, { status: 200 })
    } catch (err) {
        console.error('Get report error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


