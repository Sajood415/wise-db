import { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Settings,
  Users,
  Database,
  Globe,
  RefreshCcw,
  UserCheck,
  User,
  Building2,
  Cpu,
  Shield,
  Lock,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

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
      icon: FileText,
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
      icon: Settings,
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
      icon: Users,
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
      icon: Database,
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
      icon: Globe,
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
      icon: RefreshCcw,
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
      icon: UserCheck,
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
      icon: User,
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
      icon: Building2,
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
      icon: Cpu,
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
      icon: Database,
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
      icon: Settings,
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
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            How <span className="text-[#006d5b]">Fraud Scan</span> Works
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Understanding our comprehensive fraud protection process from
            initial reporting to global intelligence sharing.
          </p>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-secondary/15 text-[#43d49d] text-lg font-medium border border-secondary">
            <span className="w-3 h-3 bg-secondary rounded-full mr-3 animate-pulse"></span>
            95% report verification accuracy
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {processSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition duration-300 group"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#006d5b] to-[#43d49d] text-white rounded-full mb-4 text-2xl font-bold mx-auto group-hover:scale-105 transform transition duration-300">
                    {step.number}
                  </div>
                  <div className="text-[#006d5b] mb-4 flex justify-center text-4xl">
                    <Icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-2 text-center">
                    {step.description}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">{step.details}</p>
                  <ul className="space-y-2">
                    {step.actions.map((action, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <CheckCircle className="w-5 h-5 text-[#006d5b]" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Journeys */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
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
            {userJourneys.map((journey) => {
              const Icon = journey.icon;
              return (
                <div
                  key={journey.type}
                  className="bg-white p-8 rounded-2xl shadow-lg flex flex-col h-full hover:scale-105 transform transition duration-300"
                >
                  <div className="text-4xl text-[#006d5b] mb-4 flex justify-center">
                    <Icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    {journey.type}
                  </h3>
                  <h4 className="text-lg font-semibold text-[#006d5b] mb-3 text-center">
                    {journey.title}
                  </h4>
                  <p className="text-gray-600 mb-6 text-center">
                    {journey.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    {journey.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#006d5b]/10 text-[#006d5b] font-semibold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={
                      journey.type === "Public User"
                        ? "/report-fraud"
                        : journey.type === "Enterprise Client"
                        ? "/enterprise"
                        : "/signup"
                    }
                    className="mt-auto inline-block bg-[#006d5b] text-white py-3 px-6 rounded-lg text-center font-semibold hover:bg-[#43d49d] transition duration-300"
                  >
                    Get Started
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
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
            {technologies.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 text-center"
                >
                  <div className="text-[#006d5b] mb-4 flex justify-center">
                    <Icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {tech.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{tech.description}</p>
                  <div className="space-y-2">
                    {tech.features.map((feature, i) => (
                      <div
                        key={i}
                        className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      {/* Security & Privacy */}
      <section className="py-24 bg-gradient-to-r from-[#1c2736] to-[#006d5b] text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Security & Privacy First
            </h2>
            <p className="text-xl text-[#d7f6ea] mb-8">
              Your data security and privacy are our top priorities. We
              implement industry-leading security measures to protect all
              information.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "End-to-End Encryption",
                  desc: "All data is encrypted in transit and at rest using AES-256 encryption.",
                  icon: Lock,
                },
                {
                  title: "Anonymous Reporting",
                  desc: "Report fraud without revealing your identity or personal information.",
                  icon: UserCheck,
                },
                {
                  title: "Continuous Monitoring",
                  desc: "We continuously monitor systems for suspicious activity to ensure your data remains protected in real time.",
                  icon: RefreshCcw,
                },
                {
                  title: "Access Controls",
                  desc: "Role-based access controls and multi-factor authentication.",
                  icon: Settings,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-[#006d5b] rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-[#d7f6ea] text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about how our fraud protection process works.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "How long does verification take?",
                a: "Most verifications are completed within seconds for automated checks, while manual reviews typically take 2-4 hours during business hours.",
              },
              {
                q: "Is my data secure?",
                a: "Yes, we use industry-leading encryption and security measures. All data is encrypted in transit and at rest, and we're SOC 2 and GDPR compliant.",
              },
              {
                q: "Can I report fraud anonymously?",
                a: "Absolutely. Our platform allows anonymous fraud reporting without requiring personal information or account creation.",
              },
              {
                q: "What happens after I report fraud?",
                a: "Your report is analyzed by our AI system, reviewed by human experts, and if verified, added to our global database to protect others.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.q}
                </h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-secondary text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-medium text-primary mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary mb-8 max-w-2xl mx-auto">
            Join thousands of businesses and individuals using Fraud Scan to
            fight fraud and protect their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/report-fraud"
              className="bg-[#FFC21A] text-primary hover:bg-primary hover:text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 shadow-sm"
            >
              Report Fraud Now
            </Link>
            <Link
              href="/signup"
              className="text-white hover:text-white bg-primary hover:bg-primary/20 hover:text-[#006d5b] font-semibold py-3 px-8 rounded-full transition-colors duration-200"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
