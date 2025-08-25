import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import EnterpriseRequest from '@/models/EnterpriseRequest'

export async function POST(request: NextRequest) {
    try {
        await dbConnect()
        const { enterprise, token, email, firstName, lastName, password } = await request.json()

        if (!enterprise || !token || !email || !firstName || !lastName || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const er: any = await EnterpriseRequest.findById(enterprise).lean()
        if (!er) return NextResponse.json({ error: 'Invalid enterprise link' }, { status: 400 })
        if (!er.paymentReceived) return NextResponse.json({ error: 'Payment not confirmed yet' }, { status: 400 })
        if (!er.signupToken || er.signupToken !== token) return NextResponse.json({ error: 'Invalid or used token' }, { status: 400 })
        if (er.signupTokenExpiresAt && new Date(er.signupTokenExpiresAt) < new Date()) {
            return NextResponse.json({ error: 'Signup link expired' }, { status: 400 })
        }
        if (er.enterpriseAdminEmail && er.enterpriseAdminEmail.toLowerCase() !== String(email).toLowerCase()) {
            return NextResponse.json({ error: 'Email does not match the invitation' }, { status: 400 })
        }

        // ensure user not exists
        const existing = await User.findOne({ email: String(email).toLowerCase() }).lean()
        if (existing) return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })

        const hashed = await bcrypt.hash(password, 12)

        // Create enterprise admin user
        const user = await User.create({
            firstName: String(firstName).trim(),
            lastName: String(lastName).trim(),
            email: String(email).toLowerCase().trim(),
            password: hashed,
            role: 'enterprise_admin',
            company: { name: er.companyName },
            subscription: {
                type: 'enterprise_package',
                status: 'active',
                searchesUsed: 0,
                searchLimit: Number(er.allowanceSearches || 0),
                canAccessRealData: true,
            },
        })

        // Invalidate token after use
        await EnterpriseRequest.findByIdAndUpdate(enterprise, { $unset: { signupToken: 1, signupTokenExpiresAt: 1 } })

        const userObj = user.toObject()
        delete (userObj as any).password
        return NextResponse.json({ message: 'Enterprise admin created', user: userObj })
    } catch (err) {
        console.error('Enterprise signup error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


