import { Metadata } from "next";
import HelpForm from "./HelpForm";

export const metadata: Metadata = {
  title: "Help Center - Fraud Scan | Support & Assistance",
  description:
    "Get help with Fraud Scan fraud protection platform. Contact our support team for assistance with reporting fraud, using our services, and technical support.",
  keywords:
    "help center, customer support, fraud reporting help, technical support, contact support, fraud scan assistance",
  openGraph: {
    title: "Help Center - Fraud Scan | Support & Assistance",
    description:
      "Get expert help with fraud reporting and platform assistance.",
    url: "https://fraudscans.com/help",
    type: "website",
  },
};

export default function Help() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-5xl  mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Help <span className="text-gray-900">Center</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Need assistance? Our support team is here to help you with fraud
            reporting, database searches, platform features, and any questions you may have.
          </p>
        </div>

        {/* Quick Help Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "FAQ",
              description: "Find answers to commonly asked questions about fraud reporting and database searches",
              icon: (
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
              bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
              borderColor: "border-blue-200",
              hoverBorder: "hover:border-blue-400",
            },
            {
              title: "Support Guides",
              description: "Learn how to report fraud, search the database, and use platform features",
              icon: (
                <svg
                  className="w-7 h-7 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              ),
              bgColor: "bg-gradient-to-br from-green-50 to-green-100",
              borderColor: "border-green-200",
              hoverBorder: "hover:border-green-400",
            },
            {
              title: "Direct Contact",
              description: "Reach out to our support team for personalized assistance",
              icon: (
                <svg
                  className="w-7 h-7 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              ),
              bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
              borderColor: "border-purple-200",
              hoverBorder: "hover:border-purple-400",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`bg-white p-8 rounded-2xl border-2 ${item.borderColor} ${item.hoverBorder} shadow-md hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-1`}
            >
              <div
                className={`w-16 h-16 ${item.bgColor} rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Help Form */}
        <div className="mb-16">
          <HelpForm />
        </div>

        {/* Additional Help Info */}
        <div className="mt-12 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 p-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
            Other Ways to Get Help
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Response Times
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-100">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shrink-0"></span>
                  <span className="text-gray-700">
                    <span className="font-semibold text-gray-900">General inquiries:</span> 24-48 hours
                  </span>
                </li>
                <li className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shrink-0"></span>
                  <span className="text-gray-700">
                    <span className="font-semibold text-gray-900">Technical issues:</span> 12-24 hours
                  </span>
                </li>
                <li className="flex items-center gap-4 p-3 bg-red-50 rounded-lg border border-red-100">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shrink-0"></span>
                  <span className="text-gray-700">
                    <span className="font-semibold text-gray-900">Urgent matters:</span> 2-4 hours
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
                What to Include
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 shrink-0"></span>
                  <span className="text-gray-700 leading-relaxed">Detailed description of your issue or question</span>
                </li>
                <li className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 shrink-0"></span>
                  <span className="text-gray-700 leading-relaxed">Steps to reproduce (if applicable)</span>
                </li>
                <li className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 shrink-0"></span>
                  <span className="text-gray-700 leading-relaxed">Screenshots or error messages</span>
                </li>
                <li className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 shrink-0"></span>
                  <span className="text-gray-700 leading-relaxed">Your account email (if applicable)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
