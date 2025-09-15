export type TemplatePayload = Record<string, string | number | undefined>

export type EmailTemplate = {
    subject: (p: TemplatePayload) => string
    text: (p: TemplatePayload) => string
    html: (p: TemplatePayload) => string
}

function esc(value: unknown): string {
    return String(value ?? '')
}

export const emailTemplates = {
    lowQuotaIndividual: {
        subject: () => 'Wise-DB: You have 10% searches remaining',
        text: (p) => `Hi ${esc(p.firstName)},\n\nYour search allowance is almost used up.\nUsed: ${esc(p.used)} of ${esc(p.limit)}. Remaining: ${esc(p.remaining)}.\n\nUpgrade or top up to avoid interruptions.\n\n— Wise-DB`,
        html: (p) => `<p>Hi ${esc(p.firstName)},</p><p>Your search allowance is almost used up.</p><p><strong>Used:</strong> ${esc(p.used)} of ${esc(p.limit)}. <strong>Remaining:</strong> ${esc(p.remaining)}.</p><p>Upgrade or top up to avoid interruptions.</p><p>— Wise-DB</p>`
    } as EmailTemplate,
    lowQuotaEnterpriseAdmin: {
        subject: () => 'Wise-DB: You have 10% searches remaining',
        text: (p) => `Hi ${esc(p.firstName)},\n\nYour enterprise search allowance is almost used up.\nUsed: ${esc(p.used)} of ${esc(p.limit)}. Remaining: ${esc(p.remaining)}.\n\nConsider topping up or contacting sales.\n\n— Wise-DB`,
        html: (p) => `<p>Hi ${esc(p.firstName)},</p><p>Your enterprise search allowance is almost used up.</p><p><strong>Used:</strong> ${esc(p.used)} of ${esc(p.limit)}. <strong>Remaining:</strong> ${esc(p.remaining)}.</p><p>Consider topping up or contacting sales.</p><p>— Wise-DB</p>`
    } as EmailTemplate,
    enterpriseStripePaymentAndSignup: {
        subject: () => 'Wise-DB Enterprise — Payment & Signup',
        text: (p) => `Pay: ${esc(p.stripeUrl)}\nSignup: ${esc(p.signupLink)}`,
        html: (p) => `<div style="font-family:Inter,Arial,sans-serif;line-height:1.7;color:#0f172a">\n  <p style="margin:0 0 12px 0">Hello${p.contactName ? ' ' + esc(p.contactName) : ''},</p>\n  <p style="margin:0 0 12px 0;color:#334155">Thank you for choosing <strong>Wise‑DB</strong>. Please complete the payment and then finish your enterprise admin signup.</p>\n  <div style="margin:16px 0;padding:14px;border:1px solid #e5e7eb;border-radius:12px;background:#f8fafc">\n    ${p.companyName ? `<div style=\"margin-bottom:6px\"><strong>Company:</strong> ${esc(p.companyName)}</div>` : ''}\n    <div style="margin-bottom:6px"><strong>Amount:</strong> ${esc(p.amount)} ${esc(p.currency)}</div>\n    <div style="margin-bottom:0"><strong>Includes:</strong> ${esc(p.searches)} searches • ${esc(p.users)} users</div>\n  </div>\n  <div style="margin:14px 0">\n    <a href="${esc(p.stripeUrl)}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:10px 14px;border-radius:8px;">Pay with Stripe</a>\n    <div style="margin-top:6px;color:#475569;font-size:13px"><strong>Link:</strong> <a href="${esc(p.stripeUrl)}" style="color:#1d4ed8;text-decoration:underline">${esc(p.shortStripeUrl)}</a></div>\n  </div>\n  <div style="margin:16px 0 12px 0">\n    <div style="margin:0 0 6px 0"><strong>Admin signup (after payment confirmation):</strong></div>\n    <a href="${esc(p.signupLink)}" style="display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;padding:10px 14px;border-radius:8px;">Open Signup</a>\n    <div style="margin-top:6px;color:#475569;font-size:13px"><strong>Link:</strong> <a href="${esc(p.signupLink)}" style="color:#1d4ed8;text-decoration:underline">${esc(p.shortSignupLink)}</a></div>\n  </div>\n  <p style="margin:12px 0 0 0;color:#334155">Regards,<br/>Wise‑DB Team</p>\n  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>\n  <p style="margin:0;color:#94a3b8;font-size:12px">If you’ve already paid, the signup link will work once payment is confirmed automatically.</p>\n</div>`
    } as EmailTemplate,
    enterpriseBankAndSignup: {
        subject: () => 'Wise-DB Enterprise — Bank Details & Signup',
        text: (p) => `Amount: ${esc(p.amount)} ${esc(p.currency)}\nIncludes: ${esc(p.searches)} searches / ${esc(p.users)} users\nSignup: ${esc(p.signupLink)}`,
        html: (p) => `<div style="font-family:Inter,Arial,sans-serif;line-height:1.7;color:#0f172a">\n  <p style="margin:0 0 12px 0">Hello${p.contactName ? ' ' + esc(p.contactName) : ''},</p>\n  <p style="margin:0 0 12px 0;color:#334155">Please complete your <strong>Wise‑DB</strong> enterprise purchase via bank transfer, then finish your admin signup.</p>\n  <div style="margin:16px 0;padding:14px;border:1px solid #e5e7eb;border-radius:12px;background:#f8fafc">\n    ${p.companyName ? `<div style=\"margin-bottom:6px\"><strong>Company:</strong> ${esc(p.companyName)}</div>` : ''}\n    <div style="margin-bottom:6px"><strong>Amount:</strong> ${esc(p.amount)} ${esc(p.currency)}</div>\n    <div style="margin-bottom:0"><strong>Includes:</strong> ${esc(p.searches)} searches • ${esc(p.users)} users</div>\n  </div>\n  <div style="margin:16px 0;padding:14px;border:1px dashed #e5e7eb;border-radius:12px;background:#fff">\n    <div style="margin-bottom:6px"><strong>Account Name:</strong> ${esc(p.bankAccountName)}</div>\n    <div style="margin-bottom:6px"><strong>Account / IBAN:</strong> ${esc(p.bankAccountNumber)}</div>\n    <div style="margin-bottom:6px"><strong>Bank:</strong> ${esc(p.bankName)}</div>\n    <div style="margin-bottom:6px"><strong>SWIFT/BIC:</strong> ${esc(p.bankSwift)}</div>\n    <div style="margin-bottom:0"><strong>Reference:</strong> ${esc(p.paymentReference)}</div>\n  </div>\n  <div style="margin:12px 0 0 0"><strong>Admin signup (after payment is confirmed):</strong></div>\n  <div style="margin:6px 0 0 0;color:#475569;font-size:13px"><strong>Link:</strong> <a href="${esc(p.signupLink)}" style="color:#1d4ed8;text-decoration:underline">${esc(p.shortSignupLink)}</a></div>\n  <p style="margin:16px 0 0 0;color:#334155">Regards,<br/>Wise‑DB Team</p>\n  <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>\n  <p style="margin:0;color:#94a3b8;font-size:12px">We’ll enable the signup link once we confirm your transfer.</p>\n</div>`
    } as EmailTemplate,
    enterpriseSignupLink: {
        subject: () => 'Your Wise-DB Enterprise Admin Signup Link',
        text: (p) => `Signup link: ${esc(p.signupLink)}`,
        html: (p) => `<p>Hello,</p><p>Your enterprise admin signup link is ready:</p><p><a href="${esc(p.signupLink)}">${esc(p.signupLink)}</a></p><p>This link expires on ${esc(p.expires)}.</p>`
    } as EmailTemplate,
    enterprisePaymentReceivedSignup: {
        subject: () => 'Payment received — complete your Wise-DB enterprise admin signup',
        text: (p) => `Complete signup: ${esc(p.signupLink)}`,
        html: (p) => `<p>Your payment has been recorded.</p>${p.signupLink ? `<p>Complete signup: <a href=\"${esc(p.signupLink)}\">${esc(p.signupLink)}</a></p>` : ''}`
    } as EmailTemplate,
    packageExpiryReminder: {
        subject: () => 'Wise-DB: Your plan expires in 7 days',
        text: (p) => `Hi ${esc(p.firstName)},\n\nYour Wise-DB plan will expire on ${esc(p.expiryDate)}.\nTo avoid interruptions, please renew or contact our team.\n\n— Wise-DB`,
        html: (p) => `<p>Hi ${esc(p.firstName)},</p><p>Your Wise-DB plan will expire on <strong>${esc(p.expiryDate)}</strong>.</p><p>To avoid interruptions, please renew or contact our team.</p><p>— Wise-DB</p>`
    } as EmailTemplate,
}

export type EmailTemplateKey = keyof typeof emailTemplates
