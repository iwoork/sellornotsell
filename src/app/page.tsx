import Link from "next/link";

const PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
] as const;

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-light to-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Should You <span className="text-sell">Sell</span> or{" "}
          <span className="text-hold">Hold</span> Your Property?
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
          Get free, instant AI-powered advice with a full financial breakdown —
          equity analysis, selling costs, capital gains, and market timing.
          Built for Canadian homeowners.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/assess"
            className="inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Get My Answer — Free
          </Link>
          <span className="text-sm text-muted">
            No sign-up required. Results in under 60 seconds.
          </span>
        </div>
      </div>
    </section>
  );
}

const HOW_IT_WORKS_STEPS = [
  {
    step: "1",
    title: "Tell Us About Your Property",
    description:
      "Enter your address, purchase details, and current mortgage info. Takes about 2 minutes.",
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    step: "2",
    title: "We Crunch the Numbers",
    description:
      "Our engine calculates your equity, selling costs, capital gains tax, mortgage penalties, and more.",
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25v-.008Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007v-.008Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
      </svg>
    ),
  },
  {
    step: "3",
    title: "Get Your Personalized Verdict",
    description:
      "Our AI weighs your finances, market conditions, and goals to give you a clear sell-or-hold recommendation.",
    icon: (
      <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
];

function HowItWorksSection() {
  return (
    <section className="bg-white px-6 py-20" id="how-it-works">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          How It Works
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted">
          Three simple steps to your personalized sell-or-hold recommendation.
        </p>
        <div className="mt-16 grid gap-12 sm:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light">
                {item.icon}
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-base leading-7 text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TRUST_SIGNALS = [
  { stat: "100%", label: "Free — No Hidden Fees" },
  { stat: "< 60s", label: "Instant AI Analysis" },
  { stat: "10+", label: "Canadian Provinces Covered" },
  { stat: "PIPEDA", label: "Privacy Compliant" },
];

function TrustSection() {
  return (
    <section className="border-y border-border bg-card px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {TRUST_SIGNALS.map((signal) => (
            <div key={signal.label} className="flex flex-col items-center text-center">
              <span className="text-3xl font-bold text-primary">{signal.stat}</span>
              <span className="mt-2 text-sm text-muted">{signal.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatYouGetSection() {
  const features = [
    {
      title: "Equity Analysis",
      description: "See exactly how much equity you've built and what you'd walk away with after selling.",
    },
    {
      title: "Selling Cost Breakdown",
      description: "Commission, legal fees, mortgage penalties, closing costs — all calculated for your situation.",
    },
    {
      title: "Capital Gains Tax Estimate",
      description: "Principal residence exemption, partial exemptions, and estimated tax owing — Canadian rules applied.",
    },
    {
      title: "Market Timing Insights",
      description: "Current market conditions in your area — average prices, days on market, and price trends.",
    },
    {
      title: "Carrying Cost Analysis",
      description: "Monthly mortgage, property tax, insurance, and maintenance costs vs. potential appreciation.",
    },
    {
      title: "AI-Powered Recommendation",
      description: "All factors weighed together for a clear sell-or-hold verdict with confidence level and reasoning.",
    },
  ];

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          What You Get
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted">
          A comprehensive financial picture — not just a yes or no.
        </p>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProvinceSelector() {
  return (
    <section className="bg-card px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Available Across Canada
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
          We cover all major provinces with localized market data and provincial tax rules.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {PROVINCES.map((province) => (
            <Link
              key={province}
              href="/assess"
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary-light hover:text-primary"
            >
              {province}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-primary px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to Find Out?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
          Get your free, personalized sell-or-hold recommendation in under 60 seconds.
          No sign-up. No obligation.
        </p>
        <Link
          href="/assess"
          className="mt-10 inline-flex h-14 items-center justify-center rounded-xl bg-white px-8 text-lg font-semibold text-primary shadow-lg transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
        >
          Get My Answer — Free
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-white px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="text-sm text-muted">
          &copy; {new Date().getFullYear()} SellOrNotSell.com. All rights reserved.
        </div>
        <nav className="flex gap-6 text-sm text-muted">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
        </nav>
      </div>
      <p className="mx-auto mt-6 max-w-3xl text-center text-xs text-muted">
        SellOrNotSell.com provides educational information only and does not constitute financial,
        legal, or real estate advice. Consult qualified professionals before making property decisions.
        Market data may not reflect real-time conditions.
      </p>
    </footer>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          <span className="text-primary">Sell</span>
          <span className="text-muted">Or</span>
          <span className="text-foreground">NotSell</span>
        </Link>
        <Link
          href="/assess"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Get My Answer
        </Link>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <TrustSection />
      <HowItWorksSection />
      <WhatYouGetSection />
      <ProvinceSelector />
      <CTASection />
      <Footer />
    </>
  );
}
