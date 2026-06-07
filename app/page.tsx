"use client";

import { useEffect, useState } from "react";

interface Coin {
  symbol: string;
  name: string;
  price: number;
  market_cap: number;
  volume_24h: number;
  change_1h: number;
  change_24h: number;
  signal: string;
  strength: number;
  sparkline: number[];
  scanned_at: string;
  image?: string;
  ath?: number;
  atl?: number;
  high_24h?: number;
  low_24h?: number;
  circulating_supply?: number;
  total_supply?: number;
}

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [selected, setSelected] = useState<Coin | null>(null);

  async function loadData() {
    try {
      const res = await fetch("/api/feed");
      const json = await res.json();
      if (json.ok) {
        setCoins(json.data);
        setError(null);
        if (json.data[0]) setLastUpdate(json.data[0].scanned_at);
      } else {
        setError(json.error || "Failed to load");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>🪙 Crypto Intel Agent</h1>
        <p style={{ color: "#94a3b8" }}>Loading market data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h1 style={{ ...styles.title, color: "#ef4444" }}>❌ Error</h1>
        <p style={{ color: "#94a3b8" }}>{error}</p>
        <button onClick={loadData} style={styles.button}>Retry</button>
      </div>
    );
  }

  // Detect meme coin & new pairs
  const memeKeywords = ["doge", "shib", "pepe", "floki", "meme", "bonk", "wif", "brett", "moodeng", "popcat", "turbo", "mood"];
  const isMeme = (c: Coin) => memeKeywords.some(k => c.name.toLowerCase().includes(k) || c.symbol.toLowerCase().includes(k));
  const memeCoins = coins.filter(isMeme);

  // New pairs = coin dengan market cap relatif kecil tapi volume tinggi (likely baru listing)
  const medianCap = [...coins].sort((a, b) => a.market_cap - b.market_cap)[Math.floor(coins.length / 2)]?.market_cap || 0;
  const newPairs = coins
    .filter(c => c.market_cap < medianCap * 0.3 && c.volume_24h > 1e7 && Math.abs(c.change_24h) > 3)
    .sort((a, b) => Math.abs(b.change_24h) - Math.abs(a.change_24h))
    .slice(0, 10);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🪙 Crypto Intel Agent</h1>
        <button onClick={loadData} style={styles.button}>↻ Refresh</button>
      </div>

      <p style={{ color: "#64748b", fontSize: 12, marginBottom: 20 }}>
        {coins.length} coins • Last update: {lastUpdate ? new Date(lastUpdate).toLocaleString() : "—"}
      </p>

      {newPairs.length > 0 && (
        <div style={{ marginBottom: 30 }}>
          <h2 style={{ color: "#fbbf24", fontSize: 18, marginBottom: 12, fontWeight: 600 }}>
            🚀 New Pairs & Movers
          </h2>
          <div style={styles.grid}>
            {newPairs.map((coin) => (
              <div key={coin.symbol} onClick={() => setSelected(coin)} style={{ ...styles.card, cursor: "pointer", borderColor: "#fbbf2444" }}>
                <NewPairBadge coin={coin} />
              </div>
            ))}
          </div>
        </div>
      )}

      {memeCoins.length > 0 && (
        <div style={{ marginBottom: 30 }}>
          <h2 style={{ color: "#a78bfa", fontSize: 18, marginBottom: 12, fontWeight: 600 }}>
            🐸 Meme Coins
          </h2>
          <div style={styles.grid}>
            {memeCoins.map((coin) => (
              <div key={coin.symbol} onClick={() => setSelected(coin)} style={{ ...styles.card, cursor: "pointer", borderColor: "#a78bfa44" }}>
                <CoinCard coin={coin} />
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 style={{ color: "#cbd5e1", fontSize: 18, marginBottom: 12, fontWeight: 600 }}>
        📊 All Coins (Top 50)
      </h2>
      <div style={styles.grid}>
        {coins.map((coin) => (
          <div key={coin.symbol} onClick={() => setSelected(coin)} style={{ ...styles.card, cursor: "pointer" }}>
            <CoinCard coin={coin} />
          </div>
        ))}
      </div>

      {selected && <CoinModal coin={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function CoinCard({ coin }: { coin: Coin }) {
  const up = coin.change_24h > 0;
  const signalColor =
    coin.signal === "BULLISH" ? "#10b981" : coin.signal === "BEARISH" ? "#ef4444" : "#6b7280";

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>{coin.symbol}</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, background: signalColor + "22", color: signalColor, border: `1px solid ${signalColor}55` }}>
              {coin.signal}
            </span>
          </div>
          <p style={{ color: "#94a3b8", fontSize: 12, margin: "2px 0 0" }}>{coin.name}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: "#fff", fontWeight: 600 }}>
            ${coin.price >= 1 ? coin.price.toLocaleString("en-US", { maximumFractionDigits: 2 }) : coin.price.toFixed(6)}
          </p>
          <p style={{ color: up ? "#10b981" : "#ef4444", fontSize: 13 }}>
            {up ? "+" : ""}
            {coin.change_24h.toFixed(2)}%
          </p>
        </div>
      </div>

      {coin.sparkline && coin.sparkline.length > 1 && (
        <Sparkline data={coin.sparkline} color={signalColor} />
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10, fontSize: 11 }}>
        <div>
          <p style={{ color: "#64748b" }}>1h</p>
          <p style={{ color: coin.change_1h > 0 ? "#10b
