import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Fraud from '@/models/Fraud';

// GET /api/dashboard/recent-activity?limit=10
// For now, recent activity = user's recently viewed/searched or created reports
// We start with user's own recent submissions. Later we can extend with search logs.
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const userId = request.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 10)));

        const items = await Fraud.find({ submittedBy: userId })
            .sort({ updatedAt: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json({ items }, { status: 200 });
    } catch (error) {
        console.error('Recent activity fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


