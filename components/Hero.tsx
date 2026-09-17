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
}

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
const formatCompact = (value: number) => value >= 1000000 ? `${value / 1000000}M` : value >= 1000 ? `${value / 1000}K` : formatNumber(value);

export default function Hero() {
  const [stats, setStats] = useState<HeroStats>({ raised: 0, tokenPrice: 0, community: 50000, potentialUsers: 1000000, communityDriven: 100 });

  useEffect(() => {
    fetch("/api/presale/stats", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) setStats({
          raised: Number(data.raised ?? 0),
          tokenPrice: Number(data.tokenPrice ?? 0),
          community: Number(data.community ?? data.investors ?? 50000),
          potentialUsers: Number(data.potentialUsers ?? 1000000),
          communityDriven: Number(data.communityDriven ?? 100),
        });
      })
      .catch(() => undefined);
  }, []);

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
