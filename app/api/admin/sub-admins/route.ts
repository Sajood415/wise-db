import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()
        const role = request.headers.get('x-user-role') || ''
        if (role !== 'super_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const q = (searchParams.get('q') || '').trim()
        const isActive = searchParams.get('isActive')

        const filter: any = { role: 'sub_admin' }
        const and: any[] = []
        if (q) {
            const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
            and.push({ $or: [{ firstName: rx }, { lastName: rx }, { email: rx }] })
        }
        if (isActive === 'true') and.push({ isActive: true })
        if (isActive === 'false') and.push({ isActive: false })
        if (and.length) filter.$and = and

        const skip = (page - 1) * limit
        const items = await User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-password').lean()
        const total = await User.countDocuments(filter)
        return NextResponse.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
    } catch (e) {
        console.error('List sub-admins error:', e)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect()
        const role = request.headers.get('x-user-role') || ''
        if (role !== 'super_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const { firstName, lastName, email, password } = body || {}
        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }
        const existing = await User.findOne({ email })
        if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
        const hashed = await bcrypt.hash(password, 10)
        const created = await User.create({ firstName, lastName, email, password: hashed, role: 'sub_admin', isActive: true })
        const dto = created.toObject()
        delete (dto as any).password
        return NextResponse.json({ item: dto })
    } catch (e) {
        console.error('Create sub-admin error:', e)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


