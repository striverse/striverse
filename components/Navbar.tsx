"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface User { id: string; fullName: string; email: string; role: string; }

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    const sectionIds = ["features", "about", "tokenomics", "community", "invest", "staking", "vesting", "airdrop", "roadmap"];
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
        <Link href="/" className="reference-brand sv-full-brand" aria-label="STRIVERSE home">
          <Image
            src="/striverse-full-logo.png"
            alt="STRIVERSE registered logo"
            width={2048}
            height={682}
            priority
            className="sv-full-brand-image"
            sizes="(max-width: 900px) 210px, 300px"
          />
        </Link>

        <div className="reference-nav-links sv-reference-links">
          <a className={activeSection === "home" ? "is-active" : ""} href="/" onClick={(event) => { event.preventDefault(); scrollToSection("home"); }}>Home</a>
          <a className={activeSection === "about" ? "is-active" : ""} href="#about" onClick={(event) => { event.preventDefault(); scrollToSection("about"); }}>About</a>
          <a className={activeSection === "features" ? "is-active" : ""} href="#features" onClick={(event) => { event.preventDefault(); scrollToSection("features"); }}>Ecosystem</a>
          <a className={activeSection === "tokenomics" ? "is-active" : ""} href="#tokenomics" onClick={(event) => { event.preventDefault(); scrollToSection("tokenomics"); }}>Tokenomics</a>
          <a className={activeSection === "roadmap" ? "is-active" : ""} href="#roadmap" onClick={(event) => { event.preventDefault(); scrollToSection("roadmap"); }}>Roadmap</a>
          <a href="#tokenomics" onClick={(event) => { event.preventDefault(); scrollToSection("tokenomics"); }}>Presale / ICO</a>
          <a href="#products" onClick={(event) => { event.preventDefault(); scrollToSection("products"); }}>Packages</a>
          <Link href="/dashboard/referral">Affiliate</Link>
        </div>

        <button type="button" className="sv-mobile-menu-toggle" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((value) => !value)}>{mobileOpen ? "✕" : "☰"}</button>
        <div className="reference-nav-actions" style={{ marginLeft: "auto", gap: 8, flex: "0 0 auto", minWidth: 0 }}>
          <button type="button" className={`reference-theme ${isLight ? "is-light" : ""}`} aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"} aria-pressed={isLight} onClick={() => { const next = !isLight; setIsLight(next); document.documentElement.dataset.mode = next ? "light" : "dark"; localStorage.setItem("striverse-theme", next ? "light" : "dark"); }}><span className="reference-sun">☼</span><span className="reference-theme-knob">{isLight ? "☀" : "☾"}</span></button>
          <Link href="/login" className="reference-wallet">Member Login</Link><Link href={appHref} className="reference-launch">Launch App <span>↗</span></Link>
        </div>
        {mobileOpen && <div className="sv-mobile-nav-panel">
          {[["home","Home"],["about","About"],["features","Ecosystem"],["tokenomics","Tokenomics"],["roadmap","Roadmap"],["tokenomics","Presale / ICO"],["products","Packages"]].map(([id,label], index) => <a key={label + index} href={id === "home" ? "/" : "#"+id} onClick={(event) => { event.preventDefault(); scrollToSection(id); setMobileOpen(false); }}>{label}</a>)}
          <Link href="/dashboard/referral" onClick={() => setMobileOpen(false)}>Affiliate</Link>
          <Link href={appHref} onClick={() => setMobileOpen(false)}>Launch App ↗</Link>
        </div>}
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
