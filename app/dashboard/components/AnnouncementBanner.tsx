"use client";

import { Megaphone } from "lucide-react";
import GlassCard from "./ui/GlassCard";

export default function AnnouncementBanner() {
  return (
    <GlassCard className="mt-8 overflow-hidden border border-cyan-500/20">
      <div className="flex items-center gap-3 bg-cyan-500/10 px-6 py-4">
        <Megaphone className="text-cyan-400" size={22} />

        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="animate-marquee inline-block">
            🚀 Welcome to STRIVERSE Presale • ⭐ 1 USDT = 1000 STV • 🎁 Partner rewards available • 🔒 STV Tokens will unlock after launch • 📢 Stay tuned for upcoming announcements
          </div>
        </div>
      </div>
    </GlassCard>
  );
}