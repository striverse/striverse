"use client";

import { useEffect, useState } from "react";

interface HeroStats { raised: number; hardCap: number; progress: number; tokenPrice: number; endDate: string | null; }
const initialStats: HeroStats = { raised: 0, hardCap: 0, progress: 0, tokenPrice: 0, endDate: null };
const money = (value: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
const countdown = (date: string | null) => {
  if (!date) return null;
  const ms = Math.max(0, new Date(date).getTime() - Date.now());
  return { days: Math.floor(ms / 86400000), hours: Math.floor(ms / 3600000) % 24, minutes: Math.floor(ms / 60000) % 60, seconds: Math.floor(ms / 1000) % 60 };
};

export default function Hero() {
  const [stats, setStats] = useState<HeroStats>(initialStats);
  const [clock, setClock] = useState<ReturnType<typeof countdown>>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/presale/stats", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (active) setStats({ raised: Number(data.raised ?? 0), hardCap: Number(data.hardCap ?? 0), progress: Number(data.progress ?? 0), tokenPrice: Number(data.tokenPrice ?? 0), endDate: data.endDate ?? null });
      }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!stats.endDate) return;
    const update = () => setClock(countdown(stats.endDate));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [stats.endDate]);

  return (
    <>
      <section className="sv-hero" aria-label="STRIVERSE introduction">
        <div className="sv-hero-inner">
          <div>
            <p className="sv-kicker">The next dimension of digital opportunity</p>
            <h1>STRIVERSE <span>(STV)</span><br />AI-Powered<br />Web3 Ecosystem</h1>
            <p className="sv-hero-lead">A connected digital ecosystem bringing blockchain technology, intelligent tools and real-world utility together — built to grow with its community.</p>
            <div className="sv-actions">
              <a className="sv-btn sv-btn-primary" href="#whitepaper">Whitepaper ↗</a>
              <a className="sv-btn sv-btn-secondary" href="#features">Explore Ecosystem</a>
            </div>
            <div className="sv-stats" aria-label="Live presale information">
              <div className="sv-stat"><small>Raised</small><strong>${money(stats.raised)}</strong></div>
              <div className="sv-stat"><small>Hard cap</small><strong>${money(stats.hardCap)}</strong></div>
              <div className="sv-stat"><small>Presale progress</small><strong>{Math.max(0, Math.min(100, stats.progress)).toFixed(2)}%</strong></div>
              {stats.tokenPrice > 0 && <div className="sv-stat"><small>STV price</small><strong>${stats.tokenPrice}</strong></div>}
              {clock && <div className="sv-stat"><small>Sale countdown</small><strong>{clock.days}d {String(clock.hours).padStart(2,"0")}:{String(clock.minutes).padStart(2,"0")}:{String(clock.seconds).padStart(2,"0")}</strong></div>}
            </div>
          </div>
          <div className="sv-art" aria-hidden="true">
            <div className="sv-chip" /><div className="sv-orbit" /><div className="sv-core"><span>STV</span></div>
            <i className="sv-node n1" /><i className="sv-node n2" /><i className="sv-node n3" /><i className="sv-node n4" />
          </div>
        </div>
      </section>
      <section id="ecosystem-highlights" className="sv-features">
        <div className="sv-features-head"><p className="sv-kicker">Inside the ecosystem</p><h2>Technology with purpose.</h2><p>Four foundations for a connected, accessible and scalable digital ecosystem.</p></div>
        <div className="sv-feature-grid">
          <article className="sv-feature-card"><span className="sv-feature-icon">✧</span><b>AI-Powered</b><p>Intelligent experiences designed to make digital participation more accessible.</p></article>
          <article className="sv-feature-card"><span className="sv-feature-icon">◇</span><b>Blockchain Powered</b><p>Transparent, verifiable infrastructure for a connected digital ecosystem.</p></article>
          <article className="sv-feature-card"><span className="sv-feature-icon">◎</span><b>Real-World Utility</b><p>Practical ecosystem experiences that connect digital tools with everyday use.</p></article>
          <article className="sv-feature-card"><span className="sv-feature-icon">⌘</span><b>Scalable &amp; Global</b><p>A flexible foundation designed to evolve as the community and ecosystem grow.</p></article>
        </div>
      </section>
    </>
  );
}
