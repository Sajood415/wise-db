"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

const packages = [
  {
    id: "basic-monthly",
    name: "Basic Monthly",
    price: 19.99,
    searches: 100,
    features: [
      "100 searches per month",
      "Access to real fraud data",
      "Priority support",
      "Export capabilities",
    ],
    popular: false,
  },
  {
    id: "basic-yearly",
    name: "Basic Yearly",
    price: 99.99,
    searches: 1200,
    features: [
      "1200 searches per year",
      "Access to real fraud data",
      "Priority support",
      "Export capabilities",
    ],
    popular: true,
  },
  {
    id: "premium-monthly",
    name: "Premium Monthly",
    price: 29.99,
    searches: 500,
    features: [
      "500 searches per month",
      "Access to real fraud data",
      "Priority support",
      "Export capabilities",
      "Advanced analytics"
    ],
    popular: false,
  },
  {
    id: "premium-yearly",
    name: "Premium Yearly",
    price: 299.99,
    searches: 6000,
    features: [
      "6000 searches per year",
      "Access to real fraud data",
      "Priority support",
      "Export capabilities",
      "Advanced analytics"
    ],
    popular: false,
  },
  {
    id: "pay-as-you-go",
    name: "Pay As You Go",
    price: 2,
    searches: 1,
    features: [
      "$2 per search",
      "Buy credits and use anytime",
    ],
    popular: false,
    payg: true,
  },
];

const PRICE_PER_SEARCH = 2.0; 

type SubscriptionStatus = {
  type: 'free_trial' | 'paid_package' | 'enterprise_package' | 'pay_as_you_go' | null;
  status: 'active' | 'expired' | 'cancelled' | null;
  searchesUsed: number;
  searchLimit: number;
  remainingSearches: number;
  packageName: string | null;
  isTrialExpired: boolean;
  isPackageExpired: boolean;
  packageEndsAt: string | null;
};

