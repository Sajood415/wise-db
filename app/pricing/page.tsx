"use client";

import { useState } from "react";
import UniversalHero from "@/components/ui/UniversalHero";
import { Check, Crown, Zap, Shield, Star } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  searches: number;
  features: string[];
  popular?: boolean;
  periodLabel: string;
  icon: any;
  description?: string;
}

const PricingPage = () => {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: "basic-monthly",
      name: "Basic",
      price: 19.99,
      searches: 100,
      features: [
        "100 searches per month",
        "Priority support",
      ],
      periodLabel: "month",
      icon: Check,
      description: "Perfect for individuals and small teams",
    },
    {
      id: "basic-yearly",
      name: "Professional",
      price: 99.99,
      searches: 1200,
      features: [
        "1200 searches per year",
        "Priority support",
        "Save 17% vs monthly",
      ],
      popular: true,
      periodLabel: "year",
      icon: Star,
      description: "Best value for growing businesses",
    },
    {
      id: "premium-monthly",
      name: "Premium",
      price: 29.99,
      searches: 500,
      features: [
        "500 searches per month",
        "Priority support",
        "Advanced analytics",
      ],
      periodLabel: "month",
      icon: Zap,
      description: "Advanced features for power users",
    },
    {
      id: "pay-as-you-go",
      name: "Pay As You Go",
      price: 2,
      searches: 1,
      features: [
        "$2 per search",
        "Pay only for what you use",
        "No long-term commitments",
        "Credits available anytime",
      ],
      periodLabel: "credit",
      icon: Shield,
      description: "Flexible pricing for occasional use",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 0,
      searches: 0,
      features: [
        "Custom verification tools",
        "Dedicated account manager",
        "Custom integrations",
        "Unlimited team members",
        "Advanced analytics & insights",
      ],
      periodLabel: "custom",
      icon: Crown,
      description: "Complete solution for large organizations",
    },
  ];

  return (
    <>
      <UniversalHero
        title="Pricing Plans"
        description="Flexible pricing solutions designed to scale with your business needs."
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const periodLabel = plan.periodLabel;
              const Icon = plan.icon;

              return (
                <div
                  key={plan.id}
                  className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-[#006d5b] transition-all duration-300 flex flex-col h-full group relative ${
                    plan.popular ? "ring-2 ring-[#006d5b] ring-opacity-50" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-[#006d5b] to-[#43d49d] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Icon and Title */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-[#006d5b]/10 rounded-xl mb-3 group-hover:bg-[#006d5b] transition-colors duration-300">
                      <Icon className="w-6 h-6 text-[#006d5b] group-hover:text-white transition-colors duration-300" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {plan.name}
                    </h3>

                    {plan.description && (
                      <p className="text-xs text-gray-600 mb-3">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-center mb-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl font-bold text-gray-900">
                        {plan.price === 0 ? "Custom" : `$${plan.price}`}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">
                        /{periodLabel}
                      </span>
                    </div>
                  </div>

                  {/* Search Count */}
                  <div className="mb-4 p-3 bg-[#006d5b]/5 rounded-lg border border-[#006d5b]/10">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#006d5b] rounded-full"></div>
                      <span className="text-sm font-semibold text-[#006d5b]">
                        {plan.searches > 0
                          ? `${plan.searches} searches`
                          : "Custom solution"}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex-1">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-gray-700"
                        >
                          <Check className="w-3 h-3 text-[#006d5b] mt-0.5 shrink-0" />
                          <span className="text-xs leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
