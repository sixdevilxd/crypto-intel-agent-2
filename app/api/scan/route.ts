import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import pRetry from 'p-retry';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function fetchDexScreener(chain: string) {
  return pRetry(
    async () => {
      const res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${chain}`);
      if (!res.ok) throw new Error('DexScreener fail');
      return res.json();
    },
    { retries: 2, minTimeout: 1000 }
  );
}

function calcMomentum(s: any) {
  // Simplified momentum
  const volAccel = Number(s.vol_5m || 0) / Math.max(Number(s.vol_1h || 0) / 12, 1);
  const buyRatio = (Number(s.txns_5m_buys) || 0) / 
                   Math.max((Number(s.txns_5m_buys) || 0) + (Number(s.txns_5m_sells) || 0), 1);
  const priceCh = Number(s.price_ch_1h) || 0;
  
  let score = 0;
  if (volAccel > 2) score += 30;
  else if (volAccel > 1) score += 15;
  if (buyRatio > 0.7) score += 25;
  else if (buyRatio > 0.5) score += 15;
  if (priceCh > 20) score += 25;
  else if (priceCh > 0) score += 10;
  if (Number(s.liquidity_usd) > 50000) score += 20;
  return Math.min(100, score);
}

function calcRisk(s: any) {
  let risk = 0;
  if (Number(s.liquidity_usd) < 10000) risk += 40;
  else if (Number(s.liquidity_usd) < 50000) risk += 20;
  
  const ageHours = s.ageHours || 0;
  if (ageHours < 24) risk += 30;
  else if (ageHours < 168) risk += 15;
  
  if (Number(s.liquidity_usd) / Math.max(Number(s.mcap_usd), 1) < 0.05) risk += 30;
  return Math.min(100, risk);
}

function calcOpportunity(m: number, r: number, c: number) {
  let opp = 0.35 * m + 0.30 * (100 - r) + 0.15 * 50 + 0.10 * 50 + 0.10 * 50;
  if (r > 80) opp -= 25;
  if (c < 40) opp -= 15;
  return Math.max(0, Math.min(100, Math.round(opp)));
}

function calcConfidence(s: any) {
  let conf = 50;
  if (s.price_usd) conf += 10;
  if (s.mcap_usd) conf += 10;
  if (s.liquidity_usd) conf += 10;
  if (s.vol_24h) conf += 10;
  if (s.txns_24h_buys != null) conf += 10;
  return Math.min(100, conf);
}

export async function GET() {
  try {
    const chains = ['solana', 'base', 'ethereum', 'bsc', 'arbitrum', 'polygon'];
    let totalScanned = 0;
    
    for (const chain of chains) {
      try {
        const data: any = await fetchDexScreener(chain);
        const pairs = data.pairs || [];
        totalScanned += pairs.length;
        
        for (const p of pairs.slice(0, 20)) { // Limit per chain
          if (!p.baseToken?.address) continue;
          
          // Upsert token
          const { data: token } = await supabase
            .from('tokens')
            .upsert({
              chain,
              contract_address: p.baseToken.address,
              symbol: p.baseToken.symbol,
              name: p.baseToken.name,
            }, { onConflict: 'chain,contract_address' })
            .select()
            .single();
          
          if (!token) continue;
          
          // Upsert pair
          const { data: pair } = await supabase
            .from('pairs')
            .upsert({
              token_id: token.id,
              chain,
              pair_address: p.pairAddress,
              dex: p.dexId,
              quote_symbol: p.quoteToken?.symbol,
              created_at_ts: p.pairCreatedAt ? Math.floor(p.pairCreatedAt / 1000) : null,
            }, { onConflict: 'chain,pair_address' })
            .select()
            .single();
          
          if (!pair) continue;
          
          // Snapshot data
          const snap = {
            pair_id: pair.id,
            token_id: token.id,
            price_usd: p.priceUsd,
            mcap_usd: p.marketCap,
            fdv_usd: p.fdv,
            liquidity_usd: p.liquidity?.usd,
            vol_5m: p.volume?.m5,
            vol_1h: p.volume?.h1,
            vol_6h: p.volume?.h6,
            vol_24h: p.volume?.h24,
            txns_5m_buys: p.txns?.m5?.buys,
            txns_5m_sells: p.txns?.m5?.sells,
            txns_24h_buys: p.txns?.h24?.buys,
            txns_24h_sells: p.txns?.h24?.sells,
            price_ch_5m: p.priceChange?.m5,
            price_ch_1h: p.priceChange?.h1,
            price_ch_6h: p.priceChange?.h6,
            price_ch_24h: p.priceChange?.h24,
          };
          
          await supabase.from('snapshots').insert(snap);
          
          // Calculate scores
          const ageHours = p.pairCreatedAt 
            ? (Date.now() - p.pairCreatedAt) / 3600000 
            : 999;
          
          const snapData = { ...snap, ageHours };
          const momentum = calcMomentum(snapData);
          const risk = calcRisk(snapData);
          const confidence = calcConfidence(snapData);
          const opportunity = calcOpportunity(momentum, risk, confidence);
          
          const warnings: string[] = [];
          if (ageHours < 24) warnings.push('Token baru');
          if (Number(p.liquidity?.usd) < 10000) warnings.push('Likuiditas rendah');
          if (Number(p.liquidity?.usd || 0) / Math.max(Number(p.marketCap), 1) < 0.05) 
            warnings.push('Likuiditas sangat rendah vs market cap');
          
          await supabase.from('scores').insert({
            token_id: token.id,
            momentum,
            risk,
            opportunity,
            confidence,
            community: 0,
            warnings,
            bullish_factors: momentum > 60 ? ['Volume tinggi', 'Buy pressure bagus'] : [],
            bearish_factors: risk > 60 ? ['Risiko tinggi', 'Likuiditas rendah'] : [],
            reasoning_summary: `Token ${p.baseToken.symbol} di ${chain}. Momentum ${momentum}, Risk ${risk}.`,
          });
        }
      } catch (e) {
        console.error(`Error scanning ${chain}:`, e);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      scanned: totalScanned,
      timestamp: new Date().toISOString() 
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
