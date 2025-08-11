import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Fraud from '@/models/Fraud';
import SearchLog from '@/models/SearchLog';

// GET /api/dashboard/recent-activity?limit=10
// For now, recent activity = user's recently viewed/searched or created reports
// We start with user's own recent submissions. Later we can extend with search logs.
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const userId = request.headers.get('x-user-id');
        const userEmail = request.headers.get('x-user-email');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 10)));

        const or: any[] = []
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            or.push({ submittedBy: new mongoose.Types.ObjectId(userId) })
        }
        if (userEmail) {
            or.push({ 'guestSubmission.email': userEmail })
        }
        const filter: Record<string, unknown> = or.length ? { $or: or } : { submittedBy: userId }

        const [reports, searches] = await Promise.all([
            Fraud.find(filter).sort({ updatedAt: -1 }).limit(limit).lean(),
            SearchLog.find({ user: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 }).limit(limit).lean(),
        ])

        const activities = [
            ...reports.map(r => ({
                _id: String(r._id),
                type: 'report',
                title: r.title,
                status: r.status,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
            })),
            ...searches.map(s => ({
                _id: String(s._id),
                type: 'search',
                title: s.q || 'Search executed',
                status: s.source,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
            })),
        ]
            .sort((a, b) => new Date(b.updatedAt as any).getTime() - new Date(a.updatedAt as any).getTime())
            .slice(0, limit)

        return NextResponse.json({ items: activities }, { status: 200 });
    } catch (error) {
        console.error('Recent activity fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


