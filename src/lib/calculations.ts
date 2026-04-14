import type { FinancialBreakdown, MortgageType } from "./types";

// ── Input for financial calculations ──────────────────────────────────────────

export type PaymentFrequency =
  | "monthly"
  | "bi-weekly"
  | "accelerated-bi-weekly"
  | "weekly"
  | "accelerated-weekly";

export interface CalcInput {
  purchasePrice: number;
  purchaseYear: number;
  estimatedValue: number;
  mortgageBalance: number;
  mortgageRate: number; // annual percentage, e.g. 4.5
  mortgageType: MortgageType;
  paymentFrequency: PaymentFrequency;
  amortizationYearsRemaining: number;
  remainingTermYears: number;
  propertyTax: number; // annual
  condoFees: number; // monthly
  isPrimaryResidence: boolean;
  yearsOccupiedAsPrimary: number;
  province: string;
}

// ── Mortgage helpers ──────────────────────────────────────────────────────────

/** Monthly mortgage payment using standard amortization formula */
export function monthlyMortgagePayment(
  balance: number,
  annualRate: number,
  amortizationMonths: number
): number {
  if (balance <= 0 || amortizationMonths <= 0) return 0;
  if (annualRate <= 0) return balance / amortizationMonths;

  // Canadian mortgages compound semi-annually, so convert to effective monthly rate
  const semiAnnualRate = annualRate / 100 / 2;
  const effectiveMonthlyRate = Math.pow(1 + semiAnnualRate, 1 / 6) - 1;

  const numerator = balance * effectiveMonthlyRate;
  const denominator = 1 - Math.pow(1 + effectiveMonthlyRate, -amortizationMonths);
  return numerator / denominator;
}

/** Number of payments per year for each frequency */
function paymentsPerYear(freq: PaymentFrequency): number {
  switch (freq) {
    case "weekly":
    case "accelerated-weekly": return 52;
    case "bi-weekly":
    case "accelerated-bi-weekly": return 26;
    case "monthly":
    default: return 12;
  }
}

/**
 * Effective per-period interest rate for Canadian mortgages.
 * Canadian mortgages compound semi-annually regardless of payment frequency.
 */
function effectivePerPeriodRate(annualRate: number, freq: PaymentFrequency): number {
  if (annualRate <= 0) return 0;
  const semiAnnualRate = annualRate / 100 / 2;
  const periodsPerHalfYear = paymentsPerYear(freq) / 2;
  return Math.pow(1 + semiAnnualRate, 1 / periodsPerHalfYear) - 1;
}

/**
 * Per-period payment amount based on frequency.
 * Accelerated: monthly payment ÷ divisor (2 for bi-weekly, 4 for weekly).
 * Non-accelerated: recalculated for the frequency to keep the same total amortization period.
 */
export function perPeriodPayment(
  balance: number,
  annualRate: number,
  amortizationYears: number,
  freq: PaymentFrequency
): number {
  if (balance <= 0 || amortizationYears <= 0) return 0;

  if (freq === "accelerated-bi-weekly") {
    return monthlyMortgagePayment(balance, annualRate, amortizationYears * 12) / 2;
  }
  if (freq === "accelerated-weekly") {
    return monthlyMortgagePayment(balance, annualRate, amortizationYears * 12) / 4;
  }

  // Non-accelerated: compute payment for the actual number of periods
  const r = effectivePerPeriodRate(annualRate, freq);
  const n = paymentsPerYear(freq) * amortizationYears;
  if (r <= 0) return balance / n;
  return (balance * r) / (1 - Math.pow(1 + r, -n));
}

/** Calculate remaining mortgage balance after N periods at the given frequency */
export function remainingMortgageBalance(
  originalBalance: number,
  annualRate: number,
  amortizationYears: number,
  paymentsMade: number,
  freq: PaymentFrequency = "monthly"
): number {
  if (originalBalance <= 0 || amortizationYears <= 0) return 0;

  const r = effectivePerPeriodRate(annualRate, freq);
  const payment = perPeriodPayment(originalBalance, annualRate, amortizationYears, freq);
  const totalPeriods = paymentsPerYear(freq) * amortizationYears;

  if (paymentsMade >= totalPeriods) return 0;
  if (r <= 0) return Math.max(0, originalBalance - payment * paymentsMade);

  const compounded = Math.pow(1 + r, paymentsMade);
  const balance = originalBalance * compounded - payment * ((compounded - 1) / r);
  return Math.max(0, Math.round(balance));
}

