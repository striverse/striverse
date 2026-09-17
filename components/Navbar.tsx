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
        <Link href="/" className="reference-brand" aria-label="STRIVERSE home">
          <span
            className="reference-brand-icon-clip"
            style={{ width: 54, height: 43, overflow: "hidden", display: "block", flex: "0 0 auto", position: "relative" }}
          >
            <Image
              src="/striverse-logo-only.png"
              alt=""
              width={58}
              height={52}
              priority
              className="reference-brand-icon"
              style={{ position: "absolute", left: 0, top: 0, width: 54, height: "auto", maxWidth: "none", mixBlendMode: "screen" }}
            />
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

          <div
            className="reference-search-inline"
            style={{
              display: "flex",
              alignItems: "center",
              width: searchOpen ? 150 : 42,
              height: 42,
              overflow: "hidden",
              border: "1px solid rgba(152,173,220,.28)",
              borderRadius: 22,
              background: "rgba(22,31,62,.72)",
              transition: "width .25s ease",
              flex: "0 0 auto",
            }}
          >
            <button
              type="button"
              className="reference-icon-btn"
              aria-label={searchOpen ? "Close search" : "Open search"}
              onClick={() => setSearchOpen((value) => !value)}
              style={{ width: 40, height: 40, minWidth: 40, border: 0, background: "transparent" }}
            >
              <span className="reference-search-icon" />
            </button>
            {searchOpen && (
              <input
                autoFocus
                placeholder="Search..."
                aria-label="Search STRIVERSE"
                style={{ width: 100, border: 0, outline: 0, background: "transparent", color: "white", font: "inherit", fontSize: 13 }}
              />
            )}
          </div>
        </div>

        <div className="reference-nav-actions">
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
