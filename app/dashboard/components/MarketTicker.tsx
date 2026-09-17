"use client";

import { motion } from "framer-motion";
import GlassCard from "./ui/GlassCard";

const markets = [
  { symbol: "BTC", name: "Bitcoin", price: "$118,250", change: "+2.45%" },
  { symbol: "ETH", name: "Ethereum", price: "$4,210", change: "+1.83%" },
  { symbol: "BNB", name: "BNB", price: "$845", change: "+0.94%" },
  { symbol: "SOL", name: "Solana", price: "$212", change: "-0.67%" },
  { symbol: "STV", name: "STRIVERSE", price: "$0.0010", change: "+12.50%" },
];

export default function MarketTicker() {
  return (
    <GlassCard className="mt-10 overflow-hidden p-4">
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
      >
        {[...markets, ...markets].map((coin, index) => (
          <div
            key={index}
            className="flex min-w-max items-center gap-3 rounded-xl bg-white/5 px-5 py-3"
          >
            <div>
              <h3 className="font-bold text-white">
                {coin.symbol}
              </h3>

              <p className="text-xs text-gray-400">
                {coin.name}
              </p>
            </div>

            <div>
              <p className="font-semibold">
                {coin.price}
              </p>

              <p
                className={`text-sm ${
                  coin.change.startsWith("-")
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {coin.change}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </GlassCard>
  );
}