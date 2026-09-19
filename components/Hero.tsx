"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Coins, Globe2, PlayCircle, UserRound, Users } from "lucide-react";

interface HeroStats {
  raised: number;
  hardCap: number;
  progress: number;
  tokenPrice: number;
  community: number;
  potentialUsers: number;
  communityDriven: number;
  endDate: string | null;
  totalTokens: number;
  stvSold: number;
  stvRemaining: number;
  presaleAllocatedTokens: number;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ended: boolean;
}

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
const formatCompact = (value: number) => formatNumber(value);

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
    hardCap: 0,
    progress: 0,
    tokenPrice: 0,
    community: 50000,
    potentialUsers: 1000000,
    communityDriven: 100,
    endDate: null,
    totalTokens: 0,
    stvSold: 0,
    stvRemaining: 0,
    presaleAllocatedTokens: 2222222222,
  });
  const [countdown, setCountdown] = useState<Countdown>(getCountdown(null));
  const [signedIn, setSignedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/me", { credentials: "include", cache: "no-store" })
      .then((res) => setSignedIn(res.ok))
      .catch(() => setSignedIn(false))
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/presale/stats", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          const endDate = data.endDate ?? null;
          setStats({
            raised: Number(data.raised ?? 0),
            hardCap: Number(data.hardCap ?? 0),
            progress: Number(data.progress ?? 0),
            tokenPrice: Number(data.tokenPrice ?? 0),
            community: Number(data.community ?? data.investors ?? 50000),
            potentialUsers: Number(data.potentialUsers ?? 1000000),
            communityDriven: Number(data.communityDriven ?? 100),
            endDate,
            totalTokens: Number(data.totalTokens ?? 0),
            stvSold: Number(data.stvSold ?? 0),
            stvRemaining: Number(data.stvRemaining ?? 0),
            presaleAllocatedTokens: Number(data.presaleAllocatedTokens ?? 2222222222),
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
          <h1>Secure, Smart,<br />and <span>Limitless! Join</span><br /><span>STRIVERSE</span></h1>
          <p className="reference-lead">Explore a next-generation ecosystem built around STV,<br className="desktop-break" />with investing, staking, vesting, airdrops, and a connected<br className="desktop-break" />community — all in one place.</p>
          <div className="reference-hero-actions"><a href="#invest" className="reference-video-cta"><span className="reference-play"><PlayCircle size={18} strokeWidth={1.7} /></span>Watch Video</a></div>

          <div className="reference-countdown relative mt-6 w-full max-w-[760px] overflow-hidden rounded-[28px] border border-cyan-300/25 bg-[#020b1b]/80 p-4 shadow-[0_0_55px_rgba(25,220,255,.12)] backdrop-blur-2xl sm:p-5" aria-label="STV Token Presale countdown">
            <div className="pointer-events-none absolute -right-12 -top-14 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-violet-500/15 blur-3xl" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black tracking-[.32em] sm:text-xs">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_12px_#ef4444]" />
                  <span className="text-red-500">STV TOKEN PRESALE</span>
                  <span className="text-cyan-300">•</span>
                  <span className="text-green-500">LIVE SALE</span>
                </div>
                <div className="mt-1 text-sm font-bold text-white sm:text-base">Secure your STV allocation before the presale closes.</div>
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

            <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[.035] p-3 sm:p-4">
              <div className="mb-2 flex items-center justify-between gap-3 text-[9px] font-black uppercase tracking-[.18em] text-slate-400 sm:text-[10px]">
                <span>STV PRESALE PROGRESS</span>
                <span className="text-cyan-200">{Math.min(100, Math.max(0, stats.progress)).toFixed(2)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 shadow-[0_0_18px_rgba(34,211,238,.55)]" style={{ width: `${Math.min(100, Math.max(0, stats.progress))}%` }} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <div><small className="block text-[8px] font-black uppercase tracking-[.16em] text-slate-500">Raised</small><b className="text-sm text-white sm:text-base">${formatNumber(stats.raised)}</b></div>
                <div><small className="block text-[8px] font-black uppercase tracking-[.16em] text-slate-500">Hard Cap</small><b className="text-sm text-white sm:text-base">${formatNumber(stats.hardCap)}</b></div>
                <div className="col-span-2 sm:col-span-1"><small className="block text-[8px] font-black uppercase tracking-[.16em] text-slate-500">STV Price</small><b className="text-sm text-cyan-200 sm:text-base">${stats.tokenPrice}</b></div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div><small className="block text-[8px] font-black uppercase tracking-[.16em] text-slate-500">Total STV Presale</small><b className="text-sm text-white sm:text-base">{formatNumber(stats.totalTokens)}</b></div>
                <div><small className="block text-[8px] font-black uppercase tracking-[.16em] text-slate-500">Presale Allocated</small><b className="text-sm text-cyan-200 sm:text-base">{formatNumber(stats.presaleAllocatedTokens)}</b></div>
                <div><small className="block text-[8px] font-black uppercase tracking-[.16em] text-slate-500">STV Sold</small><b className="text-sm text-cyan-200 sm:text-base">{formatNumber(stats.stvSold)}</b></div><div><small className="block text-[8px] font-black uppercase tracking-[.16em] text-slate-500">STV Remaining</small><b className="text-sm text-white sm:text-base">{formatNumber(stats.stvRemaining)}</b></div>
              </div>
            </div>
            <div className="relative mt-4 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 text-center text-xs font-black uppercase tracking-[.16em] text-slate-950 shadow-[0_0_28px_rgba(34,211,238,.18)] transition-transform hover:scale-[1.01]">Buy STV Now ↗</Link>
              <a href="#tokenomics" className="flex-1 rounded-xl border border-cyan-200/20 bg-white/[.04] px-4 py-3 text-center text-xs font-black uppercase tracking-[.16em] text-cyan-100 transition-colors hover:bg-white/[.08]">View Token Details</a>
            </div>
            {!authLoading && signedIn && (
              <div className="relative mt-4 rounded-2xl border border-white/10 bg-white/[.025] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-[.2em] text-slate-400">Presale Packages</span>
                  <span className="text-[9px] font-bold uppercase tracking-[.14em] text-cyan-300">Choose your allocation</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {[
                    ["LUNA","100 USDT","100,000 STV"],["AURORA","300 USDT","300,000 STV"],["ANDROMEDA","500 USDT","500,000 STV"],["ORION","700 USDT","700,000 STV"],["CELESTIA","1,000 USDT","1,000,000 STV"],
                  ].map(([name, usdt, stv]) => (
                    <div key={name} className="rounded-xl border border-cyan-200/10 bg-slate-950/35 p-2.5">
                      <b className="block text-[10px] font-black tracking-[.12em] text-white">{name}</b>
                      <span className="mt-1 block text-[10px] font-bold text-cyan-200">{usdt}</span>
                      <small className="mt-1 block text-[8px] uppercase tracking-[.12em] text-slate-500">{stv}</small>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="relative mt-3 flex items-center justify-between text-[9px] uppercase tracking-[.2em] text-slate-500 sm:text-[10px]">
              <span>LIVE • AUTO UPDATES EVERY SECOND</span>
              <span className="hidden sm:inline">{stats.endDate ? new Date(stats.endDate).toLocaleDateString() : "—"}</span>
            </div>
          </div>
        </div>
        <div className="reference-side-copy"><span>STRIVE</span><span>GROW</span><span>BELONG</span></div>
      </div>
    </section>
  );
}