export default function PaymentPage() {
  const [selectedPackage, setSelectedPackage] =
    useState<string>("basic-yearly");
  const [payAsYouGoSearches, setPayAsYouGoSearches] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [showPayAsYouGoModal, setShowPayAsYouGoModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  const payAsYouGoTotal = payAsYouGoSearches * PRICE_PER_SEARCH;

  useEffect(() => {
    async function fetchSubscriptionStatus() {
      try {
        const res = await fetch('/api/search/status', {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          setSubscriptionStatus(data);
        }
      } catch (error) {
        console.error('Failed to fetch subscription status', error);
      } finally {
        setLoadingStatus(false);
      }
    }
    fetchSubscriptionStatus();
  }, []);

  function getCurrentPlanName(): string {
    if (!subscriptionStatus) return 'Loading...';
    
    if (subscriptionStatus.type === 'free_trial') {
      return 'Free Trial';
    } else if (subscriptionStatus.type === 'paid_package') {
      return subscriptionStatus.packageName || 'Paid Package';
    } else if (subscriptionStatus.type === 'enterprise_package') {
      return subscriptionStatus.packageName || 'Enterprise Package';
    } else if (subscriptionStatus.type === 'pay_as_you_go') {
      return 'Pay As You Go';
    }
    return 'No Plan';
  }

  function getSearchLimitDisplay(): string {
    if (!subscriptionStatus) return 'Loading...';
    
    if (subscriptionStatus.searchLimit === -1) {
      return 'Unlimited searches';
    } else if (subscriptionStatus.type === 'pay_as_you_go') {
      return `${subscriptionStatus.remainingSearches} credit${subscriptionStatus.remainingSearches !== 1 ? 's' : ''} remaining`;
    } else {
      return `${subscriptionStatus.searchLimit} searches ${subscriptionStatus.type === 'free_trial' ? 'total' : 'per period'}`;
    }
  }

  function canUpgrade(): boolean {
    if (!subscriptionStatus) return true;
    return subscriptionStatus.type === 'free_trial' || 
           subscriptionStatus.status === 'expired' ||
           (subscriptionStatus.searchLimit !== -1 && subscriptionStatus.type !== 'pay_as_you_go');
  }

  const handlePayment = async () => {
    if (selectedPackage === "pay-as-you-go") {
      setShowPayAsYouGoModal(true);
      return;
    } else {
      if (!selectedPackage) {
        showToast("Please select a package", "error");
        return;
      }
    }

    setLoading(true);
    try {
      const packageData = packages.find((p) => p.id === selectedPackage);
      if (!packageData) {
        showToast("Invalid package selected", "error");
        return;
      }

      const response = await fetch("/api/payment/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: selectedPackage,
          packageName: packageData.name,
          packageType: packageData.name.includes("Yearly")
            ? "yearly"
            : "monthly",
          amount: packageData.price,
          searchesIncluded: packageData.searches,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Failed to create checkout session";
        throw new Error(errorMessage);
      }

      if (!data.sessionUrl) {
        throw new Error("No session URL received from server");
      }

      window.location.href = data.sessionUrl;
    } catch (error: any) {
      console.error("Payment error:", error);
      const errorMessage =
        error?.message || "Failed to initiate payment. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

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

        {loadingStatus ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="animate-pulse">
              <div className="h-6 bg-blue-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-blue-200 rounded w-32"></div>
            </div>
          </div>
        ) : subscriptionStatus && (
          <div className={`border rounded-lg p-6 mb-8 ${
            subscriptionStatus.status === 'expired' 
              ? 'bg-rose-50 border-rose-200' 
              : subscriptionStatus.type === 'free_trial'
              ? 'bg-blue-50 border-blue-200'
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className={`text-lg font-semibold ${
                  subscriptionStatus.status === 'expired'
                    ? 'text-rose-900'
                    : subscriptionStatus.type === 'free_trial'
                    ? 'text-blue-900'
                    : 'text-green-900'
                }`}>
                  Current Plan: {getCurrentPlanName()}
                  {subscriptionStatus.status === 'expired' && ' (Expired)'}
                </h3>
                <p className={`mt-1 ${
                  subscriptionStatus.status === 'expired'
                    ? 'text-rose-700'
                    : subscriptionStatus.type === 'free_trial'
                    ? 'text-blue-700'
                    : 'text-green-700'
                }`}>
                  {subscriptionStatus.type === 'pay_as_you_go' 
                    ? getSearchLimitDisplay()
                    : subscriptionStatus.searchLimit === -1
                    ? 'Unlimited searches'
                    : `${subscriptionStatus.searchesUsed} / ${subscriptionStatus.searchLimit} searches used`
                  }
                </p>
              </div>
              {canUpgrade() && (
                <div className="text-right">
                  <p className={`text-sm ${
                    subscriptionStatus.status === 'expired'
                      ? 'text-rose-600'
                      : 'text-blue-600'
                  }`}>
                    {subscriptionStatus.status === 'expired' 
                      ? 'Renew to continue:'
                      : 'Upgrade to unlock:'
                    }
                  </p>
                  <ul className={`text-sm mt-1 ${
                    subscriptionStatus.status === 'expired'
                      ? 'text-rose-700'
                      : 'text-blue-700'
                  }`}>
                    {subscriptionStatus.searchLimit !== -1 && (
                      <li>• More searches</li>
                    )}
                    {subscriptionStatus.type === 'free_trial' && (
                      <li>• Access to real fraud data</li>
                    )}
                    <li>• Advanced features</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pay As You Go Modal */}
        {showPayAsYouGoModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Pay As You Go
                </h3>
                <button
                  onClick={() => {
                    setShowPayAsYouGoModal(false);
                    setSelectedPackage("basic-yearly");
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Searches (Credits)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={payAsYouGoSearches}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setPayAsYouGoSearches(Math.max(1, Math.min(10000, val)));
                    }}
                    className="w-32 px-3 py-2 border text-primary border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">
                        ${PRICE_PER_SEARCH.toFixed(2)}
                      </span>{" "}
                      per search
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${payAsYouGoTotal.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  You will receive {payAsYouGoSearches} search credit
                  {payAsYouGoSearches !== 1 ? "s" : ""} after payment
                </div>
              </div>

              <ul className="mb-6 space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  $2 per search - pay only for what you use
                </li>
              </ul>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPayAsYouGoModal(false);
                    setSelectedPackage("basic-yearly");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (payAsYouGoSearches < 1) {
                      showToast("Please select at least 1 search", "error");
                      return;
                    }
                    setShowPayAsYouGoModal(false);
                    setLoading(true);
                    try {
                      const response = await fetch(
                        "/api/payment/create-checkout-session",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            packageId: "pay-as-you-go",
                            packageName: "Pay As You Go",
                            packageType: "pay_as_you_go",
                            amount: payAsYouGoTotal,
                            searchesIncluded: payAsYouGoSearches,
                            creditsPurchased: payAsYouGoSearches,
                          }),
                        }
                      );

                      const data = await response.json();

                      if (!response.ok) {
                        const errorMessage =
                          data.error || "Failed to create checkout session";
                        throw new Error(errorMessage);
                      }

                      if (!data.sessionUrl) {
                        throw new Error("No session URL received from server");
                      }

                      window.location.href = data.sessionUrl;
                    } catch (error: any) {
                      console.error("Payment error:", error);
                      const errorMessage =
                        error?.message ||
                        "Failed to initiate payment. Please try again.";
                      showToast(errorMessage, "error");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Package Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {packages.map((pkg) => {
            const isPayg = pkg.id === "pay-as-you-go" || (pkg as any).payg;
            const periodLabel = pkg.name.includes("Yearly")
              ? "year"
              : pkg.name.includes("Monthly")
              ? "month"
              : "credit";
            return (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-lg shadow-lg border-2 transition-all duration-200 cursor-pointer ${
                selectedPackage === pkg.id
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {pkg.name}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${pkg.price}
                  </span>
                  <span className="text-gray-600">/{periodLabel}</span>
                </div>

                <div className="mb-4">
                  {isPayg ? (
                    <span className="text-lg font-semibold text-blue-600">
                      Flexible credits
                    </span>
                  ) : (
                    <>
                      <span className="text-lg font-semibold text-blue-600">
                        {pkg.searches}
                      </span>
                      <span className="text-gray-600"> searches</span>
                    </>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <svg
                        className="w-4 h-4 text-green-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedPackage === pkg.id
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedPackage === pkg.id && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
              </div>
            </div>
            );
          })}
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
              "Proceed to Payment"
            )}
          </button>

          <p className="mt-3 text-sm text-gray-500">
            Secure payment powered by Stripe
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">
                Can I cancel anytime?
              </h4>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. No long-term
                contracts.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                What happens to my searches if I don't use them?
              </h4>
              <p className="text-gray-600">
                Searches reset monthly/yearly based on your plan. Unused
                searches don't carry over.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                Is there a free trial?
              </h4>
              <p className="text-gray-600">
                {subscriptionStatus?.type === 'free_trial' 
                  ? `You're currently on a free trial with ${subscriptionStatus.searchLimit} searches. Upgrade to unlock unlimited access.`
                  : subscriptionStatus?.type === 'paid_package' || subscriptionStatus?.type === 'enterprise_package'
                  ? 'Free trials are available for new users. You can upgrade or change your plan at any time.'
                  : 'Free trials are available for new users with limited searches. Upgrade to unlock unlimited access and advanced features.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
