"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UniversalHero from "@/components/ui/UniversalHero";
import UniversalCTA from "@/components/ui/UniversalCTA";

interface Plan {
  id: string;
  name: string;
  price: number;
  searches: number;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonLink: string;
  payg?: boolean;
  periodLabel: string;
}

const PricingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPayAsYouGoModal, setShowPayAsYouGoModal] = useState(false);
  const [payAsYouGoSearches, setPayAsYouGoSearches] = useState(1);
  const router = useRouter();

  const plans: Plan[] = [
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
      buttonText: "Get Started",
      buttonLink: "/signup",
      periodLabel: "month",
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
        "Save 17% vs monthly",
      ],
      popular: true,
      buttonText: "Get Started",
      buttonLink: "/signup",
      periodLabel: "year",
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
        "Advanced analytics",
      ],
      buttonText: "Get Started",
      buttonLink: "/signup",
      periodLabel: "month",
    },
    {
      id: "pay-as-you-go",
      name: "Pay As You Go",
      price: 2,
      searches: 1,
      features: [
        "$2 per search",
        "Buy credits and use anytime",
        "No monthly commitment",
        "Credits never expire",
      ],
      buttonText: "Buy Credits",
      buttonLink: "/signup",
      payg: true,
      periodLabel: "credit",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 0,
      searches: -1,
      features: [
        "Unlimited searches",
        "Custom verification tools",
        "Dedicated account manager",
        "Full database access",
        "Real-time reports & alerts",
        "Unlimited API access",
        "Custom integrations",
        "Unlimited team members",
        "Advanced analytics & insights",
        "On-premise deployment option",
        "Custom training & onboarding",
        "SLA guarantee",
      ],
      buttonText: "Contact Sales",
      buttonLink: "/enterprise",
      periodLabel: "custom",
    },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setIsLoggedIn(true);
          setUserRole(userData.user?.role || null);
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    checkAuth();
  }, []);

  const handlePayment = async () => {
    if (!selectedPlan) {
      alert("Please select a plan first");
      return;
    }

    if (selectedPlan === "pay-as-you-go") {
      setShowPayAsYouGoModal(true);
      return;
    }

    if (!isLoggedIn) {
      // Redirect to login if not authenticated for paid plans
      router.push(
        `/login?redirect=${encodeURIComponent(`/pricing?plan=${selectedPlan}`)}`
      );
      return;
    }

    setLoading(true);
    try {
      const packageData = plans.find((p) => p.id === selectedPlan);
      if (!packageData) {
        alert("Invalid package selected");
        return;
      }

      const response = await fetch("/api/payment/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: selectedPlan,
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
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePayAsYouGoPayment = async () => {
    if (!isLoggedIn) {
      router.push(
        `/login?redirect=${encodeURIComponent(`/pricing?plan=pay-as-you-go`)}`
      );
      return;
    }

    // Validate minimum amount (must be at least $0.50)
    if (payAsYouGoSearches * 2 < 0.5) {
      alert("Minimum purchase amount is $0.25 (1 search)");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/payment/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: "pay-as-you-go",
          packageName: "Pay As You Go", // Must match exactly
          packageType: "pay_as_you_go",
          amount: payAsYouGoSearches * 2,
          searchesIncluded: payAsYouGoSearches,
          creditsPurchased: payAsYouGoSearches, // Add this field
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
      alert(errorMessage);
    } finally {
      setLoading(false);
      setShowPayAsYouGoModal(false);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  return (
    <>
      <UniversalHero
        title="Choose Your Plan"
        description="Select the perfect plan for your fraud detection and prevention needs. All plans include our core features with varying levels of access and support."
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect plan for your fraud detection and prevention
              needs. All plans include our core features with varying levels of
              access and support.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {plans.map((plan) => {
              const isPayg = plan.payg;
              const isSelected = selectedPlan === plan.id;
              const periodLabel = plan.periodLabel;

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-lg shadow-lg border-2 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        {plan.price === 0 ? "Custom" : `$${plan.price}`}
                      </span>
                      <span className="text-gray-600">/{periodLabel}</span>
                    </div>

                    <div className="mb-4">
                      {isPayg ? (
                        <span className="text-lg font-semibold text-blue-600">
                          Flexible credits
                        </span>
                      ) : plan.searches === -1 ? (
                        <span className="text-lg font-semibold text-blue-600">
                          Unlimited searches
                        </span>
                      ) : (
                        <>
                          <span className="text-lg font-semibold text-blue-600">
                            {plan.searches}
                          </span>
                          <span className="text-gray-600"> searches</span>
                        </>
                      )}
                    </div>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
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
                        isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
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
              disabled={!selectedPlan || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : selectedPlan === "enterprise" ? (
                "Go to Enterprise"
              ) : (
                "Proceed to Payment"
              )}
            </button>

            <p className="mt-3 text-sm text-gray-500">
              Secure payment powered by Stripe
            </p>
          </div>

          {/* Pay As You Go Modal */}
          {showPayAsYouGoModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Buy Pay As You Go Credits
                </h3>
                <p className="text-gray-700 mb-6">
                  Each search costs $2. Buy credits and use them anytime.
                </p>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Number of searches
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={payAsYouGoSearches}
                    onChange={(e) =>
                      setPayAsYouGoSearches(parseInt(e.target.value) || 1)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                  <p className="mt-2 text-sm text-gray-700">
                    Total: ${payAsYouGoSearches * 2}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPayAsYouGoModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayAsYouGoPayment}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      `Pay $${payAsYouGoSearches * 2}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. No
                  long-term contracts.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What happens to my searches if I don't use them?
                </h3>
                <p className="text-gray-600">
                  Searches reset monthly/yearly based on your plan. Unused
                  searches don't carry over, except for Pay As You Go credits
                  which never expire.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Is there a free trial?
                </h3>
                <p className="text-gray-600">
                  Free trials are available for new users with limited searches.
                  Upgrade to unlock unlimited access and advanced features.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit cards, PayPal, and bank transfers
                  for enterprise plans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <UniversalCTA
        title="Ready to protect your business from fraud?"
        description="Join thousands of businesses that trust Fraud Scan for their security needs."
        cta1="Start Free Trial"
        cta2="Contact Support"
        cta1Href="/signup"
        cta2Href="/help"
      />
    </>
  );
};

export default PricingPage;
