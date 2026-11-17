import Image from "next/image";

export default function Hero() {
  return (
    <section className="sv-reference-hero" aria-label="STRIVERSE AI-powered Web3 ecosystem">
      <div className="sv-reference-hero-inner">
        <div className="sv-reference-copy">
          <p className="sv-reference-kicker">THE NEXT DIMENSION OF DIGITAL OPPORTUNITY</p>
          <h1>STRIVERSE <span>(STV)</span></h1>
          <h2>AI-Powered Web3 Ecosystem</h2>
          <p className="sv-reference-description">
            A next-generation, AI-driven Web3 ecosystem powered by blockchain,
            designed for real-world utility, scalability and global adoption.
          </p>
          <div className="sv-reference-actions">
            <a className="sv-reference-button sv-reference-button-gold" href="/register">
              <span aria-hidden="true">▤</span> Explore STRIVERSE <span aria-hidden="true">→</span>
            </a>
            <a className="sv-reference-button sv-reference-button-outline" href="/login">
              <span aria-hidden="true">◎</span> Member Login
            </a>
          </div>
        </div>
        <div className="sv-reference-art">
          <Image
            src="/striverse-hero-art.png"
            alt="STRIVERSE AI brain, blockchain processor and connected financial data visualization"
            width={1536}
            height={1024}
            priority
            sizes="(max-width: 900px) 100vw, 54vw"
          />
        </div>
      </div>
      <div className="sv-reference-feature-band">
        <article><span className="sv-reference-feature-icon">AI</span><div><b>AI-Powered</b><p>Intelligent, automated solutions</p></div></article>
        <article><span className="sv-reference-feature-icon">◇</span><div><b>Blockchain Powered</b><p>Secure, transparent and decentralized</p></div></article>
        <article><span className="sv-reference-feature-icon sv-gold-icon">✓</span><div><b>Real-World Utility</b><p>Practical applications with global impact</p></div></article>
        <article><span className="sv-reference-feature-icon sv-gold-icon">▥</span><div><b>Scalable &amp; Global</b><p>Built for mass adoption and long-term growth</p></div></article>
      </div>
    </section>
  );
}
