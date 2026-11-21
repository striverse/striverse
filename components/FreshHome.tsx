"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDownRight, ArrowUpRight, Menu, X, Orbit, Layers3, Compass,
  ShieldCheck, MoveUpRight, CircleDot
} from "lucide-react";

const pillars = [
  { number: "01", title: "Discover", copy: "Find your place in a connected digital-asset ecosystem.", icon: Compass },
  { number: "02", title: "Participate", copy: "Access the tools and experiences built around STV.", icon: Orbit },
  { number: "03", title: "Stay in control", copy: "Keep your account activity and ecosystem journey within reach.", icon: ShieldCheck },
];

export default function FreshHome() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="fresh-site">
      <div className="fresh-grain" aria-hidden="true" />
      <header className="fresh-header">
        <Link href="/" className="fresh-brand" aria-label="STRIVERSE home">
          <Image src="/brand/striverse-full-logo.png.png" alt="STRIVERSE" width={190} height={44} priority />
        </Link>
        <button className="fresh-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? "fresh-nav is-open" : "fresh-nav"}>
          <a href="#universe" onClick={() => setMenuOpen(false)}>Universe</a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#stv" onClick={() => setMenuOpen(false)}>STV</a>
          <Link href="/community" onClick={() => setMenuOpen(false)}>Community</Link>
        </nav>
        <Link className="fresh-header-cta" href="/register">Enter STRIVERSE <ArrowUpRight size={15} /></Link>
      </header>

      <section className="fresh-hero" id="universe">
        <div className="fresh-hero-copy">
          <p className="fresh-overline"><span /> THE STRIVERSE ECOSYSTEM</p>
          <h1>Step beyond<br />the <em>ordinary.</em></h1>
          <p className="fresh-hero-description">A digital universe centered on STV. Explore a connected experience designed to bring your next move into focus.</p>
          <div className="fresh-hero-actions">
            <Link href="/register" className="fresh-primary">Explore STRIVERSE <MoveUpRight size={17} /></Link>
            <a href="#experience" className="fresh-secondary">Discover the ecosystem <ArrowDownRight size={17} /></a>
          </div>
          <div className="fresh-index"><span>01</span><i /> A NEW DIGITAL FRONTIER</div>
        </div>
        <div className="fresh-orbit-scene" aria-label="Abstract golden orbital artwork">
          <div className="fresh-orbit orbit-one" /><div className="fresh-orbit orbit-two" /><div className="fresh-orbit orbit-three" />
          <div className="fresh-planet"><div className="fresh-planet-shine" /></div>
          <div className="fresh-orbit-point point-one" /><div className="fresh-orbit-point point-two" />
          <div className="fresh-scene-caption"><span>STV</span><b>THE CENTER OF A CONNECTED UNIVERSE</b></div>
        </div>
        <div className="fresh-hero-foot"><span>STRIVE. GROW. BELONG.</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>

      <section className="fresh-intro" id="experience">
        <div className="fresh-section-label"><span>01 / THE IDEA</span><i /></div>
        <div className="fresh-intro-grid">
          <h2>One ecosystem.<br /><em>More ways forward.</em></h2>
          <div className="fresh-intro-copy">
            <p>STRIVERSE brings the essential parts of your STV journey into one destination. Move through the ecosystem, access your account and discover the experiences available to you.</p>
            <Link href="/about" className="fresh-text-link">Get to know STRIVERSE <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="fresh-pillars">
        <div className="fresh-section-label"><span>02 / THE EXPERIENCE</span><i /></div>
        <div className="fresh-pillars-heading"><h2>Designed around<br /><em>your journey.</em></h2><p>Three simple ideas shape the STRIVERSE experience.</p></div>
        <div className="fresh-pillar-list">
          {pillars.map(({ number, title, copy, icon: Icon }) => (
            <article className="fresh-pillar" key={number}>
              <span className="fresh-pillar-number">{number}</span>
              <div className="fresh-pillar-icon"><Icon size={23} strokeWidth={1.4} /></div>
              <div className="fresh-pillar-copy"><h3>{title}</h3><p>{copy}</p></div>
              <ArrowUpRight className="fresh-pillar-arrow" size={20} />
            </article>
          ))}
        </div>
      </section>

      <section className="fresh-token" id="stv">
        <div className="fresh-token-art"><div className="fresh-token-ring" /><div className="fresh-token-core">S<span>T</span>V</div><span className="fresh-token-orbit-label">STRIVERSE / NATIVE TOKEN</span></div>
        <div className="fresh-token-copy">
          <div className="fresh-section-label"><span>03 / THE TOKEN</span><i /></div>
          <p className="fresh-overline">THE HEART OF THE ECOSYSTEM</p>
          <h2>Meet <em>STV.</em></h2>
          <p>STV is the native token at the center of the STRIVERSE ecosystem. Explore the token overview and its published details.</p>
          <Link href="/tokenomics" className="fresh-primary">Explore STV <ArrowUpRight size={17} /></Link>
        </div>
      </section>

      <section className="fresh-final">
        <div className="fresh-final-mark"><Orbit size={30} strokeWidth={1} /></div>
        <p className="fresh-overline">YOUR NEXT CHAPTER STARTS HERE</p>
        <h2>Find your place<br />in the <em>universe.</em></h2>
        <Link href="/register" className="fresh-primary">Enter STRIVERSE <ArrowUpRight size={17} /></Link>
      </section>

      <footer className="fresh-footer">
        <Link href="/" className="fresh-footer-brand">STRIVERSE<span>®</span></Link>
        <span>STRIVE. GROW. BELONG.</span>
        <div><Link href="/about">About</Link><Link href="/tokenomics">STV</Link><Link href="/community">Community</Link><Link href="/login">Sign in</Link></div>
        <small>© 2026 STRIVERSE</small>
      </footer>

      <style jsx global>{`
        .fresh-site{--ink:#090a0b;--paper:#f0eee8;--muted:#a5a49e;--gold:#d8b76b;--line:rgba(240,238,232,.16);position:relative;overflow:hidden;background:var(--ink);color:var(--paper);font-family:Arial,Helvetica,sans-serif}
        .fresh-site *{box-sizing:border-box}.fresh-site a{color:inherit;text-decoration:none}.fresh-grain{pointer-events:none;position:absolute;inset:0;z-index:1;opacity:.12;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E")}
        .fresh-header{height:86px;padding:0 5.5vw;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);position:relative;z-index:5;background:#090a0bf2}
        .fresh-brand{display:flex;align-items:center}.fresh-brand img{width:174px;height:auto;object-fit:contain}.fresh-nav{display:flex;gap:38px;align-items:center}.fresh-nav a,.fresh-header-cta{font-size:11px;letter-spacing:.09em;text-transform:uppercase}.fresh-nav a{color:#b7b5ad;transition:color .2s}.fresh-nav a:hover{color:var(--gold)}
        .fresh-header-cta{display:flex;gap:16px;align-items:center;padding:14px 18px;border:1px solid #8d7547;color:var(--gold)!important}.fresh-menu-toggle{display:none;background:none;color:var(--paper);border:0}
        .fresh-hero{min-height:690px;padding:100px 9vw 34px;position:relative;display:grid;grid-template-columns:1fr 1fr;align-items:center;border-bottom:1px solid var(--line);background:radial-gradient(ellipse at 72% 48%,#382b172b,transparent 42%),linear-gradient(120deg,#0b0c0d,#08090a 68%)}
        .fresh-hero-copy{position:relative;z-index:2;max-width:590px}.fresh-overline{font-size:9px;font-weight:700;letter-spacing:.25em;color:var(--gold);display:flex;align-items:center;gap:12px}.fresh-overline span{width:26px;height:1px;background:var(--gold)}
        .fresh-hero h1,.fresh-intro h2,.fresh-pillars h2,.fresh-token h2,.fresh-final h2{font-family:Georgia,'Times New Roman',serif;font-weight:400;letter-spacing:-.055em}
        .fresh-hero h1{font-size:clamp(64px,8vw,116px);line-height:.91;margin:32px 0}.fresh-hero h1 em,.fresh-intro h2 em,.fresh-pillars h2 em,.fresh-token h2 em,.fresh-final h2 em{font-style:italic;color:var(--gold)}
        .fresh-hero-description{font-size:15px;line-height:1.9;color:#aaa9a2;max-width:420px}.fresh-hero-actions{display:flex;align-items:center;gap:28px;margin-top:36px;flex-wrap:wrap}
        .fresh-primary{min-height:52px;padding:0 21px;display:inline-flex;align-items:center;gap:22px;background:var(--gold);color:#111!important;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;transition:transform .2s,background .2s}.fresh-primary:hover{transform:translateY(-3px);background:#edcf8b}
        .fresh-secondary,.fresh-text-link{display:inline-flex;align-items:center;gap:10px;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#c9c5b9}.fresh-index{display:flex;align-items:center;gap:12px;margin-top:90px;font-size:8px;letter-spacing:.2em;color:#79776f}.fresh-index span{color:var(--gold)}.fresh-index i{width:48px;height:1px;background:#706044}
        .fresh-orbit-scene{height:510px;position:relative;display:grid;place-items:center}.fresh-planet{width:min(27vw,330px);aspect-ratio:1;border-radius:50%;position:relative;background:radial-gradient(circle at 33% 29%,#fff2c5 0,#d9b66d 8%,#92713c 26%,#3e3020 54%,#100e0b 74%);box-shadow:inset -32px -20px 55px #000,0 0 100px #b58c4230,0 0 200px #b58c4212;z-index:2}.fresh-planet:after{content:"";position:absolute;inset:8%;border-radius:50%;border:1px solid #f4d99b38}.fresh-planet-shine{position:absolute;width:55%;height:18%;top:16%;left:12%;background:#fff2c5;filter:blur(35px);opacity:.55;border-radius:50%}
        .fresh-orbit{position:absolute;border:1px solid #d9b66d55;border-radius:50%;width:480px;height:190px;transform:rotate(-28deg);z-index:1}.orbit-two{width:560px;height:270px;transform:rotate(33deg);border-color:#d9b66d30}.orbit-three{width:390px;height:390px;transform:rotate(68deg);border-color:#d9b66d20}
        .fresh-orbit-point{position:absolute;width:9px;height:9px;background:#f1d28a;border-radius:50%;box-shadow:0 0 20px #e3bd70}.point-one{top:24%;right:18%}.point-two{bottom:25%;left:15%;width:5px;height:5px}
        .fresh-scene-caption{position:absolute;bottom:12px;display:flex;flex-direction:column;gap:7px;text-align:center;z-index:3}.fresh-scene-caption span{font:italic 26px Georgia;color:var(--gold)}.fresh-scene-caption b{font-size:7px;letter-spacing:.23em;color:#8d887c}
        .fresh-hero-foot{grid-column:1/-1;display:flex;justify-content:space-between;border-top:1px solid var(--line);padding-top:20px;font-size:8px;letter-spacing:.18em;color:#77766e}
        .fresh-intro,.fresh-pillars{padding:125px 10vw}.fresh-section-label{display:flex;align-items:center;gap:20px;color:var(--gold);font-size:9px;letter-spacing:.2em}.fresh-section-label i{height:1px;flex:1;background:var(--line)}
        .fresh-intro-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:8vw;align-items:end;margin-top:62px}.fresh-intro h2,.fresh-pillars h2{font-size:clamp(48px,6vw,82px);line-height:1.02;margin:0}.fresh-intro-copy p,.fresh-pillars-heading p,.fresh-token-copy>p:not(.fresh-overline){font-size:14px;line-height:2;color:#a7a59d}.fresh-intro-copy p{max-width:450px;margin:0 0 28px}.fresh-text-link{color:var(--gold);border-bottom:1px solid #8d754766;padding-bottom:12px}
        .fresh-pillars{background:#111211;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.fresh-pillars-heading{display:flex;justify-content:space-between;align-items:end;margin:58px 0 48px;gap:40px}.fresh-pillars-heading p{max-width:230px;margin:0}.fresh-pillar{display:grid;grid-template-columns:80px 70px 1fr 30px;align-items:center;gap:25px;padding:28px 0;border-top:1px solid var(--line)}.fresh-pillar:last-child{border-bottom:1px solid var(--line)}.fresh-pillar-number{font-size:10px;color:var(--gold);letter-spacing:.15em}.fresh-pillar-icon{width:54px;height:54px;border:1px solid #a58a543d;border-radius:50%;display:grid;place-items:center;color:var(--gold)}.fresh-pillar-copy h3{font:normal 27px Georgia;margin:0 0 8px}.fresh-pillar-copy p{margin:0;color:#89877f;font-size:12px}.fresh-pillar-arrow{color:#8c7548}
        .fresh-token{padding:120px 10vw;display:grid;grid-template-columns:1fr 1fr;gap:10vw;align-items:center}.fresh-token-art{height:380px;display:grid;place-items:center;position:relative}.fresh-token-ring{width:300px;height:300px;border:1px solid #c7a35c77;border-radius:50%;box-shadow:0 0 70px #c7a35c15,inset 0 0 70px #c7a35c12;position:absolute}.fresh-token-ring:before,.fresh-token-ring:after{content:"";position:absolute;inset:20px;border:1px solid #c7a35c38;border-radius:50%}.fresh-token-ring:after{inset:-22px;border-style:dashed;opacity:.5}.fresh-token-core{font:italic 72px Georgia;color:var(--gold);text-shadow:0 0 35px #c7a35c55;z-index:1}.fresh-token-core span{font-size:48px}.fresh-token-orbit-label{position:absolute;bottom:0;font-size:8px;letter-spacing:.22em;color:#77766e}.fresh-token-copy h2{font-size:clamp(56px,6vw,82px);margin:18px 0}.fresh-token-copy>p:not(.fresh-overline){max-width:410px;margin:0 0 30px}
        .fresh-final{padding:125px 20px;text-align:center;border-top:1px solid var(--line);background:radial-gradient(ellipse at 50% 100%,#8b6a2922,transparent 55%)}.fresh-final-mark{width:62px;height:62px;border:1px solid #a58a5455;border-radius:50%;display:grid;place-items:center;color:var(--gold);margin:0 auto 30px}.fresh-final h2{font-size:clamp(58px,7vw,94px);line-height:.98;margin:24px 0 34px}
        .fresh-footer{padding:32px 5.5vw;display:flex;align-items:center;justify-content:space-between;gap:24px;border-top:1px solid var(--line);color:#88867e}.fresh-footer-brand{font:italic 24px Georgia;color:var(--paper)!important}.fresh-footer-brand span{font:10px Arial;vertical-align:top;color:var(--gold)}.fresh-footer>span,.fresh-footer small,.fresh-footer div a{font-size:8px;letter-spacing:.16em}.fresh-footer div{display:flex;gap:22px}.fresh-footer div a:hover{color:var(--gold)}
        @media(max-width:900px){.fresh-hero{padding:80px 7vw 28px;grid-template-columns:1fr;min-height:auto}.fresh-hero-copy{max-width:700px}.fresh-orbit-scene{height:420px;margin-top:10px}.fresh-planet{width:min(48vw,280px)}.fresh-orbit{width:390px;height:160px}.orbit-two{width:450px;height:220px}.orbit-three{width:320px;height:320px}.fresh-index{margin-top:50px}.fresh-intro,.fresh-pillars,.fresh-token{padding:90px 7vw}.fresh-intro-grid,.fresh-token{grid-template-columns:1fr;gap:36px}.fresh-intro-grid{margin-top:42px}.fresh-pillars-heading{margin:42px 0 34px}.fresh-token-art{height:310px;grid-row:2}.fresh-token-copy{grid-row:1}}
        @media(max-width:650px){.fresh-header{height:72px;padding:0 6vw}.fresh-brand img{width:145px}.fresh-menu-toggle{display:block;margin-left:auto;margin-right:16px}.fresh-header-cta{padding:11px 12px;font-size:8px;gap:6px}.fresh-nav{display:none;position:absolute;top:71px;left:0;right:0;background:#0c0d0d;border-bottom:1px solid var(--line);padding:24px 7vw;flex-direction:column;align-items:flex-start;gap:22px}.fresh-nav.is-open{display:flex}.fresh-hero{padding-top:72px}.fresh-hero h1{font-size:clamp(58px,16vw,84px)}.fresh-hero-description{font-size:13px}.fresh-hero-actions{gap:18px}.fresh-secondary{font-size:8px}.fresh-orbit-scene{height:320px}.fresh-orbit{width:290px;height:125px}.orbit-two{width:340px;height:170px}.orbit-three{width:255px;height:255px}.fresh-planet{width:190px}.fresh-hero-foot{font-size:7px}.fresh-intro,.fresh-pillars,.fresh-token{padding:76px 7vw}.fresh-intro h2,.fresh-pillars h2{font-size:48px}.fresh-pillars-heading{display:block}.fresh-pillars-heading p{margin-top:20px}.fresh-pillar{grid-template-columns:32px 48px 1fr 18px;gap:12px;padding:22px 0}.fresh-pillar-icon{width:42px;height:42px}.fresh-pillar-copy h3{font-size:21px}.fresh-pillar-copy p{font-size:10px;line-height:1.6}.fresh-token-art{height:260px}.fresh-token-ring{width:220px;height:220px}.fresh-token-core{font-size:56px}.fresh-final{padding:95px 20px}.fresh-final h2{font-size:60px}.fresh-footer{flex-wrap:wrap;padding:28px 7vw}.fresh-footer div{order:3;width:100%;flex-wrap:wrap}.fresh-footer small{margin-left:auto}}
      `}</style>
    </main>
  );
}
