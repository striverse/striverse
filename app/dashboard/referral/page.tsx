"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Clock3, Copy, Gift, RefreshCw, WalletCards, ArrowDownToLine, Repeat2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const themes = ["theme-blue","theme-cyan","theme-gold","theme-emerald","theme-crimson","theme-silver"];

function Countdown({ target }: { target: string }) {
  const [left, setLeft] = useState(Math.max(0, new Date(target).getTime() - Date.now()));
  useEffect(() => { const t = window.setInterval(() => setLeft(Math.max(0, new Date(target).getTime() - Date.now())), 1000); return () => clearInterval(t); }, [target]);
  const total = Math.floor(left / 1000), h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), s = total % 60;
  if (!left) return <span className="text-emerald-300 font-semibold">Unlocking soon</span>;
  return <span className="font-mono text-white">{String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}</span>;
}

export default function ReferralWalletPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [walletRes, refRes] = await Promise.all([
        fetch("/api/user/referral/wallet", { credentials: "include", cache: "no-store" }),
        fetch("/api/user/referral", { credentials: "include", cache: "no-store" }),
      ]);
      if (!walletRes.ok) return router.replace("/");
      const wallet = await walletRes.json();
      const ref = await refRes.json();
      setData({ ...wallet, ref: ref.user });
      setCode(ref.user?.referralCode || "");
    } catch { toast.error("Unable to load Partner wallet."); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const link = useMemo(() => `https://striverse.com/register?ref=${code}`, [code]);
  if (loading) return <main className="min-h-screen bg-[#050711] text-white grid place-items-center"><RefreshCw className="animate-spin text-cyan-300"/></main>;

  return <main className="min-h-screen bg-[#050711] text-white overflow-hidden relative">
    <div className="absolute inset-0 pointer-events-none opacity-70 bg-[radial-gradient(circle_at_20%_10%,rgba(88,48,180,.28),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(20,160,255,.2),transparent_32%)]"/>
    <div className="relative max-w-md mx-auto px-4 py-5 pb-10">
      <header className="flex items-center gap-3 mb-6"><button onClick={() => router.back()} className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 grid place-items-center"><ArrowLeft size={18}/></button><div><p className="text-xs tracking-[.28em] text-cyan-300">STRIVERSE</p><h1 className="text-2xl font-bold">Partner Wallet</h1></div></header>

      <section className="rounded-3xl border border-cyan-400/20 bg-white/[.06] backdrop-blur-xl p-5 shadow-[0_0_50px_rgba(80,120,255,.12)]">
        <div className="flex items-center justify-between"><div><p className="text-sm text-white/55">Available Partner USDT</p><p className="text-4xl font-black mt-1">${Number(data.wallet.available||0).toFixed(2)}</p></div><div className="h-12 w-12 rounded-2xl bg-cyan-400/15 grid place-items-center"><WalletCards className="text-cyan-300"/></div></div>
        <div className="grid grid-cols-2 gap-3 mt-5"><div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-white/45">Pending</p><p className="font-bold mt-1">${Number(data.wallet.pending||0).toFixed(2)}</p></div><div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-white/45">Withdrawn</p><p className="font-bold mt-1">${Number(data.wallet.withdrawn||0).toFixed(2)}</p></div></div>
        <div className="grid grid-cols-2 gap-3 mt-4"><button onClick={() => router.push("/dashboard/referral/withdraw")} className="rounded-2xl py-3 bg-gradient-to-r from-cyan-400 to-blue-500 font-bold text-black flex items-center justify-center gap-2"><ArrowDownToLine size={17}/> Withdraw</button><button onClick={() => router.push("/dashboard/referral/convert")} className="rounded-2xl py-3 bg-white/10 border border-white/10 font-bold flex items-center justify-center gap-2"><Repeat2 size={17}/> Convert STV</button></div>
      </section>

      <section className="mt-5 rounded-3xl border border-white/10 bg-white/[.04] p-5"><div className="flex items-center gap-3"><Gift className="text-fuchsia-300"/><div><h2 className="font-bold">Your Partner Code</h2><p className="text-xs text-white/45">Share your Partner access</p></div></div><div className="mt-4 flex gap-2"><div className="flex-1 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 font-mono text-cyan-300">{code || "—"}</div><button onClick={() => { navigator.clipboard.writeText(code); toast.success("Partner code copied"); }} className="rounded-2xl px-4 bg-cyan-400/15 text-cyan-300"><Copy size={18}/></button></div><button onClick={() => { navigator.clipboard.writeText(link); toast.success("Partner Link copied"); }} className="w-full mt-3 rounded-2xl py-3 bg-white/5 border border-white/10 text-sm">Copy Partner Link</button></section>

      <section className="mt-5"><div className="flex items-center justify-between mb-3"><div><h2 className="text-lg font-bold">24h Unlocks</h2><p className="text-xs text-white/45">Pending Partner rewards</p></div><Clock3 className="text-amber-300" size={20}/></div>
        {data.pendingUnlocks?.length ? data.pendingUnlocks.map((p:any) => <div key={p.id} className="rounded-2xl border border-amber-300/15 bg-amber-300/[.05] p-4 mb-3"><div className="flex justify-between gap-3"><div><p className="font-semibold">{p.packageName} Partner reward</p><p className="text-xs text-white/45 mt-1">{Number(p.referralBonusUSDT).toFixed(2)} USDT</p></div><div className="text-right"><p className="text-xs text-white/45">Unlocks in</p><p className="mt-1"><Countdown target={p.referralUnlockAt}/></p></div></div></div>) : <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5 text-sm text-white/50 text-center">No pending Partner unlocks.</div>}
      </section>
    </div>
  </main>;
}
