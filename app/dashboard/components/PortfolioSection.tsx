"use client";

import {
  Lock,
  Coins,
  DollarSign,
  Wallet,
} from "lucide-react";
import StatCard from "./StatCard";

interface PortfolioSectionProps {
  lockedSTV: number;
  availableSTV: number;
  totalInvested: number;
  walletConnected: boolean;
}

export default function PortfolioSection({
  lockedSTV,
  availableSTV,
  totalInvested,
  walletConnected,
}: PortfolioSectionProps) {
  return (
    <section className="mt-8">
      {/* Section Heading */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Portfolio Overview
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          title="Locked STV"
          value={lockedSTV.toLocaleString()}
          subtitle="Locked Balance"
          icon={<Lock size={28} />}
          iconColor="text-teal-700"
        />

        <StatCard
          title="Available STV"
          value={availableSTV.toLocaleString()}
          subtitle="Ready to Use"
          icon={<Coins size={28} />}
          iconColor="text-emerald-700"
        />

        <StatCard
          title="Total Invested"
          value={`$${totalInvested.toLocaleString()}`}
          subtitle="USDT Invested"
          icon={<DollarSign size={28} />}
          iconColor="text-amber-700"
        />

        <StatCard
          title="Wallet"
          value={walletConnected ? "Connected" : "Not Connected"}
          subtitle={
            walletConnected
              ? "Secure Connection"
              : "Connect Wallet"
          }
          icon={<Wallet size={28} />}
          iconColor="text-violet-700"
        />
      </div>
    </section>
  );
}