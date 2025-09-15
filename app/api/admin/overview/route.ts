import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Fraud from '@/models/Fraud'
import User from '@/models/User'
import Payment from '@/models/Payment'
import EnterprisePayment from '@/models/EnterprisePayment'

function pctChange(current: number, previous: number): number {
    if (!Number.isFinite(previous) || previous === 0) {
        return current > 0 ? 100 : 0
    }
    return ((current - previous) / previous) * 100
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const role = request.headers.get('x-user-role') || ''
        if (role !== 'super_admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const now = new Date()
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

        // Reports
        const [
            totalReports,
            thisMonthReports,
            lastMonthReports,
            pendingReviews,
        ] = await Promise.all([
            Fraud.countDocuments({}),
            Fraud.countDocuments({ createdAt: { $gte: startOfThisMonth, $lt: now } }),
            Fraud.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } }),
            Fraud.countDocuments({ status: 'pending' }),
        ])

        // Users (active non-admin roles only; guests are not stored)
        const nonAdminRoleFilter = { role: { $nin: ['sub_admin', 'super_admin'] } }
        const [
            activeUsers,
            thisMonthUsers,
            lastMonthUsers,
        ] = await Promise.all([
            User.countDocuments({ isActive: true, ...nonAdminRoleFilter }),
            User.countDocuments({ createdAt: { $gte: startOfThisMonth, $lt: now }, isActive: true, ...nonAdminRoleFilter }),
            User.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth }, isActive: true, ...nonAdminRoleFilter }),
        ])

        // Monthly revenue: sum of completed individual payments and enterprise payments in current month
        const [subAgg, entAgg] = await Promise.all([
            Payment.aggregate([
                { $match: { status: 'completed', createdAt: { $gte: startOfThisMonth, $lt: now } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]).catch(() => [] as any[]),
            EnterprisePayment.aggregate([
                { $match: { status: 'completed', paidAt: { $gte: startOfThisMonth, $lt: now } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]).catch(() => [] as any[]),
        ])
        const monthlyRevenueValue = (subAgg && subAgg[0]?.total ? Number(subAgg[0].total) : 0)
            + (entAgg && entAgg[0]?.total ? Number(entAgg[0].total) : 0)

        return NextResponse.json({
            totalReports: {
                value: totalReports,
                changePct: pctChange(thisMonthReports, lastMonthReports),
            },
            pendingReviews: {
                value: pendingReviews,
            },
            activeUsers: {
                value: activeUsers,
                changePct: pctChange(thisMonthUsers, lastMonthUsers),
            },
            monthlyRevenue: {
                value: monthlyRevenueValue,
                currency: 'USD',
                label: 'Enterprise + Subscriptions',
            },
        })
    } catch (error) {
        console.error('Admin overview error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


