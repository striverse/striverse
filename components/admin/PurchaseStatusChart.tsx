"use client";

interface Props {
  pending: number;
  approved: number;
  rejected: number;
}

export default function PurchaseStatusChart({ pending, approved, rejected }: Props) {
  const data = [
    { name: "Approved", value: approved, color: "#10b981" },
    { name: "Pending", value: pending, color: "#f59e0b" },
    { name: "Rejected", value: rejected, color: "#ef4444" },
  ];
  const total = data.reduce((sum, item) => sum + Math.max(0, item.value), 0);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-[#101827] p-6">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">🥧 Purchase Status</h2>
      <div className="min-h-[350px] flex flex-col sm:flex-row items-center justify-center gap-8">
        <div className="relative w-[230px] h-[230px] shrink-0">
          <svg viewBox="0 0 230 230" className="w-full h-full -rotate-90" role="img" aria-label="Purchase status chart">
            <circle cx="115" cy="115" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="30" />
            {total > 0 && data.map((item, index) => {
              const length = (Math.max(0, item.value) / total) * circumference;
              const currentOffset = offset;
              offset += length;
              return <circle key={`${item.name}-${index}`} cx="115" cy="115" r={radius} fill="none" stroke={item.color} strokeWidth="30" strokeDasharray={`${length} ${circumference - length}`} strokeDashoffset={-currentOffset} />;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{total.toLocaleString()}</span>
            <span className="text-xs text-slate-400">Total</span>
          </div>
        </div>
        <div className="space-y-4 w-full max-w-xs">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full" style={{ background: item.color }} />{item.name}</span>
              <span className="font-semibold">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
