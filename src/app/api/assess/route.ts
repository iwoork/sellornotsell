import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { calculateFinancials, remainingMortgageBalance, generateAmortizationSchedule, type CalcInput, type PaymentFrequency } from "@/lib/calculations";
import { getRecommendation } from "@/lib/claude";
import type {
  AssessmentInput,
  MortgageType,
  PropertyType,
  SellingReason,
  SellingTimeline,
} from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate and transform the form data into typed structures
    const input = validateAndTransform(body);

    // 1. Save lead to Supabase
    const { data: lead, error: leadError } = await getSupabase()
      .from("leads")
      .insert({
        first_name: input.lead.firstName,
        last_name: input.lead.lastName,
        email: input.lead.email,
        phone: input.lead.phone || "",
        address: input.lead.address || "",
        city: input.lead.city,
        province: input.lead.province,
        postal_code: input.lead.postalCode || "",
        consent_marketing: input.lead.consentMarketing,
        consent_privacy: input.lead.consentPrivacy,
        selling_reason: input.goals.sellingReason,
        timeline: input.goals.timeline,
        property_type: input.property.propertyType,
        estimated_value: input.property.estimatedValue,
        source: "sellornotsell",
      })
      .select("id")
      .single();

    if (leadError || !lead) {
      console.error("Lead insert error:", leadError);
      return NextResponse.json(
        { error: "Failed to save your information. Please try again." },
        { status: 500 }
      );
    }

    // 2. Run financial calculations
    const calcInput: CalcInput = {
      purchasePrice: input.purchase.purchasePrice,
      purchaseYear: input.purchase.purchaseYear,
      estimatedValue: input.property.estimatedValue,
      mortgageBalance: input.purchase.mortgageBalance,
      mortgageRate: input.purchase.mortgageRate,
      mortgageType: input.purchase.mortgageType,
      paymentFrequency: input.purchase.paymentFrequency as PaymentFrequency,
      amortizationYearsRemaining: input.purchase.amortizationYears,
      remainingTermYears: input.purchase.remainingTermYears,
      propertyTax: input.property.propertyTax,
      condoFees: input.property.condoFees,
      isPrimaryResidence: true, // Assumed for MVP — most users are primary residents
      yearsOccupiedAsPrimary: new Date().getFullYear() - input.purchase.purchaseYear,
      province: input.lead.province,
    };

    const financials = calculateFinancials(calcInput);

    // Generate amortization schedule from remaining balance
    const amortizationSchedule = generateAmortizationSchedule(
      calcInput.mortgageBalance,
      calcInput.mortgageRate,
      calcInput.amortizationYearsRemaining * 12
    );
    const financialsWithSchedule = { ...financials, amortizationSchedule };

    // 3. Save initial assessment to Supabase
    const { data: assessment, error: assessError } = await getSupabase()
      .from("assessments")
      .insert({
        lead_id: lead.id,
        purchase_price: input.purchase.purchasePrice,
        purchase_year: input.purchase.purchaseYear,
        down_payment_percent: input.purchase.downPaymentPercent,
        mortgage_balance: input.purchase.mortgageBalance,
        mortgage_rate: input.purchase.mortgageRate,
        mortgage_type: input.purchase.mortgageType,
        amortization_years: input.purchase.amortizationYears,
        remaining_term_years: input.purchase.remainingTermYears,
        property_type: input.property.propertyType,
        estimated_value: input.property.estimatedValue,
        bedrooms: input.property.bedrooms,
        bathrooms: input.property.bathrooms,
        square_feet: input.property.squareFeet,
        condo_fees: input.property.condoFees,
        property_tax: input.property.propertyTax,
        major_renovations: input.property.majorRenovations,
        selling_reason: input.goals.sellingReason,
        timeline: input.goals.timeline,
        move_destination: input.goals.moveDestination,
        additional_notes: input.goals.additionalNotes,
        financials: financialsWithSchedule,
      })
      .select("id")
      .single();

    if (assessError || !assessment) {
      console.error("Assessment insert error:", assessError);
      return NextResponse.json(
        { error: "Failed to save assessment. Please try again." },
        { status: 500 }
      );
    }

    // 4. Call Claude API for recommendation
    const recommendation = await getRecommendation(input, financials);

    // 5. Update assessment with AI result
    const { error: updateError } = await getSupabase()
      .from("assessments")
      .update({
        verdict: recommendation.verdict,
        confidence: recommendation.confidence,
        reasoning: recommendation.reasoning,
        considerations: recommendation.considerations,
      })
      .eq("id", assessment.id);

    if (updateError) {
      console.error("Assessment update error:", updateError);
    }

    // 6. Update lead with verdict
    const { error: leadUpdateError } = await getSupabase()
      .from("leads")
      .update({
        verdict: recommendation.verdict,
        confidence: recommendation.confidence,
      })
      .eq("id", lead.id);

    if (leadUpdateError) {
      console.error("Lead verdict update error:", leadUpdateError);
    }

    return NextResponse.json({
      id: assessment.id,
      verdict: recommendation.verdict,
      confidence: recommendation.confidence,
      financials,
      reasoning: recommendation.reasoning,
      considerations: recommendation.considerations,
    });
  } catch (err) {
    console.error("Assessment error:", err);
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// ── Validation & transformation ──────────────────────────────────────────────

function validateAndTransform(body: Record<string, unknown>): AssessmentInput {
  // Required fields validation
  const required = [
    "firstName", "lastName", "email",
    "city", "province",
    "purchasePrice", "purchaseYear",
    "downPayment", "amortizationYears", "mortgageRate",
    "propertyType", "bedrooms", "bathrooms", "estimatedCurrentValue",
    "annualPropertyTax",
    "sellingReason", "timeline",
  ];

  for (const field of required) {
    if (!body[field] && body[field] !== 0) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (!body.consent) {
    throw new Error("Consent is required to process your assessment.");
  }

  // Email validation
  const email = String(body.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email address.");
  }

  const purchasePrice = Number(body.purchasePrice);
  const downPayment = Number(body.downPayment);
  const purchaseYear = Number(body.purchaseYear);
  const amortizationYearsTotal = Number(body.amortizationYears) || 25;
  const originalMortgage = Math.max(0, purchasePrice - downPayment);
  const mortgageRate = Number(body.mortgageRate);
  const currentYear = new Date().getFullYear();
  const yearsSincePurchase = Math.max(0, currentYear - purchaseYear);
  const paymentsMade = yearsSincePurchase * 12;
  const totalAmortizationMonths = amortizationYearsTotal * 12;
  const mortgageBalance = remainingMortgageBalance(
    originalMortgage, mortgageRate, totalAmortizationMonths, paymentsMade
  );
  const amortizationYearsRemaining = Math.max(0, amortizationYearsTotal - yearsSincePurchase);

  // Map form mortgage type to our type
  const mortgageTypeMap: Record<string, MortgageType> = {
    Fixed: "fixed",
    Variable: "variable",
    "Don't know": "variable", // Default to variable for penalty calc (lower penalty)
  };

  // Map payment frequency
  const paymentFrequencyMap: Record<string, PaymentFrequency> = {
    Monthly: "monthly",
    "Bi-weekly": "bi-weekly",
    "Accelerated bi-weekly": "accelerated-bi-weekly",
    Weekly: "weekly",
    "Accelerated weekly": "accelerated-weekly",
  };

  // Map form property type
  const propertyTypeMap: Record<string, PropertyType> = {
    "Detached House": "detached",
    "Semi-Detached": "semi-detached",
    Townhouse: "townhouse",
    "Condo / Apartment": "condo",
    "Duplex / Triplex": "duplex",
    Other: "other",
  };

  // Map selling reason
  const reasonMap: Record<string, SellingReason> = {
    Downsizing: "downsizing",
    Upgrading: "upsizing",
    "Relocating for work": "relocating",
    Retirement: "retirement",
    "Financial reasons": "financial",
    "Divorce / separation": "lifestyle",
    "Investment property — want to cash out": "investment",
    "Neighbourhood change": "lifestyle",
    Other: "other",
  };

  // Map timeline
  const timelineMap: Record<string, SellingTimeline> = {
    "As soon as possible": "asap",
    "Within 3 months": "3-6 months",
    "Within 6 months": "3-6 months",
    "Within 1 year": "6-12 months",
    "Just exploring options": "just curious",
  };

  return {
    lead: {
      firstName: String(body.firstName).trim(),
      lastName: String(body.lastName).trim(),
      email,
      phone: String(body.phone || "").trim(),
      address: String(body.streetAddress || body.address || "").trim(),
      city: String(body.city).trim(),
      province: String(body.province) as AssessmentInput["lead"]["province"],
      postalCode: body.postalCode ? String(body.postalCode).toUpperCase().replace(/\s/g, "").replace(/^(.{3})/, "$1 ") : "",
      consentMarketing: true,
      consentPrivacy: Boolean(body.consent),
    },
    purchase: {
      purchasePrice,
      purchaseYear,
      downPaymentPercent: purchasePrice > 0 ? Math.round((downPayment / purchasePrice) * 100) : 0,
      mortgageBalance,
      mortgageRate,
      mortgageType: body.mortgageType ? (mortgageTypeMap[String(body.mortgageType)] ?? "variable") : "variable",
      paymentFrequency: paymentFrequencyMap[String(body.paymentFrequency)] ?? "monthly",
      amortizationYears: amortizationYearsRemaining,
      remainingTermYears: body.remainingTermYears ? Number(body.remainingTermYears) : 3,
    },
    property: {
      propertyType: propertyTypeMap[String(body.propertyType)] ?? "other",
      estimatedValue: Number(body.estimatedCurrentValue),
      bedrooms: Number(body.bedrooms),
      bathrooms: Number(body.bathrooms),
      squareFeet: Number(body.sqft) || 0,
      condoFees: Number(body.monthlyStrataFees || body.monthlyCondoFees) || 0,
      propertyTax: Number(body.annualPropertyTax),
      majorRenovations: String(body.majorRenovations || ""),
    },
    goals: {
      sellingReason: reasonMap[String(body.sellingReason)] ?? "other",
      timeline: timelineMap[String(body.timeline)] ?? "just curious",
      moveDestination: String(body.moveDestination || ""),
      additionalNotes: String(body.additionalNotes || ""),
    },
  };
}
