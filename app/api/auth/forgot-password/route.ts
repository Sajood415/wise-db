import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendMail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const { email } = await request.json();

        // Validate required fields
        if (!email) {
            return NextResponse.json(
                { error: 'Please provide an email address' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Don't reveal if email exists or not for security
            return NextResponse.json(
                { message: 'If an account with that email exists, we have sent a password reset link.' },
                { status: 200 }
            );
        }

        // Check if user is active
        if (!user.isActive) {
            return NextResponse.json(
                { error: 'Account is deactivated. Please contact support.' },
                { status: 400 }
            );
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Save reset token to user
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetExpires;
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        // Send email
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset - WiseDB</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #006d5b, #43d49d); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; background: #006d5b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .button:hover { background: #1c2736; }
                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                        <p>WiseDB Security</p>
                    </div>
                    <div class="content">
                        <h2>Hello ${user.firstName},</h2>
                        <p>We received a request to reset your password for your WiseDB account.</p>
                        <p>Click the button below to reset your password:</p>
                        <a href="${resetUrl}" class="button">Reset Password</a>
                        <p>This link will expire in 15 minutes for security reasons.</p>
                        <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
                        <p>For security reasons, this link can only be used once.</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 WiseDB. All rights reserved.</p>
                        <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
                        <p style="word-break: break-all; color: #006d5b;">${resetUrl}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await sendMail({
            to: user.email,
            subject: 'Password Reset Request - WiseDB',
            html: emailHtml
        });

        return NextResponse.json(
            { message: 'If an account with that email exists, we have sent a password reset link.' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
