import { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  Database,
  Radar,
  Users,
  Layers,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

import UniversalHero from "../../components/ui/UniversalHero";
import UniversalCTA from "@/components/ui/UniversalCTA";

export const metadata: Metadata = {
  title: "About Us - Fraud Scan | Leading Fraud Protection Platform",
  description:
    "Learn about Fraud Scan, the trusted fraud reporting and verification platform protecting businesses worldwide. Discover our mission, values, and commitment to fighting fraud.",
  keywords:
    "about fraud scan, fraud protection company, anti-fraud platform, business security, fraud prevention team",
  openGraph: {
    title: "About Us - Fraud Scan",
    description:
      "Learn about Fraud Scan, the trusted fraud reporting and verification platform protecting businesses worldwide.",
    url: "https://fraudscans.com/about",
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
        "Fraud Scan was established with a mission to combat fraud globally",
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
      <UniversalHero
        title="About Fraud Scan"
        description={
          "We're on a mission to create a safer digital world by empowering businesses and individuals to identify, report, and prevent fraudulent activities."
        }
      />

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT COLUMN: Mission and Value Propositions (Maintained Professional Look) */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 border-l-4 border-[#006d5b] pl-4 leading-tight">
                Our mission
              </h2>
              <p className="text-xl text-gray-700 mb-6 italic">
                "To build the world's most comprehensive and{" "}
                <span className="font-medium">
                  trusted fraud intelligence platform
                </span>{" "}
                , empowering businesses to secure their digital future."
              </p>
              <p className="text-lg text-gray-600 mb-10">
                We achieve this through relentless innovation and global
                collaboration, creating a safer digital ecosystem that benefits
                all our partners and users.
              </p>

              {/* Value Propositions: Thematic, Boxed, and Clear */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Innovation */}
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-secondary/10  border border-secondary hover:shadow-sm hover:shadow-secondary">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 mb-1">
                      Innovation
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Advanced AI/ML processing and analytics.
                    </p>
                  </div>
                </div>

                {/* Trust */}
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-secondary/10  border border-secondary hover:shadow-sm hover:shadow-secondary">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 mb-1">Trust</h3>
                    <p className="text-gray-600 text-sm">
                      Secure, compliant, and transparent operations.
                    </p>
                  </div>
                </div>

                {/* Collaboration */}
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-secondary/10  border border-secondary hover:shadow-sm hover:shadow-secondary">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 mb-1">
                      Collaboration
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Global community working together for shared defense.
                    </p>
                  </div>
                </div>

                {/* Impact */}
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-secondary/10  border border-secondary hover:shadow-sm hover:shadow-secondary">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 mb-1">
                      Impact
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Measurable fraud prevention results and value.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Vision and Metrics (PROFESSIONAL CARD STYLE) */}
            <div className="relative pt-8 mt-8">
              {/* The main card container - using slate/gray gradient for premium look */}
              <div
                className="relative aspect-[3/2] w-full max-w-lg mx-auto rounded-3xl p-8 shadow-2xl transition-transform duration-500 hover:scale-[1.03] cursor-pointer
              bg-gradient-to-br from-slate-800 to-gray-900 border border-slate-700/50"
              >
                {/* Card Title/Logo Spot */}
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-extrabold text-white uppercase tracking-widest">
                    Fraud Scan <span className="text-[#43d49d]">VISION</span>
                  </h3>
                  {/* Visual Accent: Brand Logo/Chip Icon */}
                  <ShieldCheck className="w-8 h-8 text-[#43d49d] transform rotate-12" />
                </div>

                {/* Vision Statement */}
                <p className="text-white/80 mb-6 text-lg font-medium">
                  Our vision is the elimination of digital fraud worldwide
                  through **collaborative intelligence**.
                </p>

                {/* Key Metric Card - Embedded for Security Look */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                    <span className="text-xs uppercase tracking-widest text-white/70 block mb-1">
                      Fraud Prevented
                    </span>
                    <div className="flex items-end justify-between">
                      <span className="text-4xl font-black text-white">
                        $1M+
                      </span>
                      {/* Visual: Progress Bar */}
                      <div className="w-1/3">
                        <div className="w-full bg-white/30 rounded-full h-2 mb-1">
                          <div
                            className="bg-[#43d49d] rounded-full h-2 shadow-inner"
                            style={{ width: "75%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Card Elements (like an RFID chip or hologram) */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-[#43d49d]/50 rounded-lg blur-sm opacity-50"></div>
                <div className="absolute top-6 right-6 w-16 h-8 bg-white/10 rounded-full blur-xs opacity-50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-[#DDE6F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Who We Are
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              FraudScans empowers organizations with real-time intelligence and
              advanced fraud-detection tools — built by global AML/CFT experts.
            </p>
          </div>

          {/* What We Do - Cards */}
          <div className="mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 border-l-4 border-[#006d5b] pl-4 leading-tight">What We Do</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-[#006d5b] transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#006d5b] to-[#43d49d] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-14 h-14 bg-[#006d5b]/10 rounded-lg group-hover:bg-[#006d5b] transition-colors duration-300 shrink-0">
                    <Layers className="w-7 h-7 text-[#006d5b] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      Comprehensive Fraud Database
                    </h4>
                    <p className="text-gray-600">
                      Updated intelligence on fraudulent entities and scam patterns.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-[#006d5b] transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#006d5b] to-[#43d49d] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-14 h-14 bg-[#006d5b]/10 rounded-lg group-hover:bg-[#006d5b] transition-colors duration-300 shrink-0">
                    <Radar className="w-7 h-7 text-[#006d5b] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      Advanced Screening Tools
                    </h4>
                    <p className="text-gray-600">
                      API-ready screening with automated monitoring and risk checks.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-[#006d5b] transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#006d5b] to-[#43d49d] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-14 h-14 bg-[#006d5b]/10 rounded-lg group-hover:bg-[#006d5b] transition-colors duration-300 shrink-0">
                    <ShieldCheck className="w-7 h-7 text-[#006d5b] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      Fraud Intelligence Hub
                    </h4>
                    <p className="text-gray-600">
                      Alerts, trends, and proactive intelligence to stay ahead.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us - Card */}
          <div className="bg-[#006d5b] p-10 md:p-12 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
            <h3 className="text-2xl md:text-3xl font-bold mb-10">Why Choose Us?</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 hover:translate-x-1 cursor-default">
                <p className="text-white/95 font-medium">Trusted by global compliance teams.</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 hover:translate-x-1 cursor-default">
                <p className="text-white/95 font-medium">Built on proven AML/CFT frameworks.</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 hover:translate-x-1 cursor-default">
                <p className="text-white/95 font-medium">Scalable for startups & enterprises.</p>
              </div>
            </div>
            <div className="pt-8 border-t border-white/20">
              <p className="text-[#FFC21A] text-lg md:text-xl italic mb-8 font-medium">
                "Speed, accuracy, and security for modern fintechs."
              </p>
              <Link
                href={"/signup"}
                className="inline-block px-8 py-3 bg-white text-[#006d5b] font-semibold rounded-lg hover:bg-[#FFC21A] hover:text-white transform hover:scale-105 transition-all duration-300 shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-primary/80">
        {/* Glow Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
              Our Values
            </h2>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              These core values guide everything we do and shape the way we
              serve our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Security First */}
            <div className="text-center p-8 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 hover:scale-[1.03] transition-all duration-300">
              <div className="w-20 h-20 bg-[#ffc21a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-10 h-10"
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
              <h3 className="text-2xl font-bold mb-3">Security First</h3>
              <p className="text-blue-100 leading-relaxed">
                We prioritize the security and privacy of our users' data above
                all else, implementing industry‑leading protection.
              </p>
            </div>

            {/* Community Driven */}
            <div className="text-center p-8 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 hover:scale-[1.03] transition-all duration-300">
              <div className="w-20 h-20 bg-[#ffc21a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-10 h-10"
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
              <h3 className="text-2xl font-bold mb-3">Community Driven</h3>
              <p className="text-blue-100 leading-relaxed">
                We believe in the power of collaboration to build stronger,
                safer systems and protect people everywhere.
              </p>
            </div>

            {/* Innovation */}
            <div className="text-center p-8 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 hover:scale-[1.03] transition-all duration-300">
              <div className="w-20 h-20 bg-[#ffc21a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-10 h-10"
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
              <h3 className="text-2xl font-bold mb-3">Innovation</h3>
              <p className="text-blue-100 leading-relaxed">
                We constantly evolve, pushing boundaries to stay ahead of
                emerging threats and new challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <UniversalCTA
        title={"Ready to Join Our Mission?"}
        description={
          "Fraud doesn’t wait—and neither should you. Partner with FraudScans today to strengthen your fraud defenses."
        }
        cta1={" Get Started Today"}
        cta2={"Contact Our Team"}
        cta1Href={"/signup"}
        cta2Href={"/help"}
      />
    </div>
  );
}
