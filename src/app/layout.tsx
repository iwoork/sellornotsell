import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SellOrNotSell — Free AI-Powered Sell or Hold Advice for Canadian Homeowners",
  description:
    "Get instant, AI-powered advice on whether to sell or hold your property. Free financial breakdown with equity analysis, selling costs, capital gains, and market timing — built for Canadian homeowners.",
  keywords: [
    "sell or hold property",
    "sell my house Canada",
    "property sell advice",
    "home equity calculator",
    "Canadian real estate",
    "AI property advisor",
  ],
  openGraph: {
    title: "SellOrNotSell — Should You Sell or Hold Your Property?",
    description:
      "Free AI-powered sell/hold advice with a full financial breakdown. Built for Canadian homeowners.",
    type: "website",
    locale: "en_CA",
    siteName: "SellOrNotSell",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-CA"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
