"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminTopbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();

  const [notifications, setNotifications] = useState({
    pendingPurchases: 0,
    pendingUsers: 0,
  });

  async function loadNotifications() {
    try {
      const res = await fetch("/api/admin/notifications", {
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setNotifications({
          pendingPurchases: data.pendingPurchases,
          pendingUsers: data.pendingUsers,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }

    router.replace("/login/admin");
    router.refresh();
  }

  return (
    <header className="h-20 border-b border-cyan-500/20 bg-[#08101d] px-8 flex items-center justify-between">

      <div>
        <h2 className="text-2xl font-bold text-white">
          Admin Panel
        </h2>

        <p className="text-gray-400 text-sm">
          STRIVERSE Presale Management
        </p>
      </div>

      <div className="flex items-center gap-6">

        <div className="relative">

  <button
    onClick={() => setShowNotifications(!showNotifications)}
    className="relative text-2xl hover:scale-110 transition"
  >
    🔔

    {notifications.pendingPurchases > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {notifications.pendingPurchases}
      </span>
    )}
  </button>

  {showNotifications && (
    <div className="absolute right-0 mt-4 w-72 rounded-2xl border border-cyan-500/20 bg-[#0b1220] shadow-2xl overflow-hidden z-50">

      <div className="px-5 py-4 border-b border-cyan-500/20">
        <h3 className="text-lg font-bold text-cyan-400">
          Notifications
        </h3>
      </div>

      <div className="p-5 space-y-4">

        <Link
  href="/admin/purchases?status=PENDING"
  onClick={() => setShowNotifications(false)}
  className="flex justify-between items-center rounded-lg p-3 hover:bg-cyan-500/10 transition"
>
  <span>⏳ Pending Purchases</span>

  <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-yellow-400 text-sm">
    {notifications.pendingPurchases}
  </span>
</Link>

        <Link
  href="/admin/users?verified=false"
  onClick={() => setShowNotifications(false)}
  className="flex justify-between items-center rounded-lg p-3 hover:bg-cyan-500/10 transition"
>
  <span>👤 Unverified Users</span>

  <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-cyan-400 text-sm">
    {notifications.pendingUsers}
  </span>
</Link>

      </div>

    </div>
  )}

</div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-xl font-semibold"
        >
          🚪 Logout
        </button>

      </div>

    </header>
  );
}