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
      id: "search",
      title: "Search Database",
      description:
        "Individuals can search our fraud database to check businesses, identities, emails, phones and websites.",
      icon: "🔎",
      features: [
        "Keyword, phone, email and website lookup",
        "Type and risk-level filters",
        "View verified report details",
        "Recent activity and saved submissions",
      ],
    },
    {
      id: "reporting",
      title: "Secure Fraud Reporting",
      description:
        "Report suspected fraud securely. Your identity is protected and evidence can be attached.",
      icon: "🛡️",
      features: [
        "Anonymous reporting options",
        "Encrypted submission and storage",
        "Multi-format evidence upload (PDF/Images)",
        "Real-time status tracking",
      ],
    },
    {
      id: "enterprise",
      title: "Enterprise API & Workspace",
      description:
        "Enterprises can integrate via API and manage a team workspace to search and report frauds.",
      icon: "🏢",
      features: [
        "REST API access to the fraud database",
        "Team management (admins and members)",
        "Role-based access and usage controls",
        "Centralized workspace for searches and reports",
      ],
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

  // Removed pricing plans per request

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
              Search verified fraud reports, submit incidents securely, and integrate our database via API for your enterprise.
            </p>
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
                className={`bg-white border-2 rounded-xl p-8 hover:shadow-xl transition-shadow duration-300 border-gray-200`}
              >
                {/* Removed Most Popular badge */}
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
                          className="w-4 h-4 text-[#006d5b] mt-1 flex-shrink-0"
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

                {/* Pricing and Learn More removed per request */}
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
                        className="inline-block bg-[#006d5b]/10 text-[#006d5b] text-xs px-2 py-1 rounded-full mr-2 mb-1"
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

      {/* Pricing Section removed per request */}

      {/* API Section */}
      <section className="py-20 bg-gradient-to-r from-[#1c2736] to-[#006d5b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Developer-Friendly API
              </h2>
              <p className="text-xl text-[#d7f6ea] mb-8">
                Integrate our fraud protection services directly into your
                applications with our comprehensive RESTful API and SDKs.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-[#43d49d]"
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
                    className="w-5 h-5 text-[#43d49d]"
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
                    className="w-5 h-5 text-[#43d49d]"
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
                    className="w-5 h-5 text-[#43d49d]"
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
              <pre className="text-[#d7f6ea] text-sm overflow-x-auto">
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
      <section className="py-20 bg-[#006d5b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Protect Your Business?
          </h2>
          <p className="text-xl text-[#d7f6ea] mb-8 max-w-2xl mx-auto">
            Start with a free trial and see how our fraud protection services
            can safeguard your business operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-[#006d5b] hover:bg-[#d7f6ea] font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-sm"
            >
              Start Free Trial
            </Link>
            <Link
              href="/help"
              className="border-2 border-white text-white hover:bg-white hover:text-[#006d5b] font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
