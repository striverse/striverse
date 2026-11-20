"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";

type PublicPageProps = {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  sections: { title: string; body: string }[];
};

export default function PublicPage({ eyebrow, title, accent, intro, sections }: PublicPageProps) {
  return (
    <main className="sv-site sv-inner-site">
      <Navbar />
      <section className="sv-inner-hero">
        <div className="sv-inner-orb" aria-hidden="true" />
        <div className="sv-container sv-inner-content">
          <p className="sv-eyebrow"><span />{eyebrow}</p>
          <h1>{title}<br /><em>{accent}</em></h1>
          <p className="sv-inner-intro">{intro}</p>
          <div className="sv-inner-actions">
            <Link href="/#tokenomics" className="sv-button-primary">Explore STV <ArrowUpRight size={17} /></Link>
            <Link href="/#about" className="sv-button-quiet">Discover STRIVERSE</Link>
          </div>
          <div className="sv-inner-trust"><ShieldCheck size={16} /> Built around clarity, transparency and community participation</div>
        </div>
      </section>
      <section className="sv-section sv-inner-sections">
        <div className="sv-container">
          <div className="sv-section-head">
            <div><p className="sv-eyebrow"><span />INSIDE STRIVERSE</p><h2>Designed for the<br /><em>long journey.</em></h2></div>
            <p>Explore the ideas, tools and foundations that shape the STRIVERSE experience.</p>
          </div>
          <div className="sv-inner-grid">
            {sections.map((section, index) => (
              <article className="sv-inner-card" key={section.title}>
                <span className="sv-inner-index">0{index + 1}</span>
                <Sparkles size={19} strokeWidth={1.5} />
                <h3>{section.title}</h3>
                <p>{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="sv-inner-cta">
        <div className="sv-container sv-inner-cta-row">
          <div><p className="sv-eyebrow"><span />YOUR NEXT STEP</p><h2>Find your place<br /><em>in STRIVERSE.</em></h2></div>
          <Link href="/#home" className="sv-button-primary">Back to home <ArrowUpRight size={17} /></Link>
        </div>
      </section>
    </main>
  );
}
