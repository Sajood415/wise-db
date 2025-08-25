import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import EnterprisePayment from '@/models/EnterprisePayment'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const role = request.headers.get('x-user-role') || ''
        if (role !== 'super_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        const { id } = await params
        await dbConnect()
        const list = await EnterprisePayment.find({ enterpriseRequestId: id }).sort({ createdAt: -1 }).lean()
        return NextResponse.json({ items: list })
    } catch (err) {
        console.error('Enterprise payments list error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


