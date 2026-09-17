"use client";

import { useEffect, useState } from "react";

interface PresaleStats {
  raised: number;
  hardCap: number;
  tokenPrice: number;
  totalTokens: string;
  progress: number;
  investors: number;
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

export default function Stats() {
  const [stats, setStats] = useState<PresaleStats>({
    raised: 0,
    hardCap: 0,
    tokenPrice: 0,
    totalTokens: "",
    progress: 0,
    investors: 0,
  });

  async function loadStats() {
  try {
    const res = await fetch("/api/presale/stats", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch presale stats:", res.status);
      return;
    }

    const data = await res.json();

    setStats({
      raised: data.raised,
      hardCap: data.hardCap,
      tokenPrice: data.tokenPrice,
      totalTokens: data.totalTokens,
      progress: data.progress,
      investors: data.investors,
    });
  } catch (error) {
    console.error("Failed to load presale stats:", error);
  }
}
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">
            STRIVERSE <span className="text-cyan-400">Presale</span>
          </h2>

          <p className="text-gray-400 mt-4">
            Join the future of decentralized innovation.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">

          {/* Raised */}
          <div className="rounded-3xl bg-white/5 border border-cyan-500/20 backdrop-blur-xl p-8 hover:scale-105 transition duration-300">
            <p className="text-gray-400 text-sm">Raised</p>

            <h2 className="text-3xl font-bold text-green-400 mt-2">
              ${formatNumber(stats.raised)}
            </h2>
          </div>

          {/* Hard Cap */}
          <div className="rounded-3xl bg-white/5 border border-cyan-500/20 backdrop-blur-xl p-8 hover:scale-105 transition duration-300">
            <p className="text-gray-400 text-sm">Hard Cap</p>

            <h2 className="text-3xl font-bold text-white mt-2">
              ${formatNumber(stats.hardCap)}
            </h2>
          </div>

          {/* Token Price */}
          <div className="rounded-3xl bg-white/5 border border-cyan-500/20 backdrop-blur-xl p-8 hover:scale-105 transition duration-300">
            <p className="text-gray-400 text-sm">Token Price</p>

            <h2 className="text-3xl font-bold text-cyan-400 mt-2">
              ${stats.tokenPrice.toFixed(6)}
            </h2>
          </div>

          {/* Investors */}
          <div className="rounded-3xl bg-white/5 border border-cyan-500/20 backdrop-blur-xl p-8 hover:scale-105 transition duration-300">
            <p className="text-gray-400 text-sm">Investors</p>

            <h2 className="text-3xl font-bold text-purple-400 mt-2">
              {stats.investors}
            </h2>
          </div>

        </div>

        {/* Progress */}
        <div className="mt-14 rounded-3xl bg-white/5 border border-cyan-500/20 backdrop-blur-xl p-8">

          <div className="flex justify-between mb-3">
            <span>Presale Progress</span>

            <span className="text-cyan-400 font-bold">
              {stats.progress.toFixed(2)}%
            </span>
          </div>

          <div className="w-full h-5 rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-1000"
              style={{
                width: `${stats.progress}%`,
              }}
            />
          </div>

          <div className="flex justify-between mt-3 text-gray-400">
            <span>$0</span>

            <span>${formatNumber(stats.raised)} Raised</span>

            <span>${formatNumber(stats.hardCap)}</span>
          </div>

        </div>
      </div>
    </section>
  );
}