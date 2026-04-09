"use client";

import Link from "next/link";
import { useState } from "react";

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

const PROPERTY_TYPES = [
  "Detached House",
  "Semi-Detached",
  "Townhouse",
  "Condo / Apartment",
  "Duplex / Triplex",
  "Other",
] as const;

const SELLING_REASONS = [
  "Downsizing",
  "Upgrading",
  "Relocating for work",
  "Retirement",
  "Financial reasons",
  "Divorce / separation",
  "Investment property — want to cash out",
  "Neighbourhood change",
  "Other",
] as const;

const TIMELINES = [
  "As soon as possible",
  "Within 3 months",
  "Within 6 months",
  "Within 1 year",
  "Just exploring options",
] as const;

const MORTGAGE_TYPES = ["Fixed", "Variable", "Don't know"] as const;

type FormData = {
  // Step 1: Lead capture
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  consent: boolean;
  // Step 2: Purchase & mortgage
  purchasePrice: string;
  purchaseYear: string;
  downPayment: string;
  currentMortgageBalance: string;
  mortgageRate: string;
  mortgageType: string;
  amortizationYearsRemaining: string;
  // Step 3: Property details
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  estimatedCurrentValue: string;
  annualPropertyTax: string;
  monthlyCondoFees: string;
  majorRenovations: string;
  // Step 4: Goals
  sellingReason: string;
  timeline: string;
  moveDestination: string;
  additionalNotes: string;
};

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  consent: false,
  purchasePrice: "",
  purchaseYear: "",
  downPayment: "",
  currentMortgageBalance: "",
  mortgageRate: "",
  mortgageType: "",
  amortizationYearsRemaining: "",
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  sqft: "",
  estimatedCurrentValue: "",
  annualPropertyTax: "",
  monthlyCondoFees: "",
  majorRenovations: "",
  sellingReason: "",
  timeline: "",
  moveDestination: "",
  additionalNotes: "",
};

