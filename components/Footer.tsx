import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bf-footer">
      <div className="bf-footer-grid">
        <div><p className="bf-footer-kicker">STRIVE • GROW • BELONG</p><h3>Build the next dimension together.</h3><p className="bf-footer-copy">A connected ecosystem for STV, investing, staking, vesting and community participation.</p></div>
        <div><h4>Explore</h4><Link href="#about">About</Link><Link href="#features">Features</Link><Link href="#invest">Invest</Link><Link href="#staking">Staking</Link></div>
        <div><h4>Token</h4><Link href="#tokenomics">Tokenomics</Link><Link href="#vesting">Vesting</Link><Link href="#airdrop">Airdrop</Link><Link href="#roadmap">Roadmap</Link></div>
        <div><h4>Community</h4><a href="#community">Community</a><a href="#">Telegram</a><a href="#">X (Twitter)</a><a href="#">Discord</a></div>
      </div>
      <div className="bf-footer-bottom"><span>© 2026 STRIVERSE. All Rights Reserved.</span><span>Built for a brighter tomorrow.</span></div>
    </footer>
  );
}
