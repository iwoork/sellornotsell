"use client";

import { useState } from "react";

interface ScheduleEntry {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function fmt(n: number): string {
  return n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
}

export function AmortizationSchedule({ schedule }: { schedule: ScheduleEntry[] }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"yearly" | "monthly">("yearly");

  // Group by year for yearly view
  const yearly = [];
  for (let i = 0; i < schedule.length; i += 12) {
    const yearEntries = schedule.slice(i, i + 12);
    const year = Math.floor(i / 12) + 1;
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
              onClick={() => setView("monthly")}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                view === "monthly"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-xs text-muted">
                  <th className="px-4 py-2.5 text-left font-medium">
                    {view === "yearly" ? "Year" : "Month"}
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
              <tfoot>
                <tr className="bg-surface">
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
