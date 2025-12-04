import Link from "next/link";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import UniversalCTA from "@/components/ui/UniversalCTA";
import {
  ChartSpline,
  CircleCheck,
  Lock,
  LockIcon,
  ShieldCheck,
  TriangleAlert,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#1c2736] py-24 md:py-36">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_35%] gap-12 items-center">
            {/* Left: Text */}
            <div className="">
              <div className="inline-flex items-center px-6 py-2 rounded-full bg-[#006d5b]/10 text-[#43d49d] text-sm font-medium mb-6 border border-[#006d5b]/20">
                Trusted by businesses worldwide
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-white mb-4">
                Protect Your Business from <span className="">Fraud</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
                Comprehensive fraud reporting, verification, and intelligence
                platform helping businesses identify and prevent fraudulent
                activities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/report-fraud"
                  className="btn-primary text-base px-6 py-3"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Report Fraud Now
                  </span>
                </Link>
                <Link
                  href="/about"
                  className="border border-gray-200 text-gray-200 hover:bg-gray-500 hover:border-gray-500 hover:text-white rounded-full  text-base px-6 py-3"
                >
                  <span className="flex items-center justify-center">
                    Learn More
                  </span>
                </Link>
              </div>

              {/* Trust Indicators - Removed per client request */}
            </div>

            {/* Right: Framed Image with offset green backdrop */}
            <div className="relative">
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#43d49d] opacity-100"></div>
              <div className="relative  overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                <img
                  src="https://onlinedegrees.sandiego.edu/wp-content/uploads/2020/08/USD-Cyber-Entry-Level-Job-Career-Guide-1-1-1.jpeg"
                  alt="Professional working on a laptop"
                  className="w-full h-[300px] md:h-[380px] object-cover"
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
            <div className="p-6 bg-secondary/10 rounded-xl border border-secondary hover:shadow-sm hover:shadow-secondary">
              <div className="text-4xl font-bold text-[#43d49d] mb-2">
                <AnimatedCounter end={150000} suffix="+" />
              </div>
              <p className="text-gray-600">Fraud Reports Processed</p>
            </div>
            <div className="p-6 bg-secondary/10 rounded-xl border border-secondary hover:shadow-sm hover:shadow-secondary">
              <div className="text-4xl font-bold text-[#43d49d] mb-2">
                <AnimatedCounter end={100} suffix="+" />
              </div>
              <p className="text-gray-600">Businesses Protected</p>
            </div>
            <div className="p-6 bg-secondary/10 rounded-xl border border-secondary hover:shadow-sm hover:shadow-secondary">
              <div className="text-4xl font-bold text-[#43d49d] mb-2">
                <AnimatedCounter end={95} suffix="%" />
              </div>
              <p className="text-gray-600">Detection Accuracy</p>
            </div>
            <div className="p-6 bg-secondary/10 rounded-xl border border-secondary hover:shadow-sm hover:shadow-secondary">
              <div className="text-4xl font-bold text-[#43d49d] mb-2">
                $<AnimatedCounter end={10} suffix="M+" />
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
            <div className="bg-transparent p-8 rounded-xl  group">
              <div className="w-16 h-16 bg-[#FFC21A] rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary transition-all duration-300 ease-in-out">
                <ShieldCheck
                  strokeWidth={0.5}
                  className="text-gray-700 h-12 w-12"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 ">
                Real-time Verification
              </h3>
              <p className="text-gray-600 text-lg ">
                Instantly verify the authenticity of businesses, individuals,
                and transactions with our comprehensive database.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-transparent p-8 rounded-xl  group">
              <div className="w-16 h-16 bg-[#FFC21A] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#43d49d] transition-all duration-300 ease-in-out">
                <Lock strokeWidth={0.5} className="text-gray-700 h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Secure Reporting
              </h3>
              <p className="text-gray-600 text-lg ">
                Report fraudulent activities securely with our encrypted
                platform that protects your identity and data.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-transparent p-8 rounded-xl  group">
              <div className="w-16 h-16 bg-[#FFC21A] rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary transition-all duration-300 ease-in-out">
                <CircleCheck
                  strokeWidth={0.5}
                  className="text-gray-900 h-12 w-12"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Expert Verification
              </h3>
              <p className="text-gray-600 text-lg ">
                Our team of fraud experts thoroughly reviews and verifies all
                reports to ensure accuracy and reliability of our database.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-transparent p-8 rounded-xl  group">
              <div className="w-16 h-16 bg-[#FFC21A] rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary transition-all duration-300 ease-in-out">
                <Users strokeWidth={0.5} className="text-gray-700 h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Global Network
              </h3>
              <p className="text-gray-600 text-lg ">
                Access a worldwide network of fraud intelligence shared by
                businesses and organizations globally.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-transparent p-8 rounded-xl  group">
              <div className="w-16 h-16 bg-[#FFC21A] rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary transition-all duration-300 ease-in-out">
                <TriangleAlert
                  strokeWidth={0.5}
                  className="text-gray-700 h-12 w-12"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Risk Assessment
              </h3>
              <p className="text-gray-600 text-lg ">
                Get detailed risk assessments and fraud probability scores to
                make informed business decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <UniversalCTA
        title={" Ready to Protect Your Business?"}
        description={
          "Join thousands of businesses using Fraud Scan to prevent fraud and protect their operations."
        }
        cta1={"Start Free Trial"}
        cta2={"Enterprise Solutions"}
        cta1Href={"/signup"}
        cta2Href={"/enterprise"}
      />
    </>
  );
}
