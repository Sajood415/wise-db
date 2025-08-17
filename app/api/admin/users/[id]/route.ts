import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect()
        const role = request.headers.get('x-user-role') || ''
        if (role !== 'super_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        const { id } = await params
        const user = await User.findById(id).select('-password').lean()
        if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ item: user })
    } catch (e) {
        console.error('Admin user get error:', e)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect()
        const role = request.headers.get('x-user-role') || ''
        if (role !== 'super_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        const { id } = await params
        const body = await request.json()
        const allowed: any = {}
        if (typeof body.isActive === 'boolean') allowed.isActive = body.isActive
        if (body.subscription && typeof body.subscription.status === 'string') {
            allowed['subscription.status'] = body.subscription.status
        }
        if (body.role && ['individual', 'enterprise_admin', 'enterprise_user', 'sub_admin', 'super_admin'].includes(body.role)) {
            allowed.role = body.role
        }
        const updated = await User.findByIdAndUpdate(id, { $set: allowed }, { new: true }).select('-password').lean()
        if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ item: updated })
    } catch (e) {
        console.error('Admin user patch error:', e)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect()
        const role = request.headers.get('x-user-role') || ''
        if (role !== 'super_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        const { id } = await params
        await User.findByIdAndDelete(id)
        return NextResponse.json({ ok: true })
    } catch (e) {
        console.error('Admin user delete error:', e)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


