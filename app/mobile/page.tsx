"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  Gift,
  History,
  Home,
  LockKeyhole,
  Menu,
  RefreshCw,
  Send,
  Sparkles,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const packages = [
  { name: "LUNA", usdt: 100, stv: 100000, icon: "☾", accent: "#7dd3fc" },
  { name: "AURORA", usdt: 300, stv: 300000, icon: "✦", accent: "#a78bfa" },
  { name: "ANDROMEDA", usdt: 500, stv: 500000, icon: "◉", accent: "#22d3ee" },
  { name: "ORION", usdt: 700, stv: 700000, icon: "✧", accent: "#c084fc" },
  { name: "CELESTIA", usdt: 1000, stv: 1000000, icon: "◇", accent: "#f0abfc" },
];

const themes = [
  { name: "Violet Nova", primary: "#8b5cf6", secondary: "#06b6d4", glow: "#7c3aed" },
  { name: "Arctic Pulse", primary: "#38bdf8", secondary: "#22d3ee", glow: "#0284c7" },
  { name: "Solar Gold", primary: "#f59e0b", secondary: "#fbbf24", glow: "#d97706" },
  { name: "Emerald Rift", primary: "#10b981", secondary: "#34d399", glow: "#059669" },
  { name: "Crimson Orbit", primary: "#f43f5e", secondary: "#fb7185", glow: "#be123c" },
  { name: "Silver Eclipse", primary: "#e5e7eb", secondary: "#94a3b8", glow: "#64748b" },
];

const paymentAddress = process.env.NEXT_PUBLIC_STRIVERSE_TEST_PAYMENT_ADDRESS || "TEST_ONLY_PAYMENT_ADDRESS";
const TEST_MODE = process.env.NEXT_PUBLIC_STRIVERSE_TEST_MODE === "true";
const paymentNetworks = ["TRC20", "BEP20", "ERC20"];

type Tab = "home" | "buy" | "history" | "profile";

type Order = { id: string; package: string; usdt: number; stv: number; status: "PENDING" | "APPROVED" | "REJECTED"; date: string };

