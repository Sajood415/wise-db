import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wise DB - Fraud Reporting & Verification Platform",
  description:
    "Protect your business from fraud with comprehensive reporting, verification, and intelligence services. Join thousands of businesses worldwide fighting fraud together.",
  keywords:
    "fraud reporting, fraud verification, business protection, scam detection, fraud intelligence, enterprise security",
  authors: [{ name: "Wise DB Team" }],
  openGraph: {
    title: "Wise DB - Fraud Reporting & Verification Platform",
    description:
      "Protect your business from fraud with comprehensive reporting, verification, and intelligence services.",
    url: "https://wisedb.com",
    siteName: "Wise DB",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wise DB - Fraud Protection Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wise DB - Fraud Reporting & Verification Platform",
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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ToastProvider>
      </body>
    </html>
  );
}
