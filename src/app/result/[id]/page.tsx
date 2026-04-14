import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import type { Metadata } from "next";
import type { FinancialBreakdown, Verdict, ConfidenceLevel } from "@/lib/types";
import { ThemeToggle } from "../../theme-toggle";
import { AmortizationSchedule } from "./amortization-schedule";

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
  const styles = {
    high: "bg-hold-light text-hold",
    medium: "bg-warning-bg text-warning-text",
    low: "bg-sell-light text-sell",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[level]}`}>
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
    { label: "Commission (4%)", value: financials.sellingCosts.commission, negative: true },
    { label: "Legal Fees", value: financials.sellingCosts.legalFees, negative: true },
    { label: "Mortgage Penalty", value: financials.sellingCosts.mortgagePenalty, negative: true },
    { label: "Closing Costs", value: financials.sellingCosts.closingCosts, negative: true },
    { label: "Capital Gains Tax", value: financials.capitalGains.estimatedTax, negative: true },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <td className="px-5 py-3 text-muted">{row.label}</td>
              <td className="px-5 py-3 text-right font-medium text-foreground">
                <MoneyCell value={row.value} negative={row.negative} />
              </td>
            </tr>
          ))}
          <tr className="bg-surface">
            <td className="px-5 py-3.5 font-semibold text-foreground">Net Proceeds</td>
            <td className="px-5 py-3.5 text-right text-lg font-bold text-foreground">
              <MoneyCell value={financials.netProceeds} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function AdditionalMetrics({ financials }: { financials: FinancialBreakdown }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-4 text-center">
        <div className="text-xs font-medium text-muted">Monthly Carrying Cost</div>
        <div className="mt-1.5 text-lg font-bold text-foreground">
          <MoneyCell value={financials.monthlyCarryingCost} />
          <span className="text-xs font-normal text-muted">/mo</span>
        </div>
        <p className="mt-2 text-[11px] leading-snug text-muted">
          Mortgage payment, property tax, insurance, and maintenance combined
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 text-center">
        <div className="text-xs font-medium text-muted">Total Selling Costs</div>
        <div className="mt-1.5 text-lg font-bold text-sell">
          <MoneyCell value={financials.sellingCosts.total} />
        </div>
        <p className="mt-2 text-[11px] leading-snug text-muted">
          Agent commission, legal fees, mortgage penalty, and closing costs if you sell today
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4 text-center">
        <div className="text-xs font-medium text-muted">Break-Even</div>
        <div className="mt-1.5 text-lg font-bold text-foreground">
          {financials.breakEvenMonths ? `${financials.breakEvenMonths} mo` : "N/A"}
        </div>
        <p className="mt-2 text-[11px] leading-snug text-muted">
          {financials.breakEvenMonths
            ? "Months of holding needed for appreciation to cover your selling costs"
            : "Market conditions don\u2019t support a break-even timeline"}
        </p>
      </div>
    </div>
  );
}

function CapitalGainsNote({ capitalGains }: { capitalGains: FinancialBreakdown["capitalGains"] }) {
  if (capitalGains.taxableGain === 0 && capitalGains.exemptionApplied) {
    return (
      <div className="rounded-xl bg-hold-light p-4 text-sm text-hold">
        <strong>Principal Residence Exemption Applied</strong> — Your capital gain of{" "}
        {capitalGains.totalGain.toLocaleString("en-CA", {
          style: "currency",
          currency: "CAD",
          maximumFractionDigits: 0,
        })}{" "}
        is fully exempt from tax.
      </div>
    );
  }
  if (capitalGains.estimatedTax > 0) {
    return (
      <div className="rounded-xl bg-warning-bg p-4 text-sm text-warning-text">
        <strong>Capital Gains Tax Estimate:</strong> $
        {capitalGains.estimatedTax.toLocaleString()} on a taxable gain of $
        {capitalGains.taxableGain.toLocaleString()}.
        {capitalGains.exemptionApplied && " A partial principal residence exemption has been applied."}
      </div>
    );
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const assessment = await getAssessment(id);
  if (!assessment) return { title: "Assessment Not Found" };

  const verdict = assessment.verdict === "SELL" ? "Sell" : "Hold";
  return {
    title: `${verdict} Recommendation — Property Assessment`,
    description: `AI-powered property assessment result: ${verdict} recommendation with ${assessment.confidence} confidence. Net proceeds: ${assessment.financials.netProceeds.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 })}.`,
    robots: { index: false, follow: false },
  };
}

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const assessment = await getAssessment(id);

  if (!assessment) {
    notFound();
  }

  const { verdict, confidence, financials, reasoning, considerations, property_type } = assessment;
  const isSell = verdict === "SELL";
  const isCondo = property_type === "condo";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="#0f766e"/>
              <path d="M6 19L16 9l10 10" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <circle cx="16" cy="25" r="2.2" fill="white"/>
            </svg>
            <span>
              <span className="text-primary">Sell</span>
              <span className="text-muted">Or</span>
              <span className="text-foreground">NotSell</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/assess"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              New Assessment
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Verdict */}
          <div className={`rounded-2xl p-8 text-center ${isSell ? "bg-sell-light" : "bg-hold-light"}`}>
            <div className={`text-5xl font-extrabold tracking-tight sm:text-6xl ${isSell ? "text-sell" : "text-hold"}`}>
              {verdict}
            </div>
            <p className="mt-3 text-sm text-muted">
              Our AI recommends you <strong>{isSell ? "sell" : "hold"}</strong> your property.
            </p>
            <div className="mt-3">
              <ConfidenceBadge level={confidence} />
            </div>
          </div>

          {/* Financial breakdown */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-foreground">Financial Breakdown</h2>
            <FinancialTable financials={financials} />
          </section>

          <AdditionalMetrics financials={financials} />
          <CapitalGainsNote capitalGains={financials.capitalGains} />

          {/* Reasoning */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-foreground">
              Why we recommend to {verdict.toLowerCase()}
            </h2>
            <ul className="space-y-3">
              {reasoning.map((reason, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${
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
              <h2 className="mb-4 text-lg font-bold text-foreground">Things to keep in mind</h2>
              <div className="rounded-xl border border-border bg-card p-5">
                <ul className="space-y-2.5">
                  {considerations.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Amortization schedule */}
          {financials.amortizationSchedule && financials.amortizationSchedule.length > 0 && (
            <AmortizationSchedule schedule={financials.amortizationSchedule} />
          )}

          {/* SearchStrata cross-sell */}
          {isCondo && (
            <section className="rounded-xl border border-primary/20 bg-primary-light p-6 text-center">
              <h3 className="text-base font-bold text-foreground">
                Own a condo? Get your strata documents reviewed
              </h3>
              <p className="mt-2 text-sm text-muted">
                Understand your strata corporation&apos;s financial health before making a decision.
              </p>
              <a
                href="https://searchstrata.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                Learn More
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </section>
          )}

          {/* Disclaimer */}
          <p className="text-center text-[11px] leading-relaxed text-muted/70">
            This assessment is for informational purposes only and does not constitute financial,
            legal, or real estate advice. Consult qualified professionals before making property decisions.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3 pb-4 sm:flex-row sm:justify-center">
            <Link
              href="/assess"
              className="w-full rounded-xl bg-primary px-6 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-hover sm:w-auto"
            >
              Run Another Assessment
            </Link>
            <Link
              href="/"
              className="w-full rounded-xl border border-border px-6 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-surface sm:w-auto"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card px-6 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="text-xs text-muted">&copy; {new Date().getFullYear()} SellOrNotSell.com</div>
          <nav className="flex gap-6 text-xs text-muted">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
