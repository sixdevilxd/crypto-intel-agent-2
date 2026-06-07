'use client';
import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Home() {
  const [chain, setChain] = useState('solana');
  const [sort, setSort] = useState('opportunity');
  const { data, error } = useSWR(`/api/feed?chain=${chain}&sort=${sort}`, fetcher, { refreshInterval: 30000 });

  return (
    <main className="container">
      <h1>🔍 Crypto Intel Agent</h1>
      
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={chain} onChange={e => setChain(e.target.value)}>
          <option value="solana">Solana</option>
          <option value="base">Base</option>
          <option value="ethereum">Ethereum</option>
          <option value="bsc">BNB</option>
          <option value="arbitrum">Arbitrum</option>
          <option value="polygon">Polygon</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="opportunity">Opportunity</option>
          <option value="momentum">Momentum</option>
          <option value="new">Newest</option>
          <option value="volume">Volume</option>
        </select>
      </div>

      {error && <p>Error loading data. Cek konfigurasi Supabase.</p>}
      {!data && <p>Loading...</p>}
      
      <div className="grid">
        {data?.items?.map((t: any) => (
          <div key={t.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <strong>{t.symbol}</strong>
                <div className="tag">{t.name} • {t.chain}</div>
              </div>
              <div>
                <span className="badge badge-good">Opp {t.opportunity}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              <span className="badge badge-neutral">Mom {t.momentum}</span>
              <span className="badge badge-bad">Risk {t.risk}</span>
              <span className="badge badge-neutral">Conf {t.confidence}</span>
              <span className="badge badge-neutral">Comm {t.community}</span>
            </div>
            
            <div style={{ marginTop: 12, fontSize: 12, color: '#a1a1aa' }}>
              MC: ${formatNum(t.mcap_usd)} • Liq: ${formatNum(t.liquidity_usd)} • Vol24h: ${formatNum(t.vol_24h)}
            </div>
            
            {t.warnings?.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#fbbf24' }}>
                ⚠️ {t.warnings.slice(0, 2).join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

function formatNum(n: any) {
  if (!n) return '0';
  const num = Number(n);
  if (num > 1e9) return (num/1e9).toFixed(2) + 'B';
  if (num > 1e6) return (num/1e6).toFixed(2) + 'M';
  if (num > 1e3) return (num/1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}
