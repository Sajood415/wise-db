import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services - Wise DB | Comprehensive Fraud Protection Solutions",
  description:
    "Explore Wise DB fraud protection services: real-time verification, secure reporting, expert analysis, global intelligence, and enterprise solutions for businesses of all sizes.",
  keywords:
    "fraud protection services, fraud verification, secure reporting, expert fraud analysis, enterprise fraud solutions, global fraud intelligence",
  openGraph: {
    title: "Services - Wise DB | Comprehensive Fraud Protection Solutions",
    description:
      "Explore Wise DB fraud protection services for businesses of all sizes.",
    url: "https://wisedb.com/services",
    type: "website",
  },
};

export default function Services() {
  const services = [
    {
      id: "verification",
      title: "Real-time Verification",
      description:
        "Instantly verify businesses, individuals, and transactions with our comprehensive global database.",
      icon: "🔍",
      features: [
        "Instant identity verification",
        "Business legitimacy checks",
        "Transaction risk scoring",
        "Document authenticity validation",
        "Phone and email verification",
        "Address validation services",
      ],
      pricing: "Starting at $0.10 per verification",
      popular: false,
    },
    {
      id: "reporting",
      title: "Secure Fraud Reporting",
      description:
        "Report fraudulent activities securely with our encrypted platform that protects your identity.",
      icon: "🛡️",
      features: [
        "Anonymous reporting options",
        "End-to-end encryption",
        "Multi-format evidence upload",
        "Real-time status tracking",
        "Automated case routing",
        "Whistleblower protection",
      ],
      pricing: "Free for public users",
      popular: false,
    },
    {
      id: "expert-analysis",
      title: "Expert Analysis",
      description:
        "Professional fraud analysts provide detailed case reviews and risk assessments for complex fraud scenarios.",
      icon: "👨‍💼",
      features: [
        "Professional case review",
        "Manual verification process",
        "Risk assessment reports",
        "Pattern analysis",
        "Comprehensive investigations",
        "Expert consultation",
      ],
      pricing: "Custom enterprise pricing",
      popular: true,
    },
    {
      id: "intelligence",
      title: "Global Fraud Intelligence",
      description:
        "Access worldwide fraud intelligence shared by businesses and organizations globally.",
      icon: "🌍",
      features: [
        "Global fraud database access",
        "Threat intelligence feeds",
        "Industry-specific insights",
        "Geographic risk mapping",
        "Emerging threat alerts",
        "Collaborative intelligence sharing",
      ],
      pricing: "Premium subscription required",
      popular: false,
    },
    {
      id: "analytics",
      title: "Advanced Analytics",
      description:
        "Comprehensive fraud analytics and reporting to track trends and measure protection effectiveness.",
      icon: "📊",
      features: [
        "Custom dashboard creation",
        "Fraud trend analysis",
        "ROI measurement tools",
        "Automated reporting",
        "Data export capabilities",
        "API integration support",
      ],
      pricing: "Included in premium plans",
      popular: false,
    },
    {
      id: "enterprise",
      title: "Enterprise Solutions",
      description:
        "Comprehensive fraud protection suite designed for large organizations and enterprises.",
      icon: "🏢",
      features: [
        "Dedicated account management",
        "Custom integration support",
        "SLA guarantees",
        "Priority support",
        "White-label options",
        "Compliance assistance",
      ],
      pricing: "Contact for custom quote",
      popular: false,
    },
  ];

  const industries = [
    {
      name: "E-commerce",
      description:
        "Protect your online business from payment fraud, fake reviews, and account takeovers.",
      icon: "🛒",
      useCases: [
        "Payment fraud prevention",
        "Fake review detection",
        "Account security",
      ],
    },
    {
      name: "Financial Services",
      description:
        "Comprehensive fraud protection for banks, credit unions, and fintech companies.",
      icon: "🏦",
      useCases: [
        "Identity verification",
        "Transaction monitoring",
        "Anti-money laundering",
      ],
    },
    {
      name: "Healthcare",
      description:
        "Protect patient data and prevent medical identity theft and insurance fraud.",
      icon: "🏥",
      useCases: [
        "Medical identity protection",
        "Insurance fraud detection",
        "Provider verification",
      ],
    },
    {
      name: "Real Estate",
      description:
        "Verify property transactions and prevent real estate fraud and scams.",
      icon: "🏠",
      useCases: [
        "Property verification",
        "Agent authentication",
        "Transaction security",
      ],
    },
    {
      name: "Technology",
      description:
        "Protect your platform users and prevent account fraud and data breaches.",
      icon: "💻",
      useCases: ["User verification", "API security", "Data protection"],
    },
    {
      name: "Education",
      description:
        "Verify student identities and prevent academic fraud and credential forgery.",
      icon: "🎓",
      useCases: [
        "Student verification",
        "Credential validation",
        "Academic integrity",
      ],
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$49",
      period: "/month",
      description: "Perfect for small businesses getting started",
      features: [
        "1,000 verifications per month",
        "Basic fraud reporting",
        "Email support",
        "Standard API access",
        "Basic analytics dashboard",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Professional",
      price: "$199",
      period: "/month",
      description: "Ideal for growing businesses with higher volume needs",
      features: [
        "10,000 verifications per month",
        "Expert fraud analysis",
        "Priority support",
        "Advanced API features",
        "Custom integrations",
        "Detailed analytics",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large organizations",
      features: [
        "Unlimited verifications",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom integrations",
        "SLA guarantees",
        "On-premise deployment options",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Comprehensive{" "}
              <span className="gradient-text">Fraud Protection</span> Services
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              From real-time verification to expert fraud analysis, we offer a
              complete suite of fraud protection services for businesses of all
              sizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary text-lg px-8 py-4">
                Start Free Trial
              </Link>
              <Link href="/contact" className="btn-secondary text-lg px-8 py-4">
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comprehensive range of fraud protection services,
              each designed to address specific security challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className={`bg-white border-2 rounded-xl p-8 hover:shadow-xl transition-shadow duration-300 ${
                  service.popular
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200"
                }`}
              >
                {service.popular && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500 text-white text-sm font-medium mb-4">
                    Most Popular
                  </div>
                )}
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">{service.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Key Features:
                  </h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <svg
                          className="w-4 h-4 text-green-500 mt-1 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <p className="text-lg font-semibold text-blue-600 mb-4">
                    {service.pricing}
                  </p>
                  <Link
                    href={`/services/${service.id}`}
                    className={`block text-center py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                      service.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industries We Serve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our fraud protection services are tailored to meet the unique
              challenges of different industries and business sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry) => (
              <div
                key={industry.name}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-3xl mb-4">{industry.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {industry.name}
                </h3>
                <p className="text-gray-600 mb-4">{industry.description}</p>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Common Use Cases:
                  </h4>
                  <div className="space-y-1">
                    {industry.useCases.map((useCase, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-1"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that's right for your business. All plans include
              our core fraud protection features with no hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white border-2 rounded-xl p-8 ${
                  plan.popular
                    ? "border-blue-500 ring-2 ring-blue-200 scale-105"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500 text-white text-sm font-medium mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <svg
                        className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === "Enterprise" ? "/contact" : "/register"}
                  className={`block text-center py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Developer-Friendly API
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Integrate our fraud protection services directly into your
                applications with our comprehensive RESTful API and SDKs.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>RESTful API with comprehensive documentation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>SDKs for popular programming languages</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Webhook support for real-time notifications</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>99.9% uptime SLA guarantee</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/api-docs"
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  View API Docs
                </Link>
                <Link
                  href="/register"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Get API Key
                </Link>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 overflow-hidden">
              <div className="text-sm text-gray-400 mb-4">
                Example API Request
              </div>
              <pre className="text-green-400 text-sm overflow-x-auto">
                {`curl -X POST https://api.wisedb.com/v1/verify \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "business",
    "identifier": "business@example.com",
    "additional_checks": ["phone", "address"]
  }'`}
              </pre>
              <div className="text-sm text-gray-400 mt-4 mb-2">Response</div>
              <pre className="text-blue-400 text-sm overflow-x-auto">
                {`{
  "status": "verified",
  "risk_score": 15,
  "verification_id": "ver_123456",
  "checks": {
    "email": "valid",
    "phone": "valid",
    "address": "verified"
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Protect Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start with a free trial and see how our fraud protection services
            can safeguard your business operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
