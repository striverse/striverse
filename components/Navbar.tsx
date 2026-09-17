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
        <Link href="/" className="reference-brand" aria-label="STRIVERSE home">
          <span className="reference-brand-icon-clip" style={{ width: 54, height: 40, overflow: "hidden", display: "block", flex: "0 0 auto", position: "relative", background: "transparent" }}>
            <Image src="/striverse-logo-only.png" alt="" width={58} height={58} priority className="reference-brand-icon" style={{ position: "absolute", left: 0, top: 0, width: 54, height: 54, maxWidth: "none", objectFit: "contain", mixBlendMode: "screen" }} />
          </span>
          <Image src="/applogo1.png" alt="STRIVERSE" width={290} height={53} priority className="reference-brand-wordmark" />
        </Link>

        <div className="reference-nav-links">
          <a className="is-active" href="#">Home</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#tokenomics">Tokenomics</a>
          <a href="#community">Community</a>
          <div className="reference-more">
            <button type="button" onClick={() => setMoreOpen((value) => !value)} aria-expanded={moreOpen}>
              More <span className={`reference-chevron ${moreOpen ? "open" : ""}`} />
            </button>
            {moreOpen && (
              <div className="reference-more-menu">
                <a href="#staking" onClick={() => setMoreOpen(false)}>Staking</a>
                <a href="#vesting" onClick={() => setMoreOpen(false)}>Vesting</a>
                <a href="#airdrop" onClick={() => setMoreOpen(false)}>Airdrop</a>
                <a href="#roadmap" onClick={() => setMoreOpen(false)}>Roadmap</a>
              </div>
            )}
          </div>
        </div>

        <div className="reference-nav-actions">
          <label className="reference-search-bar" style={{ display: "flex", alignItems: "center", width: 180, height: 42, padding: "0 12px", gap: 8, border: "1px solid rgba(152,173,220,.38)", borderRadius: 22, background: "rgba(22,31,62,.72)", flex: "0 0 auto" }}>
            <span className="reference-search-icon" />
            <input type="search" placeholder="Search STRIVERSE..." aria-label="Search STRIVERSE" style={{ width: "100%", minWidth: 0, border: 0, outline: 0, background: "transparent", color: "white", font: "inherit", fontSize: 13 }} />
          </label>

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
      </nav>
    </header>
  );
}
