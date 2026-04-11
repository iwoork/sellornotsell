import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://sellornotsell.com" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "SellOrNotSell",
      url: "https://sellornotsell.com",
      description:
        "Free AI-powered sell or hold advice for Canadian homeowners with full financial breakdown.",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://sellornotsell.com/assess",
        description: "Start a property assessment",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "SellOrNotSell Property Advisor",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "CAD",
      },
      description:
        "AI-powered tool that analyzes your property equity, selling costs, capital gains, and market conditions to recommend whether you should sell or hold your Canadian property.",
      featureList: [
        "Equity analysis",
        "Selling cost breakdown",
        "Capital gains tax calculation with principal residence exemption",
        "Local market timing data",
        "Monthly carrying cost analysis",
        "Break-even timeline",
        "AI-powered sell or hold recommendation",
      ],
      areaServed: {
        "@type": "Country",
        name: "Canada",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does SellOrNotSell work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You enter your property details, mortgage information, and goals. Our AI analyzes your equity, selling costs (commission, legal fees, mortgage penalties), capital gains tax implications, and local market conditions to give you a clear sell-or-hold recommendation with a full financial breakdown.",
          },
        },
        {
          "@type": "Question",
          name: "Is SellOrNotSell free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, SellOrNotSell is completely free. There are no hidden fees, no sign-up required, and you get your full financial breakdown and AI recommendation at no cost.",
          },
        },
        {
          "@type": "Question",
          name: "What provinces does SellOrNotSell cover?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SellOrNotSell covers all 10 Canadian provinces: Alberta, British Columbia, Manitoba, New Brunswick, Newfoundland and Labrador, Nova Scotia, Ontario, Prince Edward Island, Quebec, and Saskatchewan.",
          },
        },
        {
          "@type": "Question",
          name: "How are capital gains calculated for Canadian property?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "If your property is your principal residence, the capital gain is typically fully exempt from tax under the Principal Residence Exemption. For investment properties, 50% of the first $250,000 in capital gains is taxable, and 66.7% of gains above that threshold. SellOrNotSell calculates this automatically based on your situation.",
          },
        },
        {
          "@type": "Question",
          name: "What selling costs are included in the analysis?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The analysis includes real estate commission (typically 4%), legal fees, mortgage discharge penalties (3-month interest or Interest Rate Differential for fixed-rate mortgages), closing costs, and estimated capital gains tax where applicable.",
          },
        },
        {
          "@type": "Question",
          name: "Is SellOrNotSell financial advice?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. SellOrNotSell provides educational information and AI-generated analysis only. It does not constitute financial, legal, or real estate advice. You should consult with qualified professionals — including a licensed real estate agent, mortgage broker, and tax accountant — before making any property decisions.",
          },
        },
        {
          "@type": "Question",
          name: "How long does the assessment take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The form takes about 60 seconds to complete. After you submit, the AI analysis typically takes 10–20 seconds to generate your personalized sell-or-hold recommendation and financial breakdown.",
          },
        },
        {
          "@type": "Question",
          name: "Is my personal information safe?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. SellOrNotSell is PIPEDA-compliant. Your contact information is never shared with the AI — only property and financial details are used for the analysis. All data is encrypted in transit and at rest. See our Privacy Policy for full details.",
          },
        },
      ],
    },
  ],
};

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#0f766e"/>
            <path d="M5 16L16 7l11 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M13 20.5a3 3 0 1 1 4.5 2.6c-.6.35-1.5.9-1.5 1.9" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <circle cx="16" cy="27.5" r="1.2" fill="white"/>
          </svg>
          <span>
            <span className="text-primary">Sell</span>
            <span className="text-muted">Or</span>
            <span className="text-foreground">NotSell</span>
          </span>
        </Link>
        <Link
          href="/assess"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium tracking-wide text-primary uppercase">
          Free for Canadian Homeowners
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Should you <span className="text-sell">sell</span> or{" "}
          <span className="text-hold">hold</span>?
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Get a free AI-powered recommendation with a full financial
          breakdown — equity, costs, capital gains, and market timing.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/assess"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover sm:w-auto"
          >
            Get My Answer
          </Link>
          <span className="text-sm text-muted">
            Takes about 60 seconds
          </span>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const signals = [
    { stat: "Free", label: "No hidden fees" },
    { stat: "60s", label: "Instant AI analysis" },
    { stat: "10+", label: "Provinces covered" },
    { stat: "PIPEDA", label: "Privacy compliant" },
  ];

  return (
    <section className="border-y border-border bg-card px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {signals.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-primary">{s.stat}</div>
              <div className="mt-1 text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      num: "1",
      title: "Describe your property",
      desc: "Location, type, and a few mortgage details. Quick and painless.",
    },
    {
      num: "2",
      title: "We crunch the numbers",
      desc: "Equity, selling costs, capital gains, mortgage penalties — all calculated.",
    },
    {
      num: "3",
      title: "Get your verdict",
      desc: "A clear sell-or-hold recommendation backed by your financials and market data.",
    },
  ];

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          How it works
        </h2>
        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
                {s.num}
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExampleResultSection() {
  const rows = [
    { label: "Estimated Equity", value: "$310,000" },
    { label: "Commission (4%)", value: "-$30,000", negative: true },
    { label: "Legal Fees", value: "-$2,000", negative: true },
    { label: "Mortgage Penalty", value: "-$4,200", negative: true },
    { label: "Closing Costs", value: "-$1,800", negative: true },
    { label: "Capital Gains Tax", value: "$0", negative: false },
  ];

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          See what you&apos;ll get
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted">
          Here&apos;s an example result from a homeowner in Vancouver.
        </p>

        <div className="relative mx-auto mt-10 max-w-2xl">
          {/* Decorative browser-style frame */}
          <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
            {/* Fake top bar */}
            <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="mx-auto text-[10px] text-muted/60">sellornotsell.com/result</span>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              {/* Verdict */}
              <div className="rounded-2xl bg-hold-light p-6 text-center">
                <div className="text-4xl font-extrabold tracking-tight text-hold sm:text-5xl">
                  HOLD
                </div>
                <p className="mt-2 text-sm text-muted">
                  Our AI recommends you <strong>hold</strong> your property.
                </p>
                <span className="mt-2 inline-flex items-center rounded-full bg-hold-light px-3 py-1 text-xs font-medium text-hold border border-hold/20">
                  High confidence
                </span>
              </div>

              {/* Financial table */}
              <div>
                <h3 className="mb-3 text-sm font-bold text-foreground">Financial Breakdown</h3>
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.label} className="border-b border-border last:border-0">
                          <td className="px-4 py-2.5 text-muted">{row.label}</td>
                          <td className={`px-4 py-2.5 text-right font-medium ${row.negative ? "text-sell" : "text-foreground"}`}>
                            {row.value}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-surface">
                        <td className="px-4 py-3 font-semibold text-foreground">Net Proceeds</td>
                        <td className="px-4 py-3 text-right text-lg font-bold text-foreground">$272,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border p-3 text-center">
                  <div className="text-xs text-muted">Monthly Cost</div>
                  <div className="mt-1 text-sm font-bold text-foreground">$2,840<span className="text-xs font-normal text-muted">/mo</span></div>
                </div>
                <div className="rounded-xl border border-border p-3 text-center">
                  <div className="text-xs text-muted">Selling Costs</div>
                  <div className="mt-1 text-sm font-bold text-sell">$38,000</div>
                </div>
                <div className="rounded-xl border border-border p-3 text-center">
                  <div className="text-xs text-muted">Break-Even</div>
                  <div className="mt-1 text-sm font-bold text-foreground">16 mo</div>
                </div>
              </div>

              {/* Reasoning preview */}
              <div>
                <h3 className="mb-3 text-sm font-bold text-foreground">Why we recommend to hold</h3>
                <ul className="space-y-2">
                  {[
                    "Your equity is growing faster than carrying costs — selling now leaves $45K on the table.",
                    "Vancouver detached homes appreciated 6.2% year-over-year with strong demand forecast.",
                    "Principal residence exemption shields your full capital gain from tax.",
                  ].map((reason, i) => (
                    <li key={i} className="flex gap-2.5 text-xs leading-relaxed text-foreground">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-hold text-[8px] font-bold text-white">
                        {i + 1}
                      </span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Decorative gradient fade at bottom */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 rounded-b-2xl bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/assess"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
          >
            Get Your Own Result
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhatYouGetSection() {
  const features = [
    { title: "Equity analysis", desc: "How much you'd walk away with after selling." },
    { title: "Selling costs", desc: "4% commission, legal fees, penalties, closing costs." },
    { title: "Capital gains", desc: "Tax implications with Canadian exemption rules." },
    { title: "Market timing", desc: "Local prices, trends, and days on market." },
    { title: "Carrying costs", desc: "Monthly cost of holding vs. potential gains." },
    { title: "AI recommendation", desc: "Everything weighed for a clear verdict." },
  ];

  return (
    <section className="bg-card px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          What you get
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-sm text-muted">
          A comprehensive financial picture — not just a yes or no.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-background p-5">
              <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "How does SellOrNotSell work?",
      a: "You enter your property details, mortgage information, and goals. Our AI analyzes your equity, selling costs (commission, legal fees, mortgage penalties), capital gains tax implications, and local market conditions to give you a clear sell-or-hold recommendation with a full financial breakdown.",
    },
    {
      q: "Is SellOrNotSell free?",
      a: "Yes, completely free. No hidden fees, no sign-up required, and you get your full financial breakdown and AI recommendation at no cost.",
    },
    {
      q: "What provinces does SellOrNotSell cover?",
      a: "All 10 Canadian provinces: Alberta, British Columbia, Manitoba, New Brunswick, Newfoundland and Labrador, Nova Scotia, Ontario, Prince Edward Island, Quebec, and Saskatchewan.",
    },
    {
      q: "How are capital gains calculated for Canadian property?",
      a: "If your property is your principal residence, the capital gain is typically fully exempt under the Principal Residence Exemption. For investment properties, 50% of the first $250,000 in gains is taxable, and 66.7% above that. SellOrNotSell calculates this automatically.",
    },
    {
      q: "What selling costs are included?",
      a: "Real estate commission (typically 5%), legal fees, mortgage discharge penalties (3-month interest or IRD for fixed-rate), closing costs, and capital gains tax where applicable.",
    },
    {
      q: "Is this financial advice?",
      a: "No. SellOrNotSell provides educational information and AI-generated analysis only. Consult qualified professionals before making property decisions.",
    },
    {
      q: "How long does the assessment take?",
      a: "The form takes about 60 seconds. After submitting, the AI analysis takes 10–20 seconds to generate your recommendation.",
    },
    {
      q: "Is my personal information safe?",
      a: "Yes. We're PIPEDA-compliant. Your contact info is never shared with the AI — only property and financial details. All data is encrypted in transit and at rest.",
    },
  ];

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          Frequently asked questions
        </h2>
        <dl className="mt-10 space-y-0 divide-y divide-border">
          {faqs.map((faq) => (
            <details key={faq.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                {faq.q}
                <svg
                  className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{faq.a}</p>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-lg text-center">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          Ready to find out?
        </h2>
        <p className="mt-3 text-sm text-muted">
          Free, instant, no sign-up required.
        </p>
        <Link
          href="/assess"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
        >
          Get My Answer
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="text-xs text-muted">
          &copy; {new Date().getFullYear()} SellOrNotSell.com
        </div>
        <nav className="flex gap-6 text-xs text-muted">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms
          </Link>
        </nav>
      </div>
      <p className="mx-auto mt-4 max-w-2xl text-center text-[11px] leading-relaxed text-muted/70">
        SellOrNotSell provides educational information only and does not constitute financial,
        legal, or real estate advice. Consult qualified professionals before making property decisions.
      </p>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <HeroSection />
      <TrustSection />
      <HowItWorksSection />
      <ExampleResultSection />
      <WhatYouGetSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
