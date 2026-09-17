"use client";

import { useEffect, useMemo, useState } from "react";
import { tokenomicsData } from "./tokenomics-data";

interface Props {
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function DonutChart({
  hovered,
  setHovered,
}: Props) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const radius = 90;
  const stroke = 24;
  const circumference = 2 * Math.PI * radius;

  const slices = useMemo(() => {
    let offset = 0;

    return tokenomicsData.map((item) => {
      const dash = (item.value / 100) * circumference;

      const slice = {
        ...item,
        dash,
        offset,
      };

      offset += dash;

      return slice;
    });
  }, [circumference]);

  return (
    <div className="relative flex justify-center">

      {/* Donut */}

      <svg
        width="280"
        height="280"
        viewBox="0 0 220 220"
        className="donut-chart -rotate-90"
      >

        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="#1F2937"
          strokeWidth={stroke}
        />

        {slices.map((slice, index) => (

          <circle
            key={slice.id}
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke={slice.color}
            strokeWidth={
              hovered === index
                ? stroke + 6
                : stroke
            }
            strokeLinecap="round"
            strokeDasharray={`${slice.dash} ${circumference}`}
            strokeDashoffset={
              animate
                ? -slice.offset
                : circumference
            }
            opacity={
              hovered === null
                ? 1
                : hovered === index
                ? 1
                : 0.35
            }
            className={`token-slice cursor-pointer ${
  hovered === index ? "active-slice" : ""
}`}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            style={{
  transition:
    `all .35s ease,
    stroke-dashoffset 1.5s ease ${index * 0.15}s`,

  transformOrigin: "110px 110px",

  transform:
    hovered === index
      ? "scale(1.04)"
      : "scale(1)",

  filter:
    hovered === index
      ? `drop-shadow(0 0 10px ${slice.color})
         drop-shadow(0 0 25px ${slice.color})
         drop-shadow(0 0 40px ${slice.color})`
      : "none",
}}
          />

        ))}

      </svg>

      {/* Tooltip */}

      {hovered !== null && (

        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 rounded-xl border border-cyan-500/30 bg-[#0B1220]/95 px-4 py-3 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,.25)]">

          <p
            className="font-bold"
            style={{
              color: slices[hovered].color,
            }}
          >
            {slices[hovered].title}
          </p>

          <p className="text-sm text-gray-300">
            {slices[hovered].value}% Allocation
          </p>

        </div>

      )}

      {/* Center */}

      <div className="absolute inset-0 flex items-center justify-center">

        <div className="glass flex h-40 w-40 flex-col items-center justify-center rounded-full border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,.25)]">

          <h3 className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-4xl font-extrabold text-transparent">
            STV
          </h3>

          <p className="mt-2 text-xs uppercase tracking-[3px] text-gray-400">
            Total Supply
          </p>

          <p className="mt-2 text-xl font-bold text-white">
            1,000,000,000
          </p>

          <p className="text-sm text-cyan-400">
            Tokens
          </p>

        </div>

      </div>

    </div>
  );
}