"use client";

import {
  Building2,
  Search,
  Shield,
  ShoppingCart,
  Landmark,
  Hospital,
  Home,
  Cpu,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";
import UniversalHero from "@/components/ui/UniversalHero";
import UniversalCTA from "@/components/ui/UniversalCTA";

// --- ICON MAPS ---
const serviceIcons = {
  search: Search,
  shield: Shield,
  building: Building2,
} as const;

const industryIcons = {
  cart: ShoppingCart,
  bank: Landmark,
  health: Hospital,
  home: Home,
  tech: Cpu,
  education: GraduationCap,
} as const;

// --- TYPES ---
type ServiceIconKey = keyof typeof serviceIcons;
type IndustryIconKey = keyof typeof industryIcons;

interface Service {
  id: string;
  title: string;
  description: string;
  icon: ServiceIconKey;
  features: string[];
}

interface Industry {
  name: string;
  description: string;
  icon: IndustryIconKey;
  useCases: string[];
}

// --- DATA ---
const services: Service[] = [
  {
    id: "search",
    title: "Search Database",
    description:
      "Individuals can search our fraud database to check businesses, identities, emails, phones and websites.",
    icon: "search",
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
    icon: "shield",
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
    icon: "building",
    features: [
      "REST API access to the fraud database",
      "Team management (admins and members)",
      "Role-based access and usage controls",
      "Centralized workspace for searches and reports",
    ],
  },
];

const industries: Industry[] = [
  {
    name: "E-commerce",
    description:
      "Search our fraud database before processing orders or engaging with new customers to verify if emails, phones, or businesses have been reported for fraud.",
    icon: "cart",
    useCases: [
      "Verify customer emails",
      "Check suppliers and partners",
      "Report fraudulent transactions",
    ],
  },
  {
    name: "Financial Services",
    description:
      "Search reported fraud cases to verify identities, check suspicious contacts, and research potential fraudsters before engaging in transactions.",
    icon: "bank",
    useCases: [
      "Verify client contacts",
      "Check partners before transactions",
      "Research financial scams",
    ],
  },
  {
    name: "Healthcare",
    description:
      "Search for reported fraud cases involving healthcare providers, insurance claims, or medical service providers before engaging with them.",
    icon: "health",
    useCases: [
      "Verify healthcare providers",
      "Check insurance fraud reports",
      "Report medical billing fraud",
    ],
  },
  {
    name: "Real Estate",
    description:
      "Search our database to verify if real estate agents, property sellers, or rental contacts have been reported for fraud or scams.",
    icon: "home",
    useCases: [
      "Verify real estate agents",
      "Check property sellers",
      "Report property scams",
    ],
  },
  {
    name: "Technology",
    description:
      "Integrate our fraud database via API to check user emails, phone numbers, or business contacts against reported fraud cases in your systems.",
    icon: "tech",
    useCases: [
      "API user verification",
      "Check partners before partnerships",
      "Report phishing scams",
    ],
  },
  {
    name: "Education",
    description:
      "Search for reported fraud cases involving educational institutions, credential providers, or student services before engaging with them.",
    icon: "education",
    useCases: [
      "Verify education providers",
      "Check credential services",
      "Report academic fraud",
    ],
  },
];

// --- COMPONENT ---
export default function Services() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <UniversalHero
        title={"Comprehensive Fraud Protection Services"}
        gradientText={""}
        afterText={""}
        description={
          " Search verified fraud reports, submit incidents securely, and integrate our database directly into your business systems."
        }
        badgeText={""}
      />

      {/* SERVICES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 bg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
              Choose from our comprehensive range of fraud prevention and
              verification services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {services.map((service) => {
              const Icon = serviceIcons[service.icon];
              return (
                <div
                  key={service.id}
                  className="p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#006d5b] transition-all bg-secondary/5"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-[#006d5b] flex-shrink-0">
                      <Icon className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#006d5b]" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black">
              Industries We Serve
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mt-4">
              We empower businesses across multiple sectors with
              industry-specific fraud prevention solutions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {industries.map((industry) => {
              const Icon = industryIcons[industry.icon];
              return (
                <div
                  key={industry.name}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-200"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="text-[#006d5b] flex-shrink-0">
                      <Icon className="w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {industry.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{industry.description}</p>
                  <h4 className="text-gray-900 font-semibold mb-3">
                    Common Use Cases
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {industry.useCases.map((u, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm rounded-full bg-[#006d5b]/10 text-[#006d5b]"
                      >
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* API SECTION */}
      <section className="py-24 bg-gradient-to-r from-[#1c2736] to-[#006d5b] text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Developer-Friendly API
            </h2>
            <p className="text-lg text-[#d7f6ea] mb-10">
              Integrate fraud protection into your apps with our secure REST
              API, complete documentation, and SDKs.
            </p>
            <ul className="space-y-4 text-lg">
              {[
                "RESTful API with full documentation",
                "99.9% uptime SLA guarantee",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#43d49d] w-6 h-6" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/api-docs"
              className="inline-block mt-10 bg-[#FABE19] hover:text-white hover:bg-gray-500 text-gray-900 font-semibold px-6 py-3 rounded-full  transition"
            >
              View API Docs
            </Link>
          </div>
          <div className="bg-[#0f1520] rounded-xl p-6 border border-white/10">
            <p className="text-sm text-gray-400 mb-2">Example Request</p>
            <pre className="text-green-400 text-sm whitespace-pre-wrap break-words">
              {`curl -X GET "https://api.fraudscans.com/api/external/frauds?email=business@example.com&limit=20" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
            </pre>
            <p className="text-sm text-gray-400 mt-6 mb-2">Response</p>
            <pre className="text-[#d7f6ea] text-sm whitespace-pre-wrap break-words">
              {`{
  "items": [
    {
      "name": "John Doe",
      "email": "business@example.com",
      "phone": "+1234567890"
    }
  ],
  "remaining": 499
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* CTA */}
      <UniversalCTA
        title={" Ready to Protect Your Business?"}
        description={
          "Start with a free trial and explore our complete fraud protection platform."
        }
        cta1={"Start Free Trial"}
        cta2={" Schedule Consultation"}
        cta1Href={"/signup"}
        cta2Href={"/help"}
      />
    </div>
  );
}
