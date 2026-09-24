"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";



const features = [
  ["01", "Invest", "Grow your portfolio with clear STV ecosystem opportunities.", "invest"],
  ["02", "Stake", "Earn rewards while supporting the network and community.", "stake"],
  ["03", "Vest", "Track long-term allocations and unlocks with clear visibility.", "vest"],
  ["04", "Airdrops", "Be part of community campaigns, rewards and exclusive drops.", "airdrop"],
];

const distribution = [
  ["Community & Airdrop", "Community allocation"],
  ["Staking Rewards", "Rewards reserve"],
  ["Ecosystem Growth", "Development & expansion"],
  ["Liquidity", "Market liquidity"],
  ["Team & Operations", "Long-term operations"],
];

const roadmap = [
  ["01", "Foundation", "Website, documentation and community foundation."],
  ["02", "Ecosystem", "STV ecosystem experiences and product expansion."],
  ["03", "Rewards", "Staking, vesting and community reward experiences."],
  ["04", "Expansion", "Broader ecosystem integrations and community growth."],
];

function FeatureIcon({ type }: { type: string }) {
  const common = { viewBox: "0 0 64 64", "aria-hidden": true as const };
  if (type === "invest") return (
    <svg {...common}>
      <defs><linearGradient id="investLogo" x1="8" y1="56" x2="56" y2="8"><stop stopColor="#19d9eb"/><stop offset="1" stopColor="#7b55ff"/></linearGradient></defs>
      <path d="M32 5 56 19v26L32 59 8 45V19L32 5Z" fill="none" stroke="url(#investLogo)" strokeWidth="2.5"/>
      <path d="m17 39 10-10 7 6 13-15" fill="none" stroke="#63e9f5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M43 20h4v4" fill="none" stroke="#a78bff" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
  if (type === "stake") return (
    <svg {...common}>
      <defs><linearGradient id="stakeLogo" x1="10" y1="54" x2="54" y2="10"><stop stopColor="#18dce9"/><stop offset="1" stopColor="#8b55ff"/></linearGradient></defs>
      <circle cx="32" cy="32" r="25" fill="none" stroke="url(#stakeLogo)" strokeWidth="2.5"/>
      <path d="M20 23h19a8 8 0 0 1 0 16H25a5 5 0 0 0 0 10h17" fill="none" stroke="#65eaf4" strokeWidth="4" strokeLinecap="round"/>
      <path d="M32 14v36" stroke="#a98cff" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
  if (type === "vest") return (
    <svg {...common}>
      <defs><linearGradient id="vestLogo" x1="8" y1="56" x2="56" y2="8"><stop stopColor="#23d9e9"/><stop offset="1" stopColor="#8157ff"/></linearGradient></defs>
      <path d="M32 6 53 18v24L32 54 11 42V18L32 6Z" fill="none" stroke="url(#vestLogo)" strokeWidth="2.5"/>
      <circle cx="32" cy="31" r="11" fill="none" stroke="#64e7f3" strokeWidth="3.5"/>
      <path d="M32 23v9l6 4" fill="none" stroke="#b092ff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M27 12h10" stroke="#64e7f3" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg {...common}>
      <defs><linearGradient id="airdropLogo" x1="8" y1="56" x2="56" y2="8"><stop stopColor="#19dce9"/><stop offset="1" stopColor="#9b50ff"/></linearGradient></defs>
      <path d="M32 7 39 24l18 8-18 8-7 17-7-17-18-8 18-8 7-17Z" fill="none" stroke="url(#airdropLogo)" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M32 17v20M22 27h20" stroke="#69eaf5" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="m48 10 2 5m2-2-5 2" stroke="#ad8cff" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function Home() {
  return (
    <main className="reference-site">
      <Navbar />
      <Hero />

      <section id="features" className="site-section features-section">
        <div className="section-shell">
          <p className="section-kicker">FEATURES</p>
          <div className="section-heading-row">
            <h2>Everything You Need to<br /><span>Build a Better Tomorrow</span></h2>
            <p>One connected ecosystem for investing, staking, vesting and community participation.</p>
          </div>
          <div className="feature-grid">
            {features.map(([num, title, text, icon]) => (
              <article className="feature-card" key={num}>
                <span className="card-number">{num}</span>
                <div className="card-orb" />
                <div className="feature-icon"><FeatureIcon type={icon} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      

<section id="about" className="site-section about-section">
        <div className="section-shell split-section">
          <div>
            <p className="section-kicker">ABOUT</p>
            <h2>STRIVERSE is built for enlightening the wealth.</h2>
          </div>
          <div className="section-copy">
            <p>STRIVERSE brings the core pieces of a digital asset ecosystem together in one focused experience.</p>
            <p>Explore STV, participate in the ecosystem, track your activity and discover new ways to engage with the community.</p>
            <Link href="/register" className="text-link">Explore the ecosystem ↗</Link>
          </div>
        </div>
      </section>



<section id="tokenomics" className="site-section token-section">
        <div className="tokenomics-reference-image-wrap">
          <img
            className="tokenomics-reference-image"
            src="/a_sleek_futuristic_neon_cyberpunk_infographic_on.png"
            alt="STRIVERSE tokenomics — 8,888,888,888 STV total supply — 25% presale"
          />
        </div>
      </section>

<section id="roadmap" className="site-section roadmap-section">
        <div className="section-shell">
          <p className="section-kicker">ROADMAP</p>
          <div className="section-heading-row"><h2>Build.<br /><span>Grow. Belong.</span></h2><p>A flexible roadmap that can evolve with the ecosystem and confirmed delivery milestones.</p></div>
          <div className="roadmap-grid">{roadmap.map(([num, title, text]) => <article key={num} className="roadmap-card"><span>{num}</span><div className="roadmap-dot" /><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

<section id="staking" className="site-section dark-panel-section">
        <div className="section-shell split-section panel-split">
          <div>
            <p className="section-kicker">STAKING</p>
            <h2>Put your STV<br /><span>to work.</span></h2>
          </div>
          <div className="feature-panel">
            <div className="panel-glow" />
            <div className="panel-top"><span>STV STAKING</span><b>LIVE EXPERIENCE</b></div>
            <div className="staking-metric"><strong>Stake</strong><span>Lock STV and participate in the reward experience.</span></div>
            <div className="metric-row"><div><b>APY</b><span>Connected data</span></div><div><b>TERM</b><span>Pool dependent</span></div><div><b>REWARD</b><span>STV</span></div></div>
            <Link href="/app" className="panel-button">Open Staking ↗</Link>
          </div>
        </div>
      </section>

<section id="vesting" className="site-section vesting-section">
        <div className="section-shell split-section">
          <div>
            <p className="section-kicker">VESTING</p>
            <h2>Clear unlocks.<br /><span>Clear visibility.</span></h2>
          </div>
          <div className="vesting-card">
            <div className="vesting-line"><span>Allocation</span><b>STV</b></div>
            <div className="vesting-progress"><span /></div>
            <div className="vesting-grid"><div><small>VESTED</small><b>Connected data</b></div><div><small>CLAIMABLE</small><b>Connected data</b></div><div><small>NEXT UNLOCK</small><b>Schedule</b></div></div>
            <p>Vesting schedules can be surfaced here once the project's final allocation and unlock rules are connected.</p>
            <Link href="/app" className="text-link">View vesting ↗</Link>
          </div>
        </div>
      </section>

<section id="more" className="site-section more-section">
        <div className="section-shell">
          <p className="section-kicker">MORE</p>
          <h2>Airdrop.<br /><span>Roadmap. Community.</span></h2>
          <div className="more-grid">
            <article id="airdrop" className="more-card"><span>AIRDROP</span><h3>Grow with the community.</h3><p>Show eligibility, allocation, campaign progress and claim status here when the live airdrop rules are connected.</p><Link href="/register">Check eligibility ↗</Link></article>
            <article id="products" className="more-card"><span>PRODUCTS</span><h3>Explore the STRIVERSE app.</h3><p>Sign in to access the connected STV experiences, including the available ecosystem packages and account tools.</p><Link href="/app">Open the app ↗</Link></article>
          </div>
        </div>
      </section>



      <section id="community" className="site-section community-section">
        <div className="community-shell">
          <p className="section-kicker">COMMUNITY</p>
          <h2>Build the next dimension<br /><span>together.</span></h2>
          <p>Join the STRIVERSE community and follow the ecosystem as it grows.</p>
          <div className="community-actions"><a href="#about" className="panel-button">Explore STRIVERSE ↗</a><a href="#features" className="outline-button">Discover features ↗</a></div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-shell">
          <div><p className="section-kicker">STRIVERSE</p><h3>Strive. Grow. Belong.</h3><p>Next-generation digital ecosystem built around STV.</p></div>
          <div><b>Explore</b><a href="#about">About</a><a href="#features">Features</a><a href="#staking">Staking</a></div>
          <div><b>Token</b><a href="#tokenomics">Tokenomics</a><a href="#vesting">Vesting</a><a href="#airdrop">Airdrop</a><a href="#roadmap">Roadmap</a></div>
          <div><b>Community</b><a href="#community">Community</a><Link href="/register">Register</Link><Link href="/login">Login</Link></div>
        </div>
        <div className="footer-bottom"><span>© 2026 STRIVERSE</span><span>All Rights Reserved.</span></div>
      </footer>
    </main>
  );
}
