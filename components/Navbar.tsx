"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("striverse-theme");
    const light = savedTheme === "light";
    setIsLight(light);
    document.documentElement.dataset.mode = light ? "light" : "dark";

    fetch("/api/user/me", { credentials: "include", cache: "no-store" })
      .then(async (res) => (res.ok ? (await res.json()).user : null))
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const appHref = loading ? "/login" : user ? (user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard") : "/login";

  return (
    <header className="reference-nav-wrap">
      <nav className="reference-nav" aria-label="Primary navigation">
        <Link href="/" className="reference-brand" aria-label="STRIVERSE home" style={{ flex: "0 0 320px", minWidth: 320 }}>
          <span className="reference-brand-icon-clip" style={{ width: 54, height: 40, overflow: "hidden", display: "block", flex: "0 0 54px", position: "relative", background: "transparent" }}>
            <Image src="/striverse-logo-only.png" alt="" width={58} height={58} priority className="reference-brand-icon" style={{ position: "absolute", left: 0, top: 0, width: 54, height: 54, maxWidth: "none", objectFit: "contain", mixBlendMode: "normal", background: "transparent", filter: "drop-shadow(0 0 8px rgba(0,229,255,.22))" }} />
          </span>
          <Image src="/applogo1.png" alt="STRIVERSE" width={240} height={43} priority className="reference-brand-wordmark" style={{ width: 240, height: "auto", flex: "0 0 240px", display: "block" }} />
        </Link>

        <div className="reference-nav-links" style={{ flex: "0 0 auto", minWidth: 0, gap: 16, whiteSpace: "nowrap" }}>
          <a className="is-active" href="#">Home</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#tokenomics">Tokenomics</a>
          <a href="#community">Community</a>
          <div className="reference-more">
            <button type="button" onClick={() => setMoreOpen((value) => !value)} aria-expanded={moreOpen}>More <span className={`reference-chevron ${moreOpen ? "open" : ""}`} /></button>
            {moreOpen && <div className="reference-more-menu">
              <a href="#staking" onClick={() => setMoreOpen(false)}>Staking</a>
              <a href="#vesting" onClick={() => setMoreOpen(false)}>Vesting</a>
              <a href="#airdrop" onClick={() => setMoreOpen(false)}>Airdrop</a>
              <a href="#roadmap" onClick={() => setMoreOpen(false)}>Roadmap</a>
            </div>}
          </div>
        </div>

        <div className="reference-nav-actions" style={{ marginLeft: "auto", gap: 8, flex: "0 0 auto", minWidth: 0 }}>
          <button type="button" className="reference-icon-btn" aria-label={searchOpen ? "Close search" : "Open search"} aria-expanded={searchOpen} onClick={() => setSearchOpen((value) => !value)} style={{ width: 44, height: 44 }}>
            <span className="reference-search-icon" />
          </button>
          <button type="button" className={`reference-theme ${isLight ? "is-light" : ""}`} aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"} aria-pressed={isLight} onClick={() => {
            const next = !isLight;
            setIsLight(next);
            document.documentElement.dataset.mode = next ? "light" : "dark";
            localStorage.setItem("striverse-theme", next ? "light" : "dark");
          }}>
            <span className="reference-sun">☼</span>
            <span className="reference-theme-knob">{isLight ? "☀" : "☾"}</span>
          </button>
          <Link href="/login" className="reference-wallet">Connect Wallet</Link>
          <Link href={appHref} className="reference-launch">Launch App <span>↗</span></Link>
        </div>

        {searchOpen && <div className="reference-search-popover">
          <input autoFocus placeholder="Search STRIVERSE..." aria-label="Search STRIVERSE" />
          <span>⌕</span>
        </div>}
      </nav>
      <style jsx global>{`
        @media (min-width: 1201px) {
          .reference-nav {
            grid-template-columns: 320px minmax(0, 1fr) auto !important;
            gap: 12px !important;
          }
          .reference-brand {
            gap: 10px !important;
          }
          .reference-brand-wordmark {
            width: 240px !important;
            height: 44px !important;
          }
          .reference-nav-links {
            justify-content: flex-start !important;
            gap: 16px !important;
          }
          .reference-nav-actions {
            gap: 8px !important;
          }
        }
        @media (max-width: 1200px) and (min-width: 901px) {
          .reference-nav {
            grid-template-columns: 300px minmax(0, 1fr) auto !important;
            gap: 10px !important;
          }
          .reference-nav-links {
            gap: 12px !important;
          }
        }
      `}</style>
    </header>
  );
}
