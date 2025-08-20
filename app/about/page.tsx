import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us - Wise DB | Leading Fraud Protection Platform",
  description:
    "Learn about Wise DB, the trusted fraud reporting and verification platform protecting businesses worldwide. Discover our mission, values, and commitment to fighting fraud.",
  keywords:
    "about wise db, fraud protection company, anti-fraud platform, business security, fraud prevention team",
  openGraph: {
    title: "About Us - Wise DB",
    description:
      "Learn about Wise DB, the trusted fraud reporting and verification platform protecting businesses worldwide.",
    url: "https://wisedb.com/about",
    type: "website",
  },
};

export default function About() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      bio: "Former cybersecurity expert with 15+ years experience in fraud detection and prevention.",
      image: "👩‍💼",
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      bio: "Technology leader specializing in AI/ML and large-scale data processing systems.",
      image: "👨‍💻",
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Head of Security",
      bio: "PhD in Computer Science, leading expert in cybersecurity and data protection.",
      image: "👩‍🔬",
    },
    {
      name: "David Park",
      role: "VP of Operations",
      bio: "Operations specialist with extensive experience in scaling global platforms.",
      image: "👨‍💼",
    },
  ];

  const milestones = [
    {
      year: "2019",
      event: "Company Founded",
      description:
        "Wise DB was established with a mission to combat fraud globally",
    },
    {
      year: "2020",
      event: "First 1,000 Users",
      description: "Reached our first milestone of helping 1,000 businesses",
    },
    {
      year: "2021",
      event: "Expert Review System",
      description:
        "Launched comprehensive expert review and verification system",
    },
    {
      year: "2022",
      event: "Global Expansion",
      description: "Expanded services to 50+ countries worldwide",
    },
    {
      year: "2023",
      event: "10,000+ Businesses",
      description: "Now protecting over 10,000 businesses globally",
    },
    {
      year: "2024",
      event: "Enterprise Solutions",
      description: "Launched comprehensive enterprise fraud protection suite",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="gradient-text">Wise DB</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              We're on a mission to create a safer digital world by empowering
              businesses and individuals to identify, report, and prevent
              fraudulent activities.
            </p>
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-100 text-blue-800 text-lg font-medium">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
              Trusted by 10,000+ businesses worldwide
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                To build the world's most comprehensive and trusted fraud
                intelligence platform, making it easier for businesses of all
                sizes to protect themselves and their customers from fraudulent
                activities.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We believe that by working together and sharing fraud
                intelligence, we can create a safer digital ecosystem that
                benefits everyone.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-blue-600"
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
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Innovation
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Advanced data processing and analytics
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-green-600"
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
                    <h3 className="font-semibold text-gray-900 mb-1">Trust</h3>
                    <p className="text-gray-600 text-sm">
                      Secure and transparent operations
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-purple-600"
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
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Collaboration
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Global community working together
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-orange-600"
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
                    <h3 className="font-semibold text-gray-900 mb-1">Impact</h3>
                    <p className="text-gray-600 text-sm">
                      Measurable fraud prevention results
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-blue-100 mb-6">
                  A world where fraud is eliminated through collaborative
                  intelligence, advanced technology, and shared responsibility.
                </p>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Fraud Prevented</span>
                    <span className="text-xl font-bold">$50M+</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2 w-3/4"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-200 rounded-full opacity-50"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-pink-200 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a small startup to a global fraud prevention platform, here's
              how we've grown and evolved over the years.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Content */}
                  <div
                    className={`w-5/12 ${
                      index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"
                    }`}
                  >
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <div className="text-sm font-semibold text-blue-600 mb-1">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {milestone.event}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse team of experts is dedicated to building the most
              effective fraud prevention solutions in the industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              These core values guide everything we do and shape the way we
              serve our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Security First</h3>
              <p className="text-blue-100">
                We prioritize the security and privacy of our users' data above
                all else, implementing industry-leading security measures.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Community Driven</h3>
              <p className="text-blue-100">
                We believe in the power of community collaboration to create
                stronger defenses against fraud for everyone.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-blue-100">
                We continuously innovate and evolve our platform to stay ahead
                of emerging fraud threats and techniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Join Our Mission?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Be part of the global effort to combat fraud and protect businesses
            worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary">
              Get Started Today
            </Link>
            <Link href="/help" className="btn-secondary">
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
