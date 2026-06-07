import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } }
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("market_data")
      .select("symbol, name, price, market_cap, volume_24h, change_1h, change_24h, signal, strength, sparkline, scanned_at")
      .order("market_cap", { ascending: false })
      .limit(50);

    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true, data: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
