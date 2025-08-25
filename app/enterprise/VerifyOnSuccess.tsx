"use client"

import { useEffect } from 'react'
import { useToast } from '@/contexts/ToastContext'

export default function VerifyOnSuccess({ sessionId }: { sessionId: string }) {
  const { showToast } = useToast()
  useEffect(() => {
    if (!sessionId) return
    ;(async () => {
      try {
        const res = await fetch(`/api/payment/enterprise/verify?session_id=${encodeURIComponent(sessionId)}`, { method: 'POST' })
        if (!res.ok) {
          // silent fail, but surface minimal info for debugging
          // const data = await res.json().catch(() => ({}))
        } else {
          showToast('Enterprise payment verified', 'success')
        }
      } catch {
        // ignore
      }
    })()
  }, [sessionId, showToast])
  return null
}


