"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Coins, Globe2, PlayCircle, UserRound, Users } from "lucide-react";

interface HeroStats {
  raised: number;
  tokenPrice: number;
  community: number;
  potentialUsers: number;
  communityDriven: number;
  endDate: string | null;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ended: boolean;
}

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
const formatCompact = (value: number) => value >= 1000000 ? `${value / 1000000}M` : value >= 1000 ? `${value / 1000}K` : formatNumber(value);

const getCountdown = (endDate: string | null): Countdown => {
  if (!endDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };

  const diff = Math.max(0, new Date(endDate).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    ended: diff === 0,
  };
};

const pad = (value: number) => String(value).padStart(2, "0");

export default function Hero() {
  const [stats, setStats] = useState<HeroStats>({
    raised: 0,
    tokenPrice: 0,
    community: 50000,
    potentialUsers: 1000000,
    communityDriven: 100,
    endDate: null,
  });
  const [countdown, setCountdown] = useState<Countdown>(getCountdown(null));

  useEffect(() => {
    fetch("/api/presale/stats", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          const endDate = data.endDate ?? null;
          setStats({
            raised: Number(data.raised ?? 0),
            tokenPrice: Number(data.tokenPrice ?? 0),
            community: Number(data.community ?? data.investors ?? 50000),
            potentialUsers: Number(data.potentialUsers ?? 1000000),
            communityDriven: Number(data.communityDriven ?? 100),
            endDate,
          });
          setCountdown(getCountdown(endDate));
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!stats.endDate) return;
    const timer = window.setInterval(() => {
      setCountdown(getCountdown(stats.endDate));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [stats.endDate]);

  const countdownUnits = [
    ["DAYS", countdown.days],
    ["HOURS", countdown.hours],
    ["MIN", countdown.minutes],
    ["SEC", countdown.seconds],
  ] as const;

  return (
    <section className="reference-hero-live" aria-label="STRIVERSE landing page">
      <div className="reference-space" /><div className="reference-stars" /><div className="reference-nebula reference-nebula-a" /><div className="reference-nebula reference-nebula-b" /><div className="reference-hero-art" aria-hidden="true" />
      <div className="reference-planet"><div className="reference-planet-glow" /><div className="reference-planet-surface" /><div className="reference-planet-light" /></div><div className="reference-moon" />
      <div className="reference-mountain mountain-a" /><div className="reference-mountain mountain-b" /><div className="reference-mountain mountain-c" />
      <div className="reference-platform"><div className="platform-ring platform-ring-a" /><div className="platform-ring platform-ring-b" /><div className="platform-core" /></div>
      <div className="reference-light-beam beam-a" /><div className="reference-light-beam beam-b" /><div className="reference-light-beam beam-c" />

      <div className="reference-hero-content">
        <div className="reference-hero-copy">
          <p className="reference-kicker">THE NEXT DIMENSION OF DIGITAL OPPORTUNITY</p>
          <h1>Secure, Smart, and<br />Limitless! <span>Join</span><br /><span>STRIVERSE</span></h1>
          <p className="reference-lead">Explore a next-generation ecosystem built around STV,<br className="desktop-break" />with investing, staking, vesting, airdrops, and a connected<br className="desktop-break" />community — all in one place.</p>
          <div className="reference-hero-actions"><Link href="/register" className="reference-primary-cta">Explore STRIVERSE <span>↗</span></Link><a href="#invest" className="reference-video-cta"><span className="reference-play"><PlayCircle size={18} strokeWidth={1.7} /></span>Watch Video</a></div>

          <div className="reference-countdown relative mt-6 w-full max-w-[720px] overflow-hidden rounded-[26px] border border-cyan-300/25 bg-[#031126]/75 p-4 shadow-[0_0_45px_rgba(25,220,255,.10)] backdrop-blur-xl sm:p-5" aria-label="Presale countdown">
            <div className="pointer-events-none absolute -right-12 -top-14 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-violet-500/15 blur-3xl" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black tracking-[.32em] text-cyan-200/70 sm:text-xs">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_12px_#67e8f9]" />
                  PRESALE COUNTDOWN
                </div>
                <div className="mt-1 text-sm font-bold text-white sm:text-base">The next phase starts when the clock reaches zero.</div>
              </div>
              {countdown.ended && <span className="rounded-full border border-red-300/30 bg-red-400/10 px-3 py-1.5 text-xs font-black tracking-widest text-red-200">ENDED</span>}
            </div>

            {!countdown.ended && (
              <div className="relative mt-4 grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2">
                {countdownUnits.map(([label, value], index) => (
                  <div key={label} className="contents">
                    <div className="group relative overflow-hidden rounded-2xl border border-cyan-200/15 bg-white/[.045] px-2 py-3 text-center shadow-inner shadow-cyan-300/[.04] sm:px-4 sm:py-4">
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
                      <strong className="block font-mono text-2xl font-black tabular-nums tracking-tight text-cyan-100 sm:text-4xl">{index === 0 ? value : pad(value)}</strong>
                      <small className="mt-1 block text-[8px] font-black tracking-[.2em] text-cyan-300/60 sm:text-[10px]">{label}</small>
                    </div>
                    {index < countdownUnits.length - 1 && <span className="pb-5 font-mono text-lg font-black text-cyan-300/50 sm:text-2xl">:</span>}
                  </div>
                ))}
              </div>
            )}

            <div className="relative mt-3 flex items-center justify-between text-[9px] uppercase tracking-[.2em] text-slate-500 sm:text-[10px]">
              <span>LIVE • AUTO UPDATES EVERY SECOND</span>
              <span className="hidden sm:inline">{stats.endDate ? new Date(stats.endDate).toLocaleDateString() : "—"}</span>
            </div>
          </div>

          <div className="reference-stats">
            <div className="reference-stat"><span className="reference-stat-icon"><Users size={28} /></span><div><b>{formatCompact(stats.community)}+</b><small>Community</small></div></div>
            <div className="reference-stat"><span className="reference-stat-icon"><Coins size={28} /></span><div><b>${formatNumber(stats.raised)}</b><small>Raised</small></div></div>
            <div className="reference-stat"><span className="reference-stat-icon"><UserRound size={28} /></span><div><b>{formatCompact(stats.potentialUsers)}+</b><small>Potential Users</small></div></div>
            <div className="reference-stat"><span className="reference-stat-icon"><Globe2 size={28} /></span><div><b>{stats.communityDriven}%</b><small>Community Driven</small></div></div>
          </div>
        </div>
        <div className="reference-side-copy"><span>STRIVE</span><span>GROW</span><span>BELONG</span></div>
      </div>
    </section>
  );
}
