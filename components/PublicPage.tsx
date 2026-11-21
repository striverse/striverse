"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X, ShieldCheck } from "lucide-react";
import { useState } from "react";

type PublicPageProps = {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  sections: { title: string; body: string }[];
};

export default function PublicPage({ eyebrow, title, accent, intro, sections }: PublicPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="fresh-site fresh-inner-site">
      <div className="fresh-grain" aria-hidden="true" />
      <header className="fresh-header">
        <Link href="/" className="fresh-brand" aria-label="STRIVERSE home">
          <Image src="/brand/striverse-full-logo.png.png" alt="STRIVERSE" width={190} height={44} priority />
        </Link>
        <button className="fresh-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? "fresh-nav is-open" : "fresh-nav"}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Overview</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>Ecosystem</Link>
          <Link href="/tokenomics" onClick={() => setMenuOpen(false)}>STV Token</Link>
          <Link href="/roadmap" onClick={() => setMenuOpen(false)}>Roadmap</Link>
          <Link href="/community" onClick={() => setMenuOpen(false)}>Community</Link>
        </nav>
        <Link className="fresh-header-cta" href="/register">Launch app <ArrowUpRight size={15} /></Link>
      </header>

      <section className="fresh-inner-hero">
        <div className="fresh-inner-orbit" aria-hidden="true"><span /><span /><span /></div>
        <div className="fresh-inner-copy">
          <p className="fresh-overline"><span /> {eyebrow}</p>
          <h1>{title}<br /><em>{accent}</em></h1>
          <p className="fresh-hero-description">{intro}</p>
          <div className="fresh-hero-actions">
            <Link href="/tokenomics" className="fresh-primary">Explore STV token <ArrowUpRight size={17} /></Link>
            <Link href="/" className="fresh-secondary">Discover STRIVERSE <ArrowUpRight size={16} /></Link>
          </div>
          <div className="fresh-hero-trust"><span><ShieldCheck size={15}/> Official STRIVERSE project information</span></div>
        </div>
        <div className="fresh-inner-indexmark" aria-hidden="true">S<span>TV</span></div>
      </section>

      <section className="fresh-inner-details">
        <div className="fresh-section-label"><span>EXPLORE THE DETAILS</span><i /></div>
        <div className="fresh-inner-heading"><h2>Built around<br /><em>the bigger picture.</em></h2><p>Explore the information and foundations that shape the STRIVERSE ecosystem.</p></div>
        <div className="fresh-inner-grid">
          {sections.map((section, index) => (
            <article className="fresh-inner-card" key={section.title}>
              <small>0{index + 1} / STRIVERSE</small>
              <h3>{section.title}</h3>
              <p>{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="fresh-inner-next">
        <p className="fresh-overline">STEP INTO THE STRIVERSE</p>
        <h2>Explore what<br /><em>comes next.</em></h2>
        <div className="fresh-hero-actions">
          <Link href="/" className="fresh-primary">Back to homepage <ArrowUpRight size={17} /></Link>
          <Link href="/register" className="fresh-secondary">Launch app <ArrowUpRight size={16} /></Link>
        </div>
      </section>

      <footer className="fresh-footer">
        <Link href="/" className="fresh-footer-brand">STRIVERSE<span>®</span></Link>
        <span>STRIVE. GROW. BELONG.</span>
        <div><Link href="/about">About</Link><Link href="/tokenomics">STV Token</Link><Link href="/roadmap">Roadmap</Link><Link href="/community">Community</Link><Link href="/login">Sign in</Link></div>
        <small>© 2026 STRIVERSE</small>
      </footer>

      <style jsx global>{`
        .fresh-inner-site{min-height:100vh}
        .fresh-inner-hero{min-height:590px;padding:95px 8vw 75px;position:relative;display:flex;align-items:center;overflow:hidden;border-bottom:1px solid var(--line);background:radial-gradient(ellipse at 78% 48%,#8d682a24,transparent 42%),linear-gradient(120deg,#0b0c0d,#08090a 68%)}
        .fresh-inner-copy{position:relative;z-index:2;max-width:760px}
        .fresh-inner-hero h1{font-family:Georgia,'Times New Roman',serif;font-size:clamp(58px,7.2vw,100px);font-weight:400;letter-spacing:-.055em;line-height:.98;margin:30px 0}
        .fresh-inner-hero h1 em,.fresh-inner-heading h2 em,.fresh-inner-next h2 em{font-style:italic;color:var(--gold)}
        .fresh-inner-orbit{position:absolute;width:min(47vw,560px);aspect-ratio:1;border:1px solid #d8b76b24;border-radius:50%;right:7vw;top:50%;transform:translateY(-50%);box-shadow:0 0 90px #c99b3510,inset 0 0 90px #c99b3510}
        .fresh-inner-orbit span{position:absolute;inset:12%;border:1px solid #d8b76b20;border-radius:50%}.fresh-inner-orbit span:nth-child(2){inset:24%}.fresh-inner-orbit span:nth-child(3){inset:-12%;border-style:dashed;opacity:.45}
        .fresh-inner-indexmark{position:absolute;right:18vw;top:50%;transform:translateY(-50%);font:italic clamp(80px,13vw,180px) Georgia;color:#d8b76b;opacity:.85;text-shadow:0 0 50px #d8b76b33}
        .fresh-inner-indexmark span{font-size:.48em}
        .fresh-inner-details{padding:100px 10vw 110px;background:#0d0e0e;border-bottom:1px solid var(--line)}
        .fresh-inner-heading{display:flex;align-items:end;justify-content:space-between;gap:40px;margin:48px 0 42px}
        .fresh-inner-heading h2,.fresh-inner-next h2{font:400 clamp(45px,5.7vw,74px)/1.02 Georgia,'Times New Roman',serif;letter-spacing:-.05em;margin:0}
        .fresh-inner-heading>p{max-width:340px;color:#99978e;font-size:12px;line-height:1.9;margin:0}
        .fresh-inner-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
        .fresh-inner-card{min-height:190px;padding:26px;border:1px solid #ffffff17;background:linear-gradient(145deg,#151615,#0b0c0c)}
        .fresh-inner-card small{font-size:8px;letter-spacing:.18em;color:var(--gold)}
        .fresh-inner-card h3{font:normal 26px Georgia;margin:28px 0 12px}
        .fresh-inner-card p{font-size:12px;line-height:1.9;color:#a7a59d;margin:0}
        .fresh-inner-next{padding:105px 20px;text-align:center;background:radial-gradient(ellipse at 50% 100%,#8b6a2922,transparent 55%)}
        .fresh-inner-next h2{margin:24px 0 30px}
        .fresh-inner-next .fresh-hero-actions{justify-content:center}
        @media(max-width:900px){.fresh-inner-hero{min-height:540px;padding:80px 7vw}.fresh-inner-orbit{right:-15vw;width:60vw}.fresh-inner-indexmark{right:7vw}.fresh-inner-details{padding:80px 7vw}.fresh-inner-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:650px){.fresh-inner-hero{min-height:530px;padding:70px 7vw}.fresh-inner-hero h1{font-size:clamp(52px,14vw,72px)}.fresh-inner-orbit{width:80vw;right:-35vw;opacity:.7}.fresh-inner-indexmark{right:8vw;top:24%;font-size:100px;opacity:.32}.fresh-inner-details{padding:70px 7vw}.fresh-inner-heading{display:block;margin:38px 0 30px}.fresh-inner-heading>p{margin-top:18px}.fresh-inner-grid{grid-template-columns:1fr}.fresh-inner-card{min-height:150px}.fresh-inner-next{padding:80px 20px}}
      `}</style>
    </main>
  );
}
