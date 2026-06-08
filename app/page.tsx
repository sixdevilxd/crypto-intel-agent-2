"use client";

import { useEffect, useState } from "react";

interface Coin {
  symbol: string;
  name: string;
  price: number;
  change_24h: number;
}

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/feed");
        const json = await res.json();

        if (json.ok) {
          setCoins(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "24px",
      }}
    >
      <h1>🪙 Crypto Intel Agent</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          {coins.map((coin) => (
            <div
              key={coin.symbol}
              style={{
                border: "1px solid #334155",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <h3>
                {coin.symbol} - {coin.name}
              </h3>

              <p>
                Price: $
                {Number(coin.price).toLocaleString()}
              </p>

              <p
                style={{
                  color:
                    coin.change_24h >= 0
                      ? "#10b981"
                      : "#ef4444",
                }}
              >
                {coin.change_24h >= 0 ? "+" : ""}
                {coin.change_24h?.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
