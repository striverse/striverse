"use client";

interface Props {
  data: { day: string; amount: number }[];
}

export default function SalesChart({ data }: Props) {
  const width = 760;
  const height = 300;
  const pad = { top: 20, right: 20, bottom: 48, left: 58 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const max = Math.max(...data.map((d) => d.amount), 1);
  const points = data.map((d, i) => ({
    ...d,
    x: data.length <= 1 ? pad.left + plotW / 2 : pad.left + (i / (data.length - 1)) * plotW,
    y: pad.top + plotH - (d.amount / max) * plotH,
  }));
  const line = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = points.length ? `${pad.left},${pad.top + plotH} ${line} ${pad.left + plotW},${pad.top + plotH}` : "";

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-[#101827] p-6">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">📈 Revenue Overview</h2>
      {data.length === 0 ? (
        <div className="h-[350px] flex items-center justify-center text-sm text-slate-400">No sales data yet.</div>
      ) : (
        <div className="h-[350px] w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" role="img" aria-label="Revenue overview chart">
            <line x1={pad.left} y1={pad.top + plotH} x2={pad.left + plotW} y2={pad.top + plotH} stroke="currentColor" opacity="0.2" />
            <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + plotH} stroke="currentColor" opacity="0.2" />
            <text x={pad.left - 8} y={pad.top + 5} textAnchor="end" fontSize="11" fill="currentColor" opacity="0.65">{max.toLocaleString()}</text>
            <text x={pad.left - 8} y={pad.top + plotH + 4} textAnchor="end" fontSize="11" fill="currentColor" opacity="0.65">0</text>
            {area && <polygon points={area} fill="#06b6d4" fillOpacity="0.16" />}
            {line && <polyline points={line} fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
            {points.map((p) => (
              <g key={`${p.day}-${p.x}`}>
                <circle cx={p.x} cy={p.y} r="4" fill="#06b6d4" />
                <text x={p.x} y={height - 16} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">{p.day}</text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}
