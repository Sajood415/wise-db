export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      {/* Header Section */}
      <div className="bg-primary py-20 shadow-lg">
        <h1 className="text-center text-4xl font-bold text-white tracking-wide">
          Terms of Service
        </h1>
        <p className="text-center text-blue-100 mt-3 text-lg">
          Please read these terms carefully before using our platform.
        </p>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-6 -mt-12">
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
          <div className="space-y-10">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using the Fraud Scan platform, you agree to
                comply with and be bound by these Terms of Service. If you do
                not agree, you must discontinue use of our services.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                2. Description of Service
              </h2>
              <p className="text-gray-700 mb-4">
                Fraud Scan provides tools and resources for fraud reporting,
                research, and verification. Our services include:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Fraud incident reporting and submissions",
                  "Access to a fraud database for verification",
                  "Enterprise-level API access",
                  "User management & workspace tools",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-secondary/10 border border-secondary/40 rounded-xl text-gray-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                3. User Responsibilities
              </h2>
              <p className="text-gray-700 mb-4">
                By using our platform, you agree to:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Provide accurate and truthful information</li>
                <li>Not submit false, misleading, or harmful reports</li>
                <li>Respect the privacy and rights of all individuals</li>
                <li>Use the service only for lawful purposes</li>
                <li>Maintain the security of your account</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                4. Fraud Report Guidelines
              </h2>
              <p className="text-gray-700 mb-4">
                When submitting fraud reports, you must ensure that:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>All submitted information is factual</li>
                <li>Relevant evidence is included when available</li>
                <li>No personal data of uninvolved individuals is included</li>
                <li>
                  You report only incidents related to you or your organization
                </li>
                <li>The platform is not used for harassment or defamation</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                5. Data Usage & Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your use of the platform is also governed by our Privacy Policy.
                By using our services, you consent to the data collection,
                processing, and storage outlined in the Privacy Policy.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                6. Service Limitations
              </h2>
              <p className="text-gray-700 mb-4">
                While we strive to provide a reliable experience, we do not
                guarantee:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Uninterrupted or error-free service</li>
                <li>Absolute accuracy of all database information</li>
                <li>Immediate review of submitted reports</li>
                <li>Availability of all features at all times</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                7. Termination
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your account at any
                time if we believe your actions violate these Terms of Service
                or cause harm to our users or platform.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                8. Contact Information
              </h2>
              <p className="text-gray-700 mb-4">
                If you have questions or concerns about these Terms of Service,
                you can reach us at:
              </p>
              <div className="bg-secondary/10 p-5 rounded-xl border border-secondary/40 text-gray-700">
                <p>
                  <strong>Email:</strong> legal@fraudscans.com
                </p>
                <p>
                  <strong>Address:</strong> [Your Company Address]
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
