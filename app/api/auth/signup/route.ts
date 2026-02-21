import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyRecaptchaToken } from '@/lib/recaptcha';

export async function POST(request: NextRequest) {
    try {
        const { firstName, lastName, email, password, company, recaptchaToken } = await request.json();

        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                { error: 'Please fill in all required fields' },
                { status: 400 }
            );
        }

        const captcha = await verifyRecaptchaToken(recaptchaToken)
        if (!captcha.ok) {
            return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const user = new User({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: 'individual',
            company: company ? { name: company.trim() } : undefined,
            subscription: {
                type: 'free_trial',
                status: 'active',
                trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                searchesUsed: 0,
                searchLimit: 10
            }
        });

        await user.save();

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        return NextResponse.json(
            {
                message: 'User created successfully',
                user: userResponse
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}