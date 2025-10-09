import Link from "next/link";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#1c2736] py-24">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center px-6 py-2 rounded-full bg-[#006d5b]/10 text-[#43d49d] text-sm font-medium mb-6 border border-[#006d5b]/20">
                Trusted by 10,000+ businesses worldwide
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                Protect Your Business from <span className="gradient-text">Fraud</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
                Comprehensive fraud reporting, verification, and intelligence platform helping businesses identify and prevent fraudulent activities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/report-fraud" className="btn-primary text-base px-6 py-3">
                  <span className="relative z-10 flex items-center justify-center">Report Fraud Now</span>
                </Link>
                <Link href="/about" className="btn-secondary text-base px-6 py-3">
                  <span className="flex items-center justify-center">Learn More</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 flex flex-wrap items-center gap-4 text-slate-400">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10">
                  <div className="w-6 h-6 bg-[#006d5b] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10">
                  <div className="w-6 h-6 bg-[#006d5b] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">GDPR Ready</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10">
                  <div className="w-6 h-6 bg-[#006d5b] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">99.9% Uptime</span>
                </div>
              </div>
            </div>

            {/* Right: Framed Image with offset green backdrop */}
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#43d49d] opacity-100"></div>
              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                <img
                  src="https://onlinedegrees.sandiego.edu/wp-content/uploads/2020/08/USD-Cyber-Entry-Level-Job-Career-Guide-1-1-1.jpeg"
                  alt="Professional working on a laptop"
                  className="w-full h-[360px] md:h-[460px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-[#43d49d] mb-2">
                <AnimatedCounter end={150000} suffix="+" />
              </div>
              <p className="text-gray-600">Fraud Reports Processed</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#43d49d] mb-2">
                <AnimatedCounter end={10000} suffix="+" />
              </div>
              <p className="text-gray-600">Businesses Protected</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#43d49d] mb-2">
                <AnimatedCounter end={95} suffix="%" />
              </div>
              <p className="text-gray-600">Detection Accuracy</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#43d49d] mb-2">
                $<AnimatedCounter end={50} suffix="M+" />
              </div>
              <p className="text-gray-600">Fraud Prevented</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Fraud Protection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides multiple layers of protection to help you
              identify, report, and prevent fraudulent activities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-[#006d5b]/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-[#006d5b]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Real-time Verification
              </h3>
              <p className="text-gray-600">
                Instantly verify the authenticity of businesses, individuals,
                and transactions with our comprehensive database.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-[#006d5b]/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-[#006d5b]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Secure Reporting
              </h3>
              <p className="text-gray-600">
                Report fraudulent activities securely with our encrypted
                platform that protects your identity and data.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-[#006d5b]/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-[#006d5b]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Expert Verification
              </h3>
              <p className="text-gray-600">
                Our team of fraud experts thoroughly reviews and verifies all
                reports to ensure accuracy and reliability of our database.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-[#006d5b]/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-[#006d5b]"
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Global Network
              </h3>
              <p className="text-gray-600">
                Access a worldwide network of fraud intelligence shared by
                businesses and organizations globally.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-[#006d5b]/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-[#006d5b]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.118 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Risk Assessment
              </h3>
              <p className="text-gray-600">
                Get detailed risk assessments and fraud probability scores to
                make informed business decisions.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-[#006d5b]/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-[#006d5b]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Analytics Dashboard
              </h3>
              <p className="text-gray-600">
                Monitor fraud trends, generate reports, and track your
                protection metrics with comprehensive analytics.
              </p>
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
            Join thousands of businesses using Fraud Scan to prevent fraud and
            protect their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-[#006d5b] hover:bg-[#d7f6ea] font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-sm"
            >
              Start Free Trial
            </Link>
            <Link
              href="/enterprise"
              className="border-2 border-white text-white hover:bg-white hover:text-[#006d5b] font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Enterprise Solutions
            </Link>
          </div>
    </div>
      </section>
    </>
  );
}
