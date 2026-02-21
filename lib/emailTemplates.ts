export type TemplatePayload = Record<string, string | number | undefined>

export type EmailTemplate = {
    subject: (p: TemplatePayload) => string
    text: (p: TemplatePayload) => string
    html: (p: TemplatePayload) => string
}

import { buildEmailLayout, EmailUi } from './emailLayout'

const e = EmailUi.escHtml

function para(html: string): string {
    return `<p style="margin:0 0 12px 0;">${html}</p>`
}

function subtle(html: string): string {
    return `<p style="margin:0 0 12px 0;color:#4A4A4A;">${html}</p>`
}

function kvTable(rows: Array<{ k: string, v: string }>): string {
    const body = rows
        .map(({ k, v }) => {
            return `<tr>
  <td style="padding:10px 12px;border-bottom:1px solid #E0E0E0;color:#4A4A4A;font-size:14px;line-height:1.5;"><strong style="color:#0A0A0A;">${e(k)}</strong></td>
  <td align="right" style="padding:10px 12px;border-bottom:1px solid #E0E0E0;color:#4A4A4A;font-size:14px;line-height:1.5;">${v}</td>
</tr>`
        })
        .join('')
        .replace(/<\/tr>$/, '</tr>') // keep structure stable

    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px 0;border:1px solid #E0E0E0;border-radius:8px;overflow:hidden;">
${body}
</table>`
}

function baseUrl(): string {
    const raw = String(process.env.NEXT_PUBLIC_BASE_URL || '').trim()
    return raw ? raw.replace(/\/+$/, '') : ''
}

export const emailTemplates = {
    lowQuotaIndividual: {
        subject: () => 'Fraud Scan: You have 10% searches remaining',
        text: (p) => {
            const dash = baseUrl() ? `${baseUrl()}/dashboard` : ''
            return [
                `Hi ${e(p.firstName)},`,
                ``,
                `You’re close to your search limit.`,
                ``,
                `Used: ${e(p.used)} of ${e(p.limit)}`,
                `Remaining: ${e(p.remaining)}`,
                ``,
                dash ? `Open dashboard: ${dash}` : `Log in to your dashboard to upgrade or top up.`,
                ``,
                `— FraudScans`,
            ].join('\n')
        },
        html: (p) => {
            const dash = baseUrl() ? `${baseUrl()}/dashboard` : ''
            const content = [
                para(`Hi ${e(p.firstName)},`),
                subtle(`You’re close to your search limit. To avoid interruptions, please upgrade or top up.`),
                kvTable([
                    { k: 'Used', v: `${e(p.used)} / ${e(p.limit)}` },
                    { k: 'Remaining', v: `${e(p.remaining)}` },
                ]),
                para(dash ? `Open your dashboard to manage your plan.` : `Open your dashboard to manage your plan.`),
            ].join('')

            return buildEmailLayout({
                previewText: `You have 10% searches remaining.`,
                title: `You’re nearing your search limit`,
                content,
                ctaLabel: dash ? 'Open dashboard' : undefined,
                ctaUrl: dash || undefined,
                alertType: 'info',
            })
        }
    } as EmailTemplate,
    lowQuotaEnterpriseAdmin: {
        subject: () => 'Fraud Scan: You have 10% searches remaining',
        text: (p) => {
            const dash = baseUrl() ? `${baseUrl()}/dashboard` : ''
            return [
                `Hi ${e(p.firstName)},`,
                ``,
                `Your enterprise search allowance is almost used up.`,
                ``,
                `Used: ${e(p.used)} of ${e(p.limit)}`,
                `Remaining: ${e(p.remaining)}`,
                ``,
                dash ? `Open dashboard: ${dash}` : `Top up or contact sales to avoid interruptions.`,
                ``,
                `— FraudScans`,
            ].join('\n')
        },
        html: (p) => {
            const dash = baseUrl() ? `${baseUrl()}/dashboard` : ''
            const content = [
                para(`Hi ${e(p.firstName)},`),
                subtle(`Your enterprise search allowance is almost used up. Consider topping up to avoid interruptions.`),
                kvTable([
                    { k: 'Used', v: `${e(p.used)} / ${e(p.limit)}` },
                    { k: 'Remaining', v: `${e(p.remaining)}` },
                ]),
                para(`If you need assistance, reply to this email and we’ll help.`),
            ].join('')

            return buildEmailLayout({
                previewText: `Your enterprise allowance is running low.`,
                title: `Enterprise allowance running low`,
                content,
                ctaLabel: dash ? 'Open dashboard' : undefined,
                ctaUrl: dash || undefined,
                alertType: 'info',
            })
        }
    } as EmailTemplate,
    enterpriseStripePaymentAndSignup: {
        subject: () => 'Fraud Scan Enterprise — Payment & Signup',
        text: (p) => [
            `Hello${p.contactName ? ' ' + e(p.contactName) : ''},`,
            ``,
            `Please complete payment and then finish your enterprise admin signup.`,
            ``,
            `Company: ${e(p.companyName)}`,
            `Amount: ${e(p.amount)} ${e(p.currency)}`,
            `Includes: ${e(p.searches)} searches • ${e(p.users)} users`,
            ``,
            `Pay with Stripe: ${e(p.stripeUrl)}`,
            `Admin signup: ${e(p.signupLink)}`,
            ``,
            `— FraudScans`,
        ].join('\n'),
        html: (p) => {
            const stripeUrl = String(p.stripeUrl || '')
            const signupLink = String(p.signupLink || '')

            const content = [
                para(`Hello${p.contactName ? ' ' + e(p.contactName) : ''},`),
                subtle(`Thank you for choosing <strong>FraudScans Enterprise</strong>. Please complete payment, then finish your admin signup.`),
                kvTable([
                    { k: 'Company', v: e(p.companyName) },
                    { k: 'Amount', v: `${e(p.amount)} ${e(p.currency)}` },
                    { k: 'Includes', v: `${e(p.searches)} searches • ${e(p.users)} users` },
                ]),
                para(`Payment link: ${EmailUi.link(stripeUrl, e(p.shortStripeUrl || 'Open Stripe'))}`),
                para(`Admin signup (after payment confirmation): ${EmailUi.link(signupLink, e(p.shortSignupLink || 'Open signup'))}`),
                subtle(`If you’ve already paid, the signup link will work once payment is confirmed automatically.`),
            ].join('')

            return buildEmailLayout({
                previewText: 'Complete payment and finish enterprise signup.',
                title: 'Payment & admin signup',
                content,
                ctaLabel: 'Pay with Stripe',
                ctaUrl: stripeUrl,
                alertType: 'info',
            })
        }
    } as EmailTemplate,
    enterpriseBankAndSignup: {
        subject: () => 'Fraud Scan Enterprise — Bank Details & Signup',
        text: (p) => [
            `Hello${p.contactName ? ' ' + e(p.contactName) : ''},`,
            ``,
            `Please complete your enterprise purchase via bank transfer.`,
            ``,
            `Company: ${e(p.companyName)}`,
            `Amount: ${e(p.amount)} ${e(p.currency)}`,
            `Includes: ${e(p.searches)} searches • ${e(p.users)} users`,
            ``,
            `Bank details`,
            `- Account Name: ${e(p.bankAccountName)}`,
            `- Account / IBAN: ${e(p.bankAccountNumber)}`,
            `- Bank: ${e(p.bankName)}`,
            `- SWIFT/BIC: ${e(p.bankSwift)}`,
            `- Reference: ${e(p.paymentReference)}`,
            ``,
            `Admin signup (after payment is confirmed): ${e(p.signupLink)}`,
            ``,
            `— FraudScans`,
        ].join('\n'),
        html: (p) => {
            const signupLink = String(p.signupLink || '')
            const content = [
                para(`Hello${p.contactName ? ' ' + e(p.contactName) : ''},`),
                subtle(`Please complete your <strong>FraudScans Enterprise</strong> purchase via bank transfer. After payment is confirmed, finish your admin signup.`),
                kvTable([
                    { k: 'Company', v: e(p.companyName) },
                    { k: 'Amount', v: `${e(p.amount)} ${e(p.currency)}` },
                    { k: 'Includes', v: `${e(p.searches)} searches • ${e(p.users)} users` },
                ]),
                para(`<strong style="color:#0A0A0A;">Bank details</strong>`),
                kvTable([
                    { k: 'Account Name', v: e(p.bankAccountName) },
                    { k: 'Account / IBAN', v: e(p.bankAccountNumber) },
                    { k: 'Bank', v: e(p.bankName) },
                    { k: 'SWIFT/BIC', v: e(p.bankSwift) },
                    { k: 'Reference', v: e(p.paymentReference) },
                ]),
                para(`Admin signup (after payment is confirmed): ${EmailUi.link(signupLink, e(p.shortSignupLink || 'Open signup'))}`),
                subtle(`We’ll enable the signup flow once we confirm your transfer.`),
            ].join('')

            return buildEmailLayout({
                previewText: 'Bank transfer details for your enterprise purchase.',
                title: 'Bank details & admin signup',
                content,
                ctaLabel: signupLink ? 'Open signup' : undefined,
                ctaUrl: signupLink || undefined,
                alertType: 'info',
            })
        }
    } as EmailTemplate,
    enterpriseSignupLink: {
        subject: () => 'Your Fraud Scan Enterprise Admin Signup Link',
        text: (p) => [
            `Hello,`,
            ``,
            `Your enterprise admin signup link is ready.`,
            `Signup: ${e(p.signupLink)}`,
            `Expires: ${e(p.expires)}`,
            ``,
            `— FraudScans`,
        ].join('\n'),
        html: (p) => {
            const signupLink = String(p.signupLink || '')
            const content = [
                para(`Hello,`),
                subtle(`Your enterprise admin signup link is ready.`),
                para(`This link expires on <strong style="color:#0A0A0A;">${e(p.expires)}</strong>.`),
            ].join('')

            return buildEmailLayout({
                previewText: 'Your admin signup link is ready.',
                title: 'Enterprise admin signup link',
                content,
                ctaLabel: 'Open signup',
                ctaUrl: signupLink,
                alertType: 'info',
            })
        }
    } as EmailTemplate,
    enterprisePaymentReceivedSignup: {
        subject: () => 'Payment received — complete your Fraud Scan enterprise admin signup',
        text: (p) => {
            const link = String(p.signupLink || '')
            return [
                `Your payment has been recorded.`,
                ``,
                link ? `Complete signup: ${e(link)}` : `If you need help, reply to this email.`,
                ``,
                `— FraudScans`,
            ].join('\n')
        },
        html: (p) => {
            const signupLink = String(p.signupLink || '').trim()
            const content = [
                subtle(`Your payment has been recorded.`),
                signupLink ? para(`Complete your admin signup when you’re ready.`) : para(`If you need help, reply to this email.`),
            ].join('')

            return buildEmailLayout({
                previewText: 'Payment received. Complete your enterprise signup.',
                title: 'Payment received',
                content,
                ctaLabel: signupLink ? 'Complete signup' : undefined,
                ctaUrl: signupLink || undefined,
                alertType: 'info',
            })
        }
    } as EmailTemplate,
    enterpriseLeadNotification: {
        subject: (p) => `New enterprise lead: ${e(p.companyName)}`,
        text: (p) => [
            `New enterprise request received.`,
            ``,
            `Company: ${e(p.companyName)}`,
            `Contact: ${e(p.contactName)}`,
            `Email: ${e(p.businessEmail)}`,
            `Phone: ${e(p.phoneNumber)}`,
            `Industry: ${e(p.industry)}`,
            `Searches: ${e(p.numberOfSearches)}`,
            `Users: ${e(p.numberOfUsers)}`,
            `When needed: ${e(p.whenNeeded)}`,
            p.message ? `` : '',
            p.message ? `Message: ${e(p.message)}` : '',
            ``,
            `— FraudScans`,
        ].filter(Boolean).join('\n'),
        html: (p) => {
            const email = String(p.businessEmail || '').trim()
            const mailto = email ? `mailto:${email}` : ''
            const content = [
                subtle(`A new enterprise request was submitted.`),
                kvTable([
                    { k: 'Company', v: e(p.companyName) },
                    { k: 'Contact', v: e(p.contactName) },
                    { k: 'Email', v: email ? EmailUi.link(mailto, e(email)) : e(email) },
                    { k: 'Phone', v: e(p.phoneNumber) },
                    { k: 'Industry', v: e(p.industry) },
                    { k: 'Searches', v: e(p.numberOfSearches) },
                    { k: 'Users', v: e(p.numberOfUsers) },
                    { k: 'When needed', v: e(p.whenNeeded) },
                ]),
                p.message ? para(`<strong style="color:#0A0A0A;">Message</strong><br/>${e(p.message)}`) : '',
            ].join('')

            return buildEmailLayout({
                previewText: `New enterprise lead received.`,
                title: 'New enterprise lead',
                content,
                ctaLabel: email ? 'Email contact' : undefined,
                ctaUrl: mailto || undefined,
                alertType: 'info',
            })
        }
    } as EmailTemplate,
    packageExpiryReminder: {
        subject: () => 'Fraud Scan: Your plan expires in 7 days',
        text: (p) => {
            const dash = baseUrl() ? `${baseUrl()}/dashboard` : ''
            return [
                `Hi ${e(p.firstName)},`,
                ``,
                `Your plan expires on ${e(p.expiryDate)}.`,
                `To avoid interruptions, please renew or contact our team.`,
                ``,
                dash ? `Open dashboard: ${dash}` : '',
                ``,
                `— FraudScans`,
            ].filter(Boolean).join('\n')
        },
        html: (p) => {
            const dash = baseUrl() ? `${baseUrl()}/dashboard` : ''
            const content = [
                para(`Hi ${e(p.firstName)},`),
                subtle(`Your plan expires on <strong style="color:#0A0A0A;">${e(p.expiryDate)}</strong>. To avoid interruptions, please renew or contact our team.`),
            ].join('')
            return buildEmailLayout({
                previewText: `Your plan expires in 7 days.`,
                title: 'Plan expiry reminder',
                content,
                ctaLabel: dash ? 'Open dashboard' : undefined,
                ctaUrl: dash || undefined,
                alertType: 'info',
            })
        }
    } as EmailTemplate,
}

export type EmailTemplateKey = keyof typeof emailTemplates
