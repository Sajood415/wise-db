import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

// GET /api/search/status -> returns subscription summary for current user
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const userId = request.headers.get('x-user-id')
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const user: any = await User.findById(userId).lean()
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const sub = user.subscription || {}
        const remaining = typeof sub.searchLimit === 'number' && sub.searchLimit >= 0
            ? Math.max(0, (sub.searchLimit || 0) - (sub.searchesUsed || 0))
            : -1

        return NextResponse.json({
            type: sub.type,
            status: sub.status,
            canAccessRealData: sub.canAccessRealData,
            searchesUsed: sub.searchesUsed || 0,
            searchLimit: sub.searchLimit ?? -1,
            remainingSearches: remaining,
            isTrialExpired: user.subscription?.type === 'free_trial' && user.subscription?.trialEndsAt ? (new Date() > new Date(user.subscription.trialEndsAt)) : false,
        })
    } catch (error) {
        console.error('Search status error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


