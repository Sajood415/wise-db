import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Fraud from '@/models/Fraud';
import SearchLog from '@/models/SearchLog';
import User from '@/models/User';

// GET /api/dashboard/overview
// Returns high-level counters for the dashboard for the authenticated user
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const userId = request.headers.get('x-user-id');
        const userEmail = request.headers.get('x-user-email');
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

        // Build user filter: include reports submitted as logged-in user OR guest submissions matching email
        const or: any[] = [];
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            or.push({ submittedBy: new mongoose.Types.ObjectId(userId) });
        }
        if (userEmail) {
            or.push({ 'guestSubmission.email': userEmail });
        }
        const myFilter: Record<string, unknown> = or.length ? { $or: or } : { submittedBy: userId };

        // User-specific stats
        const [myReportsTotal, myApproved, myPending, myRejected] = await Promise.all([
            Fraud.countDocuments(myFilter),
            Fraud.countDocuments({ ...myFilter, status: 'approved' }),
            Fraud.countDocuments({ ...myFilter, status: 'pending' }),
            Fraud.countDocuments({ ...myFilter, status: 'rejected' }),
        ]);

        // Searches used from user profile
        const userDoc: any = await User.findById(userId).lean();
        const searchesUsed = (userDoc?.subscription?.searchesUsed as number) ?? 0;

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
                searches: { used: searchesUsed },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Dashboard overview error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


