import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Fraud from '@/models/Fraud';

// GET /api/dashboard/my-reports?page=1&pageSize=10&status=approved|pending|rejected|under_review
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const userId = request.headers.get('x-user-id');
        const userEmail = request.headers.get('x-user-email');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = Math.max(1, Number(searchParams.get('page') || 1));
        const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize') || 10)));
        const status = searchParams.get('status');

        const or: any[] = []
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
            or.push({ submittedBy: new mongoose.Types.ObjectId(userId) })
        }
        if (userEmail) {
            or.push({ 'guestSubmission.email': userEmail })
        }
        const filter: Record<string, unknown> = or.length ? { $or: or } : { submittedBy: userId };
        if (status) {
            filter.status = status;
        }

        const skip = (page - 1) * pageSize;

        const [items, total] = await Promise.all([
            Fraud.find(filter)
                .populate('submittedBy', 'firstName lastName email phone')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(pageSize)
                .lean(),
            Fraud.countDocuments(filter),
        ]);

        return NextResponse.json(
            {
                items,
                pagination: {
                    page,
                    pageSize,
                    total,
                    totalPages: Math.ceil(total / pageSize),
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('My reports fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


