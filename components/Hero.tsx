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

          <div className="reference-countdown" aria-label="Presale countdown">
            <div className="reference-countdown-heading">
              <span>PRESALE ENDS IN</span>
              {countdown.ended && <b>ENDED</b>}
            </div>
            {!countdown.ended && (
              <div className="reference-countdown-units">
                <div><strong>{pad(countdown.days)}</strong><small>DAYS</small></div>
                <span>:</span>
                <div><strong>{pad(countdown.hours)}</strong><small>HOURS</small></div>
                <span>:</span>
                <div><strong>{pad(countdown.minutes)}</strong><small>MIN</small></div>
                <span>:</span>
                <div><strong>{pad(countdown.seconds)}</strong><small>SEC</small></div>
              </div>
            )}
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
