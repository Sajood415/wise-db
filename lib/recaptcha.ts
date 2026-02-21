export type RecaptchaVerifyResult =
  | { ok: true }
  | { ok: false; reason: 'missing_token' | 'missing_secret' | 'verify_failed' }

export async function verifyRecaptchaToken(
  recaptchaToken: string | null | undefined
): Promise<RecaptchaVerifyResult> {
  if (!recaptchaToken) return { ok: false, reason: 'missing_token' }

  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) return { ok: false, reason: 'missing_secret' }

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: recaptchaToken }),
    })

    if (!res.ok) return { ok: false, reason: 'verify_failed' }

    const data = (await res.json()) as { success?: boolean }
    if (!data?.success) return { ok: false, reason: 'verify_failed' }

    return { ok: true }
  } catch {
    return { ok: false, reason: 'verify_failed' }
  }
}

