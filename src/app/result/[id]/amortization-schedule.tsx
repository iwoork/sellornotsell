"use client";

import { useState } from "react";

interface ScheduleEntry {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

type Freq = "monthly" | "bi-weekly" | "accelerated-bi-weekly" | "weekly" | "accelerated-weekly";

const FREQ_LABELS: Record<Freq, string> = {
  monthly: "Month",
  "bi-weekly": "Period",
  "accelerated-bi-weekly": "Period",
  weekly: "Week",
  "accelerated-weekly": "Week",
};

function periodsPerYear(freq: Freq): number {
  if (freq === "weekly" || freq === "accelerated-weekly") return 52;
  if (freq === "bi-weekly" || freq === "accelerated-bi-weekly") return 26;
  return 12;
}

function fmt(n: number): string {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
}

interface LumpSumSavings {
  interestSaved: number;
  paymentsSaved: number;
  totalLumpSum: number;
}

export function AmortizationSchedule({
  schedule,
  paymentFrequency = "monthly",
  lumpSumSavings,
}: {
  schedule: ScheduleEntry[];
  paymentFrequency?: string;
  lumpSumSavings?: LumpSumSavings | null;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"yearly" | "per-payment">("yearly");

  const freq = (paymentFrequency || "monthly") as Freq;
  const ppy = periodsPerYear(freq);
  const periodLabel = FREQ_LABELS[freq] || "Period";

  // Group by year
  const yearly = [];
  for (let i = 0; i < schedule.length; i += ppy) {
    const yearEntries = schedule.slice(i, i + ppy);
    const year = Math.floor(i / ppy) + 1;
    yearly.push({
      year,
      payment: yearEntries.reduce((s, e) => s + e.payment, 0),
      principal: yearEntries.reduce((s, e) => s + e.principal, 0),
      interest: yearEntries.reduce((s, e) => s + e.interest, 0),
      balance: yearEntries[yearEntries.length - 1].balance,
    });
  }

  const rows = view === "yearly" ? yearly : schedule;

  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-5 py-4 text-left transition-colors hover:bg-surface"
      >
        <h2 className="text-base font-bold text-foreground">Amortization Schedule</h2>
        <svg
          className={`h-5 w-5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {/* View toggle */}
          <div className="flex gap-1 rounded-lg bg-surface p-1">
            <button
              type="button"
              onClick={() => setView("yearly")}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "yearly"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Yearly
            </button>
            <button
              type="button"
              onClick={() => setView("per-payment")}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "per-payment"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Per Payment
            </button>
          </div>

          {/* Summary */}
          <div className="flex flex-wrap gap-4 text-xs text-muted">
            <span>
              {schedule.length} payments remaining
            </span>
            <span>
              Total interest: {fmt(schedule.reduce((s, e) => s + e.interest, 0))}
            </span>
          </div>

          {/* Lump sum savings */}
          {lumpSumSavings && lumpSumSavings.interestSaved > 0 && (
            <div className="rounded-xl bg-hold-light p-4 text-sm">
              <p className="font-semibold text-hold">
                Lump sum payments totalling {fmt(lumpSumSavings.totalLumpSum)} save you:
              </p>
              <div className="mt-2 flex flex-wrap gap-6 text-xs">
                <div>
                  <span className="font-bold text-hold text-base">{fmt(lumpSumSavings.interestSaved)}</span>
                  <span className="text-muted ml-1">in interest</span>
                </div>
                <div>
                  <span className="font-bold text-hold text-base">{lumpSumSavings.paymentsSaved}</span>
                  <span className="text-muted ml-1">fewer payments</span>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-border bg-card max-h-[28rem] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-border bg-surface text-xs text-muted">
                  <th className="px-4 py-2.5 text-left font-medium">
                    {view === "yearly" ? "Year" : periodLabel}
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium">Payment</th>
                  <th className="px-4 py-2.5 text-right font-medium">Principal</th>
                  <th className="px-4 py-2.5 text-right font-medium">Interest</th>
                  <th className="px-4 py-2.5 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const period = "year" in row ? row.year : row.period;
                  return (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors"
                    >
                      <td className="px-4 py-2 text-foreground font-medium">{period}</td>
                      <td className="px-4 py-2 text-right text-foreground">{fmt(row.payment)}</td>
                      <td className="px-4 py-2 text-right text-primary">{fmt(row.principal)}</td>
                      <td className="px-4 py-2 text-right text-muted">{fmt(row.interest)}</td>
                      <td className="px-4 py-2 text-right text-foreground font-medium">{fmt(row.balance)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="sticky bottom-0">
                <tr className="bg-surface border-t border-border">
                  <td className="px-4 py-2.5 font-semibold text-foreground">Total</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-foreground">
                    {fmt(schedule.reduce((s, e) => s + e.payment, 0))}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-primary">
                    {fmt(schedule.reduce((s, e) => s + e.principal, 0))}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-muted">
                    {fmt(schedule.reduce((s, e) => s + e.interest, 0))}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-foreground">$0</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
