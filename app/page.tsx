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

      <section id="tokenomics" className="site-section token-section">
        <div className="section-shell tokenomics-visual-shell">
          <div className="token-reference-stage">
            <svg className="token-reference-bg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <radialGradient id="spaceBg" cx="50%" cy="48%" r="75%"><stop offset="0%" stopColor="#142b75"/><stop offset="34%" stopColor="#07133d"/><stop offset="72%" stopColor="#02071d"/><stop offset="100%" stopColor="#01030d"/></radialGradient>
                <radialGradient id="nebulaPink"><stop stopColor="#f43cff" stopOpacity=".75"/><stop offset=".45" stopColor="#7d2bff" stopOpacity=".24"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient>
                <radialGradient id="nebulaBlue"><stop stopColor="#22c9ff" stopOpacity=".55"/><stop offset=".45" stopColor="#235cff" stopOpacity=".2"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient>
                <radialGradient id="coinFace" cx="30%" cy="22%"><stop stopColor="#154f82"/><stop offset=".45" stopColor="#071d47"/><stop offset="1" stopColor="#010713"/></radialGradient>
                <filter id="glowC"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="glowS"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <linearGradient id="floor" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#071c45" stopOpacity=".1"/><stop offset="1" stopColor="#071b4d" stopOpacity=".75"/></linearGradient>
              </defs>
              <rect width="1600" height="900" fill="url(#spaceBg)"/>
              <ellipse cx="1190" cy="170" rx="470" ry="210" fill="url(#nebulaPink)" opacity=".9"/>
              <ellipse cx="390" cy="210" rx="500" ry="250" fill="url(#nebulaBlue)"/>
              <g fill="#fff" opacity=".85">
                <circle cx="85" cy="140" r="1.4"/><circle cx="160" cy="280" r="1.2"/><circle cx="255" cy="110" r="1"/><circle cx="355" cy="205" r="1.5"/><circle cx="480" cy="90" r="1.2"/><circle cx="590" cy="180" r="1"/><circle cx="700" cy="75" r="1.3"/><circle cx="910" cy="120" r="1.2"/><circle cx="1040" cy="75" r="1.5"/><circle cx="1160" cy="210" r="1"/><circle cx="1290" cy="105" r="1.3"/><circle cx="1420" cy="190" r="1.2"/><circle cx="1510" cy="95" r="1.5"/><circle cx="80" cy="500" r="1"/><circle cx="1450" cy="480" r="1.2"/>
              </g>
              <g filter="url(#glowS)" opacity=".9">
                <circle cx="205" cy="180" r="4" fill="#63dfff"/><circle cx="320" cy="300" r="3" fill="#b76cff"/><circle cx="1110" cy="250" r="4" fill="#ff58d5"/><circle cx="1370" cy="330" r="3" fill="#63dfff"/>
              </g>
              <g opacity=".9">
                <circle cx="-35" cy="350" r="205" fill="#08132e" stroke="#255ea2" strokeWidth="3"/>
                <ellipse cx="-35" cy="350" rx="215" ry="48" fill="none" stroke="#48a8ff" strokeWidth="8" opacity=".45" transform="rotate(-18 -35 350)"/>
                <circle cx="1470" cy="255" r="94" fill="#08152f" stroke="#2b7dca" strokeWidth="2"/>
                <ellipse cx="1470" cy="255" rx="145" ry="31" fill="none" stroke="#5db9ff" strokeWidth="7" opacity=".75" transform="rotate(-20 1470 255)"/>
                <circle cx="220" cy="205" r="39" fill="#0a1833" stroke="#3d6d9f" strokeWidth="2"/>
              </g>
              <g strokeLinecap="round">
                <ellipse cx="800" cy="485" rx="545" ry="250" fill="none" stroke="#27dfff" strokeWidth="2" opacity=".8"/>
                <ellipse cx="800" cy="485" rx="450" ry="205" fill="none" stroke="#a74cff" strokeWidth="2" opacity=".8" transform="rotate(18 800 485)"/>
                <ellipse cx="800" cy="485" rx="345" ry="165" fill="none" stroke="#25e7ff" strokeWidth="2" opacity=".9" transform="rotate(-20 800 485)"/>
                <ellipse cx="800" cy="485" rx="275" ry="132" fill="none" stroke="#6f5cff" strokeWidth="2" opacity=".8"/>
              </g>
              <g filter="url(#glowS)">
                <circle cx="540" cy="440" r="7" fill="#ff9b3d"/><circle cx="1060" cy="440" r="7" fill="#ff51ce"/><circle cx="800" cy="250" r="7" fill="#31ecff"/><circle cx="590" cy="690" r="7" fill="#ff9b3d"/><circle cx="1010" cy="690" r="7" fill="#39ef91"/>
              </g>
              <path d="M0 735 L0 620 45 620 45 680 70 680 70 580 105 580 105 665 130 665 130 550 165 550 165 640 195 640 195 590 225 590 225 710 270 710 270 610 305 610 305 540 340 540 340 690 380 690 380 620 420 620 420 570 455 570 455 710 L1600 710 1600 735Z" fill="url(#floor)"/>
              <path d="M0 735H1600M0 790H1600M0 845H1600" stroke="#1261bc" opacity=".55"/>
              <path d="M70 735V900M190 735V900M330 735V900M500 735V900M650 735V900M800 735V900M950 735V900M1100 735V900M1270 735V900M1430 735V900M1550 735V900" stroke="#1261bc" opacity=".42"/>
            </svg>

            <div className="token-reference-core">
              <div className="token-reference-coin">
                <img src="/striverse-logo-only.png" alt="" />
                <span>STV</span>
              </div>
            </div>

            <div className="token-reference-item token-reference-community"><div className="token-reference-orb">👥</div><div className="token-reference-card"><b>25%</b><strong>Community &amp; Ecosystem</strong></div></div>
            <div className="token-reference-item token-reference-development"><div className="token-reference-orb">▤</div><div className="token-reference-card"><b>20%</b><strong>Development</strong></div></div>
            <div className="token-reference-item token-reference-marketing"><div className="token-reference-card"><b>15%</b><strong>Marketing</strong></div><div className="token-reference-orb">📣</div></div>
            <div className="token-reference-item token-reference-treasury"><div className="token-reference-card"><b>20%</b><strong>Treasury</strong></div><div className="token-reference-orb">♜</div></div>
            <div className="token-reference-item token-reference-liquidity"><div className="token-reference-orb">🔥</div><div className="token-reference-card"><b>20%</b><strong>Liquidity</strong></div></div>

            <div className="token-reference-platform">BUILD <i>•</i> EARN <i>•</i> BELONG</div>
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

      <section id="roadmap" className="site-section roadmap-section">
        <div className="section-shell">
          <p className="section-kicker">ROADMAP</p>
          <div className="section-heading-row"><h2>Build.<br /><span>Grow. Belong.</span></h2><p>A flexible roadmap that can evolve with the ecosystem and confirmed delivery milestones.</p></div>
          <div className="roadmap-grid">{roadmap.map(([num, title, text]) => <article key={num} className="roadmap-card"><span>{num}</span><div className="roadmap-dot" /><h3>{title}</h3><p>{text}</p></article>)}</div>
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
