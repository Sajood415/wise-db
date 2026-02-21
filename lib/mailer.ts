import nodemailer from 'nodemailer'

export interface SendMailOptions {
    to: string
    subject: string
    html?: string
    text?: string
}

export function getTransport() {
    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 587)
    const user = (process.env.SMTP_USER || '').trim()
    // Gmail app passwords are 16 chars with no spaces; strip spaces in case .env was unquoted or pasted with spaces
    const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '').trim()
    const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465

    if (!host || !user || !pass) {
        throw new Error('SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS')
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
    })
    return transporter
}

export async function sendMail({ to, subject, html, text }: SendMailOptions) {
    const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com'
    const transporter = getTransport()
    await transporter.sendMail({ from, to, subject, html, text })
}


