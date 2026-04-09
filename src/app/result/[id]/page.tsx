import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import type { FinancialBreakdown, Verdict, ConfidenceLevel } from "@/lib/types";

interface AssessmentData {
  id: string;
  verdict: Verdict;
  confidence: ConfidenceLevel;
  financials: FinancialBreakdown;
  reasoning: string[];
  considerations: string[];
  created_at: string;
  property_type: string;
}

async function getAssessment(id: string): Promise<AssessmentData | null> {
  const { data, error } = await getSupabase()
    .from("assessments")
    .select(
      "id, verdict, confidence, financials, reasoning, considerations, created_at, property_type"
    )
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as AssessmentData;
}

function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const colors = {
    high: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${colors[level]}`}
    >
      {level.charAt(0).toUpperCase() + level.slice(1)} confidence
    </span>
  );
}

function MoneyCell({ value, negative }: { value: number; negative?: boolean }) {
  const formatted = Math.abs(value).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });
  return (
    <span className={negative && value > 0 ? "text-sell" : ""}>
      {negative && value > 0 ? `-${formatted}` : formatted}
    </span>
  );
}

function FinancialTable({ financials }: { financials: FinancialBreakdown }) {
  const rows = [
    { label: "Estimated Equity", value: financials.estimatedEquity },
    {
      label: "Commission (5%)",
      value: financials.sellingCosts.commission,
      negative: true,
    },
    {
      label: "Legal Fees",
      value: financials.sellingCosts.legalFees,
      negative: true,
    },
    {
      label: "Mortgage Penalty",
      value: financials.sellingCosts.mortgagePenalty,
      negative: true,
    },
    {
      label: "Closing Costs",
      value: financials.sellingCosts.closingCosts,
      negative: true,
    },
    {
      label: "Capital Gains Tax",
      value: financials.capitalGains.estimatedTax,
      negative: true,
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <td className="px-4 py-3 text-muted">{row.label}</td>
              <td className="px-4 py-3 text-right font-medium text-foreground">
                <MoneyCell value={row.value} negative={row.negative} />
              </td>
            </tr>
          ))}
          <tr className="bg-gray-50">
            <td className="px-4 py-3 font-semibold text-foreground">
              Net Proceeds
            </td>
            <td className="px-4 py-3 text-right text-lg font-bold text-foreground">
              <MoneyCell value={financials.netProceeds} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function AdditionalMetrics({
  financials,
}: {
  financials: FinancialBreakdown;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-border p-4 text-center">
        <div className="text-sm text-muted">Monthly Carrying Cost</div>
        <div className="mt-1 text-xl font-bold text-foreground">
          <MoneyCell value={financials.monthlyCarryingCost} />
          <span className="text-sm font-normal text-muted">/mo</span>
        </div>
      </div>
      <div className="rounded-xl border border-border p-4 text-center">
        <div className="text-sm text-muted">Total Selling Costs</div>
        <div className="mt-1 text-xl font-bold text-sell">
          <MoneyCell value={financials.sellingCosts.total} />
        </div>
      </div>
      <div className="rounded-xl border border-border p-4 text-center">
        <div className="text-sm text-muted">Break-Even</div>
        <div className="mt-1 text-xl font-bold text-foreground">
          {financials.breakEvenMonths
            ? `${financials.breakEvenMonths} months`
            : "N/A"}
        </div>
      </div>
    </div>
  );
}

function CapitalGainsNote({
  capitalGains,
}: {
  capitalGains: FinancialBreakdown["capitalGains"];
}) {
  if (capitalGains.taxableGain === 0 && capitalGains.exemptionApplied) {
    return (
      <div className="rounded-lg bg-accent-light p-4 text-sm text-accent">
        <strong>Principal Residence Exemption Applied</strong> — Your capital
        gain of{" "}
        {capitalGains.totalGain.toLocaleString("en-CA", {
          style: "currency",
          currency: "CAD",
          maximumFractionDigits: 0,
        })}{" "}
        is fully exempt from tax as a principal residence.
      </div>
    );
  }
  if (capitalGains.estimatedTax > 0) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
        <strong>Capital Gains Tax Estimate:</strong> $
        {capitalGains.estimatedTax.toLocaleString()} on a taxable gain of $
        {capitalGains.taxableGain.toLocaleString()}.
        {capitalGains.exemptionApplied &&
          " A partial principal residence exemption has been applied."}
      </div>
    );
  }
  return null;
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assessment = await getAssessment(id);

  if (!assessment) {
    notFound();
  }

  const { verdict, confidence, financials, reasoning, considerations, property_type } =
    assessment;
  const isSell = verdict === "SELL";
  const isCondo = property_type === "condo";

  return (
    <>
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
            New Assessment
          </Link>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Verdict hero */}
          <div
            className={`rounded-2xl p-8 text-center ${
              isSell
                ? "bg-gradient-to-br from-red-50 to-red-100"
                : "bg-gradient-to-br from-green-50 to-green-100"
            }`}
          >
            <div
              className={`text-6xl font-extrabold tracking-tight sm:text-7xl ${
                isSell ? "text-sell" : "text-hold"
              }`}
            >
              {verdict}
            </div>
            <p className="mt-3 text-lg text-muted">
              Our AI recommends you{" "}
              <strong>{isSell ? "sell" : "hold"}</strong> your property.
            </p>
            <div className="mt-4">
              <ConfidenceBadge level={confidence} />
            </div>
          </div>

          {/* Financial breakdown */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground">
              Financial Breakdown
            </h2>
            <FinancialTable financials={financials} />
          </section>

          {/* Additional metrics */}
          <AdditionalMetrics financials={financials} />

          {/* Capital gains note */}
          <CapitalGainsNote capitalGains={financials.capitalGains} />

          {/* Reasoning */}
          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground">
              Why We Recommend to {verdict}
            </h2>
            <ul className="space-y-3">
              {reasoning.map((reason, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                      isSell ? "bg-sell" : "bg-hold"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {reason}
                </li>
              ))}
            </ul>
          </section>

          {/* Considerations */}
          {considerations.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-foreground">
                Things to Keep in Mind
              </h2>
              <div className="rounded-xl border border-border bg-white p-5">
                <ul className="space-y-2">
                  {considerations.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* SearchStrata cross-sell for condos */}
          {isCondo && (
            <section className="rounded-xl border-2 border-primary bg-primary-light p-6 text-center">
              <h3 className="text-lg font-bold text-foreground">
                Own a Condo? Get Your Strata Documents Reviewed
              </h3>
              <p className="mt-2 text-sm text-muted">
                Before making any decision, make sure you understand your strata
                corporation&apos;s financial health. SearchStrata can review your
                strata documents and flag risks.
              </p>
              <a
                href="https://searchstrata.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Learn More at SearchStrata
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </section>
          )}

          {/* Disclaimer */}
          <p className="text-center text-xs text-muted">
            This assessment is for informational purposes only and does not
            constitute financial, legal, or real estate advice. Consult
            qualified professionals before making property decisions. Market
            data and estimates may not reflect real-time conditions.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/assess"
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Run Another Assessment
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-white px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="text-sm text-muted">
            &copy; {new Date().getFullYear()} SellOrNotSell.com
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
      </footer>
    </>
  );
}
