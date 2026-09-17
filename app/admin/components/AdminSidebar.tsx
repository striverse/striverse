"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Gift,
  Megaphone,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Purchases",
    href: "/admin/purchases",
    icon: CreditCard,
  },
  {
    title: "Withdrawals",
    href: "/admin/withdrawals",
    icon: CreditCard,
  },
  {
    title: "Referrals",
    href: "/admin/referrals",
    icon: Gift,
  },
  {
    title: "Announcements",
    href: "/admin/announcements",
    icon: Megaphone,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Security Audit",
    href: "/admin/audit",
    icon: ShieldCheck,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-white/10 bg-[#08101F]">
      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-8">
        <h1 className="text-3xl font-bold tracking-wide text-cyan-400">
          STRIVERSE
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Admin Control Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all ${
                active
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-4">
        <button
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
          onClick={() => {
            localStorage.removeItem("auth");
            window.location.href = "/admin";
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}