"use client";

import { useState } from "react";
import DonutChart from "./DonutChart";
import TokenLegend from "./TokenLegend";

export default function Tokenomics() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden py-24 px-6">

      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Heading */}
        <h2 className="text-center text-5xl font-bold">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Tokenomics
          </span>
        </h2>

        <p className="mt-4 text-center text-gray-400">
          STRIVERSE Token Distribution
        </p>

        {/* Content */}
        <div className="mt-16 grid items-center gap-16 lg:grid-cols-2">

          <DonutChart
            hovered={hovered}
            setHovered={setHovered}
          />

          <TokenLegend
            hovered={hovered}
            setHovered={setHovered}
          />

        </div>

      </div>

    </section>
  );
}