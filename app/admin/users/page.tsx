"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, ShieldCheck, ShieldOff, Users, RefreshCw, Copy } from "lucide-react";

type User = {
  id: string; fullName: string; email: string; phone: string; role: string;
  isVerified: boolean; isBlocked: boolean; referralCode: string; referredById: string | null;
  createdAt: string;
  purchaseWallet?: { lockedSTV: number; unlockedSTV: number; totalPurchasedUSDT: number } | null;
  bonusWallet?: { referralPending: number; referralAvailable: number; referralWithdrawn: number } | null;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      const data = await res.json();
      if (res.ok) setUsers(data.users ?? []);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => [u.fullName, u.email, u.phone, u.referralCode].some(v => v?.toLowerCase().includes(q)));
  }, [users, query]);

  async function toggleBlock(user: User) {
    setUpdating(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ isBlocked: !user.isBlocked }),
      });
      if (res.ok) setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u));
    } finally { setUpdating(null); }
  }

  return <main className="min-h-full text-white">
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm uppercase tracking-[0.25em] text-cyan-300/70">Control center</p><h1 className="mt-2 text-3xl font-bold">Users</h1><p className="mt-1 text-sm text-slate-400">Manage accounts, referral links and wallet balances.</p></div>
      <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10"><RefreshCw size={16}/> Refresh</button>
    </div>

    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      {[['Total users', users.length], ['Verified', users.filter(u=>u.isVerified).length], ['Blocked', users.filter(u=>u.isBlocked).length]].map(([label,value]) => <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"><div className="flex items-center justify-between"><span className="text-sm text-slate-400">{label}</span><Users size={18} className="text-cyan-300"/></div><div className="mt-2 text-2xl font-bold">{value}</div></div>)}
    </div>

    <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl">
      <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md"><Search size={17} className="absolute left-3 top-3 text-slate-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, email, phone or referral code" className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-cyan-400/50"/></div>
        <span className="text-xs text-slate-500">{filtered.length} shown</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm"><thead className="bg-black/20 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">User</th><th className="px-5 py-4">Referral</th><th className="px-5 py-4">Purchased</th><th className="px-5 py-4">Locked STV</th><th className="px-5 py-4">Bonus USDT</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Action</th></tr></thead>
        <tbody className="divide-y divide-white/5">{loading ? <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-500">Loading users…</td></tr> : filtered.map(user => <tr key={user.id} className="hover:bg-white/[0.025]">
          <td className="px-5 py-4"><div className="font-semibold">{user.fullName}</div><div className="text-xs text-slate-500">{user.email}</div></td>
          <td className="px-5 py-4"><button className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-cyan-300" onClick={()=>navigator.clipboard?.writeText(user.referralCode)}>{user.referralCode}<Copy size={12}/></button></td>
          <td className="px-5 py-4">${(user.purchaseWallet?.totalPurchasedUSDT ?? 0).toLocaleString()}</td>
          <td className="px-5 py-4 font-semibold">{(user.purchaseWallet?.lockedSTV ?? 0).toLocaleString()} STV</td>
          <td className="px-5 py-4 text-emerald-300">${(user.bonusWallet?.referralAvailable ?? 0).toFixed(2)}</td>
          <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs ${user.isBlocked ? 'bg-red-500/10 text-red-300' : 'bg-emerald-500/10 text-emerald-300'}`}>{user.isBlocked ? 'Blocked' : user.isVerified ? 'Active' : 'Unverified'}</span></td>
          <td className="px-5 py-4"><div className="flex items-center gap-2"><Link href={`/admin/users/${user.id}`} className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/10">View</Link><button disabled={updating===user.id} onClick={()=>toggleBlock(user)} className="rounded-lg border border-white/10 p-2 hover:bg-white/10" title={user.isBlocked ? 'Unblock' : 'Block'}>{user.isBlocked ? <ShieldCheck size={15}/> : <ShieldOff size={15}/>}</button></div></td>
        </tr>)}</tbody></table>
      </div>
    </div>
  </main>;
}
