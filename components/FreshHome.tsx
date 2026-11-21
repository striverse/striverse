"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDownRight, ArrowUpRight, Menu, X, Orbit, Layers3, Compass,
  ShieldCheck, MoveUpRight, CircleDot, Coins, Network, ChartNoAxesCombined,
  Wallet, Blocks, ChevronRight
} from "lucide-react";

const ecosystem = [
  { number: "01", title: "Discover the token", copy: "Explore STV and review the token information published by STRIVERSE.", icon: Coins, href: "/tokenomics", tag: "STV TOKEN" },
  { number: "02", title: "Explore the ecosystem", copy: "Find the experiences, tools and destinations available across STRIVERSE.", icon: Network, href: "/about", tag: "WEB3 ECOSYSTEM" },
  { number: "03", title: "Join the community", copy: "Connect with the STRIVERSE community and follow the project journey.", icon: Blocks, href: "/community", tag: "COMMUNITY" },
];

const quickLinks = [
  { label: "Token overview", detail: "STV information", href: "/tokenomics", icon: Coins },
  { label: "Project roadmap", detail: "Milestones & direction", href: "/roadmap", icon: ChartNoAxesCombined },
  { label: "Presale portal", detail: "Explore the presale", href: "/presale", icon: Wallet },
];

export default function FreshHome() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="fresh-site crypto-home">
      <div className="fresh-grain" aria-hidden="true" />
      <header className="fresh-header">
        <Link href="/" className="fresh-brand" aria-label="STRIVERSE home">
          <Image src="/brand/striverse-full-logo.png.png" alt="STRIVERSE" width={190} height={44} priority />
        </Link>
        <button className="fresh-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav className={menuOpen ? "fresh-nav is-open" : "fresh-nav"}>
          <a href="#markets" onClick={() => setMenuOpen(false)}>Overview</a>
          <a href="#ecosystem" onClick={() => setMenuOpen(false)}>Ecosystem</a>
          <Link href="/tokenomics" onClick={() => setMenuOpen(false)}>STV Token</Link>
          <Link href="/roadmap" onClick={() => setMenuOpen(false)}>Roadmap</Link>
          <Link href="/community" onClick={() => setMenuOpen(false)}>Community</Link>
        </nav>
        <Link className="fresh-header-cta" href="/register">Launch app <ArrowUpRight size={15} /></Link>
      </header>

      <section className="fresh-hero" id="universe">
        <div className="fresh-hero-copy">
          <p className="fresh-overline"><span /> THE NEXT DIMENSION OF WEB3</p>
          <h1>Where crypto<br />meets <em>possibility.</em></h1>
          <p className="fresh-hero-description">Enter STRIVERSE — a connected digital ecosystem built around STV. Discover the token, explore the platform and find your place in the next chapter of Web3.</p>
          <div className="fresh-hero-actions">
            <Link href="/tokenomics" className="fresh-primary">Explore STV token <MoveUpRight size={17} /></Link>
            <Link href="/about" className="fresh-secondary">Discover STRIVERSE <ArrowDownRight size={17} /></Link>
          </div>
          <div className="fresh-hero-trust"><span><ShieldCheck size={15}/> Explore official project information</span><span><CircleDot size={8}/> Web3 ecosystem</span></div>
        </div>
        <div className="fresh-coin-scene" aria-label="Abstract golden STV coin artwork">
          <div className="coin-grid" />
          <div className="coin-halo halo-a" /><div className="coin-halo halo-b" />
          <div className="coin-orbit orbit-a" /><div className="coin-orbit orbit-b" /><div className="coin-orbit orbit-c" />
          <Image src="/brand/striverse-stv-coin.webp" alt="Official STRIVERSE STV gold cryptocurrency coin" width={1254} height={1254} priority className="stv-coin-image" />
          <div className="coin-node node-a"><i/> STV / ECOSYSTEM</div>
          <div className="coin-node node-b"><i/> BUILT FOR WHAT'S NEXT</div>
          <div className="coin-scene-caption"><span>STV</span><b>THE TOKEN AT THE CENTER</b></div>
        </div>
        <div className="fresh-hero-foot"><span>STRIVE. GROW. BELONG.</span><span>SCROLL TO EXPLORE ↓</span></div>
      </section>

      <section className="crypto-overview" id="markets">
        <div className="crypto-overview-head"><div><p className="fresh-overline"><span/> STRIVERSE AT A GLANCE</p><h2>Explore the <em>ecosystem.</em></h2></div><p>Start with the essentials. Find official STV information, project milestones and the experiences available across STRIVERSE.</p></div>
        <div className="crypto-data-grid">
          <Link href="/tokenomics" className="crypto-data-card featured"><span className="data-card-icon"><Coins size={19}/></span><small>01 / NATIVE TOKEN</small><strong>STV</strong><p>Token overview & published details</p><span className="data-card-link">VIEW TOKEN <ArrowUpRight size={14}/></span></Link>
          <Link href="/roadmap" className="crypto-data-card"><span className="data-card-icon"><ChartNoAxesCombined size={19}/></span><small>02 / PROJECT DIRECTION</small><strong>Roadmap</strong><p>Explore the project milestones</p><span className="data-card-link">VIEW ROADMAP <ArrowUpRight size={14}/></span></Link>
          <Link href="/presale" className="crypto-data-card"><span className="data-card-icon"><Wallet size={19}/></span><small>03 / TOKEN ACCESS</small><strong>Presale</strong><p>Visit the official presale portal</p><span className="data-card-link">EXPLORE PRESALE <ArrowUpRight size={14}/></span></Link>
        </div>
        <div className="data-note"><ShieldCheck size={14}/> Market prices and performance are not displayed here. Visit the official token pages for current published information.</div>
      </section>

      <section className="fresh-intro" id="ecosystem">
        <div className="fresh-section-label"><span>01 / THE STRIVERSE ECOSYSTEM</span><i /></div>
        <div className="fresh-intro-grid">
          <h2>More than a token.<br /><em>A connected universe.</em></h2>
          <div className="fresh-intro-copy">
            <p>STRIVERSE brings token information, platform experiences and community destinations together in one place. Explore the ecosystem at your own pace and use official project resources to learn more.</p>
            <Link href="/about" className="fresh-text-link">About STRIVERSE <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="fresh-pillars">
        <div className="fresh-section-label"><span>02 / EXPLORE THE PLATFORM</span><i /></div>
        <div className="fresh-pillars-heading"><h2>Your gateway<br />to <em>STRIVERSE.</em></h2><p>Three ways to start exploring the ecosystem.</p></div>
        <div className="fresh-pillar-list">
          {ecosystem.map(({ number, title, copy, icon: Icon, href, tag }) => (
            <Link href={href} className="fresh-pillar" key={number}>
              <span className="fresh-pillar-number">{number}</span>
              <div className="fresh-pillar-icon"><Icon size={23} strokeWidth={1.4} /></div>
              <div className="fresh-pillar-copy"><small>{tag}</small><h3>{title}</h3><p>{copy}</p></div>
              <ArrowUpRight className="fresh-pillar-arrow" size={20} />
            </Link>
          ))}
        </div>
      </section>

      <section className="fresh-token" id="stv">
        <div className="fresh-token-art"><div className="fresh-token-ring" /><div className="fresh-token-core">S<span>T</span>V</div><span className="fresh-token-orbit-label">STRIVERSE / NATIVE TOKEN</span><div className="token-art-spark spark-one"/><div className="token-art-spark spark-two"/></div>
        <div className="fresh-token-copy">
          <div className="fresh-section-label"><span>03 / THE STV TOKEN</span><i /></div>
          <p className="fresh-overline">THE TOKEN AT THE CENTER</p>
          <h2>Discover <em>STV.</em></h2>
          <p>Get familiar with the STV token through the official STRIVERSE token overview. Review the published token details and ecosystem information.</p>
          <Link href="/tokenomics" className="fresh-primary">View token details <ArrowUpRight size={17} /></Link>
        </div>
      </section>

      <section className="crypto-quicklinks">
        <div className="fresh-section-label"><span>04 / YOUR NEXT STEP</span><i /></div>
        <div className="quicklinks-head"><h2>Explore what<br /><em>comes next.</em></h2><p>Go directly to the STRIVERSE destinations you want to explore.</p></div>
        <div className="quicklink-list">{quickLinks.map(({label,detail,href,icon:Icon})=><Link href={href} className="quicklink" key={label}><span className="quicklink-icon"><Icon size={20}/></span><span><b>{label}</b><small>{detail}</small></span><ChevronRight size={19}/></Link>)}</div>
      </section>

      <section className="fresh-final">
        <div className="fresh-final-mark"><Orbit size={30} strokeWidth={1} /></div>
        <p className="fresh-overline">STEP INTO THE STRIVERSE</p>
        <h2>Your Web3 journey<br />starts <em>here.</em></h2>
        <div className="final-actions"><Link href="/register" className="fresh-primary">Create your account <ArrowUpRight size={17} /></Link><Link href="/community" className="fresh-secondary">Join the community <ArrowUpRight size={16}/></Link></div>
      </section>

      <footer className="fresh-footer">
        <Link href="/" className="fresh-footer-brand">STRIVERSE<span>®</span></Link>
        <span>STRIVE. GROW. BELONG.</span>
        <div><Link href="/about">About</Link><Link href="/tokenomics">STV Token</Link><Link href="/roadmap">Roadmap</Link><Link href="/community">Community</Link><Link href="/login">Sign in</Link></div>
        <small>© 2026 STRIVERSE</small>
      </footer>

      <style jsx global>{`
        .fresh-site{--ink:#090a0b;--paper:#f0eee8;--muted:#a5a49e;--gold:#d8b76b;--gold2:#f0d494;--line:rgba(240,238,232,.14);position:relative;overflow:hidden;background:var(--ink);color:var(--paper);font-family:Arial,Helvetica,sans-serif}
        .fresh-site *{box-sizing:border-box}.fresh-site a{color:inherit;text-decoration:none}.fresh-grain{pointer-events:none;position:absolute;inset:0;z-index:1;opacity:.1;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.18'/%3E%3C/svg%3E")}
        .crypto-topline{height:30px;padding:0 5.5vw;display:flex;justify-content:space-between;align-items:center;background:#050606;border-bottom:1px solid #ffffff10;color:#858176;font-size:8px;letter-spacing:.17em}.crypto-topline span:first-child{display:flex;align-items:center;gap:9px}.crypto-topline i{width:6px;height:6px;border-radius:50%;background:var(--gold);box-shadow:0 0 10px var(--gold)}.crypto-topline b{color:var(--gold);padding:0 5px}
        .fresh-header{height:78px;padding:0 5.5vw;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);position:relative;z-index:5;background:#090a0bf2}.fresh-brand{display:flex;align-items:center}.fresh-brand img{width:174px;height:auto;object-fit:contain}.fresh-nav{display:flex;gap:28px;align-items:center}.fresh-nav a,.fresh-header-cta{font-size:10px;letter-spacing:.08em;text-transform:uppercase}.fresh-nav a{color:#b7b5ad;transition:color .2s}.fresh-nav a:hover{color:var(--gold)}.fresh-header-cta{display:flex;gap:14px;align-items:center;padding:13px 17px;border:1px solid #8d7547;color:var(--gold)!important}.fresh-menu-toggle{display:none;background:none;color:var(--paper);border:0}
        .fresh-hero{min-height:660px;padding:88px 8vw 28px;position:relative;display:grid;grid-template-columns:1fr 1fr;align-items:center;border-bottom:1px solid var(--line);background:radial-gradient(ellipse at 74% 48%,#62471e30,transparent 43%),linear-gradient(120deg,#0b0c0d,#08090a 68%)}.fresh-hero-copy{position:relative;z-index:2;max-width:610px}.fresh-overline{font-size:9px;font-weight:700;letter-spacing:.23em;color:var(--gold);display:flex;align-items:center;gap:12px}.fresh-overline span{width:25px;height:1px;background:var(--gold)}
        .fresh-hero h1,.fresh-intro h2,.fresh-pillars h2,.fresh-token h2,.fresh-final h2,.crypto-overview h2,.quicklinks-head h2{font-family:Georgia,'Times New Roman',serif;font-weight:400;letter-spacing:-.055em}.fresh-hero h1{font-size:clamp(58px,7.3vw,104px);line-height:.94;margin:30px 0}.fresh-hero h1 em,.fresh-intro h2 em,.fresh-pillars h2 em,.fresh-token h2 em,.fresh-final h2 em,.crypto-overview h2 em,.quicklinks-head h2 em{font-style:italic;color:var(--gold)}
        .fresh-hero-description{font-size:14px;line-height:1.9;color:#aaa9a2;max-width:455px}.fresh-hero-actions{display:flex;align-items:center;gap:25px;margin-top:32px;flex-wrap:wrap}.fresh-primary{min-height:50px;padding:0 20px;display:inline-flex;align-items:center;gap:20px;background:linear-gradient(110deg,#d3ad5d,#edcf8a);color:#111!important;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;transition:transform .2s,filter .2s}.fresh-primary:hover{transform:translateY(-3px);filter:brightness(1.08)}.fresh-secondary,.fresh-text-link{display:inline-flex;align-items:center;gap:9px;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#c9c5b9}.fresh-hero-trust{display:flex;gap:23px;flex-wrap:wrap;margin-top:47px;color:#858176;font-size:9px;letter-spacing:.05em}.fresh-hero-trust span{display:flex;align-items:center;gap:7px}.fresh-hero-trust svg{color:var(--gold)}
        .fresh-coin-scene{height:500px;position:relative;display:grid;place-items:center;isolation:isolate}.coin-grid{position:absolute;inset:0;background-image:linear-gradient(#d7b66b0a 1px,transparent 1px),linear-gradient(90deg,#d7b66b0a 1px,transparent 1px);background-size:42px 42px;mask-image:radial-gradient(ellipse,black,transparent 68%);z-index:-1}.coin-halo{position:absolute;width:380px;height:380px;border-radius:50%;background:#d8b76b12;filter:blur(60px)}.halo-b{width:220px;height:220px;background:#f3d99a12;filter:blur(50px)}.stv-coin-image{width:min(36vw,440px);height:auto;aspect-ratio:1;object-fit:contain;position:relative;z-index:2;transform:rotate(-7deg);filter:drop-shadow(0 18px 34px #000c) drop-shadow(0 0 28px #f2b90055);animation:stvCoinFloat 7s ease-in-out infinite,stvCoinGlow 5s ease-in-out infinite}.coin-orbit{position:absolute;width:470px;height:170px;border:1px solid #d8b76b55;border-radius:50%;transform:rotate(-28deg);z-index:1;animation:stvOrbitDrift 18s ease-in-out infinite}.orbit-b{width:510px;height:250px;transform:rotate(34deg);border-color:#d8b76b35}.orbit-c{width:370px;height:370px;transform:rotate(68deg);border-color:#d8b76b24}.coin-node{position:absolute;z-index:3;padding:9px 12px;border:1px solid #d8b76b40;background:#0b0c0ddd;color:#c9b27f;font-size:7px;letter-spacing:.15em}.coin-node i{display:inline-block;width:5px;height:5px;background:var(--gold);border-radius:50%;margin-right:7px;box-shadow:0 0 9px var(--gold)}.node-a{top:18%;right:0}.node-b{bottom:16%;left:0}.coin-scene-caption{position:absolute;bottom:2px;display:flex;flex-direction:column;gap:6px;text-align:center;z-index:3}.coin-scene-caption span{font:italic 20px Georgia;color:var(--gold)}.coin-scene-caption b{font-size:7px;letter-spacing:.2em;color:#8d887c}
        .fresh-hero-foot{grid-column:1/-1;display:flex;justify-content:space-between;border-top:1px solid var(--line);padding-top:17px;font-size:8px;letter-spacing:.18em;color:#77766e}
        .crypto-overview{padding:94px 9vw 88px;background:#0d0e0e;border-bottom:1px solid var(--line)}.crypto-overview-head{display:flex;align-items:end;justify-content:space-between;gap:50px;margin-bottom:42px}.crypto-overview h2,.quicklinks-head h2{font-size:clamp(43px,5.4vw,70px);line-height:1;margin:22px 0 0}.crypto-overview-head>p,.quicklinks-head>p{max-width:340px;color:#99978e;font-size:12px;line-height:1.9;margin:0}.crypto-data-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.crypto-data-card{min-height:205px;padding:23px;border:1px solid #ffffff17;background:linear-gradient(145deg,#151615,#0b0c0c);position:relative;transition:border-color .2s,transform .2s}.crypto-data-card:hover{border-color:#c9a45b88;transform:translateY(-4px)}.crypto-data-card.featured{background:radial-gradient(circle at 90% 0,#c49a4820,transparent 55%),#151512;border-color:#b28d4b66}.data-card-icon{width:38px;height:38px;border:1px solid #c9a45b55;border-radius:50%;display:grid;place-items:center;color:var(--gold);margin-bottom:18px}.crypto-data-card>small{display:block;color:#8f8879;font-size:7px;letter-spacing:.18em}.crypto-data-card>strong{display:block;font:32px Georgia;margin:8px 0}.crypto-data-card>p{font-size:10px;color:#96938a;margin:0}.data-card-link{position:absolute;bottom:21px;right:21px;display:flex;align-items:center;gap:8px;color:var(--gold);font-size:7px;letter-spacing:.15em}.data-note{display:flex;align-items:center;gap:9px;color:#77766e;font-size:9px;margin-top:20px}.data-note svg{color:var(--gold)}
        .fresh-intro,.fresh-pillars{padding:112px 10vw}.fresh-section-label{display:flex;align-items:center;gap:20px;color:var(--gold);font-size:8px;letter-spacing:.2em}.fresh-section-label i{height:1px;flex:1;background:var(--line)}.fresh-intro-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:8vw;align-items:end;margin-top:57px}.fresh-intro h2,.fresh-pillars h2{font-size:clamp(46px,5.8vw,78px);line-height:1.02;margin:0}.fresh-intro-copy p,.fresh-pillars-heading p,.fresh-token-copy>p:not(.fresh-overline){font-size:13px;line-height:2;color:#a7a59d}.fresh-intro-copy p{max-width:450px;margin:0 0 25px}.fresh-text-link{color:var(--gold);border-bottom:1px solid #8d754766;padding-bottom:11px}
        .fresh-pillars{background:#111211;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}.fresh-pillars-heading,.quicklinks-head{display:flex;justify-content:space-between;align-items:end;margin:52px 0 42px;gap:40px}.fresh-pillars-heading p{max-width:230px;margin:0}.fresh-pillar{display:grid;grid-template-columns:65px 62px 1fr 25px;align-items:center;gap:23px;padding:25px 0;border-top:1px solid var(--line);transition:padding .2s}.fresh-pillar:hover{padding-left:9px}.fresh-pillar:last-child{border-bottom:1px solid var(--line)}.fresh-pillar-number{font-size:9px;color:var(--gold);letter-spacing:.15em}.fresh-pillar-icon{width:50px;height:50px;border:1px solid #a58a543d;border-radius:50%;display:grid;place-items:center;color:var(--gold)}.fresh-pillar-copy small{font-size:7px;letter-spacing:.18em;color:var(--gold)}.fresh-pillar-copy h3{font:normal 25px Georgia;margin:6px 0}.fresh-pillar-copy p{margin:0;color:#89877f;font-size:11px}.fresh-pillar-arrow{color:#8c7548}
        .fresh-token{padding:110px 10vw;display:grid;grid-template-columns:1fr 1fr;gap:10vw;align-items:center}.fresh-token-art{height:360px;display:grid;place-items:center;position:relative}.fresh-token-ring{width:280px;height:280px;border:1px solid #c7a35c77;border-radius:50%;box-shadow:0 0 70px #c7a35c15,inset 0 0 70px #c7a35c12;position:absolute}.fresh-token-ring:before,.fresh-token-ring:after{content:"";position:absolute;inset:20px;border:1px solid #c7a35c38;border-radius:50%}.fresh-token-ring:after{inset:-22px;border-style:dashed;opacity:.5}.fresh-token-core{font:italic 68px Georgia;color:var(--gold);text-shadow:0 0 35px #c7a35c55;z-index:1}.fresh-token-core span{font-size:46px}.fresh-token-orbit-label{position:absolute;bottom:0;font-size:7px;letter-spacing:.22em;color:#77766e}.token-art-spark{position:absolute;width:5px;height:5px;border-radius:50%;background:var(--gold);box-shadow:0 0 14px var(--gold)}.spark-one{top:17%;right:22%}.spark-two{bottom:22%;left:21%}.fresh-token-copy h2{font-size:clamp(53px,5.5vw,78px);margin:18px 0}.fresh-token-copy>p:not(.fresh-overline){max-width:410px;margin:0 0 28px}
        .crypto-quicklinks{padding:90px 10vw;background:#101111;border-top:1px solid var(--line)}.quicklinks-head{margin:42px 0 28px}.quicklink-list{border-top:1px solid var(--line)}.quicklink{display:flex;align-items:center;gap:17px;padding:18px 4px;border-bottom:1px solid var(--line);transition:padding .2s}.quicklink:hover{padding-left:12px}.quicklink-icon{width:42px;height:42px;border:1px solid #c9a45b44;border-radius:50%;display:grid;place-items:center;color:var(--gold)}.quicklink>span:nth-child(2){display:flex;flex-direction:column;gap:5px;flex:1}.quicklink b{font:normal 18px Georgia}.quicklink small{color:#8c8980;font-size:9px}.quicklink>svg{color:var(--gold)}
        .fresh-final{padding:115px 20px;text-align:center;border-top:1px solid var(--line);background:radial-gradient(ellipse at 50% 100%,#8b6a2922,transparent 55%)}.fresh-final-mark{width:60px;height:60px;border:1px solid #a58a5455;border-radius:50%;display:grid;place-items:center;color:var(--gold);margin:0 auto 27px}.fresh-final h2{font-size:clamp(55px,6.7vw,88px);line-height:.98;margin:22px 0 30px}.final-actions{display:flex;justify-content:center;align-items:center;gap:25px;flex-wrap:wrap}
        .fresh-footer{padding:30px 5.5vw;display:flex;align-items:center;justify-content:space-between;gap:22px;border-top:1px solid var(--line);color:#88867e}.fresh-footer-brand{font:italic 23px Georgia;color:var(--paper)!important}.fresh-footer-brand span{font:10px Arial;vertical-align:top;color:var(--gold)}.fresh-footer>span,.fresh-footer small,.fresh-footer div a{font-size:8px;letter-spacing:.14em}.fresh-footer div{display:flex;gap:18px}.fresh-footer div a:hover{color:var(--gold)}
        @keyframes stvCoinFloat{0%,100%{translate:0 0;rotate:-1deg}50%{translate:0 -12px;rotate:1deg}}@keyframes stvCoinGlow{0%,100%{filter:brightness(1)}50%{filter:brightness(1.09)}}@keyframes stvOrbitDrift{0%,100%{rotate:0deg}50%{rotate:5deg}}@media(prefers-reduced-motion:reduce){.stv-coin-image,.coin-orbit{animation:none!important}.fresh-site *{scroll-behavior:auto!important;transition:none!important}}
        @media(max-width:900px){.fresh-hero{padding:72px 7vw 25px;grid-template-columns:1fr;min-height:auto}.fresh-hero-copy{max-width:700px}.fresh-coin-scene{height:420px;margin-top:5px}.stv-coin-image{width:min(58vw,390px)}.coin-orbit{width:390px;height:150px}.orbit-b{width:450px;height:220px}.orbit-c{width:320px;height:320px}.fresh-intro,.fresh-pillars,.fresh-token,.crypto-overview,.crypto-quicklinks{padding:82px 7vw}.fresh-intro-grid,.fresh-token{grid-template-columns:1fr;gap:35px}.fresh-intro-grid{margin-top:40px}.fresh-pillars-heading{margin:40px 0 32px}.fresh-token-art{height:290px;grid-row:2}.fresh-token-copy{grid-row:1}.crypto-overview-head{align-items:start;flex-direction:column;gap:18px}.crypto-overview-head>p{max-width:520px}}
        @media(max-width:650px){.crypto-topline{padding:0 5vw;font-size:6px;letter-spacing:.1em}.crypto-topline span:last-child{font-size:0}.crypto-topline span:last-child b{font-size:7px}.fresh-header{height:70px;padding:0 5vw}.fresh-brand img{width:140px}.fresh-menu-toggle{display:block;margin-left:auto;margin-right:12px}.fresh-header-cta{padding:10px 11px;font-size:8px;gap:5px}.fresh-nav{display:none;position:absolute;top:69px;left:0;right:0;background:#0c0d0d;border-bottom:1px solid var(--line);padding:22px 7vw;flex-direction:column;align-items:flex-start;gap:20px}.fresh-nav.is-open{display:flex}.fresh-hero{padding-top:65px}.fresh-hero h1{font-size:clamp(54px,14.5vw,76px)}.fresh-hero-description{font-size:12px}.fresh-hero-actions{gap:17px}.fresh-secondary{font-size:8px}.fresh-hero-trust{gap:12px;margin-top:30px;font-size:8px}.fresh-coin-scene{height:330px}.stv-coin-image{width:min(72vw,300px)}.coin-orbit{width:290px;height:115px}.orbit-b{width:330px;height:165px}.orbit-c{width:245px;height:245px}.coin-node{font-size:6px;padding:7px 8px}.node-a{right:-4px;top:15%}.node-b{left:-4px;bottom:13%}.fresh-hero-foot{font-size:6px}.crypto-overview,.fresh-intro,.fresh-pillars,.fresh-token,.crypto-quicklinks{padding:70px 7vw}.crypto-data-grid{grid-template-columns:1fr;gap:10px}.crypto-data-card{min-height:170px}.crypto-overview h2,.quicklinks-head h2{font-size:48px}.fresh-intro h2,.fresh-pillars h2{font-size:45px}.fresh-pillars-heading{display:block}.fresh-pillars-heading p{margin-top:17px}.fresh-pillar{grid-template-columns:27px 43px 1fr 16px;gap:10px;padding:20px 0}.fresh-pillar-icon{width:39px;height:39px}.fresh-pillar-copy h3{font-size:19px}.fresh-pillar-copy p{font-size:9px;line-height:1.6}.fresh-token-art{height:245px}.fresh-token-ring{width:210px;height:210px}.fresh-token-core{font-size:54px}.quicklinks-head{display:block}.quicklinks-head>p{margin-top:18px}.quicklink b{font-size:16px}.fresh-final{padding:88px 20px}.fresh-final h2{font-size:57px}.fresh-footer{flex-wrap:wrap;padding:26px 7vw}.fresh-footer div{order:3;width:100%;flex-wrap:wrap;gap:16px}.fresh-footer small{margin-left:auto}}
      `}</style>
    </main>
  );
}
