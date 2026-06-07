import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chain = searchParams.get('chain') || 'solana';
  const sort = searchParams.get('sort') || 'opportunity';

  // Ambil token + score terakhir
  const { data: tokens, error } = await supabase
    .from('tokens')
    .select(`
      id, chain, contract_address, symbol, name,
      snapshots: snapshots!inner(price_usd, mcap_usd, liquidity_usd, vol_24h),
      scores: scores!inner(momentum, risk, opportunity, confidence, community, warnings, bullish_factors, bearish_factors, ts)
    `)
    .eq('chain', chain)
    .order('ts', { foreignTable: 'scores', ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Ambil score & snapshot terbaru per token
  const items = (tokens || []).map((t: any) => {
    const latestScore = t.scores?.[0];
    const latestSnap = t.snapshots?.[t.snapshots.length - 1];
    return {
      id: t.id,
      chain: t.chain,
      symbol: t.symbol,
      name: t.name,
      contract: t.contract_address,
      ...latestScore,
      ...latestSnap,
    };
  });

  // Sort
  items.sort((a, b) => {
    if (sort === 'opportunity') return (b.opportunity || 0) - (a.opportunity || 0);
    if (sort === 'momentum') return (b.momentum || 0) - (a.momentum || 0);
    if (sort === 'volume') return Number(b.vol_24h || 0) - Number(a.vol_24h || 0);
    return 0;
  });

  return NextResponse.json({ items: items.slice(0, 50) });
}
