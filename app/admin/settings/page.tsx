"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Lock, Save, ShieldCheck } from "lucide-react";

type Pkg = { id?: string; name: string; usdtAmount: number; stvAmount: number; sortOrder: number; isActive: boolean; isCollapsed?: boolean };
type HeroStats = { community: number; raised: number; potentialUsers: number; communityDriven: number };

const defaults: Pkg[] = ["LUNA", "AURORA", "ANDROMEDA", "ORION", "CELESTIA"].map((name, i) => ({ name, usdtAmount: [100, 300, 500, 700, 1000][i], stvAmount: [100000, 300000, 500000, 700000, 1000000][i], sortOrder: i + 1, isActive: true, isCollapsed: false }));
const defaultHeroStats: HeroStats = { community: 50000, raised: 150000, potentialUsers: 1000000, communityDriven: 100 };

export default function Settings() {
  const [role, setRole] = useState("");
  const [packages, setPackages] = useState<Pkg[]>(defaults);
  const [wallets, setWallets] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [heroStats, setHeroStats] = useState<HeroStats>(defaultHeroStats);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/me", { cache: "no-store" }),
      fetch("/api/admin/packages", { cache: "no-store" }),
      fetch("/api/admin/payment-wallets", { cache: "no-store" }),
      fetch("/api/admin/partner-config", { cache: "no-store" }),
      fetch("/api/admin/hero-stats", { cache: "no-store" }),
    ]).then(async ([a, p, w, c, h]) => {
      const ad = await a.json();
      setRole(ad.admin?.role || "");
      const pd = await p.json();
      if (pd.packages?.length) setPackages(pd.packages);
      const wd = await w.json();
      setWallets(wd.wallets || []);
      const cd = await c.json();
      if (cd.config) setConfig(cd.config);
      const hd = await h.json();
      if (hd.stats) setHeroStats(hd.stats);
    }).catch(() => setMsg("Unable to load settings."));
  }, []);

  const developer = role === "DEVELOPER";
  const canEditHero = role === "ADMIN" || role === "DEVELOPER";
  const updatePkg = (i: number, k: string, v: any) => setPackages(a => a.map((p, j) => j === i ? { ...p, [k]: v } : p));
  const updateHero = (key: keyof HeroStats, value: number) => setHeroStats(s => ({ ...s, [key]: value }));

  async function savePackages() {
    const r = await fetch("/api/admin/packages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ packages }) });
    const d = await r.json(); setMsg(d.message || "Saved");
  }
  async function saveConfig() {
    const r = await fetch("/api/admin/partner-config", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(config) });
    const d = await r.json(); setMsg(d.message || "Saved"); if (d.config) setConfig(d.config);
  }
  async function saveWallets() {
    const r = await fetch("/api/admin/payment-wallets", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ wallets }) });
    const d = await r.json(); setMsg(d.message || "Saved");
  }
  async function saveHeroStats() {
    const r = await fetch("/api/admin/hero-stats", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(heroStats) });
    const d = await r.json(); setMsg(d.message || "Saved"); if (d.stats) setHeroStats(d.stats);
  }

  return <main className="space-y-8 text-white">
    <header><p className="text-xs uppercase tracking-[.3em] text-cyan-300/70">Developer Control Center</p><h1 className="mt-2 text-3xl font-black">Striverse Settings</h1><p className="mt-2 text-sm text-slate-400">Central configuration for packages, hero statistics, Partner rewards, wallets and operating rules.</p></header>

    <section className="rounded-3xl border border-cyan-400/15 bg-white/[.035] p-5">
      <div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Homepage Statistics</h2><p className="text-sm text-slate-400">Edit Community, Raised, Potential Users and Community Driven shown on the homepage.</p></div>{!canEditHero && <Lock className="text-slate-500" size={18} />}</div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {([["community", "Community"], ["raised", "Raised (USDT)"], ["potentialUsers", "Potential Users"], ["communityDriven", "Community Driven (%)"]] as const).map(([key, label]) => <label key={key} className="text-xs text-slate-400">{label}<input disabled={!canEditHero} type="number" min="0" max={key === "communityDriven" ? 100 : undefined} value={heroStats[key]} onChange={e => updateHero(key, +e.target.value)} className="mt-1 w-full rounded-xl bg-black/30 p-3 text-white" /></label>)}
      </div>
      {canEditHero && <button onClick={saveHeroStats} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-bold"><Save size={16} /> Save Homepage Statistics</button>}
    </section>

    <section className="rounded-3xl border border-cyan-400/15 bg-white/[.035] p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold">Packages</h2><p className="text-sm text-slate-400">Pricing and STV allocation. Referral percentages are managed separately.</p></div>{!developer && <Lock className="text-slate-500" size={18} />}</div><div className="mt-5 space-y-3">{packages.map((p, i) => <div key={p.name} className="rounded-2xl border border-white/10 bg-black/10 p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="font-bold">{p.name}</span><span className={`rounded-full px-2 py-1 text-[10px] ${p.isActive ? "bg-emerald-400/10 text-emerald-300" : "bg-red-400/10 text-red-300"}`}>{p.isActive ? "ACTIVE" : "INACTIVE"}</span></div><button onClick={() => updatePkg(i, "isCollapsed", !p.isCollapsed)} className="rounded-lg border border-white/10 p-2">{p.isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}</button></div>{!p.isCollapsed && <div className="mt-4 grid gap-3 md:grid-cols-4"><label className="text-xs text-slate-400">USDT<input disabled={!developer} type="number" value={p.usdtAmount} onChange={e => updatePkg(i, "usdtAmount", +e.target.value)} className="mt-1 w-full rounded-xl bg-black/30 p-3 text-white" /></label><label className="text-xs text-slate-400">STV<input disabled={!developer} type="number" value={p.stvAmount} onChange={e => updatePkg(i, "stvAmount", +e.target.value)} className="mt-1 w-full rounded-xl bg-black/30 p-3 text-white" /></label><label className="flex items-end gap-2 text-sm"><input disabled={!developer} type="checkbox" checked={p.isActive !== false} onChange={e => updatePkg(i, "isActive", e.target.checked)} /> Active</label><div className="text-xs text-slate-500 self-center">No package-level referral %</div></div>}</div>)}</div>{developer && <button onClick={savePackages} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-bold"><Save size={16} /> Save Packages</button>}</section>

    {developer && config && <section className="rounded-3xl border border-violet-400/15 bg-white/[.035] p-5"><div className="flex items-center gap-3"><ShieldCheck className="text-violet-300" /><div><h2 className="text-xl font-bold">Partner Program Rewards</h2><p className="text-sm text-slate-400">Developer-only reward controls. Level 4 does not exist.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["directPercent", "Direct Reward"], ["level1Percent", "Partner Level 1"], ["level2Percent", "Partner Level 2"], ["level3Percent", "Partner Level 3"]].map(([k, l]) => <label key={k} className="text-xs text-slate-400">{l}<div className="mt-1 flex items-center rounded-xl bg-black/30"><input type="number" min="0" max="100" value={config[k]} onChange={e => setConfig({ ...config, [k]: +e.target.value })} className="w-full bg-transparent p-3 text-white" /><span className="pr-3">%</span></div></label>)}</div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["unlockHours", "Unlock hours"], ["minWithdrawalUSDT", "Min withdrawal USDT"], ["conversionRate", "USDT → STV"], ["settlementDays", "Settlement days"], ["withdrawalProcessingHours", "Withdrawal hours"], ["special3Set", "3-set incentive"], ["special6Set", "6-set incentive"], ["special9Set", "9-set incentive"]].map(([k, l]) => <label key={k} className="text-xs text-slate-400">{l}<input type="number" value={config[k]} onChange={e => setConfig({ ...config, [k]: +e.target.value })} className="mt-1 w-full rounded-xl bg-black/30 p-3 text-white" /></label>)}</div><button onClick={saveConfig} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-bold"><Save size={16} /> Save Partner Rules</button></section>}

    <section className="rounded-3xl border border-white/10 bg-white/[.035] p-5"><div><h2 className="text-xl font-bold">Payment Wallets</h2><p className="text-sm text-slate-400">Developer-only receiving wallet configuration.</p></div><div className="mt-5 grid gap-3 md:grid-cols-3">{["TRC20", "BEP20", "ERC20"].map(n => <label key={n} className="text-xs text-slate-400">{n}<input disabled={!developer} value={wallets.find(w => w.network === n)?.address || ""} onChange={e => setWallets(ws => [...ws.filter(w => w.network !== n), { network: n, address: e.target.value, isActive: true }])} placeholder="Receiving address" className="mt-1 w-full rounded-xl bg-black/30 p-3 text-white" /></label>)}</div>{developer && <button onClick={saveWallets} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-fuchsia-500 px-5 py-3 font-bold"><Save size={16} /> Save Wallets</button>}</section>

    {msg && <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cyan-200">{msg}</div>}
  </main>;
}
