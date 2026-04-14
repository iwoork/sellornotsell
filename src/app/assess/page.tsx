"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ThemeToggle } from "../theme-toggle";

const PROPERTY_TYPES = [
  "Detached House",
  "Semi-Detached",
  "Townhouse",
  "Condo / Apartment",
  "Duplex / Triplex",
  "Other",
] as const;

const MORTGAGE_TYPES = [
  "Fixed",
  "Variable",
  "Don't know",
] as const;

const PAYMENT_FREQUENCIES = [
  "Monthly",
  "Bi-weekly",
  "Accelerated bi-weekly",
  "Weekly",
  "Accelerated weekly",
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

type FormData = {
  // Step 1: Property
  streetAddress: string;
  unit: string;
  city: string;
  province: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  estimatedCurrentValue: string;
  monthlyStrataFees: string;
  // Step 2: Mortgage
  purchasePrice: string;
  purchaseYear: string;
  currentMortgageBalance: string;
  mortgageRate: string;
  mortgageType: string;
  paymentFrequency: string;
  annualPropertyTax: string;
  // Step 3: About you
  sellingReason: string;
  timeline: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consent: boolean;
};

const INITIAL_FORM: FormData = {
  streetAddress: "",
  unit: "",
  city: "",
  province: "",
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  estimatedCurrentValue: "",
  monthlyStrataFees: "",
  purchasePrice: "",
  purchaseYear: "",
  currentMortgageBalance: "",
  mortgageRate: "",
  mortgageType: "",
  paymentFrequency: "",
  annualPropertyTax: "",
  sellingReason: "",
  timeline: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  consent: false,
};

const STEPS = [
  { title: "Your Property", subtitle: "Tell us about your home" },
  { title: "Your Mortgage", subtitle: "A few financial details" },
  { title: "Get Your Results", subtitle: "Where should we send your report?" },
];

function ProgressBar({ step, total }: { step: number; total: number }) {
  const progress = ((step + 1) / total) * 100;
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <span>Step {step + 1} of {total}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function formatWithCommas(val: string): string {
  const num = val.replace(/[^\d.]/g, "");
  const [integer, decimal] = num.split(".");
  const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal !== undefined ? `${formatted}.${decimal}` : formatted;
}

function Input({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  label,
  prefix,
  suffix,
}: {
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  label: string;
  prefix?: string;
  suffix?: string;
}) {
  const isNumeric = type === "number";
  const displayValue = isNumeric && value ? formatWithCommas(value) : value;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
            {prefix}
          </span>
        )}
        <input
          id={id}
          name={id}
          type={isNumeric ? "text" : type}
          inputMode={isNumeric ? "decimal" : undefined}
          placeholder={placeholder ? formatWithCommas(placeholder) : undefined}
          value={displayValue}
          onChange={(e) => {
            if (isNumeric) {
              const raw = e.target.value.replace(/[^\d.]/g, "");
              onChange(raw);
            } else {
              onChange(e.target.value);
            }
          }}
          className={`block w-full rounded-xl border border-border bg-card py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-shadow ${prefix ? "pl-8 pr-3" : suffix ? "pl-4 pr-8" : "px-4"}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
  label,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  label: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-shadow appearance-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24' stroke='%239ca3af' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
      >
        <option value="" className="text-muted">{placeholder || "Select..."}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

// Map Google's administrative_area_level_1 short names to full province names
const PROVINCE_MAP: Record<string, string> = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NS: "Nova Scotia",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Quebec",
  SK: "Saskatchewan",
  NT: "Northwest Territories",
  NU: "Nunavut",
  YT: "Yukon",
};

declare global {
  interface Window {
    google?: typeof google;
  }
}

function PlacesAutocomplete({
  streetAddress,
  city,
  province,
  onSelect,
  onClear,
}: {
  streetAddress: string;
  city: string;
  province: string;
  onSelect: (streetAddress: string, city: string, province: string) => void;
  onClear: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const elementRef = useRef<any>(null);
  const [mountKey, setMountKey] = useState(0);

  const initAutocomplete = useCallback(async () => {
    if (!window.google?.maps || elementRef.current || !containerRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const placesLib = await window.google.maps.importLibrary("places") as any;
    const PlaceAutocompleteElement = placesLib.PlaceAutocompleteElement;
    if (!PlaceAutocompleteElement) return;

    const pac = new PlaceAutocompleteElement({
      includedPrimaryTypes: ["street_address", "subpremise"],
      includedRegionCodes: ["ca"],
    });

    pac.addEventListener("gmp-select", async (e: Event) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const placePrediction = (e as any).placePrediction ?? (e as any).detail?.placePrediction;
      if (!placePrediction) return;

      const place = placePrediction.toPlace();
      await place.fetchFields({ fields: ["addressComponents"] });

      const components = place.addressComponents;
      if (!components) return;

      let streetNumber = "";
      let route = "";
      let selectedCity = "";
      let prov = "";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const comp of components as any[]) {
        const types: string[] = comp.types;
        if (types.includes("street_number")) {
          streetNumber = comp.longText ?? comp.long_name;
        } else if (types.includes("route")) {
          route = comp.longText ?? comp.long_name;
        } else if (types.includes("locality")) {
          selectedCity = comp.longText ?? comp.long_name;
        } else if (types.includes("sublocality_level_1") && !selectedCity) {
          selectedCity = comp.longText ?? comp.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          prov = PROVINCE_MAP[comp.shortText ?? comp.short_name] || comp.longText || comp.long_name;
        }
      }

      const street = [streetNumber, route].filter(Boolean).join(" ");

      if (selectedCity) {
        onSelect(street, selectedCity, prov);
      }
    });

    containerRef.current.appendChild(pac);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    elementRef.current = pac as any;
  }, [onSelect]);

  useEffect(() => {
    if (window.google?.maps) {
      initAutocomplete();
      return;
    }

    const interval = setInterval(() => {
      if (window.google?.maps) {
        initAutocomplete();
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [initAutocomplete]);

  const hasSelection = !!(city && province);

  return (
    <>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Property Address
        </label>
        {hasSelection ? (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground">
            <span className="flex-1 truncate">
              {[streetAddress, city, province].filter(Boolean).join(", ")}
            </span>
            <button
              type="button"
              onClick={() => { elementRef.current = null; setMountKey((k) => k + 1); onClear(); }}
              className="shrink-0 rounded-lg p-0.5 text-muted hover:text-foreground hover:bg-surface transition-colors"
              aria-label="Change address"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        ) : (
          <div
            key={mountKey}
            ref={containerRef}
            className="places-autocomplete-wrapper"
          />
        )}
      </div>
    </>
  );
}

function fetchAssessedValue(
  streetAddress: string,
  city: string,
  unit?: string,
): Promise<number | null> {
  const params = new URLSearchParams({ address: streetAddress, city });
  if (unit) params.set("unit", unit);
  return fetch(`/api/assessed-value?${params}`)
    .then((res) => (res.ok ? res.json() : null))
    .then((json) => json?.assessedValue ?? null)
    .catch(() => null);
}

const CONDO_TYPES = new Set(["Condo / Apartment", "Duplex / Triplex"]);

function Step1({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  const [assessedHint, setAssessedHint] = useState<string | null>(null);
  const [loadingAssessment, setLoadingAssessment] = useState(false);
  const showUnit = !!(form.streetAddress && form.city && CONDO_TYPES.has(form.propertyType));

  const applyAssessedValue = useCallback(
    async (streetAddress: string, city: string, unit?: string) => {
      if (!streetAddress) return;
      setLoadingAssessment(true);
      setAssessedHint(null);
      const val = await fetchAssessedValue(streetAddress, city, unit);
      setLoadingAssessment(false);
      if (val) {
        update({ estimatedCurrentValue: String(val) });
        setAssessedHint(`Pre-filled from BC Assessment ($${Number(val).toLocaleString("en-CA")})`);
      }
    },
    [update],
  );

  const handlePlaceSelect = useCallback(
    async (streetAddress: string, city: string, province: string) => {
      update({ streetAddress, city, province, unit: "" });
      setAssessedHint(null);
      // For non-condo types, look up without unit
      await applyAssessedValue(streetAddress, city);
    },
    [update, applyAssessedValue],
  );

  const handlePlaceClear = useCallback(() => {
    update({ streetAddress: "", unit: "", city: "", province: "" });
    setAssessedHint(null);
  }, [update]);

  // Re-fetch assessed value when unit changes (debounced)
  const unitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleUnitChange = useCallback(
    (unit: string) => {
      update({ unit });
      setAssessedHint(null);
      if (unitTimerRef.current) clearTimeout(unitTimerRef.current);
      if (unit && form.streetAddress && form.city) {
        unitTimerRef.current = setTimeout(() => {
          applyAssessedValue(form.streetAddress, form.city, unit);
        }, 500);
      }
    },
    [update, form.streetAddress, form.city, applyAssessedValue],
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <PlacesAutocomplete
          streetAddress={form.streetAddress}
          city={form.city}
          province={form.province}
          onSelect={handlePlaceSelect}
          onClear={handlePlaceClear}
        />
      </div>
      <Select id="propertyType" label="Property Type" value={form.propertyType} onChange={(v) => {
        update({ propertyType: v });
        // If switching to condo type with an address already set, clear assessed hint (user needs to enter unit)
        if (CONDO_TYPES.has(v) && form.streetAddress) {
          setAssessedHint(null);
        }
        // If switching away from condo, re-fetch without unit
        if (!CONDO_TYPES.has(v) && form.streetAddress && form.city) {
          applyAssessedValue(form.streetAddress, form.city);
        }
      }} options={PROPERTY_TYPES} />
      {showUnit && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="unit" label="Unit / Suite Number" value={form.unit} onChange={handleUnitChange} placeholder="e.g. 510" />
          <Input id="monthlyStrataFees" label="Monthly Strata Fees" type="number" value={form.monthlyStrataFees} onChange={(v) => update({ monthlyStrataFees: v })} placeholder="450" prefix="$" />
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="bedrooms" label="Bedrooms" type="number" value={form.bedrooms} onChange={(v) => update({ bedrooms: v })} placeholder="3" />
        <Input id="bathrooms" label="Bathrooms" type="number" value={form.bathrooms} onChange={(v) => update({ bathrooms: v })} placeholder="2" />
      </div>
      <div>
        <Input id="estimatedCurrentValue" label="Estimated Market Value" type="number" value={form.estimatedCurrentValue} onChange={(v) => { update({ estimatedCurrentValue: v }); setAssessedHint(null); }} placeholder="650,000" prefix="$" />
        {loadingAssessment && (
          <p className="mt-1 text-xs text-muted">Looking up BC Assessment value...</p>
        )}
        {assessedHint && !loadingAssessment && (
          <p className="mt-1 text-xs text-primary">{assessedHint}</p>
        )}
      </div>
    </div>
  );
}

function Step2({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="purchasePrice" label="Purchase Price" type="number" value={form.purchasePrice} onChange={(v) => update({ purchasePrice: v })} placeholder="500,000" prefix="$" />
        <Input id="purchaseYear" label="Year Purchased" type="number" value={form.purchaseYear} onChange={(v) => update({ purchaseYear: v })} placeholder="2019" />
      </div>
      <Input id="currentMortgageBalance" label="Current Mortgage Balance" type="number" value={form.currentMortgageBalance} onChange={(v) => update({ currentMortgageBalance: v })} placeholder="350,000" prefix="$" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="mortgageRate" label="Mortgage Rate" type="number" value={form.mortgageRate} onChange={(v) => update({ mortgageRate: v })} placeholder="4.5" suffix="%" />
        <Select id="mortgageType" label="Mortgage Type" value={form.mortgageType} onChange={(v) => update({ mortgageType: v })} options={MORTGAGE_TYPES} placeholder="Select type" />
      </div>
      <Select id="paymentFrequency" label="Payment Frequency" value={form.paymentFrequency} onChange={(v) => update({ paymentFrequency: v })} options={PAYMENT_FREQUENCIES} placeholder="Select frequency" />
      <Input id="annualPropertyTax" label="Annual Property Tax" type="number" value={form.annualPropertyTax} onChange={(v) => update({ annualPropertyTax: v })} placeholder="4,500" prefix="$" />
    </div>
  );
}

function Step3({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <Select id="sellingReason" label="Why are you considering selling?" value={form.sellingReason} onChange={(v) => update({ sellingReason: v })} options={SELLING_REASONS} placeholder="Select a reason" />
      <Select id="timeline" label="When are you thinking of selling?" value={form.timeline} onChange={(v) => update({ timeline: v })} options={TIMELINES} placeholder="Select timeline" />
      <div className="border-t border-border pt-5">
        <p className="text-xs text-muted mb-4">We&apos;ll email your personalized report.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="firstName" label="First Name" value={form.firstName} onChange={(v) => update({ firstName: v })} placeholder="Jane" />
          <Input id="lastName" label="Last Name" value={form.lastName} onChange={(v) => update({ lastName: v })} placeholder="Smith" />
        </div>
      </div>
      <Input id="email" label="Email" type="email" value={form.email} onChange={(v) => update({ email: v })} placeholder="jane@example.com" />
      <Input id="phone" label="Phone (optional)" type="tel" value={form.phone} onChange={(v) => update({ phone: v })} placeholder="(604) 555-1234" />
      <div className="flex items-start gap-3 rounded-xl bg-surface p-4">
        <input
          id="consent"
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update({ consent: e.target.checked })}
          className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        <label htmlFor="consent" className="text-xs leading-5 text-muted">
          I consent to SellOrNotSell processing my information to provide a property assessment per{" "}
          <Link href="/privacy" className="font-medium text-primary hover:underline">
            our privacy policy
          </Link>.
        </label>
      </div>
    </div>
  );
}

const LOADING_MESSAGES = [
  "Analyzing your property details...",
  "Calculating mortgage & equity...",
  "Estimating selling costs...",
  "Checking capital gains implications...",
  "Reviewing market conditions...",
  "Generating your AI recommendation...",
];

function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="text-center">
        <div className="relative mx-auto h-10 w-10">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
        <p className="mt-6 text-base font-medium text-foreground">
          {LOADING_MESSAGES[messageIndex]}
        </p>
        <p className="mt-2 text-xs text-muted">
          This usually takes 10–20 seconds
        </p>
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
        return !!(form.streetAddress && form.city && form.province && form.propertyType && form.bedrooms && form.bathrooms && form.estimatedCurrentValue);
      case 1:
        return !!(form.purchasePrice && form.purchaseYear && form.currentMortgageBalance && form.mortgageRate && form.mortgageType && form.paymentFrequency && form.annualPropertyTax);
      case 2:
        return !!(form.sellingReason && form.timeline && form.firstName && form.lastName && form.email && form.consent);
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
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
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
          <ThemeToggle />
        </div>
      </header>

      {submitting ? (
        <LoadingScreen />
      ) : (
        <main className="flex-1 px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-lg">
            <ProgressBar step={step} total={STEPS.length} />

            <div className="mt-8">
              <h2 className="text-xl font-bold text-foreground">{STEPS[step].title}</h2>
              <p className="mt-1 text-sm text-muted">{STEPS[step].subtitle}</p>

              <div className="mt-6">{stepComponents[step]}</div>

              {error && (
                <div className="mt-4 rounded-xl bg-error-bg p-3 text-sm text-sell">
                  {error}
                </div>
              )}

              <div className="mt-8 flex items-center gap-3">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="rounded-xl border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
                  >
                    Back
                  </button>
                )}

                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canAdvance()}
                    className="ml-auto rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canAdvance() || submitting}
                    className="ml-auto rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Get My Recommendation
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
