import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

// GET /api/search/status -> returns subscription summary for current user
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const userId = request.headers.get('x-user-id')
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const user: any = await User.findById(userId)
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        // Auto-expire free trial if past trialEndsAt
        if (
            user.subscription?.type === 'free_trial' &&
            user.subscription?.trialEndsAt &&
            new Date() > new Date(user.subscription.trialEndsAt) &&
            user.subscription.status !== 'expired'
        ) {
            user.subscription.status = 'expired'
            try { await user.save() } catch { }
        }

        const sub = user.subscription || {}

        // Defaults to the user's own subscription
        let effectiveUsed = sub.searchesUsed || 0
        let effectiveLimit = typeof sub.searchLimit === 'number' ? sub.searchLimit : -1

        // For enterprise_user, reflect creator's quota if exists
        if (user.role === 'enterprise_user' && user.createdBy) {
            try {
                const admin: any = await User.findById(user.createdBy)
                if (admin && admin.subscription) {
                    effectiveUsed = admin.subscription.searchesUsed || 0
                    effectiveLimit = typeof admin.subscription.searchLimit === 'number' ? admin.subscription.searchLimit : -1
                }
            } catch { }
        }

        const remaining = effectiveLimit >= 0
            ? Math.max(0, (effectiveLimit || 0) - (effectiveUsed || 0))
            : -1

        return NextResponse.json({
            type: sub.type,
            status: sub.status,
            canAccessRealData: sub.canAccessRealData,
            searchesUsed: effectiveUsed,
            searchLimit: effectiveLimit,
            remainingSearches: remaining,
            isTrialExpired: user.subscription?.type === 'free_trial' && user.subscription?.trialEndsAt ? (new Date() > new Date(user.subscription.trialEndsAt)) : false,
            packageName: (user as any).packageName || null,
        })
    } catch (error) {
        console.error('Search status error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


