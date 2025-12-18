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
      links: [{ name: "Help Center", href: "/help" }],
    },
  };

  return (
    <footer className="bg-gradient-to-b from-[#1c2736] to-[#0f1720] text-white relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 pointer-events-none"></div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="logo md:w-20 md:h-20 h-14 w-14 mb-6 flex items-center justify-center bg-white/5 rounded-xl p-2 border border-white/10">
              <img src="/logo2.png" alt="Fraud Scan Logo" className="w-full h-full object-contain" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Protecting businesses and individuals from fraud through
              comprehensive reporting and database search services.
            </p>
            <div className="flex space-x-3">
              {/* Social Media Icons */}
              <a
                href="#"
                className="group relative w-10 h-10 bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
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
            <div key={key} className="space-y-4">
              <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                {section.title}
                <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group text-gray-400 hover:text-white text-sm transition-all duration-300 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-blue-500 group-hover:scale-150 transition-all duration-300"></span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {currentYear} <span className="text-white font-semibold">Fraud Scan</span>. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
