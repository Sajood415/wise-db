import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { jwtVerify } from 'jose'
import connectToDatabase from '@/lib/mongodb'
import Fraud from '@/models/Fraud'

function mapFraudType(inputType?: string): 'email' | 'phone' | 'website' | 'identity' | 'financial' | 'other' {
    const type = (inputType || '').toLowerCase()
    const direct: Record<string, 'email' | 'phone' | 'website' | 'identity' | 'financial' | 'other'> = {
        'email': 'email',
        'phone': 'phone',
        'website': 'website',
        'identity': 'identity',
        'financial': 'financial',
        'other': 'other',
        'phishing': 'email',
        'identity theft': 'identity',
        'credit card fraud': 'financial',
        'wire transfer fraud': 'financial',
        'cryptocurrency scam': 'financial',
        'online shopping fraud': 'financial',
        'investment scam': 'financial',
        'romance scam': 'financial',
        'tech support scam': 'financial',
        'business email compromise': 'email',
    }
    return direct[type] ?? 'other'
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase()

        const body = await req.json()

        const {
            reportTitle,
            detailedDescription,
            fraudType,
            incidentDate,
            currency,
            actualLoss,
            attemptedLoss,
            websitesSocialMedia,
            evidenceDescription,
            reporterName,
            reporterEmail,
            reporterPhone,
        } = body || {}

        if (!reportTitle || !detailedDescription) {
            return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
        }

        // Identify user (prefer middleware header; fallback to cookie token for public path submissions)
        let userId = req.headers.get('x-user-id') || ''
        if (!userId) {
            const token = req.cookies.get('auth-token')?.value
            if (token) {
                try {
                    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key')
                    const { payload } = await jwtVerify(token, secret)
                    userId = (payload.userId as string) || ''
                } catch {
                    // ignore token errors; treat as guest
                }
            }
        }

        const doc = await Fraud.create({
            title: reportTitle,
            description: detailedDescription,
            type: mapFraudType(fraudType),
            fraudDetails: {
                amount: actualLoss ? Number(actualLoss) : undefined,
                currency: currency || 'USD',
                date: incidentDate ? new Date(incidentDate) : undefined,
            },
            status: 'pending',
            submittedBy: userId && mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : undefined,
            guestSubmission: !userId
                ? {
                    name: reporterName || 'Guest',
                    email: reporterEmail || '',
                    phone: reporterPhone || undefined,
                }
                : undefined,
            evidence: {
                screenshots: [],
                documents: [],
                additionalInfo: [
                    websitesSocialMedia ? `Web/Profiles: ${websitesSocialMedia}` : '',
                    evidenceDescription ? `Evidence: ${evidenceDescription}` : '',
                    attemptedLoss ? `Attempted loss: ${attemptedLoss}` : '',
                ]
                    .filter(Boolean)
                    .join(' | '),
            },
            tags: fraudType ? [String(fraudType).toLowerCase()] : [],
            severity: 'medium',
            reportedAt: new Date(),
        })

        return NextResponse.json({ message: 'Report submitted', id: doc._id }, { status: 201 })
    } catch (error: any) {
        console.error('Create fraud report failed:', error)
        return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 })
    }
}


