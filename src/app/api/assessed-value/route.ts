import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")?.trim();
  const city = req.nextUrl.searchParams.get("city")?.trim();

  if (!address || !city) {
    return NextResponse.json({ error: "address and city are required" }, { status: 400 });
  }

  const supabase = getSupabase();

  // Try exact match on street_address + city
  const { data, error } = await supabase
    .from("properties")
    .select("listing_data->assessedValue")
    .ilike("street_address", address)
    .ilike("city", city)
    .not("listing_data->assessedValue", "is", null)
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Failed to fetch assessed value" }, { status: 500 });
  }

  if (!data || !data.assessedValue) {
    return NextResponse.json({ assessedValue: null });
  }

  return NextResponse.json({ assessedValue: Number(data.assessedValue) });
}
