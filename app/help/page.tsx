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
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Help <span className="gradient-text">Center</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Need assistance? Our support team is here to help you with fraud
            reporting, platform features, and any questions you may have.
          </p>
        </div>

        {/* Quick Help Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "FAQ",
              description: "Find answers to commonly asked questions",
              icon: (
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
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
              bgColor: "bg-blue-50",
            },
            {
              title: "Documentation",
              description: "Detailed guides and tutorials",
              icon: (
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              ),
              bgColor: "bg-green-50",
            },
            {
              title: "Direct Contact",
              description: "Reach out to our support team",
              icon: (
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              ),
              bgColor: "bg-purple-50",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <div
                className={`w-14 h-14 ${item.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Help Form */}
        <div className="mb-16">
          <HelpForm />
        </div>

        {/* Additional Help Info */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Other Ways to Get Help
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Response Times
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  General inquiries: 24-48 hours
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  Technical issues: 12-24 hours
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  Urgent matters: 2-4 hours
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                What to Include
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="w-3 h-3 bg-gray-400 rounded-full mt-1"></span>
                  Detailed description of the issue
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-3 h-3 bg-gray-400 rounded-full mt-1"></span>
                  Steps to reproduce the problem
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-3 h-3 bg-gray-400 rounded-full mt-1"></span>
                  Screenshots or error messages
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-3 h-3 bg-gray-400 rounded-full mt-1"></span>
                  Your account information (if applicable)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
