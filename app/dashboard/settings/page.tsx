"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, KeyRound, Bell, Link2, LogOut, ChevronRight, LockKeyhole } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [security, setSecurity] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/user/security", { credentials: "include", cache: "no-store" })
      .then((r) => r.json()).then((d) => d.success && setSecurity(d.security)).catch(() => {});
    fetch("/api/user/security", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "SETTINGS_VIEW" }) }).catch(() => {});
  }, []);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      router.replace("/login");
    } finally { setBusy(false); }
  }

  const row = (icon: React.ReactNode, title: string, sub: string, onClick?: () => void) => (
    <button onClick={onClick} className="w-full flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.08]">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">{icon}</div>
      <div className="min-w-0 flex-1"><p className="font-semibold text-white">{title}</p><p className="mt-1 text-xs text-white/50">{sub}</p></div>
      <ChevronRight className="h-5 w-5 text-white/30" />
    </button>
  );

  return <main className="min-h-screen bg-[#050816] px-4 pb-28 pt-6 text-white">
    <div className="mx-auto max-w-md">
      <header className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">STRIVERSE</p><h1 className="mt-2 text-3xl font-bold">Security & Settings</h1><p className="mt-2 text-sm text-white/50">Keep your account and recovery controls secure.</p></header>

      <section className="mb-5 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-purple-500/10 to-transparent p-5 shadow-[0_0_45px_rgba(34,211,238,0.08)]">
        <div className="flex items-center gap-3"><ShieldCheck className="h-6 w-6 text-cyan-300"/><div><p className="font-semibold">Security status</p><p className="text-xs text-white/50">Your recovery credential is never shown to admins.</p></div></div>
        <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-black/20 p-3"><p className="text-[11px] text-white/45">Recovery</p><p className="mt-1 font-semibold text-emerald-300">{security?.recovery?.configured ? "Configured" : "Not configured"}</p></div><div className="rounded-2xl bg-black/20 p-3"><p className="text-[11px] text-white/45">One-time reset</p><p className="mt-1 font-semibold">{security?.recovery?.used ? "Used" : "Available"}</p></div></div>
      </section>

      <div className="space-y-3">
        {row(<KeyRound className="h-5 w-5" />, "Recovery Security", security?.recovery?.used ? "One-time recovery already used" : "Review your recovery status", () => router.push("/dashboard/profile"))}
        {row(<Link2 className="h-5 w-5" />, "Partner Program", "View your code, link and earnings", () => router.push("/dashboard/referral"))}
        {row(<Bell className="h-5 w-5" />, "Notifications", "Manage and review account alerts", () => router.push("/dashboard"))}
        {row(<LockKeyhole className="h-5 w-5" />, "Account Protection", security?.account?.blocked ? "Account is restricted" : "Account is active")}
      </div>

      <button disabled={busy} onClick={logout} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-400/10 py-4 font-semibold text-red-300 transition hover:bg-red-400/15 disabled:opacity-50"><LogOut className="h-5 w-5" />{busy ? "Signing out…" : "Sign Out"}</button>
      <p className="mt-5 text-center text-[11px] leading-5 text-white/30">Never share your recovery phrase with support, admins, or anyone else.</p>
    </div>
  </main>;
}
