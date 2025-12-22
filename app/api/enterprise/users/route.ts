import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import EnterpriseRequest from '@/models/EnterpriseRequest'
import SearchLog from '@/models/SearchLog'

// GET: list enterprise users for current enterprise admin
export async function GET(request: NextRequest) {
    try {
        await dbConnect()
        const userId = request.headers.get('x-user-id')
        const role = request.headers.get('x-user-role')
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if (role !== 'enterprise_admin' && role !== 'super_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const page = Math.max(1, Number(request.nextUrl.searchParams.get('page') || 1))
        const pageSize = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get('pageSize') || 20)))
        const createdByParam = (request.nextUrl.searchParams.get('createdBy') || '').trim()

        const filter: any = role === 'super_admin'
            ? (createdByParam ? { role: 'enterprise_user', createdBy: createdByParam } : { role: 'enterprise_user' })
            : { createdBy: userId, role: 'enterprise_user' }
        const [items, total] = await Promise.all([
            User.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .select('-password')
                .lean(),
            User.countDocuments(filter)
        ])

        // Use stored per-user subscription.searchesUsed for personal counts
        const itemsWithCounts = items.map((u: any) => ({
            ...u,
            searchCount: (u.subscription?.searchesUsed as number) || 0,
        }))

        return NextResponse.json({ items: itemsWithCounts, pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } })
    } catch (err) {
        console.error('Enterprise users list error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST: create an enterprise user under current enterprise admin
export async function POST(request: NextRequest) {
    try {
        await dbConnect()
        const adminId = request.headers.get('x-user-id')
        const role = request.headers.get('x-user-role')
        if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        if (role !== 'enterprise_admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { firstName, lastName, email, password } = await request.json()
        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const admin = await User.findById(adminId)
        if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 })

        const adminSub = admin.subscription || {}
        const now = new Date()
        const pkgEnds = adminSub.packageEndsAt ? new Date(adminSub.packageEndsAt) : undefined
        const isPackageExpired = !!(pkgEnds && now > pkgEnds && adminSub.type !== 'free_trial')
        
        if (isPackageExpired) {
            return NextResponse.json({ error: 'Your enterprise plan has expired. Renew to create users.' }, { status: 403 })
        }

        const adminLimit = typeof adminSub.searchLimit === 'number' ? adminSub.searchLimit : 0
        const adminUsed = adminSub.searchesUsed || 0
        const isUnlimited = adminLimit === -1
        const remaining = isUnlimited ? -1 : Math.max(0, adminLimit - adminUsed)

        if (!isUnlimited && remaining === 0) {
            return NextResponse.json({ error: 'Your search quota is exhausted. Purchase more searches to create users.' }, { status: 403 })
        }

        // Enforce allowanceUsers limit based on EnterpriseRequest
        try {
            // Find the latest paid enterprise request for this admin email
            const er: any = await EnterpriseRequest.findOne({ enterpriseAdminEmail: admin.email, paymentReceived: true })
                .sort({ createdAt: -1 })
                .lean()
            if (er && typeof er.allowanceUsers === 'number' && er.allowanceUsers >= 0) {
                const currentUsers = await User.countDocuments({ createdBy: admin._id, role: 'enterprise_user' })
                if (currentUsers >= er.allowanceUsers) {
                    return NextResponse.json({ error: 'User limit reached for your enterprise plan' }, { status: 403 })
                }
            }
        } catch { /* ignore and proceed if lookup fails */ }

        const existing = await User.findOne({ email: String(email).toLowerCase() }).lean()
        if (existing) return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })

        const hashed = await bcrypt.hash(password, 12)
        const user = await User.create({
            firstName: String(firstName).trim(),
            lastName: String(lastName).trim(),
            email: String(email).toLowerCase().trim(),
            password: hashed,
            role: 'enterprise_user',
            createdBy: admin._id,
            company: { name: admin.company?.name || '' },
            subscription: {
                type: 'enterprise_package',
                status: 'active',
                searchesUsed: 0,
                searchLimit: 0, // not used; deducted from enterprise admin
                canAccessRealData: true,
            },
        })

        const obj = user.toObject()
        delete (obj as any).password
        return NextResponse.json({ user: obj }, { status: 201 })
    } catch (err) {
        console.error('Enterprise user create error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


