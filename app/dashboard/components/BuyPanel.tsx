"use client";

import { useEffect, useState } from "react";
import { Coins, Wallet } from "lucide-react";
import GlassCard from "@/app/dashboard/components/ui/GlassCard";
import GradientButton from "@/app/dashboard/components/ui/GradientButton";

interface BuyPanelProps {
  loading?: boolean;
  onBuy: (amount: number, network: string) => void;
}

const STV_RATE = 1000; // 1 USDT = 1000 STV

export default function BuyPanel({
  loading = false,
  onBuy,
}: BuyPanelProps) {
  const [amount, setAmount] = useState(100);
  const [network, setNetwork] = useState("BEP20");
  

  const stv = amount * STV_RATE;

  function handleBuy() {
    onBuy(amount, network);
  }

  return (
    <GlassCard className="p-7">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
          <Coins size={24} />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Buy STV
          </h2>

          <p className="text-sm text-gray-400">
            
          </p>
        </div>
      </div>

      <div className="mt-8">
  <label className="mb-3 block text-sm text-gray-400">
    Select Package
  </label>

  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
    {[
      [100, "LUNA"],
      [300, "AURORA"],
      [500, "ANDROMEDA"],
      [700, "ORION"],
      [1000, "CELESTIA"],
    ].map(([pkg, name]) => (
      <button
        key={pkg}
        type="button"
        onClick={() => setAmount(pkg as number)}
        className={`rounded-2xl border p-4 text-left transition ${
          amount === pkg
            ? "border-cyan-400 bg-cyan-500/20 text-cyan-400"
            : "border-white/10 bg-white/5 text-white hover:border-cyan-400"
        }`}
      >
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
          {name as string}
        </div>
        <div className="mt-1 text-xl font-bold">
          ${pkg as number}
        </div>
        <div className="text-xs text-gray-400">
          USDT · {(pkg as number) * STV_RATE} STV
        </div>
      </button>
    ))}
  </div>
</div>

      {/* Network */}
      <div className="mt-6">
        <label className="mb-2 block text-sm text-gray-400">
          Network
        </label>

        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className="
            w-full
            rounded-2xl
            border
            border-white/10
            bg-[#111827]
            px-4
            py-4
            text-white
            outline-none
            focus:border-cyan-400
          "
        >
          <option value="BEP20">BEP20</option>
          <option value="TRC20">TRC20</option>
          <option value="ERC20">ERC20</option>
        </select>
      </div>

      {/* STV Output */}
      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">
            You Receive
          </span>

          <span className="text-2xl font-bold text-cyan-400">
            {stv.toLocaleString()} STV
          </span>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Rate: 1 USDT = {STV_RATE.toLocaleString()} STV
        </p>
      </div>

      {/* Wallet */}
      <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
        <Wallet size={18} />
        Secure wallet verification after payment.
      </div>

      {/* Buy */}
      <div className="mt-8">
        <GradientButton
          fullWidth
          loading={loading}
          onClick={handleBuy}
        >
          Buy STV
        </GradientButton>
      </div>
    </GlassCard>
  );
}