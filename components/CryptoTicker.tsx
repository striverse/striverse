"use client";

import { useEffect, useState } from "react";

interface Coin {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

export default function CryptoTicker() {
  const [coins, setCoins] = useState<Coin[]>([
    { symbol: "BTC", name: "Bitcoin", price: 109245, change: 2.41 },
    { symbol: "ETH", name: "Ethereum", price: 3525, change: 1.68 },
    { symbol: "BNB", name: "BNB", price: 785, change: 0.95 },
    { symbol: "SOL", name: "Solana", price: 242, change: 3.26 },
    { symbol: "XRP", name: "Ripple", price: 2.61, change: 2.04 },
    { symbol: "ADA", name: "Cardano", price: 1.12, change: 1.44 },
    { symbol: "DOGE", name: "Dogecoin", price: 0.39, change: 2.88 },
    { symbol: "TON", name: "Toncoin", price: 7.34, change: 0.71 },
    { symbol: "AVAX", name: "Avalanche", price: 48.22, change: 1.83 },
    { symbol: "LINK", name: "Chainlink", price: 28.42, change: 2.17 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prev) =>
        prev.map((coin) => {
          const random = (Math.random() - 0.5) * (coin.price * 0.003);

          const newPrice = Number((coin.price + random).toFixed(2));

          const newChange = Number(
            (coin.change + (Math.random() - 0.5) * 0.5).toFixed(2)
          );

          return {
            ...coin,
            price: newPrice,
            change: newChange,
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full overflow-hidden border-y border-cyan-500/20 bg-black/70 backdrop-blur-xl">
      <div className="ticker whitespace-nowrap py-3">
        <div className="inline-flex gap-10">
          {[...coins, ...coins].map((coin, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm md:text-base"
            >
              <span className="font-bold text-cyan-400">{coin.symbol}</span>

              <span className="text-white">
                ${coin.price.toLocaleString("en-US")}
              </span>

              <span
                className={`font-semibold ${
                  coin.change >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {coin.change >= 0 ? "+" : ""}
                {coin.change}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}