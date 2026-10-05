"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface User { id: string; fullName: string; email: string; role: string; }

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("striverse-theme");
    const light = savedTheme === "light";
    setIsLight(light);
    document.documentElement.dataset.mode = light ? "light" : "dark";
    fetch("/api/user/me", { credentials: "include", cache: "no-store" })
      .then(async (res) => (res.ok ? (await res.json()).user : null))
      .then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const sectionIds = ["features", "about", "tokenomics", "community", "staking", "vesting", "airdrop", "roadmap"];

    const updateActiveSection = () => {
      const nav = document.querySelector<HTMLElement>(".reference-nav-wrap");
      const navHeight = nav?.getBoundingClientRect().height ?? 0;
      const marker = window.scrollY + navHeight + 80;

      // The hero is the home state. Do not let the first section become active
      // while its top edge is only barely visible at the bottom of the viewport.
      const firstSection = document.getElementById(sectionIds[0]);
      if (!firstSection || marker < firstSection.offsetTop) {
        setActiveSection("home");
        return;
      }

      let current = "home";
      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= marker) current = id;
      }
      setActiveSection(current);
    };

    const updateFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveSection(hash);
      } else {
        updateActiveSection();
      }
    };

    updateFromHash();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("hashchange", updateFromHash);
    window.addEventListener("striverse-section-change", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("hashchange", updateFromHash);
      window.removeEventListener("striverse-section-change", updateActiveSection);
    };
  }, []);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      if (currentY <= 12) {
        setNavHidden(false);
      } else if (delta > 4) {
        setNavHidden(true);
        setMoreOpen(false);
      } else if (delta < -4) {
        setNavHidden(false);
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === "home") {
      window.history.replaceState(null, "", "/");
      window.dispatchEvent(new CustomEvent("striverse-section-change", { detail: { section: id } }));
      setMoreOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(id);
    if (!element) return;

    setMoreOpen(false);
    setMobileMenuOpen(false);
    window.history.replaceState(null, "", `#${id}`);
    window.dispatchEvent(new CustomEvent("striverse-section-change", { detail: { section: id } }));

    // Focus mode hides the other sections, so reset the document to the selected section.
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const appHref = loading ? "/login" : user ? (user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard") : "/login";

  return (
    <header className={`reference-nav-wrap${navHidden ? " nav-hidden" : ""}`}>
      <nav className="reference-nav" aria-label="Primary navigation">
        <Link href="/" className="reference-brand" aria-label="STRIVERSE home">
          <span className="reference-brand-icon-clip" style={{ width: 62, height: 46, overflow: "hidden", display: "block", flex: "0 0 62px", position: "relative", background: "transparent" }}>
            <Image src="/striverse-logo-only.png" alt="" width={68} height={68} priority className="reference-brand-icon" style={{ position: "absolute", left: 0, top: 0, width: 66, height: 66, maxWidth: "none", objectFit: "contain", mixBlendMode: "normal", background: "transparent", filter: "drop-shadow(0 0 8px rgba(0,229,255,.22))" }} />
          </span>
          <Image src="/applogo1.png" alt="STRIVERSE" width={290} height={52} priority className="reference-brand-wordmark" style={{ width: 290, height: "auto", flex: "0 0 290px", display: "block" }} />
        </Link>

        <div className="reference-nav-links" style={{ flex: "0 0 auto", minWidth: 0, gap: 12, whiteSpace: "nowrap" }}>
          <a className={activeSection === "home" ? "is-active" : ""} href="/" onClick={(event) => { event.preventDefault(); scrollToSection("home"); }}>Home</a><a className={activeSection === "features" ? "is-active" : ""} href="#features" onClick={(event) => { event.preventDefault(); scrollToSection("features"); }}>Features</a><a className={activeSection === "about" ? "is-active" : ""} href="#about" onClick={(event) => { event.preventDefault(); scrollToSection("about"); }}>About</a><a className={activeSection === "tokenomics" ? "is-active" : ""} href="#tokenomics" onClick={(event) => { event.preventDefault(); scrollToSection("tokenomics"); }}>Tokenomics</a><a className={activeSection === "community" ? "is-active" : ""} href="#community" onClick={(event) => { event.preventDefault(); scrollToSection("community"); }}>Community</a>
          <div className={`reference-more ${["staking","vesting","airdrop","roadmap"].includes(activeSection) ? "is-active" : ""}`}><button type="button" onClick={() => setMoreOpen((value) => !value)} aria-expanded={moreOpen}>More <span className={`reference-chevron ${moreOpen ? "open" : ""}`} /></button>{moreOpen && <div className="reference-more-menu"><a className={activeSection === "staking" ? "is-active" : ""} href="#staking" onClick={(event) => { event.preventDefault(); scrollToSection("staking"); }}>Staking</a><a className={activeSection === "vesting" ? "is-active" : ""} href="#vesting" onClick={(event) => { event.preventDefault(); scrollToSection("vesting"); }}>Vesting</a><a className={activeSection === "airdrop" ? "is-active" : ""} href="#airdrop" onClick={(event) => { event.preventDefault(); scrollToSection("airdrop"); }}>Airdrop</a><a className={activeSection === "roadmap" ? "is-active" : ""} href="#roadmap" onClick={(event) => { event.preventDefault(); scrollToSection("roadmap"); }}>Roadmap</a></div>}</div>
        </div>

        <div className="reference-nav-actions" style={{ marginLeft: "auto", gap: 8, flex: "0 0 auto", minWidth: 0 }}>
          <button type="button" className="reference-icon-btn reference-desktop-search" aria-label={searchOpen ? "Close search" : "Open search"} aria-expanded={searchOpen} onClick={() => setSearchOpen((value) => !value)} style={{ width: 44, height: 44 }}><span className="reference-search-icon" /></button>
          <button type="button" className={`reference-theme reference-desktop-theme ${isLight ? "is-light" : ""}`} aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"} aria-pressed={isLight} onClick={() => { const next = !isLight; setIsLight(next); document.documentElement.dataset.mode = next ? "light" : "dark"; localStorage.setItem("striverse-theme", next ? "light" : "dark"); }}><span className="reference-sun">☼</span><span className="reference-theme-knob">{isLight ? "☀" : "☾"}</span></button>
          <Link href="/login" className="reference-wallet reference-desktop-action">Connect Wallet</Link><Link href={appHref} className="reference-launch reference-desktop-action">Launch App <span>↗</span></Link>
          <button type="button" className={`reference-mobile-menu-toggle${mobileMenuOpen ? " is-open" : ""}`} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((value) => !value)}>
            <span /><span /><span />
          </button>
        </div>
        {searchOpen && <div className="reference-search-popover"><input autoFocus placeholder="Search STRIVERSE..." aria-label="Search STRIVERSE" /><span>⌕</span></div>}
        {mobileMenuOpen && (
          <div className="reference-mobile-menu">
            <div className="reference-mobile-menu-grid">
              {[
                ["home", "Home"], ["features", "Features"], ["about", "About"],
                ["tokenomics", "Tokenomics"], ["community", "Community"],
                ["staking", "Staking"], ["vesting", "Vesting"], ["airdrop", "Airdrop"], ["roadmap", "Roadmap"],
              ].map(([id, label]) => (
                <a key={id} className={activeSection === id ? "is-active" : ""} href={id === "home" ? "/" : `#${id}`} onClick={(event) => { event.preventDefault(); scrollToSection(id); }}>
                  <span>{label}</span><b>↗</b>
                </a>
              ))}
            </div>
            <div className="reference-mobile-menu-footer">
              <button type="button" onClick={() => { const next = !isLight; setIsLight(next); document.documentElement.dataset.mode = next ? "light" : "dark"; localStorage.setItem("striverse-theme", next ? "light" : "dark"); }}>
                {isLight ? "Dark mode" : "Light mode"} <span>{isLight ? "☾" : "☀"}</span>
              </button>
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Connect Wallet</Link>
              <Link href={appHref} onClick={() => setMobileMenuOpen(false)}>Launch App ↗</Link>
            </div>
          </div>
        )}
      </nav>
      <style jsx global>{`
        @media (min-width: 1201px) {
          .reference-nav { grid-template-columns: 350px minmax(0, 1fr) auto !important; gap: 6px !important; }
          .reference-brand { gap: 3px !important; width: 350px !important; min-width: 350px !important; }
          .reference-brand-icon-clip { width: 62px !important; flex: 0 0 62px !important; }
          .reference-brand-wordmark { width: 290px !important; height: 52px !important; }
          .reference-nav-links { justify-content: flex-start !important; gap: 12px !important; }
          .reference-nav-actions { gap: 8px !important; }
        }
        @media (max-width: 1200px) and (min-width: 901px) {
          .reference-nav { grid-template-columns: 330px minmax(0, 1fr) auto !important; gap: 6px !important; }
          .reference-brand { gap: 3px !important; width: 330px !important; min-width: 330px !important; }
          .reference-brand-icon-clip { width: 60px !important; flex: 0 0 60px !important; }
          .reference-brand-wordmark { width: 270px !important; }
          .reference-nav-links { gap: 10px !important; }
        }
        @media (max-width: 900px) {
          .reference-nav { grid-template-columns: minmax(0,1fr) auto !important; min-height: 58px !important; padding: 7px 9px !important; gap: 8px !important; border-radius: 18px !important; }
          .reference-brand { width: auto !important; min-width: 0 !important; gap: 5px !important; overflow: hidden; }
          .reference-brand-icon-clip { width: 40px !important; height: 36px !important; flex: 0 0 40px !important; }
          .reference-brand-icon { width: 48px !important; height: 48px !important; top: -2px !important; }
          .reference-brand-wordmark { width: 150px !important; height: auto !important; flex: 0 1 150px !important; }
          .reference-nav-links, .reference-desktop-search, .reference-desktop-theme, .reference-desktop-action { display: none !important; }
          .reference-nav-actions { margin-left: 0 !important; gap: 0 !important; }
          .reference-mobile-menu-toggle { width: 42px; height: 42px; border: 1px solid rgba(85,228,243,.28); border-radius: 13px; background: rgba(8,24,48,.92); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5px; cursor:pointer; box-shadow:0 0 20px rgba(0,220,255,.08); }
          .reference-mobile-menu-toggle span { display:block; width:18px; height:1.5px; border-radius:2px; background:#bceff5; transition:transform .22s ease,opacity .22s ease; }
          .reference-mobile-menu-toggle.is-open span:nth-child(1){transform:translateY(6.5px) rotate(45deg)}
          .reference-mobile-menu-toggle.is-open span:nth-child(2){opacity:0}
          .reference-mobile-menu-toggle.is-open span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg)}
          .reference-mobile-menu { position:absolute; top:calc(100% + 8px); left:0; right:0; padding:12px; border:1px solid rgba(85,228,243,.2); border-radius:20px; background:linear-gradient(145deg,rgba(4,18,37,.985),rgba(4,10,25,.985)); box-shadow:0 20px 60px rgba(0,0,0,.45),0 0 30px rgba(0,210,255,.08); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); }
          .reference-mobile-menu-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:7px; }
          .reference-mobile-menu-grid a { min-height:43px; display:flex; align-items:center; justify-content:space-between; padding:0 12px; border:1px solid rgba(126,163,205,.13); border-radius:12px; color:#c8d6e8; text-decoration:none; background:rgba(255,255,255,.025); font-size:11px; font-weight:800; letter-spacing:.04em; }
          .reference-mobile-menu-grid a.is-active { color:#59e4f2; border-color:rgba(85,228,243,.38); background:rgba(85,228,243,.07); box-shadow:inset 0 0 18px rgba(85,228,243,.05); }
          .reference-mobile-menu-grid a b { color:#6f8ba9; font-size:11px; }
          .reference-mobile-menu-footer { display:grid; grid-template-columns:1fr 1fr; gap:7px; margin-top:8px; padding-top:8px; border-top:1px solid rgba(126,163,205,.1); }
          .reference-mobile-menu-footer button,.reference-mobile-menu-footer a { min-height:42px; display:flex; align-items:center; justify-content:center; border:1px solid rgba(126,163,205,.14); border-radius:12px; background:rgba(255,255,255,.025); color:#c8d6e8; text-decoration:none; font:inherit; font-size:10px; font-weight:900; letter-spacing:.08em; text-transform:uppercase; }
          .reference-mobile-menu-footer a:last-child { color:#041225; border-color:transparent; background:linear-gradient(100deg,#55e4f3,#8d5cff); }
        }
        @media (min-width: 901px) {
          .reference-mobile-menu-toggle, .reference-mobile-menu { display:none !important; }
        }
      `}</style>
    </header>
  );
}
