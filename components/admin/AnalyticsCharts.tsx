"use client";

interface RevenueData {
  date: string;
  raised: number;
}

interface StatusData {
  name: string;
  value: number;
}

interface Props {
  revenue: RevenueData[];
  status: StatusData[];
}

const CHART_COLORS = ["#06b6d4", "#22c55e", "#ef4444"];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

function RevenueChart({ data }: { data: RevenueData[] }) {
  const width = 640;
  const height = 260;
  const pad = { top: 16, right: 18, bottom: 42, left: 48 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const max = Math.max(...data.map((d) => d.raised), 1);
  const points = data.map((d, index) => {
    const x = data.length <= 1 ? pad.left + plotW / 2 : pad.left + (index / (data.length - 1)) * plotW;
    const y = pad.top + plotH - (d.raised / max) * plotH;
    return { ...d, x, y };
  });
  const line = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = points.length ? `${pad.left},${pad.top + plotH} ${line} ${pad.left + plotW},${pad.top + plotH}` : "";

  return (
    <div className="w-full overflow-hidden">
      {data.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-sm text-slate-400">No revenue data yet.</div>
      ) : (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[300px]" role="img" aria-label="Revenue trend chart">
          <line x1={pad.left} y1={pad.top + plotH} x2={pad.left + plotW} y2={pad.top + plotH} stroke="currentColor" opacity="0.2" />
          <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + plotH} stroke="currentColor" opacity="0.2" />
          <text x={pad.left - 8} y={pad.top + 5} textAnchor="end" fontSize="11" fill="currentColor" opacity="0.65">{formatNumber(max)}</text>
          <text x={pad.left - 8} y={pad.top + plotH + 4} textAnchor="end" fontSize="11" fill="currentColor" opacity="0.65">0</text>
          {area && <polygon points={area} fill="#06b6d4" fillOpacity="0.18" />}
          {line && <polyline points={line} fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
          {points.map((p) => (
            <g key={`${p.date}-${p.x}`}>
              <circle cx={p.x} cy={p.y} r="4" fill="#06b6d4" />
              <text x={p.x} y={height - 14} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">{p.date}</text>
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}

function StatusChart({ data }: { data: StatusData[] }) {
  const total = data.reduce((sum, item) => sum + Math.max(0, item.value), 0);
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 min-h-[300px]">
      <div className="relative w-[220px] h-[220px] shrink-0">
        <svg viewBox="0 0 220 220" className="w-full h-full -rotate-90" role="img" aria-label="Purchase status chart">
          <circle cx="110" cy="110" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="28" />
          {total > 0 && data.map((item, index) => {
            const fraction = Math.max(0, item.value) / total;
            const length = fraction * circumference;
            const currentOffset = offset;
            offset += length;
            return (
              <circle
                key={`${item.name}-${index}`}
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth="28"
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-currentOffset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{formatNumber(total)}</span>
          <span className="text-xs text-slate-400">Total</span>
        </div>
      </div>
      <div className="space-y-3 w-full">
        {data.length === 0 ? (
          <p className="text-sm text-slate-400">No purchase status data yet.</p>
        ) : data.map((item, index) => (
          <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />
              <span className="truncate">{item.name}</span>
            </div>
            <span className="font-semibold">{formatNumber(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsCharts({ revenue, status }: Props) {
  return (
    <div className="grid lg:grid-cols-2 gap-8 my-10">
      <div className="rounded-2xl bg-white/5 border border-cyan-500/20 backdrop-blur-xl p-6">
        <h2 className="text-xl font-bold mb-6">📈 Revenue Trend</h2>
        <RevenueChart data={revenue} />
      </div>
      <div className="rounded-2xl bg-white/5 border border-cyan-500/20 backdrop-blur-xl p-6">
        <h2 className="text-xl font-bold mb-6">🥧 Purchase Status</h2>
        <StatusChart data={status} />
      </div>
    </div>
  );
}
