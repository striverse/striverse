"use client";

import { Coins, DollarSign, CheckCircle, Clock } from "lucide-react";
import StatCard from "./StatCard";

interface DashboardStatsProps {
  purchasedSTV: number;
  referralBonus: number;
  approvedOrders: number;
  pendingOrders: number;
}

export default function DashboardStats({
  purchasedSTV,
  referralBonus,
  approvedOrders,
  pendingOrders,
}: DashboardStatsProps) {
  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Purchased STV"
        value={purchasedSTV.toLocaleString()}
        suffix=" STV"
        icon={<Coins size={22} />}
      />

      <StatCard
        title="Partner Earnings"
        value={referralBonus}
        suffix=" USDT"
        icon={<DollarSign size={22} />}
      />

      <StatCard
        title="Approved Orders"
        value={approvedOrders}
        icon={<CheckCircle size={22} />}
      />

      <StatCard
        title="Pending Orders"
        value={pendingOrders}
        icon={<Clock size={22} />}
      />

    </div>
  );
}