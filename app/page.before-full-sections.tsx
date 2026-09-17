"use client";

import Image from "next/image";

const nav = [
  ["About", "about"],
  ["Features", "features"],
  ["Staking", "staking"],
  ["Vesting", "vesting"],
  ["Tokenomics", "tokenomics"],
  ["More", "more"],
] as const;

export default function Home() {
  return (
    <main className="reference-site">
      <section className="reference-hero" aria-label="STRIVERSE landing page">
        <Image
          src="/reference/striverse-reference-hero.png"
          alt="STRIVERSE landing page"
          fill
          priority
          sizes="100vw"
          className="reference-hero-image"
        />

        {/* The artwork is the exact approved reference composition. These overlays keep the pictured controls functional. */}
        <div className="reference-hotspots" aria-label="Website navigation">
          {nav.map(([label, id]) => (
            <a key={id} href={`#${id}`} aria-label={label} className={`hotspot hotspot-${id}`} />
          ))}
          <a href="#staking" aria-label="Staking" className="hotspot hotspot-staking-pill" />
          <a href="#vesting" aria-label="Vesting" className="hotspot hotspot-vesting-pill" />
          <a href="/login" aria-label="Explore App" className="hotspot hotspot-explore" />
          <a href="/register" aria-label="Explore STRIVERSE" className="hotspot hotspot-hero-cta" />
          <a href="#invest" aria-label="Invest in STV" className="hotspot hotspot-invest-cta" />
        </div>
      </section>

      <section id="about" className="reference-placeholder"><span>ABOUT</span><h2>STRIVERSE ecosystem</h2></section>
      <section id="features" className="reference-placeholder"><span>FEATURES</span><h2>Explore the ecosystem</h2></section>
      <section id="staking" className="reference-placeholder"><span>STAKING</span><h2>Stake STV</h2></section>
      <section id="vesting" className="reference-placeholder"><span>VESTING</span><h2>Vesting schedule</h2></section>
      <section id="tokenomics" className="reference-placeholder"><span>TOKENOMICS</span><h2>STV tokenomics</h2></section>
      <section id="invest" className="reference-placeholder"><span>INVEST</span><h2>Invest in STV</h2></section>
      <section id="more" className="reference-placeholder"><span>MORE</span><h2>Airdrop · Products · Roadmap · Community</h2></section>
    </main>
  );
}
