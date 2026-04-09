// Canadian provinces supported by the platform
export const PROVINCES = [
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

export type Province = (typeof PROVINCES)[number];

// Property types
export type PropertyType = "detached" | "semi-detached" | "townhouse" | "condo" | "duplex" | "other";

// Mortgage type
export type MortgageType = "fixed" | "variable";

// Selling reason
export type SellingReason =
  | "upsizing"
  | "downsizing"
  | "relocating"
  | "financial"
  | "lifestyle"
  | "investment"
  | "retirement"
  | "other";

// Timeline
export type SellingTimeline = "asap" | "3-6 months" | "6-12 months" | "1-2 years" | "just curious";

// Lead capture (Step 1)
export interface LeadInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: Province;
  postalCode: string;
  consentMarketing: boolean;
  consentPrivacy: boolean;
}

// Purchase & mortgage info (Step 2)
export interface PurchaseInfo {
  purchasePrice: number;
  purchaseYear: number;
  downPaymentPercent: number;
  mortgageBalance: number;
  mortgageRate: number;
  mortgageType: MortgageType;
  amortizationYears: number;
  remainingTermYears: number;
}

// Property details (Step 3)
export interface PropertyDetails {
  propertyType: PropertyType;
  estimatedValue: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  condoFees: number; // monthly, 0 if not condo
  propertyTax: number; // annual
  majorRenovations: string;
}

// Homeowner goals (Step 4)
export interface HomeownerGoals {
  sellingReason: SellingReason;
  timeline: SellingTimeline;
  moveDestination: string; // city or province
  additionalNotes: string;
}

// Full assessment input
export interface AssessmentInput {
  lead: LeadInfo;
  purchase: PurchaseInfo;
  property: PropertyDetails;
  goals: HomeownerGoals;
}

// AI verdict
export type Verdict = "SELL" | "HOLD";
export type ConfidenceLevel = "high" | "medium" | "low";

// Financial breakdown returned to user
export interface FinancialBreakdown {
  estimatedEquity: number;
  sellingCosts: {
    commission: number;
    legalFees: number;
    mortgagePenalty: number;
    closingCosts: number;
    total: number;
  };
  netProceeds: number;
  capitalGains: {
    totalGain: number;
    exemptionApplied: boolean;
    taxableGain: number;
    estimatedTax: number;
  };
  monthlyCarryingCost: number;
  breakEvenMonths: number | null;
}

// AI result
export interface AssessmentResult {
  id: string;
  verdict: Verdict;
  confidence: ConfidenceLevel;
  financials: FinancialBreakdown;
  reasoning: string[];
  considerations: string[];
  createdAt: string;
}

// Database types
export interface DbLead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  consent_marketing: boolean;
  consent_privacy: boolean;
  source: "sellornotsell" | "searchstrata";
  created_at: string;
}

export interface DbAssessment {
  id: string;
  lead_id: string;
  purchase_price: number;
  purchase_year: number;
  down_payment_percent: number;
  mortgage_balance: number;
  mortgage_rate: number;
  mortgage_type: MortgageType;
  amortization_years: number;
  remaining_term_years: number;
  property_type: PropertyType;
  estimated_value: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  condo_fees: number;
  property_tax: number;
  major_renovations: string;
  selling_reason: SellingReason;
  timeline: SellingTimeline;
  move_destination: string;
  additional_notes: string;
  verdict: Verdict | null;
  confidence: ConfidenceLevel | null;
  financials: FinancialBreakdown | null;
  reasoning: string[] | null;
  considerations: string[] | null;
  created_at: string;
}

export interface DbMarketData {
  id: string;
  province: string;
  city: string;
  avg_price: number;
  median_price: number;
  avg_days_on_market: number;
  price_change_yoy: number; // percentage
  updated_at: string;
}

export interface DbBankRate {
  id: string;
  rate_type: "prime" | "fixed_5yr" | "variable";
  rate: number;
  effective_date: string;
  updated_at: string;
}
