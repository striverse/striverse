"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import {
  ArrowUpRight, ShieldCheck, Layers3, Wallet, Sparkles,
  Compass, Globe2, Zap, LockKeyhole, Users, ChevronRight
} from "lucide-react";

const features = [
  { n: "01", title: "Invest with clarity", body: "A clearer path into the STV ecosystem, with presale progress and account activity in one place.", icon: Wallet },
  { n: "02", title: "Stake your STV", body: "Explore staking experiences designed to reward participation and support the wider network.", icon: LockKeyhole },
  { n: "03", title: "Track every unlock", body: "Follow vesting schedules and allocation milestones with a transparent account view.", icon: Layers3 },
  { n: "04", title: "Grow together", body: "Discover community campaigns, airdrops and the next opportunities across STRIVERSE.", icon: Users },
];

const phases = [
  ["PHASE 01", "Genesis", "STV launch, website, documentation and community foundation.", "LIVE"],
  ["PHASE 02", "Liquidity", "Presale completion, DEX liquidity and transparent token distribution.", "NEXT"],
  ["PHASE 03", "Earn", "Staking, vesting, rewards and community incentive programs.", "UPCOMING"],
  ["PHASE 04", "Govern", "Community governance, proposals and treasury participation.", "UPCOMING"],
  ["PHASE 05", "Scale", "Integrations, cross-chain growth and strategic partnerships.", "UPCOMING"],
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="sv-eyebrow"><span />{children}</p>;
}

