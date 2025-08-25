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
        let remaining = typeof sub.searchLimit === 'number' && sub.searchLimit >= 0
            ? Math.max(0, (sub.searchLimit || 0) - (sub.searchesUsed || 0))
            : -1

        // For enterprise_user, reflect creator's remaining if exists
        if (user.role === 'enterprise_user' && user.createdBy) {
            try {
                const admin: any = await User.findById(user.createdBy)
                if (admin && admin.subscription) {
                    const aSub = admin.subscription
                    remaining = typeof aSub.searchLimit === 'number' && aSub.searchLimit >= 0
                        ? Math.max(0, (aSub.searchLimit || 0) - (aSub.searchesUsed || 0))
                        : -1
                }
            } catch { }
        }

        return NextResponse.json({
            type: sub.type,
            status: sub.status,
            canAccessRealData: sub.canAccessRealData,
            searchesUsed: sub.searchesUsed || 0,
            searchLimit: user.role === 'enterprise_user' ? (undefined as any) : (sub.searchLimit ?? -1),
            remainingSearches: remaining,
            isTrialExpired: user.subscription?.type === 'free_trial' && user.subscription?.trialEndsAt ? (new Date() > new Date(user.subscription.trialEndsAt)) : false,
            packageName: (user as any).packageName || null,
        })
    } catch (error) {
        console.error('Search status error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


