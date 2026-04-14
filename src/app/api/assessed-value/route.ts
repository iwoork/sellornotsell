import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city")?.trim();
  if (!city) {
    return NextResponse.json({ error: "city is required" }, { status: 400 });
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("properties")
    .select("listing_data->assessedValue")
    .ilike("city", city)
    .not("listing_data->assessedValue", "is", null);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch assessed values" }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ assessedValue: null });
  }

  // Calculate average assessed value for the city
  const values = data
    .map((row) => Number(row.assessedValue))
    .filter((v) => v > 0);

  if (values.length === 0) {
    return NextResponse.json({ assessedValue: null });
  }

  const avg = Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);

  return NextResponse.json({ assessedValue: avg, count: values.length });
}
