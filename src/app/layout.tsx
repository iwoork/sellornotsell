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

const BASE_URL = "https://sellornotsell.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SellOrNotSell — Free AI-Powered Sell or Hold Advice for Canadian Homeowners",
    template: "%s — SellOrNotSell",
  },
  description:
    "Get instant, AI-powered advice on whether to sell or hold your Canadian property. Free financial breakdown with equity analysis, selling costs, capital gains tax, and local market timing.",
  keywords: [
    "sell or hold property",
    "should I sell my house",
    "sell my house Canada",
    "property sell advice",
    "home equity calculator",
    "Canadian real estate",
    "AI property advisor",
    "sell or hold real estate",
    "capital gains calculator Canada",
    "mortgage penalty calculator",
    "home selling costs Canada",
    "property market analysis",
  ],
  authors: [{ name: "SellOrNotSell" }],
  creator: "SellOrNotSell",
  publisher: "SellOrNotSell",
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
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "SellOrNotSell — Should You Sell or Hold Your Property?",
    description:
      "Free AI-powered sell/hold advice with a full financial breakdown — equity, costs, capital gains, and market timing. Built for Canadian homeowners.",
    url: BASE_URL,
    type: "website",
    locale: "en_CA",
    siteName: "SellOrNotSell",
  },
  twitter: {
    card: "summary_large_image",
    title: "SellOrNotSell — Should You Sell or Hold Your Property?",
    description:
      "Free AI-powered sell/hold advice with a full financial breakdown. Built for Canadian homeowners.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
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
