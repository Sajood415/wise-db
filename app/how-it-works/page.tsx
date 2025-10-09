import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works - Fraud Scan | Step-by-Step Fraud Protection Process",
  description:
    "Learn how Fraud Scan fraud protection works: from reporting and verification to expert analysis and global intelligence sharing. Simple, secure, and effective.",
  keywords:
    "how fraud protection works, fraud reporting process, verification steps, expert fraud analysis process, fraud intelligence sharing",
  openGraph: {
    title: "How It Works - Fraud Scan | Step-by-Step Fraud Protection Process",
    description:
      "Learn how Fraud Scan fraud protection works from start to finish.",
    url: "https://fraudscans.com/how-it-works",
    type: "website",
  },
};

export default function HowItWorks() {
  const processSteps = [
    {
      number: "01",
      title: "Report or Query",
      description:
        "Submit a fraud report or query our database for verification",
      details:
        "Anyone can report fraud anonymously through our secure platform, or registered users can query our database for real-time verification of businesses, individuals, or transactions.",
      icon: "📝",
      actions: [
        "Submit fraud report",
        "Search database",
        "Verify identity",
        "Check business legitimacy",
      ],
    },
    {
      number: "02",
      title: "Data Processing",
      description: "Our system processes and categorizes the information",
      details:
        "The submitted information is processed and categorized based on fraud type, severity, and other relevant factors to ensure proper routing to our review team.",
      icon: "⚙️",
      actions: [
        "Data categorization",
        "Risk assessment",
        "Case routing",
        "Priority assignment",
      ],
    },
    {
      number: "03",
      title: "Expert Review",
      description: "Human experts review flagged cases for accuracy",
      details:
        "Our team of fraud experts and sub-admins manually review high-risk cases, verify evidence, and ensure the accuracy of automated decisions before adding to the database.",
      icon: "👥",
      actions: [
        "Manual verification",
        "Evidence review",
        "Quality assurance",
        "Case validation",
      ],
    },
    {
      number: "04",
      title: "Database Update",
      description: "Verified information is added to our global database",
      details:
        "Confirmed fraud cases are securely added to our global database, making the information available to the community while protecting sensitive details and maintaining privacy.",
      icon: "🗄️",
      actions: [
        "Data categorization",
        "Privacy protection",
        "Global distribution",
        "Real-time updates",
      ],
    },
    {
      number: "05",
      title: "Intelligence Sharing",
      description: "Information is shared with the global community",
      details:
        "Verified fraud intelligence is shared with businesses and organizations worldwide, helping prevent similar fraudulent activities and protecting the entire community.",
      icon: "🌐",
      actions: [
        "Community alerts",
        "Threat sharing",
        "Preventive measures",
        "Collective protection",
      ],
    },
    {
      number: "06",
      title: "Continuous Monitoring",
      description: "Ongoing monitoring and updates for emerging threats",
      details:
        "Our systems continuously monitor for new fraud patterns, update risk models, and provide real-time alerts to keep our community protected against evolving threats.",
      icon: "🔄",
      actions: [
        "Real-time monitoring",
        "Pattern updates",
        "Threat alerts",
        "Model improvement",
      ],
    },
  ];

  const userJourneys = [
    {
      type: "Public User",
      title: "Anonymous Fraud Reporting",
      description: "Report fraud without creating an account",
      steps: [
        "Visit fraud reporting form",
        "Fill in fraud details anonymously",
        "Upload supporting evidence",
        "Submit report for review",
        "Receive confirmation",
      ],
      icon: "🕵️",
    },
    {
      type: "Registered User",
      title: "Database Search & Verification",
      description: "Search our fraud database and verify entities",
      steps: [
        "Create account and log in",
        "Enter search query or verification request",
        "View instant results and risk scores",
        "Access detailed fraud reports",
      ],
      icon: "👤",
    },
    {
      type: "Enterprise Client",
      title: "Automated Integration",
      description: "Integrate fraud protection into business processes",
      steps: [
        "Set up API integration",
        "Configure automated checks",
        "Implement real-time verification",
        "Monitor dashboard analytics",
        "Access dashboard and add users",
      ],
      icon: "🏢",
    },
  ];

  const technologies = [
    {
      name: "Data Analytics",
      description:
        "Advanced data processing and analysis for comprehensive fraud intelligence",
      features: [
        "Statistical analysis",
        "Trend identification",
        "Report generation",
        "Data visualization",
      ],
      icon: "🧠",
    },
    {
      name: "Secure Database",
      description: "Reliable data storage and protection for fraud reports",
      features: [
        "Encrypted data storage",
        "Regular backups",
        "Access controls",
        "Data integrity checks",
      ],
      icon: "🔒",
    },
    {
      name: "Report Processing",
      description: "Efficient handling and categorization of fraud reports",
      features: [
        "Automated categorization",
        "Status tracking",
        "Progress updates",
        "Quick processing",
      ],
      icon: "⚙️",
    },
    {
      name: "Expert Review",
      description:
        "Human verification and quality assurance for reported cases",
      features: [
        "Manual case review",
        "Evidence verification",
        "Quality control",
        "Expert validation",
      ],
      icon: "👥",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              How <span className="gradient-text">Fraud Scan</span> Works
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Understanding our comprehensive fraud protection process from
              initial reporting to global intelligence sharing.
            </p>
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-[#006d5b]/10 text-[#43d49d] text-lg font-medium border border-[#006d5b]/20">
              <span className="w-3 h-3 bg-[#006d5b] rounded-full mr-3"></span>
              95% report verification accuracy
            </div>
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our 6-Step Protection Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every fraud report and verification request goes through our
              comprehensive 6-step process to ensure accuracy and provide
              maximum protection.
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {processSteps.map((step, index) => (
                <div key={step.number} className="relative">
                  {/* Step Card */}
                  <div className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 h-full">
                    {/* Step Number */}
                    <div className="w-16 h-16 bg-gradient-to-br from-[#006d5b] to-[#43d49d] rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto lg:mx-0">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="text-4xl mb-4 text-center lg:text-left">
                      {step.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center lg:text-left">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-center lg:text-left">
                      {step.description}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">{step.details}</p>

                    {/* Actions */}
                    <div className="space-y-2">
                      {step.actions.map((action, actionIndex) => (
                        <div
                          key={actionIndex}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-2 h-2 bg-[#006d5b] rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            {action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* User Journeys */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Different Ways to Use Fraud Scan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're an individual reporting fraud or an enterprise
              integrating our services, we have solutions tailored to your
              needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {userJourneys.map((journey) => (
              <div
                key={journey.type}
                className="bg-white rounded-xl p-8 shadow-lg h-full flex flex-col"
              >
                <div className="text-4xl mb-4 text-center">{journey.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  {journey.type}
                </h3>
                <h4 className="text-lg font-semibold text-[#006d5b] mb-3 text-center">
                  {journey.title}
                </h4>
                <p className="text-gray-600 mb-6 text-center">
                  {journey.description}
                </p>

                <div className="space-y-3">
                  {journey.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#006d5b]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#006d5b] font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100">
                  <Link
                    href={
                      journey.type === "Public User"
                        ? "/report-fraud"
                        : journey.type === "Enterprise Client"
                        ? "/enterprise"
                        : "/signup"
                    }
                    className="block text-center btn-primary"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powered by Advanced Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our fraud protection platform is built on cutting-edge
              technologies that ensure accuracy, speed, and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech) => (
              <div key={tech.name} className="text-center">
                <div className="text-6xl mb-6">{tech.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {tech.name}
                </h3>
                <p className="text-gray-600 mb-4">{tech.description}</p>
                <div className="space-y-2">
                  {tech.features.map((feature, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full"
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="py-20 bg-gradient-to-r from-[#1c2736] to-[#006d5b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Security & Privacy First
              </h2>
              <p className="text-xl text-[#d7f6ea] mb-8">
                Your data security and privacy are our top priorities. We
                implement industry-leading security measures to protect all
                information.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#006d5b] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">
                      End-to-End Encryption
                    </h3>
                    <p className="text-[#d7f6ea]">
                      All data is encrypted in transit and at rest using AES-256
                      encryption.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#006d5b] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Anonymous Reporting</h3>
                    <p className="text-[#d7f6ea]">
                      Report fraud without revealing your identity or personal
                      information.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#006d5b] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Compliance Ready</h3>
                    <p className="text-[#d7f6ea]">
                      SOC 2, GDPR, and CCPA compliant with regular security
                      audits.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#006d5b] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Access Controls</h3>
                    <p className="text-[#d7f6ea]">
                      Role-based access controls and multi-factor
                      authentication.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Security Certifications
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#006d5b] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">SOC</span>
                  </div>
                  <p className="text-sm">SOC 2 Type II</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#43d49d] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">ISO</span>
                  </div>
                  <p className="text-sm">ISO 27001</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">GDPR</span>
                  </div>
                  <p className="text-sm">GDPR Compliant</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">PCI</span>
                  </div>
                  <p className="text-sm">PCI DSS</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about how our fraud protection process works.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How long does verification take?
              </h3>
              <p className="text-gray-600">
                Most verifications are completed within seconds for automated
                checks, while manual reviews typically take 2-4 hours during
                business hours.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is my data secure?
              </h3>
              <p className="text-gray-600">
                Yes, we use industry-leading encryption and security measures.
                All data is encrypted in transit and at rest, and we're SOC 2
                and GDPR compliant.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I report fraud anonymously?
              </h3>
              <p className="text-gray-600">
                Absolutely. Our platform allows anonymous fraud reporting
                without requiring personal information or account creation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What happens after I report fraud?
              </h3>
              <p className="text-gray-600">
                Your report is analyzed by our AI system, reviewed by human
                experts, and if verified, added to our global database to
                protect others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#006d5b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-[#d7f6ea] mb-8 max-w-2xl mx-auto">
            Join thousands of businesses and individuals using Fraud Scan to fight
            fraud and protect their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/report-fraud"
              className="bg-white text-[#006d5b] hover:bg-[#d7f6ea] font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-sm"
            >
              Report Fraud Now
            </Link>
            <Link
              href="/signup"
              className="border-2 border-white text-white hover:bg-white hover:text-[#006d5b] font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
