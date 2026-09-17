"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const packages = ["LUNA", "AURORA", "ANDROMEDA", "ORION", "CELESTIA"];
const tabs = ["PENDING", "APPROVED", "REJECTED", "ALL"] as const;
type Tab = (typeof tabs)[number];

export default function AdminPurchasesPage() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("PENDING");
  const [selected, setSelected] = useState<any | null>(null);
  const [busy, setBusy] = useState(false);

  async function loadPurchases() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/purchases", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load purchases");
      setPurchases(data.purchases || []);
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Failed to load purchases.");
    } finally { setLoading(false); }
  }

  useEffect(() => { loadPurchases(); }, []);

  async function approve(id: string) {
    if (!confirm("Approve this payment? STV will be credited to the user's locked balance and the referral reward will be created.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/purchases/${id}/approve`, { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Approval failed.");
      setSelected(null);
      await loadPurchases();
    } catch (e) { alert(e instanceof Error ? e.message : "Approval failed."); }
    finally { setBusy(false); }
  }

  async function reject(id: string) {
    const remarks = prompt("Reason for rejection (optional):") || "";
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/purchases/${id}/reject`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ remarks })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reject failed.");
      setSelected(null);
      await loadPurchases();
    } catch (e) { alert(e instanceof Error ? e.message : "Reject failed."); }
    finally { setBusy(false); }
  }

  const counts = useMemo(() => ({
    PENDING: purchases.filter(p => p.status === "PENDING").length,
    APPROVED: purchases.filter(p => p.status === "APPROVED").length,
    REJECTED: purchases.filter(p => p.status === "REJECTED").length,
    ALL: purchases.length,
  }), [purchases]);
  const filtered = activeTab === "ALL" ? purchases : purchases.filter(p => p.status === activeTab);

  return (
    <main className="min-h-screen bg-[#030612] text-white p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_#67e8f9]"/><span className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">Striverse Control Center</span></div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Purchase Review</h1>
            <p className="mt-2 text-sm text-slate-400">Verify payment proof before releasing locked STV.</p>
          </div>
          <button onClick={() => router.push("/admin/dashboard")} className="rounded-2xl border border-white/10 bg-white/[.06] px-5 py-3 text-sm font-semibold hover:bg-white/10">← Dashboard</button>
        </header>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tabs.map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-2xl border p-4 text-left transition ${activeTab === tab ? "border-cyan-300/40 bg-cyan-400/10" : "border-white/10 bg-white/[.035] hover:bg-white/[.06]"}`}><div className="text-xs uppercase tracking-widest text-slate-400">{tab}</div><div className="mt-1 text-2xl font-black">{counts[tab]}</div></button>)}
        </div>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.035] shadow-2xl shadow-cyan-950/20">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] text-sm"><thead className="bg-white/[.05] text-left text-xs uppercase tracking-wider text-slate-400"><tr><th className="p-5">User</th><th className="p-5">Package</th><th className="p-5">Payment</th><th className="p-5">STV</th><th className="p-5">Network</th><th className="p-5">Status</th><th className="p-5 text-right">Action</th></tr></thead><tbody>
              {loading ? <tr><td colSpan={7} className="p-14 text-center text-slate-400">Loading purchases…</td></tr> : filtered.length === 0 ? <tr><td colSpan={7} className="p-14 text-center text-slate-400">No {activeTab.toLowerCase()} purchases.</td></tr> : filtered.map(p => <tr key={p.id} className="border-t border-white/5 hover:bg-cyan-400/[.025]"><td className="p-5"><div className="font-semibold">{p.user?.fullName || "Unknown"}</div><div className="text-xs text-slate-500">{p.user?.email}</div></td><td className="p-5"><span className="rounded-lg bg-violet-400/10 px-3 py-1 font-bold text-violet-200">{packages.includes(p.packageName) ? p.packageName : p.packageName || "STV"}</span></td><td className="p-5 font-semibold">{p.usdtAmount} USDT</td><td className="p-5">{Number(p.stvAmount).toLocaleString()}</td><td className="p-5">{p.network}</td><td className="p-5"><Status status={p.status}/></td><td className="p-5 text-right"><button onClick={() => setSelected(p)} className="rounded-xl bg-cyan-400/10 px-4 py-2 font-semibold text-cyan-200 hover:bg-cyan-400/20">Review</button></td></tr>)}
            </tbody></table>
          </div>
          <div className="space-y-3 p-3 md:hidden">
            {loading ? <div className="p-10 text-center text-slate-400">Loading purchases…</div> : filtered.length === 0 ? <div className="p-10 text-center text-slate-400">No {activeTab.toLowerCase()} purchases.</div> : filtered.map(p => <button key={p.id} onClick={() => setSelected(p)} className="w-full rounded-2xl border border-white/10 bg-white/[.035] p-4 text-left"><div className="flex items-start justify-between gap-3"><div><div className="font-bold">{p.user?.fullName || "Unknown"}</div><div className="mt-1 text-xs text-slate-500">{p.user?.email}</div></div><Status status={p.status}/></div><div className="mt-4 flex justify-between text-sm"><span className="text-violet-200">{p.packageName}</span><span>{p.usdtAmount} USDT · {Number(p.stvAmount).toLocaleString()} STV</span></div></button>)}
          </div>
        </section>
      </div>

      {selected && <ReviewModal purchase={selected} busy={busy} onClose={() => setSelected(null)} onApprove={() => approve(selected.id)} onReject={() => reject(selected.id)} />}
    </main>
  );
}

