"use client"

import Link from 'next/link'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Cancel Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600 mb-6">
            Your payment was cancelled. No charges were made to your account.
          </p>

          {/* Current Status */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Your Current Status</h3>
            <p className="text-sm text-gray-600">
              You're still on the free trial plan with 10 searches. You can try the payment again anytime.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link 
              href="/dashboard/payment" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg block transition-colors duration-200"
            >
              Try Again
            </Link>
            <Link 
              href="/dashboard" 
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg block transition-colors duration-200"
            >
              Return to Dashboard
            </Link>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500 mt-4">
            Need help? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  )
}
