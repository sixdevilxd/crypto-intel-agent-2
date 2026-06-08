"use client";

import { useEffect, useRef } from "react";

export default function TradingViewChart({
  symbol,
}: {
  symbol: string;
}) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";

    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BINANCE:${symbol}USDT`,
      interval: "15",
      timezone: "Asia/Jakarta",
      theme: "dark",
      style: "1",
      locale: "id",
      allow_symbol_change: true,
      support_host: "https://www.tradingview.com",
    });

    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div
      ref={container}
      style={{
        width: "100%",
        height: "500px",
      }}
    />
  );
}
