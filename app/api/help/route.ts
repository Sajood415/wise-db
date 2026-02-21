import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import HelpRequest from '@/models/HelpRequest'
import { verifyRecaptchaToken } from '@/lib/recaptcha'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, subject, issueType, message, recaptchaToken } = body

        // Validate required fields
        if (!name || !email || !subject || !issueType || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            )
        }

        const captcha = await verifyRecaptchaToken(recaptchaToken)
        if (!captcha.ok) {
            return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
        }

        await dbConnect()

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            )
        }

        // Validate message length
        if (message.length < 20) {
            return NextResponse.json(
                { error: 'Message must be at least 20 characters long' },
                { status: 400 }
            )
        }

        // Create new help request
        const helpRequest = await HelpRequest.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            issueType,
            message: message.trim()
        })

        return NextResponse.json({
            success: true,
            message: 'Help request submitted successfully',
            id: helpRequest._id
        }, { status: 201 })

    } catch (error) {
        console.error('Help request submission error:', error)
        return NextResponse.json(
            { error: 'Failed to submit help request. Please try again.' },
            { status: 500 }
        )
    }
}
