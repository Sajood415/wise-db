import { Metadata } from "next";
import EnterpriseForm from "./EnterpriseForm";
import VerifyOnSuccess from "./VerifyOnSuccess";
import PaymentToast from "./payment-toast";

export const metadata: Metadata = {
  title: "Enterprise Solutions - Wise DB | Custom Fraud Protection",
  description:
    "Get enterprise-grade fraud protection with custom API access, dedicated support, and scalable solutions for your business needs.",
  keywords:
    "enterprise fraud protection, API access, bulk fraud verification, business solutions, custom fraud detection",
  openGraph: {
    title: "Enterprise Solutions - Wise DB | Custom Fraud Protection",
    description:
      "Enterprise-grade fraud protection solutions with API access and dedicated support.",
    url: "https://wisedb.com/enterprise",
    type: "website",
  },
};

export default async function Enterprise({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await searchParams
  const payment = (sp?.payment as string) || ''
  const sessionId = (sp?.session_id as string) || ''
  if (payment === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful</h1>
            <p className="mt-2 text-gray-600">Thank you. Our team will reach out shortly with next steps.</p>
            {sessionId ? <VerifyOnSuccess sessionId={sessionId} /> : null}
            <div className="mt-6 flex items-center justify-center gap-3">
              <a href="/" className="px-4 py-2 rounded-md bg-gray-900 text-white">Go to Home</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PaymentToast />
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enterprise <span className="gradient-text">Solutions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scale your fraud protection with enterprise-grade solutions, API
            access, and dedicated support tailored to your business needs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l3 3-3 3m13 0H3"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              API Access
            </h3>
            <p className="text-gray-600">
              RESTful API for seamless integration with your existing systems
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 3a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Multi-User Access
            </h3>
            <p className="text-gray-600">
              Manage multiple team members with role-based permissions
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              24/7 Support
            </h3>
            <p className="text-gray-600">
              Dedicated support team with guaranteed response times
            </p>
          </div>
        </div>

        <EnterpriseForm />
      </div>
    </div>
  );
}
