export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Fraud Scan, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                Fraud Scan provides a platform for fraud reporting and database access. Our services include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Fraud incident reporting and submission</li>
                <li>Access to fraud database for verification purposes</li>
                <li>Enterprise API access for business integration</li>
                <li>User management and workspace features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                As a user of our platform, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and truthful information</li>
                <li>Not submit false or malicious reports</li>
                <li>Respect the privacy and rights of others</li>
                <li>Use the service only for lawful purposes</li>
                <li>Maintain the security of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Fraud Report Guidelines</h2>
              <p className="text-gray-700 mb-4">
                When submitting fraud reports, you must:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide factual information only</li>
                <li>Include relevant evidence when available</li>
                <li>Not include personal information of innocent parties</li>
                <li>Report incidents that occurred to you or your organization</li>
                <li>Not use the platform for harassment or defamation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Usage and Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your use of our service is also governed by our Privacy Policy. By using our service, you consent to the collection and use of information as detailed in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Service Limitations</h2>
              <p className="text-gray-700 mb-4">
                We strive to provide reliable service but cannot guarantee:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Uninterrupted or error-free service</li>
                <li>Complete accuracy of all information in our database</li>
                <li>Immediate response to all reports or inquiries</li>
                <li>Availability of all features at all times</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and access to our services at any time, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users or the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-700">
                Email: legal@fraudscans.com<br />
                Address: [Your Company Address]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
