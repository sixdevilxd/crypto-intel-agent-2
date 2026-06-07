import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import pRetry from "p-retry";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } }
);

interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number | null;
  market_cap: number | null;
  total_volume: number | null;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_24h?: number;
  sparkline_in_7d?: { price: number[] };
}

async function fetchMarketData(): Promise<CoinGeckoMarket[]> {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h",
    { headers: { "User-Agent": "crypto-intel-agent/1.0" } }
  );
  if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
  return res.json();
}

function classifySignal(coin: CoinGeckoMarket): "BULLISH" | "BEARISH" | "NEUTRAL" {
  const h1 = coin.price_change_percentage_1h_in_currency ?? 0;
  const h24 = coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h ?? 0;
  if (h1 > 1.5 && h24 > 5) return "BULLISH";
  if (h1 < -1.5 && h24 < -5) return "BEARISH";
  return "NEUTRAL";
}

function computeStrength(coin: CoinGeckoMarket): number {
  const h1 = Math.abs(coin.price_change_percentage_1h_in_currency ?? 0);
  const h24 = Math.abs(coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h ?? 0);
  return Math.min(100, Math.round(h1 * 10 + h24 * 5));
}

export async function GET() {
  const startedAt = Date.now();
  try {
    const markets = await pRetry(fetchMarketData, {
      retries: 3,
      minTimeout: 1500,
      maxTimeout: 5000,
    });

    const rows = markets
      .filter((c) => c.current_price !== null)
      .map((c) => ({
        symbol: c.symbol.toUpperCase(),
        name: c.name,
        price: c.current_price!,
        market_cap: c.market_cap ?? 0,
        volume_24h: c.total_volume ?? 0,
        change_1h: c.price_change_percentage_1h_in_currency ?? 0,
        change_24h: c.price_change_percentage_24h_in_currency ?? c.price_change_percentage_24h ?? 0,
        signal: classifySignal(c),
        strength: computeStrength(c),
        sparkline: c.sparkline_in_7d?.price ?? [],
        scanned_at: new Date().toISOString(),
      }));

    const { error } = await supabase.from("market_data").insert(rows);
    if (error) throw new Error(`Supabase insert error: ${error.message}`);

    return NextResponse.json({
      ok: true,
      count: rows.length,
      duration_ms: Date.now() - startedAt,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
