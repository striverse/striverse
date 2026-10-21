"use client";

import { useState } from "react";
import { Coins, Wallet, ChevronDown, ChevronUp } from "lucide-react";
import GlassCard from "@/app/dashboard/components/ui/GlassCard";
import GradientButton from "@/app/dashboard/components/ui/GradientButton";

interface BuyPanelProps {
  loading?: boolean;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onBuy: (amount: number, network: string) => void;
}

const STV_RATE = 1000; // 1 USDT = 1000 STV

export default function BuyPanel({
  loading = false,
  collapsed = false,
  onToggleCollapsed,
  onBuy,
}: BuyPanelProps) {
  const [amount, setAmount] = useState(100);
  const [network, setNetwork] = useState("BEP20");
  const stv = amount * STV_RATE;

  return (
    <GlassCard className="overflow-hidden !rounded-2xl !border-white/[0.09] !bg-[#081629]/95 !p-0 shadow-[0_18px_50px_rgba(0,0,0,.22)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-200">
            <Coins size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white">Buy STV</h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {collapsed ? "Purchase panel minimized" : "Select a package"}
            </p>
          </div>
        </div>
        {onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand Buy STV panel" : "Minimize Buy STV panel"}
            aria-expanded={!collapsed}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.035] text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.08] hover:text-cyan-200"
          >
            {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        )}
      </div>

      {collapsed ? (
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">Selected package</p>
              <p className="mt-1 text-lg font-semibold text-white">${amount.toLocaleString()} <span className="text-xs font-normal text-slate-400">USDT</span></p>
            </div>
            <p className="text-right text-xs text-cyan-200">{stv.toLocaleString()} STV</p>
          </div>
          <button type="button" onClick={onToggleCollapsed} className="mt-3 w-full rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.14]">Expand purchase panel</button>
        </div>
      ) : (
        <div className="space-y-5 p-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium text-slate-400">Select package</label>
              <span className="text-[10px] uppercase tracking-[0.12em] text-slate-600">USDT</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
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
                  className={`rounded-xl border px-3 py-3 text-left transition ${amount === pkg ? "border-cyan-300/45 bg-cyan-300/[0.10]" : "border-white/[0.08] bg-white/[0.025] hover:border-white/20"}`}
                >
                  <span className={`block text-[9px] font-semibold uppercase tracking-[0.12em] ${amount === pkg ? "text-cyan-200" : "text-slate-500"}`}>{name as string}</span>
                  <span className="mt-1 block text-lg font-semibold text-white">${Number(pkg).toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-400">Payment network</label>
            <select
              value={network}
              onChange={(event) => setNetwork(event.target.value)}
              className="w-full rounded-xl border border-white/[0.09] bg-[#0b1b2f] px-3 py-3 text-sm text-white outline-none transition focus:border-cyan-300/50"
            >
              <option value="BEP20">BNB Smart Chain · BEP20</option>
              <option value="TRC20">TRON · TRC20</option>
              <option value="ERC20">Ethereum · ERC20</option>
            </select>
          </div>

          <div className="rounded-xl border border-cyan-300/15 bg-cyan-300/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400">You receive</span>
              <span className="text-lg font-semibold text-cyan-200">{stv.toLocaleString()} STV</span>
            </div>
            <p className="mt-2 text-[10px] leading-4 text-slate-500">Indicative package amount · 1 USDT = {STV_RATE.toLocaleString()} STV</p>
          </div>

          <div className="flex items-start gap-2 text-[11px] leading-5 text-slate-500">
            <Wallet size={15} className="mt-0.5 shrink-0 text-slate-400" />
            Payment details and transaction proof are confirmed in the secure purchase flow.
          </div>

          <GradientButton fullWidth loading={loading} onClick={() => onBuy(amount, network)}>
            Continue to Buy STV
          </GradientButton>
        </div>
      )}
    </GlassCard>
  );
}
