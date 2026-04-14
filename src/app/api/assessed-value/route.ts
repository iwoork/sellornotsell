import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")?.trim();
  const city = req.nextUrl.searchParams.get("city")?.trim();
  const unit = req.nextUrl.searchParams.get("unit")?.trim();

  if (!address || !city) {
    return NextResponse.json({ error: "address and city are required" }, { status: 400 });
  }

  const supabase = getSupabase();

  let query = supabase
    .from("properties")
    .select("listing_data->assessedValue")
    .ilike("street_address", address)
    .ilike("city", city)
    .not("listing_data->assessedValue", "is", null);

  if (unit) {
    query = query.eq("unit", unit);
  } else {
    // When no unit is provided, prefer rows without a unit (houses, not condos)
    query = query.or("unit.is.null,unit.eq.");
  }

  const { data, error } = await query.limit(1).maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Failed to fetch assessed value" }, { status: 500 });
  }

  if (!data || !data.assessedValue) {
    return NextResponse.json({ assessedValue: null });
  }

  return NextResponse.json({ assessedValue: Number(data.assessedValue) });
}
