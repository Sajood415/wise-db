export type AlertType = 'error' | 'info'

const BRAND = {
  primary: '#0052FF',
  heading: '#0A0A0A',
  text: '#4A4A4A',
  bg: '#F7F8FA',
  card: '#FFFFFF',
  border: '#E0E0E0',
  error: '#FF4D4F',
  ctaText: '#FFFFFF',
  ctaHover: '#003FCC',
} as const

function escHtml(value: unknown): string {
  const s = String(value ?? '')
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escAttr(value: unknown): string {
  return escHtml(value)
}

function link(href: string, label?: string): string {
  const safeHref = escAttr(href)
  const safeLabel = escHtml(label ?? href)
  return `<a href="${safeHref}" style="color:${BRAND.primary};text-decoration:underline;">${safeLabel}</a>`
}

function buttonCta(ctaLabel: string, ctaUrl: string): string {
  const safeUrl = escAttr(ctaUrl)
  const safeLabel = escHtml(ctaLabel)

  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:16px 0 6px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:552px;margin:0 auto;">
          <tr>
            <td align="center" bgcolor="${BRAND.primary}" style="border-radius:6px;">
              <a href="${safeUrl}" class="fs-btn" style="display:block;padding:14px 24px;font-size:16px;font-weight:700;line-height:1.2;color:${BRAND.ctaText};text-decoration:none;border-radius:6px;">
                ${safeLabel}
              </a>
            </td>
          </tr>
        </table>
        <div style="padding-top:10px;font-size:13px;line-height:1.6;color:${BRAND.text};">
          If the button doesn’t work, use this link: ${link(ctaUrl)}
        </div>
      </td>
    </tr>
  </table>`
}

export function buildEmailLayout(args: {
  previewText: string
  title: string
  content: string
  ctaLabel?: string
  ctaUrl?: string
  alertType?: AlertType
}): string {
  const previewText = escHtml(args.previewText)
  const title = escHtml(args.title)
  const alertType = args.alertType

  const supportEmail = (process.env.SMTP_USER || 'contact.fraudscans@gmail.com').trim()
  const websiteUrl = 'https://fraudscans.com'

  const alertBorder = alertType === 'error' ? BRAND.error : BRAND.primary
  const alertLabel =
    alertType === 'error' ? 'Important' : alertType === 'info' ? 'Notice' : ''

  const alertBlock = alertType
    ? `
      <tr>
        <td style="padding:0 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 16px 0;border-left:4px solid ${alertBorder};background:${BRAND.bg};">
            <tr>
              <td style="padding:12px 12px 12px 14px;font-size:14px;line-height:1.6;color:${BRAND.text};">
                <strong style="color:${BRAND.heading};">${escHtml(alertLabel)}:</strong>
                Please review the details below.
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : ''

  const ctaBlock =
    args.ctaLabel && args.ctaUrl ? buttonCta(args.ctaLabel, args.ctaUrl) : ''

  // content is expected to be email-safe HTML constructed by templates
  const content = args.content

  return `<!doctype html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      @media (hover:hover) {
        a.fs-btn:hover { background: ${BRAND.ctaHover} !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.bg};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${BRAND.bg};">${previewText}</div>
    <center style="width:100%;background:${BRAND.bg};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0;padding:0;background:${BRAND.bg};">
        <tr>
          <td align="center" style="padding:24px 12px;">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:8px;overflow:hidden;">
              <!-- Header -->
              <tr>
                <td style="padding:20px 24px 16px 24px;">
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:800;letter-spacing:0.2px;color:${BRAND.heading};">
                    <span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${BRAND.primary};margin-right:10px;vertical-align:middle;"></span>
                    FraudScans
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:0 24px;">
                  <div style="height:1px;line-height:1px;background:${BRAND.border};"></div>
                </td>
              </tr>

              <!-- Title -->
              <tr>
                <td style="padding:20px 24px 0 24px;">
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:800;line-height:1.25;color:${BRAND.heading};margin:0 0 16px 0;">
                    ${title}
                  </div>
                </td>
              </tr>

              ${alertBlock}

              <!-- Content -->
              <tr>
                <td style="padding:0 24px 4px 24px;">
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${BRAND.text};">
                    ${content}
                  </div>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="padding:0 24px;">
                  ${ctaBlock}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:18px 24px 0 24px;">
                  <div style="height:1px;line-height:1px;background:${BRAND.border};"></div>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 24px 20px 24px;">
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:${BRAND.text};">
                    <div style="font-weight:700;color:${BRAND.heading};margin-bottom:6px;">FraudScans</div>
                    <div>Website: ${link(websiteUrl, 'fraudscans.com')}</div>
                    <div>Support: ${link(`mailto:${supportEmail}`, supportEmail)}</div>
                    <div style="margin-top:10px;color:${BRAND.text};">© ${new Date().getFullYear()} FraudScans. All rights reserved.</div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>`
}

export const EmailUi = {
  escHtml,
  escAttr,
  link,
} as const

