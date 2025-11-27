import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    company: {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "How It Works", href: "/how-it-works" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Contact", href: "/help" },
      ],
    },
    services: {
      title: "Services",
      links: [
        { name: "Report Fraud", href: "/report-fraud" },
        { name: "Enterprise Solutions", href: "/enterprise" },
      ],
    },
    support: {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" }
      ],
    },
  };

  return (
    <footer className="bg-[#1c2736] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#006d5b]">
                <span className="text-white font-bold text-sm">FS</span>
              </div>
              <span className="text-xl font-bold">Fraud Scan</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Protecting businesses and individuals from fraud through
              comprehensive reporting and verification services.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons - Keep only LinkedIn */}
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {currentYear} Fraud Scan. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
