"use client";

import { useEffect, useState } from "react";
import { Bell, UserCircle } from "lucide-react";

export default function AdminHeader() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setTime(
        now.toLocaleString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-white/10 bg-[#0B1120]/80 px-8 backdrop-blur-xl">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-cyan-400">
          
        </h1>

        <p className="text-sm text-gray-400">
          
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        <div className="hidden text-right md:block">
          <p className="font-medium text-white">{time}</p>
          <p className="text-xs text-gray-400">
            Administrator Panel
          </p>
        </div>

        <button className="relative rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10">
          <Bell size={20} />

          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold">
            0
          </span>
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
          <UserCircle
            size={36}
            className="text-cyan-400"
          />

          <div>
            <p className="font-semibold">
              Administrator
            </p>

            <p className="text-xs text-gray-400">
              ADMIN
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}