export default function MobileApp() {
  const [themeIndex, setThemeIndex] = useState(0);
  const [tab, setTab] = useState<Tab>("home");
  const [selected, setSelected] = useState(packages[0]);
  const [screen, setScreen] = useState<"dashboard" | "packages" | "payment" | "submitted" | "success" | "signup" | "login">("dashboard");
  const [referral, setReferral] = useState("");
  const [copied, setCopied] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wallet, setWallet] = useState<"MetaMask" | "Trust Wallet" | "">("");

  const theme = themes[themeIndex];

  useEffect(() => {
    const raw = window.localStorage.getItem("striverse-launch-theme");
    const next = raw ? (Number(raw) + 1) % themes.length : 0;
    window.localStorage.setItem("striverse-launch-theme", String(next));
    setThemeIndex(next);
  }, []);

  const currentOrder = useMemo(() => orders[0], [orders]);

  function copyAddress() {
    navigator.clipboard?.writeText(paymentAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function submitProof(txHash: string) {
    const order: Order = {
      id: `STV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      package: selected.name,
      usdt: selected.usdt,
      stv: selected.stv,
      status: "PENDING",
      date: new Date().toLocaleDateString(),
    };
    setOrders((prev) => [order, ...prev]);
    setScreen("submitted");
  }

  function approveDemo() {
    if (!currentOrder) return;
    setOrders((prev) => prev.map((o, i) => (i === 0 ? { ...o, status: "APPROVED" } : o)));
    setScreen("success");
  }

  return (
    <main className="mobile-shell" style={{ "--primary": theme.primary, "--secondary": theme.secondary, "--glow": theme.glow } as React.CSSProperties}>
      <div className="space-stars" />
      <div className="nebula nebula-a" />
      <div className="nebula nebula-b" />

      <div className="phone-frame">
        <header className="topbar">
          <div className="brand-lockup">
            <Image src="/striverse-symbol.png" alt="STRIVERSE" width={42} height={42} className="brand-logo" />
            <div>
              <div className="brand-name">STRIVERSE</div>
              <div className="brand-sub">{theme.name}</div>{TEST_MODE && <div className="test-badge">TEST MODE</div>}
            </div>
          </div>
          <button className="icon-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
        </header>

        <AnimatePresence mode="wait">
          {screen === "dashboard" && <Dashboard onBuy={() => { setTab("buy"); setScreen("packages"); }} orders={orders} setScreen={setScreen} />}
          {screen === "packages" && <PackageScreen selected={selected} setSelected={setSelected} onContinue={() => setScreen("payment")} />}
          {screen === "payment" && <PaymentScreen selected={selected} copied={copied} copyAddress={copyAddress} onSubmit={submitProof} wallet={wallet} setWallet={setWallet} />}
          {screen === "submitted" && <PendingScreen order={currentOrder} onDemoApprove={approveDemo} onHome={() => { setTab("home"); setScreen("dashboard"); }} />}
          {screen === "success" && <SuccessScreen order={currentOrder} onHome={() => { setTab("home"); setScreen("dashboard"); }} />}
          {screen === "signup" && <SignupScreen referral={referral} setReferral={setReferral} onBack={() => setScreen("dashboard")} />}
          {screen === "login" && <LoginScreen onBack={() => setScreen("dashboard")} />}
        </AnimatePresence>

        <nav className="bottom-nav">
          <NavItem icon={<Home size={19} />} label="Home" active={tab === "home"} onClick={() => { setTab("home"); setScreen("dashboard"); }} />
          <NavItem icon={<Sparkles size={19} />} label="Buy STV" active={tab === "buy"} onClick={() => { setTab("buy"); setScreen("packages"); }} />
          <NavItem icon={<History size={19} />} label="History" active={tab === "history"} onClick={() => { setTab("history"); setScreen("dashboard"); }} />
          <NavItem icon={<UserRound size={19} />} label="Profile" active={tab === "profile"} onClick={() => { setTab("profile"); setScreen("dashboard"); }} />
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)}>
              <motion.aside className="drawer" initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }} onClick={(e) => e.stopPropagation()}>
                <div className="drawer-head"><b>STRIVERSE</b><button className="icon-button" onClick={() => setMenuOpen(false)}><X size={18} /></button></div>
                <button onClick={() => { setScreen("signup"); setMenuOpen(false); }}><Gift size={18} /> Sign Up <ChevronRight size={16} /></button>
                <button onClick={() => { setScreen("login"); setMenuOpen(false); }}><WalletCards size={18} /> Sign In <ChevronRight size={16} /></button>
                <div className="drawer-note"><LockKeyhole size={16} /> Recovery is one-time admin approved.</div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function Dashboard({ onBuy, orders, setScreen }: { onBuy: () => void; orders: Order[]; setScreen: (s: any) => void }) {
  const pending = orders.find((o) => o.status === "PENDING");
  return <motion.section className="content" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
    <div className="hero-card">
      <div className="eyebrow">WELCOME BACK</div>
      <h1>Enter the next<br /><span>dimension.</span></h1>
      <p>Your Striverse wallet, rewards and STV journey in one place.</p>
      <button className="primary-button" onClick={onBuy}>Explore STV Packages <ArrowRight size={18} /></button>
    </div>

    <div className="balance-grid">
      <div className="stat-card"><span>LOCKED STV</span><strong>500,000</strong><small><LockKeyhole size={12} /> Purchased STV</small></div>
      <div className="stat-card reward"><span>PARTNER USDT</span><strong>25.00</strong><small><Gift size={12} /> Available after 24h</small></div>
    </div>

    <div className="section-title"><b>Quick actions</b><span>Wallet</span></div>
    <div className="action-grid">
      <button className="action-card" onClick={() => setScreen("packages")}><Sparkles /><b>Buy STV</b><small>Choose package</small></button>
      <button className="action-card"><Send /><b>Withdraw</b><small>Partner USDT only</small></button>
      <button className="action-card"><RefreshCw /><b>Convert</b><small>USDT → locked STV</small></button>
    </div>

    {pending && <div className="pending-mini"><div className="spinner" /><div><b>Payment verification pending</b><small>{pending.package} · {pending.usdt} USDT · {pending.id}</small></div><ChevronRight size={18} /></div>}

    <div className="section-title"><b>Partner Program</b><span>Share & earn</span></div>
    <div className="referral-card"><div><small>YOUR PARTNER CODE</small><strong>STV7X4Q</strong></div><button onClick={() => navigator.clipboard?.writeText("STV7X4Q")}><Copy size={17} /></button></div>
  </motion.section>;
}

function PackageScreen({ selected, setSelected, onContinue }: any) {
  return <motion.section className="content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
    <div className="page-heading"><div className="eyebrow">STRIVERSE PRESALE</div><h2>Choose your <span>package</span></h2><p>Every package receives locked STV after payment approval.</p></div>
    <div className="package-list">
      {packages.map((p) => <button key={p.name} className={`package-card ${selected.name === p.name ? "selected" : ""}`} onClick={() => setSelected(p)} style={{ "--package-accent": p.accent } as React.CSSProperties}>
        <div className="planet"><span>{p.icon}</span></div><div className="package-copy"><b>{p.name}</b><strong>{p.usdt.toLocaleString()} <small>USDT</small></strong><span>{p.stv.toLocaleString()} STV <LockKeyhole size={12} /></span></div><div className="check-dot">{selected.name === p.name && <Check size={14} />}</div>
      </button>)}
    </div>
    <div className="selected-summary"><span>Selected</span><b>{selected.name}</b><strong>{selected.usdt.toLocaleString()} USDT</strong></div>
    <button className="primary-button full" onClick={onContinue}>Continue to payment <ArrowRight size={18} /></button>
  </motion.section>;
}

function PaymentScreen({ selected, copied, copyAddress, onSubmit, wallet, setWallet }: any) {
  const [proof, setProof] = useState(false);
  const [network, setNetwork] = useState("TRC20");
  const [txHash, setTxHash] = useState("");
  return <motion.section className="content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
    <div className="page-heading"><div className="eyebrow">PAYMENT</div><h2>Complete your <span>purchase</span></h2><p>Send exactly {selected.usdt.toLocaleString()} USDT using the selected network.</p></div>
    <div className="payment-card"><div className="qr-placeholder"><div className="qr-grid">STRI<br />VERSE</div></div><div className="network-selector">{paymentNetworks.map((n) => <button key={n} className={network === n ? "selected" : ""} onClick={() => setNetwork(n)}>{n}</button>)}</div><div className="address-box"><small>PAYMENT ADDRESS</small><div><span>{paymentAddress}</span><button onClick={copyAddress}>{copied ? <Check size={17} /> : <Copy size={17} />}</button></div></div><div className="wallet-row"><button className={wallet === "MetaMask" ? "selected" : ""} onClick={() => setWallet("MetaMask")}>MetaMask</button><button className={wallet === "Trust Wallet" ? "selected" : ""} onClick={() => setWallet("Trust Wallet")}>Trust Wallet</button></div><div className="input-card compact"><label>Transaction hash *</label><input value={txHash} onChange={(e) => setTxHash(e.target.value)} placeholder="Paste transaction hash" required /></div></div>
    <label className={`upload-box ${proof ? "uploaded" : ""}`}><input type="file" accept="image/*" onChange={() => setProof(true)} hidden />{proof ? <><Check size={22} /><b>Screenshot attached</b><small>Tap to replace</small></> : <><ArrowDownToLine size={22} /><b>Upload transaction screenshot</b><small>Required for admin verification</small></>}</label>
    <button className="primary-button full" disabled={!proof || !wallet || !txHash.trim()} onClick={onSubmit}>Submit for verification <ArrowRight size={18} /></button>
  </motion.section>;
}

function PendingScreen({ order, onDemoApprove, onHome }: any) {
  return <motion.section className="content center-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div className="status-orbit pending"><div className="orbit-ring" /><div className="status-core"><RefreshCw size={34} /></div></div><div className="eyebrow">PAYMENT RECEIVED</div><h2>Verification <span>pending</span></h2><p>Admin is checking your transaction proof. Your purchased STV stays locked until approval.</p>{order && <div className="order-chip"><b>{order.id}</b><span>{order.package} · {order.usdt} USDT</span></div>}{process.env.NEXT_PUBLIC_STRIVERSE_TEST_MODE === "true" && <button className="ghost-button" onClick={onDemoApprove}>Test: Admin approve</button>}<button className="text-button" onClick={onHome}>Back to dashboard</button></motion.section>;
}

function SuccessScreen({ order, onHome }: any) {
  return <motion.section className="content center-screen" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}><div className="status-orbit success"><div className="orbit-ring" /><div className="status-core"><Check size={38} /></div></div><div className="eyebrow">TRANSACTION APPROVED</div><h2>Welcome to <span>Striverse.</span></h2><p>Your purchase has been approved and {order?.stv?.toLocaleString()} STV has been added to your locked balance.</p><div className="success-balance"><small>LOCKED STV</small><strong>{order?.stv?.toLocaleString() || "0"}</strong></div><button className="primary-button full" onClick={onHome}>Go to dashboard <ArrowRight size={18} /></button></motion.section>;
}

function SignupScreen({ referral, setReferral, onBack }: any) {
  const [step, setStep] = useState(1);
  return <motion.section className="content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}><div className="page-heading"><div className="eyebrow">NEW DIMENSION</div><h2>Create your <span>wallet</span></h2><p>Partner code is mandatory. Your recovery phrase is shown once.</p></div>{step === 1 ? <><div className="input-card"><label>Full name</label><input placeholder="Your name" /><label>Email</label><input placeholder="you@example.com" /><label>Referral code *</label><input value={referral} onChange={(e) => setReferral(e.target.value)} placeholder="Enter Partner code" /></div><button className="primary-button full" disabled={!referral.trim()} onClick={() => setStep(2)}>Generate recovery phrase <ArrowRight size={18} /></button></> : <><div className="phrase-card"><div className="eyebrow">SECRET RECOVERY PHRASE</div><div className="phrase-grid">{["orbit", "silver", "nova", "cosmic", "luna", "vector", "stellar", "quantum", "aurora", "matrix", "celestia", "pulse"].map((w, i) => <span key={w}><small>{i + 1}</small>{w}</span>)}</div></div><div className="warning-card"><LockKeyhole size={18} /><span>Never share this phrase. Admin cannot see it. Recovery reset is available only once.</span></div><button className="primary-button full" onClick={onBack}>I saved my phrase <Check size={18} /></button></>}</motion.section>;
}

function LoginScreen({ onBack }: any) {
  return <motion.section className="content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}><div className="page-heading"><div className="eyebrow">WELCOME BACK</div><h2>Sign in to <span>Striverse</span></h2><p>Use your recovery credentials to continue.</p></div><div className="input-card"><label>Email / Wallet ID</label><input placeholder="Enter your email or wallet ID" /><label>Recovery phrase</label><textarea placeholder="Enter your recovery phrase" rows={4} /></div><button className="primary-button full" onClick={onBack}>Sign In <ArrowRight size={18} /></button><div className="warning-card"><LockKeyhole size={18} /><span>Forgot your phrase? Request the one-time admin recovery process.</span></div></motion.section>;
}

function NavItem({ icon, label, active, onClick }: any) { return <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>{icon}<span>{label}</span></button>; }
