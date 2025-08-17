import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect()
        const role = request.headers.get('x-user-role') || ''
        if (role !== 'super_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        const { id } = await params
        const body = await request.json()
        const update: any = {}
        if (typeof body.isActive === 'boolean') update.isActive = body.isActive
        const updated = await User.findOneAndUpdate({ _id: id, role: 'sub_admin' }, { $set: update }, { new: true }).select('-password').lean()
        if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ item: updated })
    } catch (e) {
        console.error('Update sub-admin error:', e)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect()
        const role = request.headers.get('x-user-role') || ''
        if (role !== 'super_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        const { id } = await params
        await User.deleteOne({ _id: id, role: 'sub_admin' })
        return NextResponse.json({ ok: true })
    } catch (e) {
        console.error('Delete sub-admin error:', e)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


