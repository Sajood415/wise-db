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
import UniversalHero from "@/components/ui/UniversalHero";
import UniversalCTA from "@/components/ui/UniversalCTA";

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
      title: "Report or Search",
      description:
        "Submit fraud reports or search our database to verify contacts and businesses.",
      details:
        "Anyone can report fraud anonymously through our secure platform. Registered users can search our database to check if emails, phones, websites, or businesses have been reported for fraud.",
      icon: FileText,
      actions: [
        "Submit fraud report",
        "Search database",
        "Check email addresses",
        "Verify business contacts",
      ],
    },
    {
      title: "Data Collection",
      description: "Fraud reports are collected and stored securely",
      details:
        "Submitted fraud reports are securely stored with all evidence, including screenshots, documents, and detailed information about the fraudster and incident.",
      icon: Settings,
      actions: [
        "Secure storage",
        "Evidence preservation",
        "Data organization",
        "Status tracking",
      ],
    },
    {
      title: "Expert Review",
      description: "Sub-admins review and verify fraud reports",
      details:
        "Our team of sub-admins manually reviews each fraud report, verifies the evidence, and decides whether to approve or reject the case before it becomes searchable in our database.",
      icon: Users,
      actions: [
        "Manual review",
        "Evidence verification",
        "Approval or rejection",
        "Quality control",
      ],
    },
    {
      title: "Database Update",
      description: "Approved reports are added to the searchable database",
      details:
        "Once approved by reviewers, fraud reports are added to our database and become searchable by registered users, helping others verify if they're dealing with known fraudsters.",
      icon: Database,
      actions: [
        "Report approval",
        "Database indexing",
        "Search availability",
        "Privacy protection",
      ],
    },
    {
      title: "Community Access",
      description: "Verified fraud data is accessible to the community",
      details:
        "Approved fraud reports are available for search by registered users and enterprise clients through our platform and API, helping businesses verify contacts before engaging.",
      icon: Globe,
      actions: [
        "Search access",
        "API integration",
        "Enterprise access",
        "Community protection",
      ],
    },
    {
      title: "Ongoing Updates",
      description: "New reports are continuously added to the database",
      details:
        "As new fraud reports are submitted and approved, our database grows, providing an up-to-date resource for businesses and individuals to verify contacts and avoid fraud.",
      icon: RefreshCcw,
      actions: [
        "New report additions",
        "Database growth",
        "Updated information",
        "Continuous protection",
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
      description: "Search our fraud database to verify contacts",
      steps: [
        "Create account and log in",
        "Enter search query (keyword, email, phone, type)",
        "View search results from database",
        "Access detailed fraud reports",
      ],
      icon: User,
    },
    {
      type: "Enterprise Client",
      title: "API Integration & Team Management",
      description: "Integrate our fraud database into your systems",
      steps: [
        "Set up API integration",
        "Use API to check contacts",
        "Manage team members",
        "Monitor usage and dashboard",
      ],
      icon: Building2,
    },
  ];

  const technologies = [
    {
      name: "Search Functionality",
      description:
        "Powerful search capabilities to find fraud reports by keyword, email, phone, type, and severity",
      features: [
        "Keyword search",
        "Email and phone lookup",
        "Type and severity filters",
        "Fuzzy matching options",
      ],
      icon: Cpu,
    },
    {
      name: "Secure Database",
      description: "Reliable MongoDB storage for fraud reports and user data",
      features: [
        "MongoDB database",
        "Indexed searches",
        "Role-based access",
        "Data persistence",
      ],
      icon: Database,
    },
    {
      name: "Report Management",
      description: "Efficient handling and status tracking of fraud reports",
      features: [
        "Status tracking",
        "Evidence storage",
        "Review workflow",
        "Report submission",
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
        "Approve or reject",
        "Review notes",
      ],
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section */}
      <UniversalHero
        title={"How Fraud Scan Works"}
        gradientText={""}
        afterText={""}
        description={
          " Understanding our comprehensive fraud protection process from initial reporting to global intelligence sharing."
        }
        badgeText={""}
      />

      {/* Process Steps */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our 6-Step Protection Process
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Every fraud report and verification request goes through our
              comprehensive 6-step process to ensure accuracy and provide
              maximum protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#006d5b] to-[#43d49d] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex items-center justify-center w-14 h-14 bg-[#006d5b]/10 rounded-lg group-hover:bg-[#006d5b] transition-colors duration-300 flex-shrink-0">
                      <Icon className="w-7 h-7 text-[#006d5b] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                    {step.details}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    {step.actions.map((action, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#006d5b] flex-shrink-0"></div>
                        <span className="text-sm">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Journeys */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Different Ways to Use Fraud Scan
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
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
                  className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-[#006d5b] transition-all duration-300 flex flex-col h-full group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#006d5b] to-[#43d49d] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-14 h-14 bg-[#006d5b]/10 rounded-lg group-hover:bg-[#006d5b] transition-colors duration-300 flex-shrink-0">
                      <Icon className="w-7 h-7 text-[#006d5b] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {journey.type}
                      </h3>
                      <h4 className="text-base font-semibold text-[#006d5b]">
                        {journey.title}
                      </h4>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {journey.description}
                  </p>

                  <div className="space-y-3 mb-8 flex-1">
                    {journey.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#006d5b]/10 text-[#006d5b] font-semibold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                          {index + 1}
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{step}</span>
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
                    className="mt-auto inline-block bg-[#006d5b] text-white py-3 px-6 rounded-lg text-center font-semibold hover:bg-[#43d49d] transition duration-300 w-full"
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
              Core Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides essential tools for fraud reporting, search, and verification
              to help protect businesses and individuals.
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
      <section className="py-24 bg-gradient-to-r from-[#1c2736] to-[#006d5b] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Security & Privacy First
            </h2>
            <p className="text-lg md:text-xl text-[#d7f6ea] max-w-3xl mx-auto">
              Your data security and privacy are our top priorities. We implement
              security measures to protect all information and ensure safe fraud reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Security Features */}
            <div className="space-y-6">
              {[
                {
                  title: "Secure Authentication",
                  desc: "JWT-based authentication with HTTP-only cookies and password hashing using bcrypt.",
                  icon: Lock,
                },
                {
                  title: "Anonymous Reporting",
                  desc: "Report fraud without creating an account or revealing your identity. Guest submissions are fully supported.",
                  icon: UserCheck,
                },
                {
                  title: "Role-Based Access",
                  desc: "Granular permissions system ensures users only access features appropriate for their role.",
                  icon: Settings,
                },
                {
                  title: "API Security",
                  desc: "Enterprise API access uses Bearer token authentication with quota management and access controls.",
                  icon: ShieldCheck,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
                  <div className="w-12 h-12 bg-[#006d5b] rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 text-lg">{item.title}</h3>
                    <p className="text-[#d7f6ea] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Trust Indicators */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">Why Trust Us</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#43d49d] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Secure Data Storage</h4>
                      <p className="text-[#d7f6ea] text-sm">All fraud reports and user data stored securely in MongoDB with proper indexing and access controls.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#43d49d] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Privacy Protection</h4>
                      <p className="text-[#d7f6ea] text-sm">Guest submissions protect reporter identity. Only approved reports become searchable.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#43d49d] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Evidence Security</h4>
                      <p className="text-[#d7f6ea] text-sm">Uploaded evidence files are securely stored and only accessible to authorized reviewers.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#43d49d] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Access Control</h4>
                      <p className="text-[#d7f6ea] text-sm">Middleware protection ensures only authenticated users with proper roles can access sensitive features.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <Shield className="w-10 h-10 text-[#43d49d]" />
                  <div>
                    <h4 className="font-bold text-lg">Verified Platform</h4>
                    <p className="text-[#d7f6ea] text-sm">All reports undergo manual review before being added to the database</p>
                  </div>
                </div>
              </div>
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
      <UniversalCTA
        title={"Ready to Get Started?"}
        description={
          " Join thousands of businesses and individuals using Fraud Scan to fight fraud and protect their operations."
        }
        cta1={"Report Fraud Now"}
        cta2={"Start Free Trial"}
        cta1Href={"/report-fraud"}
        cta2Href={"/signup"}
      />
    </div>
  );
}