export default function Home() {
  return (
    <main className="sv-site">
      <Navbar />
      <Hero />

      <section id="features" className="sv-section sv-features">
        <div className="sv-container">
          <div className="sv-section-head">
            <div><Eyebrow>THE ECOSYSTEM</Eyebrow><h2>Everything connected.<br /><em>One universe.</em></h2></div>
            <p>All the essential pieces of your STV journey, brought together in one focused experience.</p>
          </div>
          <div className="sv-feature-grid">
            {features.map(({ n, title, body, icon: Icon }) => (
              <article className="sv-feature" key={n}>
                <div className="sv-feature-top"><span>{n}</span><Icon size={23} strokeWidth={1.6} /></div>
                <h3>{title}</h3><p>{body}</p><span className="sv-feature-arrow"><ArrowUpRight size={17} /></span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="sv-section sv-about">
        <div className="sv-container sv-about-grid">
          <div><Eyebrow>ABOUT STRIVERSE</Eyebrow><h2>A new dimension<br />for digital <em>opportunity.</em></h2></div>
          <div className="sv-about-copy">
            <p>STRIVERSE brings the core pieces of a digital asset ecosystem together in one focused experience. Explore STV, participate in the ecosystem, track your activity and discover new ways to engage with the community.</p>
            <Link href="/register" className="sv-link">Explore the ecosystem <ArrowUpRight size={17}/></Link>
            <div className="sv-about-pills"><span><ShieldCheck size={15}/> Account tools</span><span><Globe2 size={15}/> Connected ecosystem</span></div>
          </div>
        </div>
      </section>

      <section id="tokenomics" className="sv-tokenomics">
        <div className="sv-container">
          <div className="sv-token-copy"><Eyebrow>THE STV TOKEN</Eyebrow><h2>STRIVERSE.<br/><em>Built to move forward.</em></h2><p>STV is the native token of the STRIVERSE ecosystem on BNB Smart Chain (BEP-20).</p><div className="sv-token-price"><span>Current offering price</span><strong>0.001 USDT <small>/ STV</small></strong><span className="sv-projected">Projected live-sale price · 0.0015 USDT / STV</span></div></div>
          <div className="sv-token-art"><div className="sv-token-metrics"><article><span>TOTAL SUPPLY</span><strong>8,888,888,888</strong><small>STV</small></article><article><span>PRESALE ALLOCATION</span><strong>2,222,222,222</strong><small>STV · 25% of total supply</small></article><article><span>NETWORK</span><strong>BNB Smart Chain</strong><small>BEP-20 · USDT payments</small></article></div><p className="sv-token-disclaimer">Projected pricing is indicative only and is not a guarantee of future market value.</p></div>
        </div>
      </section>

      <section id="roadmap" className="sv-section sv-roadmap">
        <div className="sv-container">
          <div className="sv-section-head"><div><Eyebrow>THE JOURNEY</Eyebrow><h2>From vision<br/>to <em>what’s next.</em></h2></div><p>A roadmap for the STV launch, community participation and ecosystem expansion.</p></div>
          <div className="sv-roadmap-grid">
            {phases.map(([phase, title, body, status], i) => <article key={phase} className="sv-phase">
              <div className="sv-phase-meta"><span>{phase}</span><b className={i === 0 ? "live" : ""}>{status}</b></div>
              <div className="sv-phase-mark">{["✳","◈","↗","⌘","∞"][i]}</div>
              <h3>{title}</h3><p>{body}</p>
              <div className="sv-phase-line"><span style={{width: i === 0 ? "100%" : "0%"}} /></div>
            </article>)}
          </div>
        </div>
      </section>

      <section id="staking" className="sv-section sv-staking">
        <div className="sv-container sv-staking-grid">
          <div><Eyebrow>PARTICIPATE</Eyebrow><h2>Make your STV<br/><em>part of the journey.</em></h2><p>Explore the connected staking experience and follow available account opportunities.</p><Link href="/app" className="sv-button">Explore the app <ArrowUpRight size={17}/></Link></div>
          <div className="sv-staking-card"><div className="sv-staking-orb"><Sparkles size={37}/></div><span>STRIVERSE / STV</span><strong>Participation<br/>starts here.</strong><small>Stake · Track · Grow</small><div className="sv-staking-card-foot"><span>ECOSYSTEM ACCESS</span><Zap size={16}/></div></div>
        </div>
      </section>

      <section id="vesting" className="sv-section sv-vesting">
        <div className="sv-container sv-vesting-grid">
          <div><Eyebrow>TRANSPARENCY</Eyebrow><h2>Every milestone.<br/><em>In view.</em></h2></div>
          <div className="sv-vesting-info"><div><span>ALLOCATION</span><b>STV</b></div><div className="sv-vesting-track"><i/></div><p>Vesting schedules and unlock details are surfaced through the connected account experience when available.</p><Link href="/app" className="sv-link">View account experience <ArrowUpRight size={17}/></Link></div>
        </div>
      </section>

      <section id="airdrop" className="sv-section sv-community">
        <div className="sv-container sv-community-panel">
          <div><Eyebrow>COMMUNITY FIRST</Eyebrow><h2>Build what’s next.<br/><em>Together.</em></h2><p>Join the STRIVERSE community and follow the ecosystem as it grows.</p></div>
          <div className="sv-community-actions"><Link href="/register" className="sv-button">Join STRIVERSE <ArrowUpRight size={17}/></Link><Link href="/login" className="sv-button sv-button-ghost">Sign in <ChevronRight size={17}/></Link></div>
          <div className="sv-community-decoration">S<span>V</span></div>
        </div>
      </section>

      <footer id="community" className="sv-footer">
        <div className="sv-container sv-footer-grid">
          <div><div className="sv-footer-brand">STRIVERSE<span>®</span></div><p>Strive. Grow. Belong.</p></div>
          <div><b>Explore</b><a href="#about">About</a><a href="#features">Features</a><a href="#roadmap">Roadmap</a></div>
          <div><b>STV</b><a href="#tokenomics">Tokenomics</a><a href="#staking">Staking</a><a href="#vesting">Vesting</a></div>
          <div><b>Account</b><Link href="/register">Create account</Link><Link href="/login">Sign in</Link><Link href="/app">Launch app</Link></div>
        </div>
        <div className="sv-container sv-footer-bottom"><span>© 2026 STRIVERSE</span><span>Strive. Grow. Belong.</span></div>
      </footer>
    </main>
  );
}
