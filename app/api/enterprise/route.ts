import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import EnterpriseRequest from '@/models/EnterpriseRequest';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const {
            companyName,
            contactName,
            businessEmail,
            phoneNumber,
            industry,
            numberOfSearches,
            numberOfUsers,
            whenNeeded,
            message
        } = body || {};

        if (!companyName || !contactName || !businessEmail || !phoneNumber || !industry || !numberOfSearches || !numberOfUsers || !whenNeeded) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const doc = await EnterpriseRequest.create({
            companyName,
            contactName,
            businessEmail,
            phoneNumber,
            industry,
            numberOfSearches: Number(numberOfSearches),
            numberOfUsers: Number(numberOfUsers),
            whenNeeded,
            message
        });
        return NextResponse.json({ message: 'Enterprise request submitted', id: doc._id }, { status: 201 });
    } catch (err) {
        console.error('Enterprise request error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


