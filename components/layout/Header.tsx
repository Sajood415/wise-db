"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Report Fraud", href: "/report-fraud" },
    { name: "Contact", href: "/help" },
    { name: "Pricing", href: "/pricing" },
  ];

  // Get dashboard path based on user role
  const getDashboardPath = (role: string | null) => {
    switch (role) {
      case "super_admin":
        return "/admin/dashboard";
      case "sub_admin":
        return "/manage";
      case "enterprise_admin":
        return "/enterprise/dashboard";
      case "enterprise_user":
        return "/enterprise/dashboard";
      case "individual":
        return "/dashboard";
      default:
        return "/dashboard";
    }
  };

  // Check authentication status on component mount (non-blocking)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setIsLoggedIn(true);
          setUserRole(userData.user?.role || null);
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    checkAuth();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-in-out md:py-4  ${
        isHovered
          ? "bg-[#1c2736] shadow-xs shadow-gray-900"
          : "bg-white border-b border-gray-100"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <div className="">
            <Link href="/" className="">
              <div
                className={`logo md:w-26 md:h-26 h-22 w-22 flex items-center justify-center`}
              >
                <img
                  src={
                    isHovered
                      ? "/logos/logo-with-hover.png"
                      : "/logos/logo-without-hover.png"
                  }
                  alt="logo"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-baseline space-x-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group inline-flex flex-col items-center px-3 py-2 text-base  transition-colors duration-200 ${
                      isHovered
                        ? isActive
                          ? "text-white"
                          : "text-white/80 hover:text-white"
                        : isActive
                        ? "text-[#1c2736]"
                        : "text-[#1c2736]/80 hover:text-[#1c2736]"
                    }`}
                  >
                    <span>{item.name}</span>
                    <span
                      className={`${
                        isActive
                          ? "w-full opacity-100"
                          : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                      } h-1 rounded bg-[#f6c14b] mt-1 transition-all`}
                    ></span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  href={getDashboardPath(userRole)}
                  className="text-base font-semibold bg-[#ffc21a] text-[#1c2736] hover:text-white hover:bg-gray-500 px-6 py-2 rounded-full transition-colors"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-6 py-1.5 text-base font-medium transition-colors duration-200 ${
                    isHovered
                      ? "text-white/80 border border-white rounded-full hover:text-white"
                      : "text-[#1c2736]/80 border border-transparent rounded-full  hover:text-[#1c2736]"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-base font-semibold bg-[#ffc21a] text-[#1c2736] hover:bg-gray-500 hover:text-white px-6 py-2 rounded-full transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${
                isHovered
                  ? "text-white/80 hover:text-white focus:text-white"
                  : "text-[#1c2736]/80 hover:text-[#1c2736] focus:text-[#1c2736]"
              } focus:outline-none transition-colors duration-200`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div
              className={`px-2 pt-2 pb-3 space-y-1 rounded-lg mt-2 shadow-lg ${
                isHovered
                  ? "bg-[#1c2736] border border-white/10"
                  : "bg-white border border-gray-200"
              }`}
            >
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                      isHovered
                        ? isActive
                          ? "text-white"
                          : "text-white/80 hover:text-white"
                        : isActive
                        ? "text-[#1c2736]"
                        : "text-[#1c2736]/80 hover:text-[#1c2736]"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div
                className={`${
                  isHovered
                    ? "border-t border-white/10"
                    : "border-t border-gray-200"
                } pt-3 mt-3`}
              >
                {isLoggedIn ? (
                  <>
                    <Link
                      href={getDashboardPath(userRole)}
                      className="block text-center mt-2 mx-3 text-sm font-semibold bg-[#ffc21a] text-[#1c2736] hover:bg-gray-500 hover:text-white px-4 py-2 rounded-full transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                        isHovered
                          ? "text-white/80 hover:text-white"
                          : "text-[#1c2736]/80 hover:text-[#1c2736]"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block text-center mt-2 mx-3 text-sm font-semibold bg-[#ffc21a] text-[#1c2736] hover:bg-gray-500 hover:text-white px-4 py-2 rounded-full transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
