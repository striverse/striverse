"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, RefreshCw, Search, Clock3 } from "lucide-react";

type AuditLog = {
  id: string;
  userId: string | null;
  actorRole: string;
  action: string;
  metadata: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
};

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/audit?limit=200", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setLogs(data.logs ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return logs.filter((log) => [log.action, log.actorRole, log.userId, log.metadata].some((v) => String(v ?? "").toLowerCase().includes(q)));
  }, [logs, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3"><ShieldCheck className="text-cyan-300" size={24} /></div>
            <div><h1 className="text-2xl font-bold">Security Audit</h1><p className="text-sm text-slate-400">Review security and account events.</p></div>
          </div>
        </div>
        <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium hover:bg-white/10"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button>
      </div>

      <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search action, user ID, role..." className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 outline-none placeholder:text-slate-500 focus:border-cyan-400/40" /></div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-slate-400"><tr><th className="px-5 py-4">Time</th><th className="px-5 py-4">Actor</th><th className="px-5 py-4">Action</th><th className="px-5 py-4">User</th><th className="px-5 py-4">Details</th></tr></thead>
          <tbody className="divide-y divide-white/5">{filtered.map((log) => <tr key={log.id} className="hover:bg-white/[0.025]"><td className="px-5 py-4 whitespace-nowrap text-slate-400"><span className="inline-flex items-center gap-2"><Clock3 size={14}/>{new Date(log.createdAt).toLocaleString()}</span></td><td className="px-5 py-4"><span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-300">{log.actorRole}</span></td><td className="px-5 py-4 font-medium text-white">{log.action}</td><td className="px-5 py-4 font-mono text-xs text-slate-400">{log.userId ?? "—"}</td><td className="max-w-[320px] truncate px-5 py-4 text-slate-400">{log.metadata ?? "—"}</td></tr>)}{!loading && filtered.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500">No audit events found.</td></tr>}</tbody>
        </table></div>
      </div>
    </div>
  );
}
