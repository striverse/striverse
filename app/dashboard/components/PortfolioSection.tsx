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
        <h2 className="text-2xl font-bold text-white">
          Portfolio Overview
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Locked STV"
          value={lockedSTV.toLocaleString()}
          subtitle="Locked Balance"
          icon={<Lock size={28} />}
          iconColor="text-cyan-400"
        />

        <StatCard
          title="Available STV"
          value={availableSTV.toLocaleString()}
          subtitle="Ready to Use"
          icon={<Coins size={28} />}
          iconColor="text-emerald-400"
        />

        <StatCard
          title="Total Invested"
          value={`$${totalInvested.toLocaleString()}`}
          subtitle="USDT Invested"
          icon={<DollarSign size={28} />}
          iconColor="text-yellow-400"
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
          iconColor="text-violet-400"
        />
      </div>
    </section>
  );
}