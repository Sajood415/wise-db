"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import Link from 'next/link'

export default function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true)
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided')
      setLoading(false)
      return
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        if (response.status === 401) {
          // User not authenticated, redirect to login with return URL
          const returnUrl = `/dashboard/payment/success?session_id=${sessionId}`
          router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`)
          return
        }

        if (!response.ok) {
          throw new Error('Payment verification failed')
        }

        const data = await response.json()
        setPaymentDetails(data.payment)
        showToast('Payment successful! Your account has been upgraded.', 'success')
        
        // Redirect to dashboard after 5 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 5000)

      } catch (error) {
        console.error('Payment verification error:', error)
        setError('Failed to verify payment. Please contact support.')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [sessionId, router, showToast])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your account has been upgraded successfully.
          </p>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-medium">{paymentDetails.packageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">${paymentDetails.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Searches:</span>
                  <span className="font-medium">{paymentDetails.searchesIncluded}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Completed</span>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your search limit has been increased</li>
              <li>• You now have access to real fraud data</li>
              <li>• Your trial has been extended</li>
              <li>• You can start searching immediately</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link 
              href="/dashboard" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg block transition-colors duration-200"
            >
              Go to Dashboard
            </Link>
            <Link 
              href="/dashboard/search" 
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg block transition-colors duration-200"
            >
              Start Searching
            </Link>
          </div>

          {/* Auto-redirect notice */}
          <p className="text-xs text-gray-500 mt-4">
            You'll be redirected to your dashboard in a few seconds...
          </p>
        </div>
      </div>
    </div>
  )
}
