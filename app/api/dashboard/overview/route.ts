import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Fraud from '@/models/Fraud';

// GET /api/dashboard/overview
// Returns high-level counters for the dashboard for the authenticated user
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const userId = request.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Global stats
        const [totalReports, approvedReports, pendingReports, rejectedReports] = await Promise.all([
            Fraud.countDocuments({}),
            Fraud.countDocuments({ status: 'approved' }),
            Fraud.countDocuments({ status: 'pending' }),
            Fraud.countDocuments({ status: 'rejected' }),
        ]);

        // User-specific stats
        const [myReportsTotal, myApproved, myPending, myRejected] = await Promise.all([
            Fraud.countDocuments({ submittedBy: userId }),
            Fraud.countDocuments({ submittedBy: userId, status: 'approved' }),
            Fraud.countDocuments({ submittedBy: userId, status: 'pending' }),
            Fraud.countDocuments({ submittedBy: userId, status: 'rejected' }),
        ]);

        // Placeholders for searches until search logging is implemented
        const searchesThisMonth = 0;
        const savedSearches = 0;

        return NextResponse.json(
            {
                totals: {
                    totalReports,
                    approvedReports,
                    pendingReports,
                    rejectedReports,
                },
                mine: {
                    total: myReportsTotal,
                    approved: myApproved,
                    pending: myPending,
                    rejected: myRejected,
                },
                searches: {
                    thisMonth: searchesThisMonth,
                    saved: savedSearches,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Dashboard overview error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


