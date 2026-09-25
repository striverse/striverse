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
  const [navHidden, setNavHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

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
    let lastY = window.scrollY;
    setNavHidden(lastY > 12);
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 12) {
        setNavHidden(false);
      } else if (currentY > lastY + 4) {
        setNavHidden(true);
      } else if (currentY < lastY - 4) {
        setNavHidden(false);
      }
      lastY = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ["features", "about", "tokenomics", "community", "staking", "vesting", "airdrop", "roadmap"];
    const updateFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      setActiveSection(hash || "home");
    };
    updateFromHash();

    const observers = sectionIds.map((id) => {
      const element = document.getElementById(id);
      if (!element) return null;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveSection(id);
      }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
      observer.observe(element);
      return observer;
    });

    window.addEventListener("hashchange", updateFromHash);
    return () => {
      observers.forEach((observer) => observer?.disconnect());
      window.removeEventListener("hashchange", updateFromHash);
    };
  }, []);

  const scrollToSection = (id: string) => {
    if (id === "home") {
      window.history.replaceState(null, "", "/");
      setMoreOpen(false);
      setNavHidden(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(id);
    if (!element) return;

    // Hide the fixed navbar first so the selected section can occupy the viewport.
    setNavHidden(true);
    setMoreOpen(false);
    window.history.replaceState(null, "", `#${id}`);

    requestAnimationFrame(() => {
      // Always anchor to the selected section itself so its full top edge is shown.
      // Do not anchor to an inner wrapper; section padding is part of the section.
      const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY);
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  const appHref = loading ? "/login" : user ? (user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard") : "/login";

  return (
    <header className={`reference-nav-wrap ${navHidden ? "nav-hidden" : ""}`}>
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
          <button type="button" className="reference-icon-btn" aria-label={searchOpen ? "Close search" : "Open search"} aria-expanded={searchOpen} onClick={() => setSearchOpen((value) => !value)} style={{ width: 44, height: 44 }}><span className="reference-search-icon" /></button>
          <button type="button" className={`reference-theme ${isLight ? "is-light" : ""}`} aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"} aria-pressed={isLight} onClick={() => { const next = !isLight; setIsLight(next); document.documentElement.dataset.mode = next ? "light" : "dark"; localStorage.setItem("striverse-theme", next ? "light" : "dark"); }}><span className="reference-sun">☼</span><span className="reference-theme-knob">{isLight ? "☀" : "☾"}</span></button>
          <Link href="/login" className="reference-wallet">Connect Wallet</Link><Link href={appHref} className="reference-launch">Launch App <span>↗</span></Link>
        </div>
        {searchOpen && <div className="reference-search-popover"><input autoFocus placeholder="Search STRIVERSE..." aria-label="Search STRIVERSE" /><span>⌕</span></div>}
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
      `}</style>
    </header>
  );
}
