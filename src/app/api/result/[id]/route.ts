import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Missing assessment ID" }, { status: 400 });
  }

  const { data, error } = await getSupabase()
    .from("assessments")
    .select("id, verdict, confidence, financials, reasoning, considerations, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: data.id,
    verdict: data.verdict,
    confidence: data.confidence,
    financials: data.financials,
    reasoning: data.reasoning,
    considerations: data.considerations,
    createdAt: data.created_at,
  });
}