/**
 * Generate a full amortization schedule at the actual payment frequency.
 * Each entry represents one real payment (monthly, bi-weekly, or weekly).
 */
export interface AmortizationEntry {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface LumpSumPayment {
  amount: number;
  /** Period number (1-based) at which the lump sum is applied */
  period: number;
}

/**
 * Convert dated lump sums to period-indexed lump sums.
 * Period 1 starts at `startDate`, each period is `daysPerPeriod` long.
 */
export function datesToPeriods(
  lumpSums: { amount: number; date: string }[],
  startDate: Date,
  freq: PaymentFrequency
): LumpSumPayment[] {
  const daysPerPeriod = freq === "weekly" || freq === "accelerated-weekly" ? 7 : freq === "bi-weekly" || freq === "accelerated-bi-weekly" ? 14 : 30.44;

  return lumpSums
    .filter((ls) => ls.amount > 0 && ls.date)
    .map((ls) => {
      const d = new Date(ls.date);
      const diffMs = d.getTime() - startDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      const period = Math.max(1, Math.ceil(diffDays / daysPerPeriod));
      return { amount: ls.amount, period };
    })
    .sort((a, b) => a.period - b.period);
}

export function generateAmortizationSchedule(
  originalBalance: number,
  annualRate: number,
  amortizationYears: number,
  freq: PaymentFrequency = "monthly",
  lumpSums: LumpSumPayment[] = []
): AmortizationEntry[] {
  if (originalBalance <= 0 || amortizationYears <= 0) return [];

  const r = effectivePerPeriodRate(annualRate, freq);
  const payment = perPeriodPayment(originalBalance, annualRate, amortizationYears, freq);
  const maxPeriods = paymentsPerYear(freq) * amortizationYears;
  const schedule: AmortizationEntry[] = [];
  let balance = originalBalance;

  // Index lump sums by period for O(1) lookup
  const lumpByPeriod = new Map<number, number>();
  for (const ls of lumpSums) {
    lumpByPeriod.set(ls.period, (lumpByPeriod.get(ls.period) || 0) + ls.amount);
  }

  for (let i = 1; i <= maxPeriods && balance > 0.5; i++) {
    const interest = balance * r;
    let periodPayment = Math.min(payment, balance + interest);
    let principal = periodPayment - interest;

    // Apply lump sum if one falls on this period
    const lump = lumpByPeriod.get(i);
    if (lump && lump > 0) {
      const lumpApplied = Math.min(lump, balance - principal);
      if (lumpApplied > 0) {
        principal += lumpApplied;
        periodPayment += lumpApplied;
      }
    }

    balance = Math.max(0, balance - principal);
    schedule.push({
      period: i,
      payment: Math.round(periodPayment * 100) / 100,
      principal: Math.round(principal * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }

  return schedule;
}

// ── Mortgage penalty estimation ───────────────────────────────────────────────

/**
 * Variable rate: 3 months' interest on the outstanding balance
 * Fixed rate: greater of (a) 3 months' interest or (b) Interest Rate Differential (IRD)
 */
export function estimateMortgagePenalty(
  balance: number,
  annualRate: number,
  mortgageType: MortgageType,
  remainingTermYears: number,
  currentPostedRate: number = 5.0 // fallback posted rate for IRD
): number {
  if (balance <= 0) return 0;

  const threeMonthsInterest = balance * (annualRate / 100) * (3 / 12);

  if (mortgageType === "variable") {
    return Math.round(threeMonthsInterest);
  }

  // Fixed: IRD = (contract rate - current rate) * balance * remaining term
  const rateDiff = Math.max(0, annualRate / 100 - currentPostedRate / 100);
  const ird = rateDiff * balance * remainingTermYears;
  return Math.round(Math.max(threeMonthsInterest, ird));
}

// ── Selling costs ─────────────────────────────────────────────────────────────

export interface SellingCosts {
  commission: number;
  legalFees: number;
  mortgagePenalty: number;
  closingCosts: number;
  total: number;
}

export function calculateSellingCosts(
  estimatedValue: number,
  mortgageBalance: number,
  mortgageRate: number,
  mortgageType: MortgageType,
  remainingTermYears: number
): SellingCosts {
  // Commission: ~4% of sale price (post-2024 Canadian average; was 5%)
  const commission = Math.round(estimatedValue * 0.04);

  // Legal fees: $1,500 – $2,500 range; scale slightly with value
  const legalFees = estimatedValue > 1_000_000 ? 2500 : estimatedValue > 500_000 ? 2000 : 1500;

  // Mortgage penalty
  const mortgagePenalty = estimateMortgagePenalty(
    mortgageBalance,
    mortgageRate,
    mortgageType,
    remainingTermYears
  );

  // Closing costs: title insurance, adjustments, misc (~$1,000-$2,000)
  const closingCosts = estimatedValue > 1_000_000 ? 2000 : 1500;

  const total = commission + legalFees + mortgagePenalty + closingCosts;

  return { commission, legalFees, mortgagePenalty, closingCosts, total };
}

// ── Capital gains tax ─────────────────────────────────────────────────────────

export interface CapitalGainsResult {
  totalGain: number;
  exemptionApplied: boolean;
  taxableGain: number;
  estimatedTax: number;
}

/**
 * Canadian capital gains on real estate:
 * - Principal residence exemption: if the property was your principal residence
 *   for ALL years of ownership, the gain is fully exempt.
 * - Partial exemption: exempt portion = (1 + years designated) / years owned
 * - Only 50% of the remaining taxable gain is included in income (inclusion rate).
 * - We estimate tax at a combined marginal rate based on province.
 */
export function calculateCapitalGains(
  purchasePrice: number,
  estimatedValue: number,
  purchaseYear: number,
  currentYear: number,
  isPrimaryResidence: boolean,
  yearsOccupiedAsPrimary: number,
  province: string
): CapitalGainsResult {
  const totalGain = estimatedValue - purchasePrice;

  if (totalGain <= 0) {
    return { totalGain, exemptionApplied: false, taxableGain: 0, estimatedTax: 0 };
  }

  const yearsOwned = Math.max(1, currentYear - purchaseYear);

  // Full principal residence exemption
  if (isPrimaryResidence && yearsOccupiedAsPrimary >= yearsOwned) {
    return { totalGain, exemptionApplied: true, taxableGain: 0, estimatedTax: 0 };
  }

  // Partial exemption
  let exemptFraction = 0;
  if (isPrimaryResidence && yearsOccupiedAsPrimary > 0) {
    // Formula: (1 + years designated as principal residence) / years owned
    exemptFraction = Math.min(1, (1 + yearsOccupiedAsPrimary) / yearsOwned);
  }

  const taxableGain = Math.round(totalGain * (1 - exemptFraction));

  // 50% inclusion rate (first $250k; after June 25, 2024 changes, 66.7% above $250k)
  const inclusionThreshold = 250_000;
  let includedGain: number;
  if (taxableGain <= inclusionThreshold) {
    includedGain = taxableGain * 0.5;
  } else {
    includedGain = inclusionThreshold * 0.5 + (taxableGain - inclusionThreshold) * 0.6667;
  }

  // Estimated combined marginal tax rate by province (approximate top bracket)
  const marginalRate = getEstimatedMarginalRate(province);
  const estimatedTax = Math.round(includedGain * marginalRate);

  return {
    totalGain,
    exemptionApplied: exemptFraction > 0,
    taxableGain,
    estimatedTax,
  };
}

function getEstimatedMarginalRate(province: string): number {
  // Combined federal + provincial marginal rates (approximate, for ~$100k income bracket)
  const rates: Record<string, number> = {
    Alberta: 0.38,
    "British Columbia": 0.41,
    Manitoba: 0.44,
    "New Brunswick": 0.43,
    "Newfoundland and Labrador": 0.45,
    "Nova Scotia": 0.46,
    Ontario: 0.43,
    "Prince Edward Island": 0.44,
    Quebec: 0.47,
    Saskatchewan: 0.40,
  };
  return rates[province] ?? 0.43;
}

// ── Monthly carrying costs ────────────────────────────────────────────────────

export interface CarryingCosts {
  mortgage: number;
  propertyTax: number;
  insurance: number;
  maintenance: number;
  condoFees: number;
  total: number;
}

/** Convert per-period payment to monthly equivalent for carrying cost display */
function mortgageMonthlyEquivalent(
  balance: number,
  annualRate: number,
  amortizationYearsRemaining: number,
  frequency: PaymentFrequency
): number {
  const payment = perPeriodPayment(balance, annualRate, amortizationYearsRemaining, frequency);
  const ppy = paymentsPerYear(frequency);
  return (payment * ppy) / 12;
}

export function calculateMonthlyCarryingCosts(
  mortgageBalance: number,
  mortgageRate: number,
  amortizationYearsRemaining: number,
  annualPropertyTax: number,
  monthlyCondoFees: number,
  estimatedValue: number,
  paymentFrequency: PaymentFrequency = "monthly"
): CarryingCosts {
  const mortgage = mortgageMonthlyEquivalent(
    mortgageBalance,
    mortgageRate,
    amortizationYearsRemaining,
    paymentFrequency
  );

  const propertyTax = annualPropertyTax / 12;

  // Insurance: ~0.3% of home value annually (Canadian average)
  const insurance = (estimatedValue * 0.003) / 12;

  // Maintenance: ~0.75% of home value annually (conservative estimate)
  const maintenance = (estimatedValue * 0.0075) / 12;

  const total = mortgage + propertyTax + insurance + maintenance + monthlyCondoFees;

  return {
    mortgage: Math.round(mortgage),
    propertyTax: Math.round(propertyTax),
    insurance: Math.round(insurance),
    maintenance: Math.round(maintenance),
    condoFees: Math.round(monthlyCondoFees),
    total: Math.round(total),
  };
}

// ── Break-even analysis ───────────────────────────────────────────────────────

/**
 * Estimate how many months of holding would make selling costs worthwhile.
 * Uses approximate annual appreciation rate.
 * Returns null if appreciation doesn't cover costs (market declining).
 */
export function calculateBreakEvenMonths(
  estimatedValue: number,
  totalSellingCosts: number,
  annualAppreciationRate: number = 0.03 // default 3%
): number | null {
  if (annualAppreciationRate <= 0) return null;

  const monthlyAppreciation = estimatedValue * (annualAppreciationRate / 12);
  if (monthlyAppreciation <= 0) return null;

  const months = Math.ceil(totalSellingCosts / monthlyAppreciation);
  return months;
}

// ── Main calculation orchestrator ─────────────────────────────────────────────

export function calculateFinancials(input: CalcInput): FinancialBreakdown {
  const currentYear = new Date().getFullYear();

  // Equity
  const estimatedEquity = input.estimatedValue - input.mortgageBalance;

  // Selling costs
  const costs = calculateSellingCosts(
    input.estimatedValue,
    input.mortgageBalance,
    input.mortgageRate,
    input.mortgageType,
    input.remainingTermYears
  );

  // Net proceeds
  const netProceeds = estimatedEquity - costs.total;

  // Capital gains
  const capitalGains = calculateCapitalGains(
    input.purchasePrice,
    input.estimatedValue,
    input.purchaseYear,
    currentYear,
    input.isPrimaryResidence,
    input.yearsOccupiedAsPrimary,
    input.province
  );

  // Monthly carrying cost
  const carryingCosts = calculateMonthlyCarryingCosts(
    input.mortgageBalance,
    input.mortgageRate,
    input.amortizationYearsRemaining,
    input.propertyTax,
    input.condoFees,
    input.estimatedValue,
    input.paymentFrequency
  );

  // Break-even
  const breakEvenMonths = calculateBreakEvenMonths(input.estimatedValue, costs.total);

  return {
    estimatedEquity: Math.round(estimatedEquity),
    sellingCosts: {
      commission: costs.commission,
      legalFees: costs.legalFees,
      mortgagePenalty: costs.mortgagePenalty,
      closingCosts: costs.closingCosts,
      total: costs.total,
    },
    netProceeds: Math.round(netProceeds - capitalGains.estimatedTax),
    capitalGains: {
      totalGain: capitalGains.totalGain,
      exemptionApplied: capitalGains.exemptionApplied,
      taxableGain: capitalGains.taxableGain,
      estimatedTax: capitalGains.estimatedTax,
    },
    monthlyCarryingCost: carryingCosts.total,
    breakEvenMonths,
  };
}
