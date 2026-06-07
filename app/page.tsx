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
}

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");

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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🪙 Crypto Intel Agent</h1>
        <button onClick={loadData} style={styles.button}>↻ Refresh</button>
      </div>

      <p style={{ color: "#64748b", fontSize: 12, marginBottom: 20 }}>
        {coins.length} coins • Last update: {lastUpdate ? new Date(lastUpdate).toLocaleString() : "—"}
      </p>

      <div style={styles.grid}>
        {coins.map((coin) => (
          <CoinCard key={coin.symbol} coin={coin} />
        ))}
      </div>
    </div>
  );
}

function CoinCard({ coin }: { coin: Coin }) {
  const up = coin.change_24h > 0;
  const signalColor =
    coin.signal === "BULLISH" ? "#10b981" : coin.signal === "BEARISH" ? "#ef4444" : "#6b7280";

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>{coin.symbol}</span>
            <span
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 10,
                background: signalColor + "22",
                color: signalColor,
                border: `1px solid ${signalColor}55`,
              }}
            >
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
          <p style={{ color: coin.change_1h > 0 ? "#10b981" : "#ef4444" }}>
            {coin.change_1h > 0 ? "+" : ""}
            {coin.change_1h.toFixed(2)}%
          </p>
        </div>
        <div>
          <p style={{ color: "#64748b" }}>Vol 24h</p>
          <p style={{ color: "#cbd5e1" }}>${formatNum(coin.volume_24h)}</p>
        </div>
      </div>
    </div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: 50 }}>
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function formatNum(n: number): string {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
  return n.toFixed(2);
}

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)",
    padding: 20,
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
  },
  button: {
    background: "#1e293b",
    color: "#cbd5e1",
    border: "1px solid #334155",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 12,
  },
  card: {
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid #1e293b",
    borderRadius: 12,
    padding: 16,
  },
};
