import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import EnterprisePayment from '@/models/EnterprisePayment';
import EnterpriseRequest from '@/models/EnterpriseRequest';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Enrich enterprise admin with computed package end date and name
        if (user.role === 'enterprise_admin') {
            const obj = user.toObject();
            try {
                let packageEndsAt: Date | undefined = obj.subscription?.packageEndsAt as any
                if (!packageEndsAt) {
                    const latestPayment = await EnterprisePayment.findOne({ enterpriseAdminEmail: obj.email, status: 'completed' })
                        .sort({ paidAt: -1 })
                        .lean()
                    const lp: any = latestPayment as any
                    if (lp?.paidAt) {
                        const base = new Date(lp.paidAt as any)
                        packageEndsAt = new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000)
                    } else {
                        const er = await EnterpriseRequest.findOne({ enterpriseAdminEmail: obj.email, paymentReceived: true })
                            .sort({ updatedAt: -1 })
                            .lean()
                        const erDoc: any = er as any
                        if (erDoc?.paymentTxnDate) {
                            const base = new Date(erDoc.paymentTxnDate as any)
                            packageEndsAt = new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000)
                        }
                    }
                }
                if (packageEndsAt) {
                    obj.subscription = {
                        ...obj.subscription,
                        packageEndsAt,
                        type: 'enterprise_package',
                        status: obj.subscription?.status || 'active',
                        canAccessRealData: true,
                    }
                }
                if (!obj.packageName) {
                    obj.packageName = 'Enterprise'
                }
            } catch { }
            return NextResponse.json(
                { user: obj },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { user },
            { status: 200 }
        );

    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}