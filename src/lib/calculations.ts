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

/**
 * Convert a per-payment mortgage amount to a monthly equivalent based on frequency.
 *
 * - Monthly: 1 payment/month (12/year)
 * - Bi-weekly: payment = monthly / 2, 26 payments/year → monthly equiv = payment × 26 / 12
 * - Accelerated bi-weekly: payment = monthly / 2, 26 payments/year (pays off faster)
 * - Weekly: payment = monthly / 4, 52 payments/year → monthly equiv = payment × 52 / 12
 * - Accelerated weekly: payment = monthly / 4, 52 payments/year (pays off faster)
 *
 * For accelerated schedules, the per-payment amount equals the non-accelerated amount
 * but there are more payments per year, so the monthly cost is higher.
 */
function mortgageMonthlyEquivalent(
  balance: number,
  annualRate: number,
  amortizationYearsRemaining: number,
  frequency: PaymentFrequency
): number {
  // Base monthly payment
  const monthly = monthlyMortgagePayment(
    balance,
    annualRate,
    amortizationYearsRemaining * 12
  );

  switch (frequency) {
    case "monthly":
      return monthly;
    case "bi-weekly":
      // 26 payments/year, each = annual cost / 26
      return (monthly * 12) / 12; // same annual cost, same monthly equiv
    case "accelerated-bi-weekly":
      // payment = monthly / 2, but 26 payments/year → annual = monthly/2 × 26 = monthly × 13
      return (monthly * 13) / 12;
    case "weekly":
      // 52 payments/year, each = annual cost / 52
      return (monthly * 12) / 12; // same annual cost
    case "accelerated-weekly":
      // payment = monthly / 4, but 52 payments/year → annual = monthly/4 × 52 = monthly × 13
      return (monthly * 13) / 12;
    default:
      return monthly;
  }
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
