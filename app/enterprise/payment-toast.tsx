"use client"

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'

export default function PaymentToast() {
  const params = useSearchParams()
  const router = useRouter()
  const { showToast } = useToast()

  useEffect(() => {
    const status = params.get('payment')
    const sessionId = params.get('session_id')
    if (status === 'success') {
      if (sessionId) {
        fetch(`/api/payment/enterprise/verify?session_id=${encodeURIComponent(sessionId)}`, { method: 'POST' }).catch(() => {})
      }
      showToast('Payment successful', 'success')
      const next = new URL(window.location.href)
      next.searchParams.delete('payment')
      next.searchParams.delete('session_id')
      router.replace(next.pathname + next.search)
    } else if (status === 'cancel') {
      showToast('Payment canceled.', 'info')
      const next = new URL(window.location.href)
      next.searchParams.delete('payment')
      router.replace(next.pathname + next.search)
    }
  }, [params, router, showToast])

  return null
}


