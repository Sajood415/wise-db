import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import EnterpriseRequest from '@/models/EnterpriseRequest'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect()

        const role = request.headers.get('x-user-role') || ''
        if (role !== 'super_admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { id } = await params
        const body = await request.json().catch(() => ({}))
        const { status } = body || {}
        const allowed: string[] = ['new', 'in_review', 'contacted', 'closed']
        if (status && !allowed.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }
        const doc = await EnterpriseRequest.findByIdAndUpdate(
            id,
            { $set: { ...(status ? { status } : {}) } },
            { new: true }
        ).lean()
        if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ item: doc })
    } catch (err) {
        console.error('Admin enterprise update error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


