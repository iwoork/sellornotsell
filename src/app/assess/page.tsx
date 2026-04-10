"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CITIES_BY_PROVINCE } from "@/lib/cities";

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

type FormData = {
  // Step 1: Property
  city: string;
  province: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  estimatedCurrentValue: string;
  // Step 2: Mortgage
  purchasePrice: string;
  purchaseYear: string;
  currentMortgageBalance: string;
  mortgageRate: string;
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
  city: "",
  province: "",
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  estimatedCurrentValue: "",
  purchasePrice: "",
  purchaseYear: "",
  currentMortgageBalance: "",
  mortgageRate: "",
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
      <div className="h-1 w-full overflow-hidden rounded-full bg-surface">
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
        <option value="" className="text-gray-300">{placeholder || "Select..."}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function CityCombobox({
  value,
  onChange,
  province,
}: {
  value: string;
  onChange: (v: string) => void;
  province: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const allCities = province && province in CITIES_BY_PROVINCE
    ? (CITIES_BY_PROVINCE[province as keyof typeof CITIES_BY_PROVINCE] ?? [])
    : Object.values(CITIES_BY_PROVINCE).flat().sort();

  const filtered = value
    ? allCities.filter((c) => c.toLowerCase().includes(value.toLowerCase()))
    : allCities;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setHighlighted(-1);
  }, [value, open]);

  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      const el = listRef.current.children[highlighted] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted]);

  function select(city: string) {
    onChange(city);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h < filtered.length - 1 ? h + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => (h > 0 ? h - 1 : filtered.length - 1));
    } else if (e.key === "Enter" && highlighted >= 0) {
      e.preventDefault();
      select(filtered[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1.5">
        City
      </label>
      <input
        id="city"
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls="city-listbox"
        autoComplete="off"
        placeholder="Type or select a city"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="block w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-shadow"
      />
      {open && filtered.length > 0 && (
        <ul
          id="city-listbox"
          ref={listRef}
          role="listbox"
          className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-border bg-card shadow-lg"
        >
          {filtered.map((city, i) => (
            <li
              key={city}
              role="option"
              aria-selected={highlighted === i}
              onMouseDown={() => select(city)}
              onMouseEnter={() => setHighlighted(i)}
              className={`cursor-pointer px-4 py-2.5 text-sm ${
                highlighted === i
                  ? "bg-primary-light text-primary font-medium"
                  : "text-foreground hover:bg-surface"
              } ${value.toLowerCase() === city.toLowerCase() ? "font-semibold" : ""}`}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Step1({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <CityCombobox value={form.city} onChange={(v) => update({ city: v })} province={form.province} />
        <Select id="province" label="Province" value={form.province} onChange={(v) => update({ province: v })} options={PROVINCES} placeholder="Select province" />
      </div>
      <Select id="propertyType" label="Property Type" value={form.propertyType} onChange={(v) => update({ propertyType: v })} options={PROPERTY_TYPES} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="bedrooms" label="Bedrooms" type="number" value={form.bedrooms} onChange={(v) => update({ bedrooms: v })} placeholder="3" />
        <Input id="bathrooms" label="Bathrooms" type="number" value={form.bathrooms} onChange={(v) => update({ bathrooms: v })} placeholder="2" />
      </div>
      <Input id="estimatedCurrentValue" label="Estimated Market Value" type="number" value={form.estimatedCurrentValue} onChange={(v) => update({ estimatedCurrentValue: v })} placeholder="650,000" prefix="$" />
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
        <Input id="annualPropertyTax" label="Annual Property Tax" type="number" value={form.annualPropertyTax} onChange={(v) => update({ annualPropertyTax: v })} placeholder="4,500" prefix="$" />
      </div>
    </div>
  );
}

function Step3({ form, update }: { form: FormData; update: (patch: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <Select id="sellingReason" label="Why are you considering selling?" value={form.sellingReason} onChange={(v) => update({ sellingReason: v })} options={SELLING_REASONS} placeholder="Select a reason" />
      <Select id="timeline" label="When are you thinking of selling?" value={form.timeline} onChange={(v) => update({ timeline: v })} options={TIMELINES} placeholder="Select timeline" />
      <div className="border-t border-gray-100 pt-5">
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
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
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
          <div className="relative h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-primary" />
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
        return !!(form.city && form.province && form.propertyType && form.bedrooms && form.bathrooms && form.estimatedCurrentValue);
      case 1:
        return !!(form.purchasePrice && form.purchaseYear && form.currentMortgageBalance && form.mortgageRate && form.annualPropertyTax);
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
              <rect width="32" height="32" rx="7" fill="#0f766e"/>
              <path d="M16 6L5 15h3v11h16V15h3L16 6z" fill="white"/>
              <line x1="16" y1="10" x2="16" y2="26" stroke="#0f766e" strokeWidth="1" opacity="0.3"/>
            </svg>
            <span>
              <span className="text-primary">Sell</span>
              <span className="text-muted">Or</span>
              <span className="text-foreground">NotSell</span>
            </span>
          </Link>
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
                <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-sell">
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
