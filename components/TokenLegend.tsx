"use client";

import Counter from "./Counter";
import { tokenomicsData } from "./tokenomics-data";

interface Props {
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function TokenLegend({
  hovered,
  setHovered,
}: Props) {
  return (
    <div className="space-y-6">

      {tokenomicsData.map((item, index) => (

        <div
          key={item.id}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          className={`glass rounded-3xl border p-6 cursor-pointer transition-all duration-300 ${
            hovered === index
              ? "scale-[1.05] border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,.4)]"
              : "border-white/10"
          }`}
        >

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div
                className="h-5 w-5 rounded-full"
                style={{
                  background: item.color,
                  boxShadow: `0 0 15px ${item.color}`,
                }}
              />

              <div>

                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400">
                  Token Allocation
                </p>

              </div>

            </div>

            <div
              className="text-2xl font-bold"
              style={{
                color: item.color,
              }}
            >
              <Counter end={item.value} />
            </div>

          </div>

          {/* Progress Bar */}

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">

            <div
              className={`h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-[1800ms]`}
              style={{
                width: `${item.value}%`,
                transitionDelay: `${index * 150}ms`,
              }}
            />

          </div>

          <div className="mt-3 flex justify-between text-xs text-gray-400">

            <span>Allocation</span>

            <span>{item.value}% of Supply</span>

          </div>

        </div>

      ))}

    </div>
  );
}