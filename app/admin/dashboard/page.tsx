"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, ShoppingCart, DollarSign, Clock } from "lucide-react";

interface Admin {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface DashboardStats {
  totalUsers: number;
  pendingPurchases: number;
  approvedPurchases: number;
  revenue: number;
}

const emptyStats: DashboardStats = {
  totalUsers: 0,
  pendingPurchases: 0,
  approvedPurchases: 0,
  revenue: 0,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [stats, setStats] = useState<DashboardStats>(emptyStats);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [meRes, statsRes] = await Promise.all([
          fetch("/api/admin/me", { credentials: "include" }),
          fetch("/api/admin/dashboard-stats", { credentials: "include" }),
        ]);

        if (!meRes.ok) {
          router.replace("/admin/login");
          return;
        }

        const meData = await meRes.json();
        setAdmin(meData.admin);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) setStats(statsData.stats);
        }
      } catch (error) {
        console.error(error);
        router.replace("/admin/login");
      } finally {
        setLoading(false);
        setStatsLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-xl text-white">
        Loading Admin Dashboard...
      </div>
    );
  }

  const statsCards = [
    { title: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "text-cyan-400" },
    { title: "Pending Purchases", value: stats.pendingPurchases.toLocaleString(), icon: Clock, color: "text-yellow-400" },
    { title: "Approved Purchases", value: stats.approvedPurchases.toLocaleString(), icon: ShoppingCart, color: "text-green-400" },
    { title: "Revenue", value: `$${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: "text-emerald-400" },
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-blue-500/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-8">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mt-2 text-gray-400">
              Welcome back, <span className="font-semibold text-cyan-400">{admin?.fullName}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3">
            <span className="font-semibold text-cyan-300">{admin?.role}</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {statsCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-cyan-500/30 hover:bg-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{card.title}</p>
                    <h2 className="mt-3 text-3xl font-bold">{statsLoading ? "…" : card.value}</h2>
                  </div>
                  <div className={`rounded-2xl bg-white/5 p-4 ${card.color}`}><Icon size={30} /></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="mb-6 text-2xl font-bold">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <button onClick={() => router.push("/admin/users")} className="rounded-2xl bg-cyan-500 px-6 py-4 font-semibold transition hover:bg-cyan-600">Manage Users</button>
            <button onClick={() => router.push("/admin/purchases")} className="rounded-2xl bg-green-500 px-6 py-4 font-semibold transition hover:bg-green-600">Verify Purchases</button>
            <button onClick={() => router.push("/admin/announcements")} className="rounded-2xl bg-yellow-500 px-6 py-4 font-semibold transition hover:bg-yellow-600">Announcements</button>
            <button onClick={() => router.push("/admin/analytics")} className="rounded-2xl bg-purple-500 px-6 py-4 font-semibold transition hover:bg-purple-600">Analytics</button>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h2 className="mb-4 text-2xl font-bold">Recent Admin Activity</h2>
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-gray-400">
            Recent purchases and admin actions will appear here.
          </div>
        </div>
      </div>
    </main>
  );
}
