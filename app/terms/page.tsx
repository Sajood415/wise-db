"use client";

import UniversalHero from "@/components/ui/UniversalHero";

export default function TermsOfServicePage() {
  const sections = [
    {
      id: "about",
      title: "1. About Us",
      content:
        "FraudScans ('we', 'us', 'our') operates fraudscans.com, a platform for fraud reporting, verification, and fraud intelligence sharing to help businesses and individuals identify, prevent, and respond to fraudulent activity (the 'Services'). (See site descriptions of reporting, expert review, database updates, and intelligence sharing).",
    },
    {
      id: "acceptance",
      title: "2. Acceptance of Terms",
      content:
        "By accessing or using Site or Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, do not use Site.",
    },
    {
      id: "eligibility",
      title: "3. Eligibility",
      content:
        "You warrant that you are at least 18 years old and have authority to submit reports, evidence, or verification requests. Organisations warrant their authorised users act within their mandate.",
    },
    {
      id: "services",
      title: "4. Services Overview",
      content: null,
      subItems: [
        "Fraud Reporting: Users can submit fraud reports (including evidence). Anonymous reporting is available; however, certain features may require registration.",
        "Verification & Search: Registered users may query our database for real-time verification and risk indicators.",
        "Expert Review: High-risk or impactful reports are reviewed by our fraud team before inclusion in global database.",
        "Fraud Intelligence Sharing: Verified intelligence may be shared with businesses and organisations worldwide to help prevent similar conduct, subject to privacy and legal safeguards.",
        "We may update, enhance, or discontinue parts of Services. Availability and response times are not guaranteed.",
      ],
    },
    {
      id: "responsibilities",
      title: "5. User Responsibilities",
      content: "You agree to:",
      subItems: [
        "Provide information that is accurate, lawful, and not misleading.",
        "Avoid submitting malicious, defamatory, or privacy-invasive content without a proper basis.",
        "Not submit content that infringes intellectual property or violates court orders.",
        "Use Services in compliance with applicable laws.",
      ],
    },
    {
      id: "content",
      title: "6. Content Standards & Takedown",
      content:
        "We may decline, edit, or remove reports that (a) lack evidential basis, (b) risk harm without public interest, or (c) violate these Terms. We operate internal review and takedown/appeal channels for contested entries.",
    },
    {
      id: "licence",
      title: "7. Your Licence to Us",
      content:
        "You grant us a worldwide, non-exclusive, royalty-free licence to host, store, review, and disseminate your submitted content as part of our Services, including to share de-identified or summarised intelligence where appropriate.",
    },
    {
      id: "intellectual",
      title: "8. Our Intellectual Property",
      content:
        "All software, databases, algorithms, text, graphics, logos, and compilations on Site are our property or licensed to us. You may not copy, modify, reverse engineer, or use Site content beyond Services' intended purpose without written permission.",
    },
    {
      id: "privacy",
      title: "9. Privacy & Data Protection (NZ Privacy Act 2020)",
      content:
        "We comply with New Zealand Privacy Act 2020 and Information Privacy Principles (IPPs). Personal information is collected and handled in accordance with our Privacy Policy and Act.",
      subItems: [
        {
          title: "9.1 Sharing of Fraud Reports",
          content:
            "When you report suspected fraud through our platform, you acknowledge and agree that we may share information you provide—including details of fraud, supporting evidence, and relevant identifiers—with trusted partners, fraud prevention networks, and authorities, including those located outside New Zealand. We only share this information for purpose of preventing, detecting, and responding to fraudulent activity.",
        },
        {
          title: "9.2 Security",
          content:
            "We employ organisational, technical, and administrative measures to protect personal information against unauthorised access, alteration, or disclosure.",
        },
        {
          title: "9.3 Rights & Contact",
          content:
            "You may request access, correction, or raise concerns via our contact page (see Site footer). We will respond in accordance with Privacy Act.",
        },
      ],
    },
    {
      id: "evidence",
      title: "10. Evidence Handling & Legal Requests",
      content:
        "We may preserve, disclose, or restrict access to content when required by law, court order, or to protect individuals from harm. We may provide de-identified datasets for research/analytics.",
    },
    {
      id: "prohibited",
      title: "11. Prohibited Uses",
      content: "You must not use Site to:",
      subItems: [
        "Harass, defame, or target individuals without reasonable grounds.",
        "Submit malware, attempt to breach security, or perform automated scraping beyond permitted API/exports.",
        "Misrepresent identity or authority when reporting.",
      ],
    },
    {
      id: "disclaimers",
      title: "12. Accuracy, Disclaimers & No Professional Advice",
      content:
        "Fraud reports and risk scores may contain errors despite our review processes. The Services provide intelligence, not legal or financial advice. Decisions should be independently assessed.",
    },
    {
      id: "liability",
      title: "13. Limitation of Liability",
      content:
        "To the fullest extent permitted by law, we exclude liability for indirect, incidental, consequential, special, exemplary damages, or lost profits arising from use of Site or reliance on intelligence.",
    },
    {
      id: "indemnity",
      title: "14. Indemnity",
      content:
        "You agree to indemnify us against claims, losses, liabilities, and costs arising from (a) your content, (b) your breach of these Terms, or (c) misuse of Services.",
    },
    {
      id: "third-party",
      title: "15. Third-Party Links & Resources",
      content:
        "The Site may link to authorities and resources about fraud prevention. We are not responsible for third-party content or policies. (The Site focuses on fraud awareness and reporting; e.g., global guidance resources.)",
    },
    {
      id: "suspension",
      title: "16. Suspension & Termination",
      content:
        "We may suspend or terminate accounts/reports that violate these Terms or pose risk to others or platform.",
    },
    {
      id: "changes",
      title: "17. Changes to Terms",
      content:
        "We may update these Terms from time to time. Continued use after posting changes constitutes acceptance. The 'Last updated' date will reflect the latest version.",
    },
    {
      id: "contact",
      title: "18. Contact",
      content:
        "Questions about these Terms or privacy practices? Contact us via Contact page in Site footer.",
    },
  ];

  return (
    <>
      <UniversalHero
        title="Terms and Conditions"
        description="Please read these terms carefully before using our platform."
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header Info */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                FraudScans – Terms and Conditions
              </h1>
              <p className="text-gray-600">Last updated: 5 January 2026</p>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <div className="space-y-12">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-4"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                    {section.title}
                  </h2>

                  <div className="space-y-4">
                    {section.content && (
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {section.content}
                      </p>
                    )}

                    {section.subItems && (
                      <div className="space-y-4">
                        {section.subItems.map((item, index) => (
                          <div key={index} className="ml-4">
                            {typeof item === "object" ? (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  {item.title}
                                </h4>
                                <p className="text-gray-700 leading-relaxed">
                                  {item.content}
                                </p>
                              </div>
                            ) : (
                              <div className="flex items-start">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 shrink-0"></div>
                                <p className="text-gray-700 leading-relaxed">
                                  {item}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>

            {/* Footer Note */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Need Help?
                </h3>
                <p className="text-blue-800">
                  If you have any questions about these Terms and Conditions or
                  our privacy practices, please don't hesitate to contact us
                  through the contact page in the site footer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
