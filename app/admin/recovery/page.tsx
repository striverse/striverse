"use client";

import { useEffect, useState } from "react";

interface RecoveryRequest {
  id: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  referralCode: string | null;
  recoveryRequestedAt: string | null;
  createdAt: string;
}

export default function RecoveryResetPage() {
  const [requests, setRequests] = useState<RecoveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [resetCode, setResetCode] = useState<{ email: string; code: string; expiresAt: string } | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/recovery", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setRequests(data.requests || []);
      else setMessage(data.message || "Unable to load recovery requests.");
    } catch {
      setMessage("Unable to load recovery requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function approve(id: string, email: string) {
    if (!confirm(`Approve one-time recovery reset for ${email}?`)) return;
    setBusy(id);
    setMessage("");
    setResetCode(null);
    try {
      const res = await fetch("/api/admin/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Recovery reset failed.");
        return;
      }
      setResetCode({ email, code: data.resetCode, expiresAt: data.expiresAt });
      setMessage(data.message || "Recovery reset approved.");
      await load();
    } catch {
      setMessage("Recovery reset failed.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[.3em] text-cyan-300">Security</div>
          <h1 className="mt-1 text-3xl font-bold text-white">Recovery Reset</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">Review one-time recovery requests. The admin never receives or sees the user’s recovery phrase.</p>
        </div>
        <button onClick={load} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">Refresh</button>
      </div>

      {message && <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-cyan-100">{message}</div>}

      {resetCode && (
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5">
          <div className="text-xs uppercase tracking-[.2em] text-emerald-300">One-time reset code</div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <code className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-lg font-bold tracking-[.18em] text-white">{resetCode.code}</code>
            <span className="text-xs text-slate-400">For {resetCode.email} · expires {new Date(resetCode.expiresAt).toLocaleString()}</span>
          </div>
          <p className="mt-3 text-xs text-slate-400">Give this code to the verified user through your trusted support channel. Never ask for or record their new recovery phrase.</p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#08101F]">
        <div className="border-b border-white/10 px-5 py-4">
          <div className="text-sm font-semibold text-white">Pending requests</div>
          <div className="text-xs text-slate-500">{requests.length} request{requests.length === 1 ? "" : "s"}</div>
        </div>
        {loading ? (
          <div className="p-8 text-sm text-slate-500">Loading recovery requests…</div>
        ) : requests.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">No pending recovery requests.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {requests.map((user) => (
              <div key={user.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="font-semibold text-white">{user.fullName || "Unnamed user"}</div>
                  <div className="mt-1 text-sm text-slate-400">{user.email}{user.phone ? ` · ${user.phone}` : ""}</div>
                  <div className="mt-2 text-xs text-slate-500">Partner Code: {user.referralCode || "—"} · Requested: {user.recoveryRequestedAt ? new Date(user.recoveryRequestedAt).toLocaleString() : "—"}</div>
                </div>
                <button disabled={busy === user.id} onClick={() => approve(user.id, user.email)} className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-black disabled:opacity-50">{busy === user.id ? "Approving…" : "Approve Recovery Reset"}</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
