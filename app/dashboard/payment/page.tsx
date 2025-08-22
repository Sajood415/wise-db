"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'

const packages = [
  {
    id: 'basic-monthly',
    name: 'Basic Monthly',
    price: 19.99,
    searches: 100,
    features: [
      '100 searches per month',
      'Access to real fraud data',
      'Priority support',
      'Export capabilities'
    ],
    popular: false
  },
  {
    id: 'basic-yearly',
    name: 'Basic Yearly',
    price: 199.99,
    searches: 1200,
    features: [
      '1200 searches per year',
      'Access to real fraud data',
      'Priority support',
      'Export capabilities',
      '2 months free'
    ],
    popular: true
  },
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    price: 39.99,
    searches: 500,
    features: [
      '500 searches per month',
      'Access to real fraud data',
      'Priority support',
      'Export capabilities',
      'Advanced analytics',
      'API access'
    ],
    popular: false
  },
  {
    id: 'premium-yearly',
    name: 'Premium Yearly',
    price: 399.99,
    searches: 6000,
    features: [
      '6000 searches per year',
      'Access to real fraud data',
      'Priority support',
      'Export capabilities',
      'Advanced analytics',
      'API access',
      '2 months free'
    ],
    popular: false
  }
]

export default function PaymentPage() {
  const [selectedPackage, setSelectedPackage] = useState<string>('basic-yearly')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  const handlePayment = async () => {
    if (!selectedPackage) {
      showToast('Please select a package', 'error')
      return
    }

    setLoading(true)
    try {
      const packageData = packages.find(p => p.id === selectedPackage)
      if (!packageData) {
        showToast('Invalid package selected', 'error')
        return
      }

      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: selectedPackage,
          packageName: packageData.name,
          packageType: packageData.name.includes('Yearly') ? 'yearly' : 'monthly',
          amount: packageData.price,
          searchesIncluded: packageData.searches
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionUrl } = await response.json()
      window.location.href = sessionUrl

    } catch (error) {
      console.error('Payment error:', error)
      showToast('Failed to initiate payment. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="mt-2 text-lg text-gray-600">
            Upgrade your account to access more searches and real fraud data
          </p>
        </div>

        {/* Current Plan Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Current Plan: Free Trial</h3>
              <p className="text-blue-700">Limited to 10 searches</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">Upgrade to unlock:</p>
              <ul className="text-sm text-blue-700 mt-1">
                <li>• Unlimited searches</li>
                <li>• Real fraud data</li>
                <li>• Advanced features</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-lg shadow-lg border-2 transition-all duration-200 cursor-pointer ${
                selectedPackage === pkg.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
                  <span className="text-gray-600">
                    /{pkg.name.includes('Yearly') ? 'year' : 'month'}
                  </span>
                </div>
                
                <div className="mb-4">
                  <span className="text-lg font-semibold text-blue-600">{pkg.searches}</span>
                  <span className="text-gray-600"> searches</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedPackage === pkg.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedPackage === pkg.id && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Button */}
        <div className="text-center">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              'Proceed to Payment'
            )}
          </button>
          
          <p className="mt-3 text-sm text-gray-500">
            Secure payment powered by Stripe
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Can I cancel anytime?</h4>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. No long-term contracts.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">What happens to my searches if I don't use them?</h4>
              <p className="text-gray-600">Searches reset monthly/yearly based on your plan. Unused searches don't carry over.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Is there a free trial?</h4>
              <p className="text-gray-600">You're currently on a free trial with 10 searches. Upgrade to unlock unlimited access.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
