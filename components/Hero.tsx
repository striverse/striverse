export default function Hero() {
  return (
    <>
      <section className="sv-hero" aria-label="STRIVERSE introduction">
        <div className="sv-hero-inner">
          <div>
            <p className="sv-kicker">The next dimension of digital opportunity</p>
            <h1>STRIVERSE <span>(STV)</span><br />AI-Powered<br />Web3 Ecosystem</h1>
            <p className="sv-hero-lead">A connected digital ecosystem bringing blockchain technology, intelligent tools and real-world utility together — built to grow with its community.</p>
            <div className="sv-actions">
              <a className="sv-btn sv-btn-primary" href="/register">Join STRIVERSE ↗</a>
              <a className="sv-btn sv-btn-secondary" href="#features">Explore Ecosystem</a>
            </div>
            <div className="sv-hero-tags" aria-label="Ecosystem foundations"><span>AI</span><span>BLOCKCHAIN</span><span>STV ECOSYSTEM</span></div>
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