function Status({ status }: { status: string }) { const c = status === "APPROVED" ? "bg-emerald-400/10 text-emerald-300" : status === "REJECTED" ? "bg-red-400/10 text-red-300" : "bg-amber-400/10 text-amber-200"; return <span className={`rounded-full px-3 py-1 text-xs font-bold ${c}`}>{status}</span>; }

function ReviewModal({ purchase: p, busy, onClose, onApprove, onReject }: any) {
  const copy = async (text: string) => { try { await navigator.clipboard.writeText(text); } catch {} };
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-8"><div className="mx-auto my-4 max-w-6xl overflow-hidden rounded-3xl border border-cyan-300/15 bg-[#07101f] shadow-2xl shadow-cyan-950/40">
    <div className="flex items-center justify-between border-b border-white/10 p-5 sm:p-7"><div><div className="text-xs uppercase tracking-[.3em] text-cyan-300/70">Payment verification</div><h2 className="mt-1 text-2xl font-black">{p.packageName} · {p.usdtAmount} USDT</h2></div><button onClick={onClose} className="rounded-xl bg-white/5 px-3 py-2 text-slate-300 hover:bg-white/10">✕</button></div>
    <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-4"><Info title="User" value={`${p.user?.fullName || "Unknown"} · ${p.user?.email || ""}`}/><div className="grid grid-cols-2 gap-3"><Info title="Package" value={p.packageName}/><Info title="Network" value={p.network}/><Info title="USDT paid" value={`${p.usdtAmount} USDT`}/><Info title="STV to lock" value={Number(p.stvAmount).toLocaleString()}/><Info title="Referral bonus" value={`${Number(p.referralBonusUSDT || 0).toLocaleString()} USDT`}/><Info title="Created" value={new Date(p.createdAt).toLocaleString()}/></div><Info title="Sender wallet" value={p.walletAddress} copy={() => copy(p.walletAddress)}/><Info title="Transaction hash" value={p.txHash} copy={() => copy(p.txHash)}/><div className="rounded-2xl border border-amber-300/10 bg-amber-300/[.04] p-4 text-sm text-amber-100/80">Approve only after independently verifying the transaction on the selected network. Approval credits locked STV and creates the referral reward.</div></div>
      <div><div className="mb-3 flex items-center justify-between"><h3 className="font-bold">Payment screenshot</h3><Status status={p.status}/></div>{p.proofImage ? <Image src={p.proofImage} alt="Payment proof" width={1000} height={900} className="max-h-[58vh] w-full rounded-2xl border border-white/10 bg-black/30 object-contain"/> : <div className="flex h-80 items-center justify-center rounded-2xl border border-dashed border-white/15 text-slate-500">No proof uploaded</div>}</div>
    </div>
    <div className="flex flex-col-reverse gap-3 border-t border-white/10 p-5 sm:flex-row sm:justify-end sm:p-7">{p.status === "PENDING" && <><button disabled={busy} onClick={onReject} className="rounded-2xl bg-red-500/15 px-6 py-3 font-bold text-red-200 hover:bg-red-500/25 disabled:opacity-50">Reject</button><button disabled={busy} onClick={onApprove} className="rounded-2xl bg-emerald-400 px-7 py-3 font-black text-slate-950 hover:bg-emerald-300 disabled:opacity-50">{busy ? "Processing…" : "✓ Approve & Credit"}</button></>}<button onClick={onClose} className="rounded-2xl border border-white/10 px-6 py-3 font-semibold text-slate-300 hover:bg-white/5">Close</button></div>
  </div></div>;
}
function Info({ title, value, copy }: { title: string; value: string; copy?: () => void }) { return <div className="rounded-2xl border border-white/8 bg-white/[.025] p-4"><div className="text-[10px] uppercase tracking-widest text-slate-500">{title}</div><div className="mt-1 break-all text-sm font-semibold text-slate-100">{value || "—"}</div>{copy && <button onClick={copy} className="mt-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200">Copy</button>}</div>; }
