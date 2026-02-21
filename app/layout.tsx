import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["sans-serif"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://fraudscans.com'),
  title: "Fraud Scan - Fraud Reporting & Verification Platform",
  description:
    "Protect your business from fraud with comprehensive reporting, verification, and intelligence services. Join thousands of businesses worldwide fighting fraud together.",
  keywords:
    "fraud reporting, fraud verification, business protection, scam detection, fraud intelligence, enterprise security",
  authors: [{ name: "Fraud Scan Team" }],
  openGraph: {
    title: "Fraud Scan - Fraud Reporting & Verification Platform",
    description:
      "Protect your business from fraud with comprehensive reporting, verification, and intelligence services.",
    url: "https://fraudscans.com",
    siteName: "Fraud Scan",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fraud Scan - Fraud Protection Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fraud Scan - Fraud Reporting & Verification Platform",
    description:
      "Protect your business from fraud with comprehensive reporting, verification, and intelligence services.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = "G-0FZ84F6HWZ";

  return (
    <html lang="en">
      <body className={`${interSans.className} ${robotoMono.variable} antialiased`}>
        <Script
          id="ga-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `,
          }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <GoogleAnalytics />
        <ToastProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
