import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const province = searchParams.get("province");
  const city = searchParams.get("city");

  let query = getSupabase()
    .from("market_data")
    .select("province, city, avg_price, median_price, avg_days_on_market, price_change_yoy, updated_at")
    .order("province")
    .order("city");

  if (province) {
    query = query.eq("province", province);
  }
  if (city) {
    query = query.eq("city", city);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Market data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data." },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: data ?? [] });
}
