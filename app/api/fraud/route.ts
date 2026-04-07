import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { jwtVerify } from 'jose'
import connectToDatabase from '@/lib/mongodb'
import Fraud from '@/models/Fraud'
import { isS3Configured, uploadEvidenceToS3 } from '@/lib/s3'

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

function getExtensionForMimeType(type: string) {
    if (type === 'image/png') return '.png'
    if (type === 'image/jpeg') return '.jpg'
    if (type === 'application/pdf') return '.pdf'
    return ''
}

function parseBase64File(file: any) {
    const rawData = typeof file?.data === 'string' ? file.data : ''
    const mime = typeof file?.type === 'string' ? file.type : ''
    const name = typeof file?.name === 'string' ? file.name : 'file'

    if (!rawData || !mime) return null

    const dataUriMatch = /^data:(.+?);base64,(.+)$/.exec(rawData)
    const base64Payload = dataUriMatch ? dataUriMatch[2] : rawData

    try {
        const buffer = Buffer.from(base64Payload, 'base64')
        if (!buffer.length) return null
        return { buffer, mime, name }
    } catch {
        return null
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase()

        if (!isS3Configured()) {
            return NextResponse.json({ error: 'File storage is not configured' }, { status: 500 })
        }

        const contentType = req.headers.get('content-type') || ''

        // Common variables populated from either JSON or multipart form-data
        let reportTitle: string | undefined
        let detailedDescription: string | undefined
        let fraudType: string | undefined
        let incidentDate: string | undefined

        let reporterType: string | undefined
        let reporterName: string | undefined
        let reporterEmail: string | undefined
        let reporterPhone: string | undefined
        let reporterGender: string | undefined
        let reporterLocation: string | undefined

        let fraudsterName: string | undefined
        let fraudsterType: string | undefined
        let fraudsterCompany: string | undefined
        let fraudsterEmail: string | undefined
        let fraudsterGender: string | undefined
        let fraudsterContact: string | undefined
        let fraudsterAddress: string | undefined
        let fraudsterDescription: string | undefined

        let actualLoss: any
        let attemptedLoss: any
        let currency: string | undefined
        let paymentMethods: string | undefined
        let transactionDetails: string | undefined

        let websitesSocialMedia: string | undefined
        let evidenceDescription: string | undefined
        let additionalComments: string | undefined
        let recaptchaToken: string | null | undefined

        // Evidence containers
        const screenshots: string[] = []
        const documents: string[] = []

        if (contentType.includes('multipart/form-data')) {
            // Parse multipart form-data and upload files to storage
            const form = await req.formData()

            // Helper to get string values (trimmed, empty strings become undefined)
            const s = (key: string) => {
                const v = form.get(key)
                if (typeof v === 'string') {
                    const trimmed = v.trim()
                    return trimmed === '' ? undefined : trimmed
                }
                return undefined
            }

            // Extract fields
            reportTitle = s('reportTitle')
            detailedDescription = s('detailedDescription')
            fraudType = s('fraudType')
            incidentDate = s('incidentDate')

            reporterType = s('reporterType')
            reporterName = s('reporterName')
            reporterEmail = s('reporterEmail')
            reporterPhone = s('reporterPhone')
            reporterGender = s('reporterGender')
            reporterLocation = s('reporterLocation')

            fraudsterName = s('fraudsterName')
            fraudsterType = s('fraudsterType')
            fraudsterCompany = s('fraudsterCompany')
            fraudsterEmail = s('fraudsterEmail')
            fraudsterGender = s('fraudsterGender')
            fraudsterContact = s('fraudsterContact')
            fraudsterAddress = s('fraudsterAddress')
            fraudsterDescription = s('fraudsterDescription')

            actualLoss = s('actualLoss')
            attemptedLoss = s('attemptedLoss')
            currency = s('currency')
            paymentMethods = s('paymentMethods')
            transactionDetails = s('transactionDetails')

            websitesSocialMedia = s('websitesSocialMedia')
            evidenceDescription = s('evidenceDescription')
            additionalComments = s('additionalComments')
            recaptchaToken = s('recaptchaToken')

            // Server-side file validation and saving
            const MAX_BYTES = 10 * 1024 * 1024 // 10MB
            const allowedMimeTypes = new Set([
                'application/pdf',
                'image/png',
                'image/jpeg',
            ])

            const files = form.getAll('evidenceFiles') as unknown as File[]
            for (const file of files) {
                if (!file) continue
                const type = (file as any).type as string | undefined
                const size = (file as any).size as number | undefined
                const name = (file as any).name as string | undefined

                if (!type || !allowedMimeTypes.has(type)) {
                    return NextResponse.json({ error: `Unsupported file type: ${type || 'unknown'}` }, { status: 400 })
                }
                if (size && size > MAX_BYTES) {
                    return NextResponse.json({ error: `File exceeds 10MB limit: ${name}` }, { status: 400 })
                }

                const arrayBuffer = await (file as any).arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                const extFromName = name && name.includes('.') ? name.substring(name.lastIndexOf('.')) : ''
                const derivedExt = type === 'image/png' ? '.png' : type === 'image/jpeg' ? '.jpg' : type === 'application/pdf' ? '.pdf' : ''
                const ext = extFromName || derivedExt
                const safeBaseOriginal = (name || 'file').replace(/[^a-zA-Z0-9._-]+/g, '_')
                const safeBaseHasExt = !!extFromName
                const safeBase = safeBaseHasExt ? safeBaseOriginal : `${safeBaseOriginal}${ext}`
                const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
                const filename = `${unique}_${safeBase}`

                const uploaded = await uploadEvidenceToS3({
                    body: buffer,
                    contentType: type || undefined,
                    filename,
                })
                const publicUrl = uploaded.storedRef
                if (type.startsWith('image/')) {
                    screenshots.push(publicUrl)
                } else {
                    documents.push(publicUrl)
                }
            }
        } else {
            // JSON body fallback (legacy path: expects base64 strings)
            const body = await req.json()

            reportTitle = body?.reportTitle
            detailedDescription = body?.detailedDescription
            fraudType = body?.fraudType
            incidentDate = body?.incidentDate

            reporterType = body?.reporterType
            reporterName = body?.reporterName
            reporterEmail = body?.reporterEmail
            reporterPhone = body?.reporterPhone
            reporterGender = body?.reporterGender
            reporterLocation = body?.reporterLocation

            fraudsterName = body?.fraudsterName
            fraudsterType = body?.fraudsterType
            fraudsterCompany = body?.fraudsterCompany
            fraudsterEmail = body?.fraudsterEmail
            fraudsterGender = body?.fraudsterGender
            fraudsterContact = body?.fraudsterContact
            fraudsterAddress = body?.fraudsterAddress
            fraudsterDescription = body?.fraudsterDescription

            actualLoss = body?.actualLoss
            attemptedLoss = body?.attemptedLoss
            currency = body?.currency
            paymentMethods = body?.paymentMethods
            transactionDetails = body?.transactionDetails

            websitesSocialMedia = body?.websitesSocialMedia
            evidenceDescription = body?.evidenceDescription
            additionalComments = body?.additionalComments
            recaptchaToken = body?.recaptchaToken

            const uploadedFiles = Array.isArray(body?.evidenceFiles) ? body.evidenceFiles : []
            const MAX_BYTES = 10 * 1024 * 1024
            const allowedMimeTypes = new Set([
                'application/pdf',
                'image/png',
                'image/jpeg',
            ])

            for (const file of uploadedFiles) {
                const parsed = parseBase64File(file)
                if (!parsed) {
                    return NextResponse.json({ error: 'Evidence files must be uploaded as file data' }, { status: 400 })
                }
                if (!allowedMimeTypes.has(parsed.mime)) {
                    return NextResponse.json({ error: `Unsupported file type: ${parsed.mime}` }, { status: 400 })
                }
                if (parsed.buffer.length > MAX_BYTES) {
                    return NextResponse.json({ error: `File exceeds 10MB limit: ${parsed.name}` }, { status: 400 })
                }

                const ext = getExtensionForMimeType(parsed.mime)
                const safeBaseOriginal = parsed.name.replace(/[^a-zA-Z0-9._-]+/g, '_')
                const safeBase = safeBaseOriginal.includes('.') ? safeBaseOriginal : `${safeBaseOriginal}${ext}`
                const uploaded = await uploadEvidenceToS3({
                    body: parsed.buffer,
                    contentType: parsed.mime,
                    filename: safeBase,
                })

                if (parsed.mime.startsWith('image/')) {
                    screenshots.push(uploaded.storedRef)
                } else {
                    documents.push(uploaded.storedRef)
                }
            }
        }

        if (!reportTitle || !detailedDescription) {
            return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
        }

        if (recaptchaToken?.trim()) {
            try {
                const secret = process.env.RECAPTCHA_SECRET_KEY
                if (secret) {
                    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ secret, response: recaptchaToken })
                    })
                    const verifyData: any = await verifyRes.json()
                    if (!verifyData.success) {
                        return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
                    }
                }
            } catch (e) {
                console.error('reCAPTCHA verification error', e)
                return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
            }
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

        // screenshots and documents have been prepared above depending on content type

        // Build additional info from various fields
        const additionalInfoParts = [
            websitesSocialMedia ? `Websites/Social Media: ${websitesSocialMedia}` : '',
            evidenceDescription ? `Evidence Description: ${evidenceDescription}` : '',
            attemptedLoss ? `Attempted Loss: ${attemptedLoss}` : '',
            paymentMethods ? `Payment Methods: ${paymentMethods}` : '',
            transactionDetails ? `Transaction Details: ${transactionDetails}` : '',
            additionalComments ? `Additional Comments: ${additionalComments}` : '',
        ].filter(Boolean)

        const doc = await Fraud.create({
            title: reportTitle,
            description: detailedDescription,
            type: mapFraudType(fraudType),
            fraudsterDetails: {
                suspiciousEmail: fraudsterEmail,
                suspiciousPhone: fraudsterContact,
                suspiciousWebsite: websitesSocialMedia,
                suspiciousName: fraudsterName,
                suspiciousCompany: fraudsterCompany,
                amount: actualLoss ? Number(actualLoss) : undefined,
                attemptedAmount: attemptedLoss !== '' && attemptedLoss !== undefined && attemptedLoss !== null ? Number(attemptedLoss) : undefined,
                attemptedLoss: attemptedLoss !== '' && attemptedLoss !== undefined && attemptedLoss !== null ? Number(attemptedLoss) : undefined,
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
                : (reporterPhone ? {
                    phone: reporterPhone,
                } : undefined),
            evidence: {
                screenshots: screenshots,
                documents: documents,
                additionalInfo: additionalInfoParts.join(' | '),
            },
            location: reporterLocation || undefined,
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
