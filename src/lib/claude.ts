import Anthropic from "@anthropic-ai/sdk";
import type {
  AssessmentInput,
  FinancialBreakdown,
  Verdict,
  ConfidenceLevel,
} from "./types";

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

export interface ClaudeRecommendation {
  verdict: Verdict;
  confidence: ConfidenceLevel;
  reasoning: string[];
  considerations: string[];
}

export async function getRecommendation(
  input: AssessmentInput,
  financials: FinancialBreakdown
): Promise<ClaudeRecommendation> {
  const prompt = buildPrompt(input, financials);

  const message = await getAnthropic().messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
    system:
      "You are a Canadian real estate financial advisor AI. You analyze property data and financial calculations to recommend whether a homeowner should SELL or HOLD their property. Always respond with valid JSON only — no markdown, no code fences, no explanation outside the JSON.",
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Parse the JSON response
  const parsed = JSON.parse(text) as {
    verdict: string;
    confidence: string;
    reasoning: string[];
    considerations: string[];
  };

  // Validate and normalize
  const verdict: Verdict =
    parsed.verdict?.toUpperCase() === "SELL" ? "SELL" : "HOLD";
  const confidence: ConfidenceLevel = (["high", "medium", "low"] as const).includes(
    parsed.confidence as ConfidenceLevel
  )
    ? (parsed.confidence as ConfidenceLevel)
    : "medium";

  return {
    verdict,
    confidence,
    reasoning: Array.isArray(parsed.reasoning)
      ? parsed.reasoning.slice(0, 6)
      : [],
    considerations: Array.isArray(parsed.considerations)
      ? parsed.considerations.slice(0, 5)
      : [],
  };
}

function buildPrompt(
  input: AssessmentInput,
  financials: FinancialBreakdown
): string {
  const { lead, purchase, property, goals } = input;
  const f = financials;

  return `Analyze this Canadian homeowner's situation and recommend whether they should SELL or HOLD their property.

## Property Information
- Location: ${lead.city}, ${lead.province}
- Property type: ${property.propertyType}
- Bedrooms: ${property.bedrooms}, Bathrooms: ${property.bathrooms}
- Square feet: ${property.squareFeet || "Unknown"}
- ${property.condoFees > 0 ? `Monthly condo fees: $${property.condoFees.toLocaleString()}` : "No condo fees"}
- Major renovations: ${property.majorRenovations || "None noted"}

## Purchase & Mortgage
- Purchase price: $${purchase.purchasePrice.toLocaleString()} (${purchase.purchaseYear})
- Current estimated value: $${property.estimatedValue.toLocaleString()}
- Mortgage balance: $${purchase.mortgageBalance.toLocaleString()}
- Mortgage rate: ${purchase.mortgageRate}% (${purchase.mortgageType})
- Amortization remaining: ${purchase.amortizationYears} years

## Financial Calculations (pre-computed)
- Estimated equity: $${f.estimatedEquity.toLocaleString()}
- Selling costs breakdown:
  - Commission (5%): $${f.sellingCosts.commission.toLocaleString()}
  - Legal fees: $${f.sellingCosts.legalFees.toLocaleString()}
  - Mortgage penalty: $${f.sellingCosts.mortgagePenalty.toLocaleString()}
  - Closing costs: $${f.sellingCosts.closingCosts.toLocaleString()}
  - Total selling costs: $${f.sellingCosts.total.toLocaleString()}
- Net proceeds after all costs: $${f.netProceeds.toLocaleString()}
- Capital gains: $${f.capitalGains.totalGain.toLocaleString()} total gain${f.capitalGains.exemptionApplied ? " (principal residence exemption applied)" : ""}
  - Taxable gain: $${f.capitalGains.taxableGain.toLocaleString()}
  - Estimated tax: $${f.capitalGains.estimatedTax.toLocaleString()}
- Monthly carrying cost: $${f.monthlyCarryingCost.toLocaleString()}/month
- Break-even: ${f.breakEvenMonths ? `${f.breakEvenMonths} months` : "N/A (market declining)"}

## Homeowner's Situation
- Reason for considering selling: ${goals.sellingReason}
- Timeline: ${goals.timeline}
- Where they'd move: ${goals.moveDestination || "Undecided"}
- Additional notes: ${goals.additionalNotes || "None"}

## Instructions
Weigh all factors: equity position, net proceeds, carrying costs, market timing, goal alignment, tax implications, and mortgage penalties. Consider the homeowner's stated timeline and reason.

Respond with ONLY this JSON structure:
{
  "verdict": "SELL" or "HOLD",
  "confidence": "high", "medium", or "low",
  "reasoning": ["reason 1", "reason 2", "reason 3", ...],
  "considerations": ["consideration 1", "consideration 2", ...]
}

"reasoning" = 3-6 bullet points explaining WHY this verdict.
"considerations" = 2-5 things the homeowner should keep in mind regardless of the verdict.`;
}