const STEP_TITLES = [
  "Your Information",
  "Purchase & Mortgage",
  "Property Details",
  "Your Goals",
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STEP_TITLES.map((title, i) => (
        <div key={title} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
              i < currentStep
                ? "bg-accent text-white"
                : i === currentStep
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-muted"
            }`}
          >
            {i < currentStep ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < STEP_TITLES.length - 1 && (
            <div className={`hidden h-0.5 w-8 sm:block ${i < currentStep ? "bg-accent" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function FieldLabel({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
      {children}
      {required && <span className="ml-1 text-sell">*</span>}
    </label>
  );
}

function Input({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="mt-1 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
    />
  );
}

function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
  required,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <select
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="mt-1 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
    >
      <option value="">{placeholder || "Select..."}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function Step1({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="firstName" required>First Name</FieldLabel>
          <Input id="firstName" value={form.firstName} onChange={(v) => update({ firstName: v })} required placeholder="Jane" />
        </div>
        <div>
          <FieldLabel htmlFor="lastName" required>Last Name</FieldLabel>
          <Input id="lastName" value={form.lastName} onChange={(v) => update({ lastName: v })} required placeholder="Smith" />
        </div>
      </div>
      <div>
        <FieldLabel htmlFor="email" required>Email</FieldLabel>
        <Input id="email" type="email" value={form.email} onChange={(v) => update({ email: v })} required placeholder="jane@example.com" />
      </div>
      <div>
        <FieldLabel htmlFor="phone" required>Phone</FieldLabel>
        <Input id="phone" type="tel" value={form.phone} onChange={(v) => update({ phone: v })} required placeholder="+1 (416) 555-0123" />
      </div>
      <div>
        <FieldLabel htmlFor="address" required>Street Address</FieldLabel>
        <Input id="address" value={form.address} onChange={(v) => update({ address: v })} required placeholder="123 Main Street" />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <FieldLabel htmlFor="city" required>City</FieldLabel>
          <Input id="city" value={form.city} onChange={(v) => update({ city: v })} required placeholder="Toronto" />
        </div>
        <div>
          <FieldLabel htmlFor="province" required>Province</FieldLabel>
          <Select id="province" value={form.province} onChange={(v) => update({ province: v })} options={PROVINCES} required placeholder="Select province" />
        </div>
        <div>
          <FieldLabel htmlFor="postalCode" required>Postal Code</FieldLabel>
          <Input id="postalCode" value={form.postalCode} onChange={(v) => update({ postalCode: v })} required placeholder="M5V 2T6" />
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-lg bg-primary-light p-4">
        <input
          id="consent"
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update({ consent: e.target.checked })}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          required
        />
        <label htmlFor="consent" className="text-xs leading-5 text-muted">
          I consent to SellOrNotSell collecting and processing my personal information to provide a property
          assessment. My data will be handled in accordance with PIPEDA and applicable provincial privacy
          legislation. I can withdraw consent at any time by contacting us.{" "}
          <Link href="/privacy" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>
    </div>
  );
}

function Step2({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="purchasePrice" required>Purchase Price ($)</FieldLabel>
          <Input id="purchasePrice" type="number" value={form.purchasePrice} onChange={(v) => update({ purchasePrice: v })} required placeholder="500000" />
        </div>
        <div>
          <FieldLabel htmlFor="purchaseYear" required>Year Purchased</FieldLabel>
          <Input id="purchaseYear" type="number" value={form.purchaseYear} onChange={(v) => update({ purchaseYear: v })} required placeholder="2019" />
        </div>
      </div>
      <div>
        <FieldLabel htmlFor="downPayment" required>Down Payment ($)</FieldLabel>
        <Input id="downPayment" type="number" value={form.downPayment} onChange={(v) => update({ downPayment: v })} required placeholder="100000" />
      </div>
      <div>
        <FieldLabel htmlFor="currentMortgageBalance" required>Current Mortgage Balance ($)</FieldLabel>
        <Input id="currentMortgageBalance" type="number" value={form.currentMortgageBalance} onChange={(v) => update({ currentMortgageBalance: v })} required placeholder="350000" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="mortgageRate" required>Mortgage Interest Rate (%)</FieldLabel>
          <Input id="mortgageRate" type="number" value={form.mortgageRate} onChange={(v) => update({ mortgageRate: v })} required placeholder="4.5" />
        </div>
        <div>
          <FieldLabel htmlFor="mortgageType" required>Mortgage Type</FieldLabel>
          <Select id="mortgageType" value={form.mortgageType} onChange={(v) => update({ mortgageType: v })} options={MORTGAGE_TYPES} required />
        </div>
      </div>
      <div>
        <FieldLabel htmlFor="amortizationYearsRemaining" required>Years Remaining on Amortization</FieldLabel>
        <Input id="amortizationYearsRemaining" type="number" value={form.amortizationYearsRemaining} onChange={(v) => update({ amortizationYearsRemaining: v })} required placeholder="20" />
      </div>
    </div>
  );
}

function Step3({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  const isCondo = form.propertyType === "Condo / Apartment";
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel htmlFor="propertyType" required>Property Type</FieldLabel>
        <Select id="propertyType" value={form.propertyType} onChange={(v) => update({ propertyType: v })} options={PROPERTY_TYPES} required />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <FieldLabel htmlFor="bedrooms" required>Bedrooms</FieldLabel>
          <Input id="bedrooms" type="number" value={form.bedrooms} onChange={(v) => update({ bedrooms: v })} required placeholder="3" />
        </div>
        <div>
          <FieldLabel htmlFor="bathrooms" required>Bathrooms</FieldLabel>
          <Input id="bathrooms" type="number" value={form.bathrooms} onChange={(v) => update({ bathrooms: v })} required placeholder="2" />
        </div>
        <div>
          <FieldLabel htmlFor="sqft">Square Feet</FieldLabel>
          <Input id="sqft" type="number" value={form.sqft} onChange={(v) => update({ sqft: v })} placeholder="1500" />
        </div>
      </div>
      <div>
        <FieldLabel htmlFor="estimatedCurrentValue" required>Estimated Current Market Value ($)</FieldLabel>
        <Input id="estimatedCurrentValue" type="number" value={form.estimatedCurrentValue} onChange={(v) => update({ estimatedCurrentValue: v })} required placeholder="650000" />
      </div>
      <div>
        <FieldLabel htmlFor="annualPropertyTax" required>Annual Property Tax ($)</FieldLabel>
        <Input id="annualPropertyTax" type="number" value={form.annualPropertyTax} onChange={(v) => update({ annualPropertyTax: v })} required placeholder="4500" />
      </div>
      {isCondo && (
        <div>
          <FieldLabel htmlFor="monthlyCondoFees">Monthly Condo Fees ($)</FieldLabel>
          <Input id="monthlyCondoFees" type="number" value={form.monthlyCondoFees} onChange={(v) => update({ monthlyCondoFees: v })} placeholder="500" />
        </div>
      )}
      <div>
        <FieldLabel htmlFor="majorRenovations">Major Renovations (describe briefly)</FieldLabel>
        <textarea
          id="majorRenovations"
          value={form.majorRenovations}
          onChange={(e) => update({ majorRenovations: e.target.value })}
          rows={2}
          placeholder="e.g., New kitchen in 2022, finished basement"
          className="mt-1 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}

function Step4({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <FieldLabel htmlFor="sellingReason" required>Primary Reason for Considering Selling</FieldLabel>
        <Select id="sellingReason" value={form.sellingReason} onChange={(v) => update({ sellingReason: v })} options={SELLING_REASONS} required />
      </div>
      <div>
        <FieldLabel htmlFor="timeline" required>When Are You Thinking of Selling?</FieldLabel>
        <Select id="timeline" value={form.timeline} onChange={(v) => update({ timeline: v })} options={TIMELINES} required />
      </div>
      <div>
        <FieldLabel htmlFor="moveDestination">Where Would You Move?</FieldLabel>
        <Input id="moveDestination" value={form.moveDestination} onChange={(v) => update({ moveDestination: v })} placeholder="e.g., Smaller condo downtown, another city" />
      </div>
      <div>
        <FieldLabel htmlFor="additionalNotes">Anything Else We Should Know?</FieldLabel>
        <textarea
          id="additionalNotes"
          value={form.additionalNotes}
          onChange={(e) => update({ additionalNotes: e.target.value })}
          rows={3}
          placeholder="e.g., Concerns about the market, upcoming life changes, specific financial goals..."
          className="mt-1 block w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground shadow-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}

export default function AssessPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<FormData>) => setForm((prev) => ({ ...prev, ...patch }));

  const canAdvance = (): boolean => {
    switch (step) {
      case 0:
        return !!(form.firstName && form.lastName && form.email && form.phone && form.address && form.city && form.province && form.postalCode && form.consent);
      case 1:
        return !!(form.purchasePrice && form.purchaseYear && form.downPayment && form.currentMortgageBalance && form.mortgageRate && form.mortgageType && form.amortizationYearsRemaining);
      case 2:
        return !!(form.propertyType && form.bedrooms && form.bathrooms && form.estimatedCurrentValue && form.annualPropertyTax);
      case 3:
        return !!(form.sellingReason && form.timeline);
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }
      const data = await res.json();
      window.location.href = `/result/${data.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setSubmitting(false);
    }
  };

  const stepComponents = [
    <Step1 key="s1" form={form} update={update} />,
    <Step2 key="s2" form={form} update={update} />,
    <Step3 key="s3" form={form} update={update} />,
    <Step4 key="s4" form={form} update={update} />,
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            <span className="text-primary">Sell</span>
            <span className="text-muted">Or</span>
            <span className="text-foreground">NotSell</span>
          </Link>
          <span className="text-sm text-muted">
            Step {step + 1} of {STEP_TITLES.length}
          </span>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <StepIndicator currentStep={step} />

          <div className="mt-8 rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-foreground">{STEP_TITLES[step]}</h2>
            <p className="mt-1 text-sm text-muted">
              {step === 0 && "We need your contact info to deliver your personalized report."}
              {step === 1 && "Tell us about your original purchase and current mortgage."}
              {step === 2 && "Help us understand your property to estimate its value."}
              {step === 3 && "Your goals help our AI tailor its recommendation."}
            </p>

            <div className="mt-6">{stepComponents[step]}</div>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-sell">
                {error}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-gray-50"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < STEP_TITLES.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canAdvance()}
                  className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canAdvance() || submitting}
                  className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Analyzing..." : "Get My Recommendation"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
