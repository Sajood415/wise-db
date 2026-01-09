export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header Section */}
      <div className="bg-primary py-20 shadow-lg">
        <h1 className="text-center text-4xl font-bold text-white tracking-wide">
          Privacy Policy
        </h1>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
          <div className="space-y-10">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                1. Information We Collect
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We collect information you provide directly to us, such as when
                you create an account, submit fraud reports, or contact support.
              </p>
              <ul className="space-y-2 text-gray-700 pl-5 list-disc">
                <li>Account information (name, email, phone number)</li>
                <li>Fraud report details and uploaded evidence</li>
                <li>Search queries and platform activity logs</li>
                <li>Communication and support history</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Your information is used to operate and improve our platform.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Provide and maintain our fraud reporting services",
                  "Investigate and process fraud reports",
                  "Maintain our fraud database for public safety",
                  "Send important updates and alerts",
                  "Enhance platform features and user experience",
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
                3. Information Sharing
              </h2>
              <p className="text-gray-700 mb-4">
                We do not sell or trade your personal data. We may share
                information only:
              </p>

              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>With law enforcement when required by law</li>
                <li>To prevent fraudulent or harmful activities</li>
                <li>With your explicit consent</li>
                <li>To protect our rights, safety, and system integrity</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                4. Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We implement strong security measures—including encryption,
                access controls, and monitoring—to safeguard your information
                against unauthorized access or misuse.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                5. Your Rights
              </h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate or outdated information</li>
                <li>Request deletion of your data</li>
                <li>Opt out of non-essential communications</li>
                <li>Export your personal data</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                6. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                For questions regarding this Privacy Policy, please contact:
              </p>

              <div className="bg-secondary/10 p-5 rounded-xl border border-secondary/40 text-gray-700">
                <p>
                  <strong>Email:</strong> privacy@fraudscans.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
