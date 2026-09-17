"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import { ArrowLeft, Bell, Check, ChevronRight, Copy, Gift, History, Home, LockKeyhole, LogOut, QrCode, ShieldCheck, Sparkles, Upload, UserRound, Wallet, X, RefreshCw } from "lucide-react";

const themes = [
  { name: "Blue Nebula", accent: "#5ee7ff", accent2: "#7c4dff", bg: "#040713", glow: "rgba(69,183,255,.24)" },
  { name: "Violet Pulse", accent: "#c084fc", accent2: "#7c3aed", bg: "#080411", glow: "rgba(168,85,247,.25)" },
  { name: "Cyan Aurora", accent: "#67e8f9", accent2: "#14b8a6", bg: "#02100f", glow: "rgba(20,184,166,.23)" },
  { name: "Solar Amber", accent: "#fbbf24", accent2: "#f97316", bg: "#120a02", glow: "rgba(245,158,11,.22)" },
  { name: "Emerald Core", accent: "#86efac", accent2: "#10b981", bg: "#03100a", glow: "rgba(16,185,129,.22)" },
  { name: "Crimson Rift", accent: "#fb7185", accent2: "#e11d48", bg: "#120306", glow: "rgba(225,29,72,.22)" },
];

const TEST_MODE = process.env.NEXT_PUBLIC_STRIVERSE_TEST_MODE === "true";

const packages = [
  { name: "LUNA", usdt: 100, stv: 100000, planet: "🌙" },
  { name: "AURORA", usdt: 300, stv: 300000, planet: "🪐" },
  { name: "ANDROMEDA", usdt: 500, stv: 500000, planet: "🌌" },
  { name: "ORION", usdt: 700, stv: 700000, planet: "⭐" },
  { name: "CELESTIA", usdt: 1000, stv: 1000000, planet: "✨" },
];

const demoWords = ["lunar", "signal", "cosmic", "orbit", "stellar", "pulse", "nebula", "vector", "quantum", "galaxy", "aurora", "voyage"];
const recoveryWords = ["nova","orbit","stellar","cosmic","luna","aurora","orion","nebula","celestial","quantum","eclipse","galaxy","vertex","pulse","zenith","comet","meteor","solstice","equinox","infinity","radiant","voyager","astral","horizon","phoenix","spectrum","gravity","zen","matrix","vortex","prism","atlas"];

function format(n: number) { return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n); }

export default function StriverseApp() {
  const [themeIndex, setThemeIndex] = useState(0);
  const [screen, setScreen] = useState("home");
  const [auth, setAuth] = useState("welcome");
  const [userName, setUserName] = useState("Striverse User");
  const [referral, setReferral] = useState("");
  const [phrase, setPhrase] = useState<string[]>([]);
  const [phraseConfirm, setPhraseConfirm] = useState<string[]>([]);
  const [showPhrase, setShowPhrase] = useState(false);
  const [selected, setSelected] = useState(packages[0]);
  const [network, setNetwork] = useState("TRC20");
  const [paymentStep, setPaymentStep] = useState<"details" | "payment" | "proof" | "pending" | "success">("details");
  const [copied, setCopied] = useState(false);
  const [referralUSDT, setReferralUSDT] = useState(25);
  const [convertOpen, setConvertOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [txHash, setTxHash] = useState("");
  const [resetRequested, setResetRequested] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetPhone, setResetPhone] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newRecoveryPhrase, setNewRecoveryPhrase] = useState<string[]>([]);
  const [newRecoveryConfirm, setNewRecoveryConfirm] = useState<string[]>([]);
  const [resetStage, setResetStage] = useState<"request" | "pending" | "code" | "phrase" | "complete">("request");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [launchMessage, setLaunchMessage] = useState("");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const key = "striverse-app-launch";
    const count = Number(localStorage.getItem(key) || "0") + 1;
    localStorage.setItem(key, String(count));
    const idx = (count - 1) % themes.length;
    setThemeIndex(idx);
    setLaunchMessage(`Theme ${idx + 1} · ${themes[idx].name}`);
    const t = window.setTimeout(() => setLaunchMessage(""), 1800);
    return () => window.clearTimeout(t);
  }, []);

  const theme = themes[themeIndex];
  const walletAddress = process.env.NEXT_PUBLIC_STRIVERSE_TEST_PAYMENT_ADDRESS || "TEST_ONLY_PAYMENT_ADDRESS";

  async function submitRecoveryRequest() {
    const email = resetEmail.trim().toLowerCase();
    const phone = resetPhone.trim();
    if (!email || !phone) {
      setResetError("Enter your registered email and mobile number.");
      return;
    }
    setResetLoading(true);
    setResetError("");
    try {
      const res = await fetch("/api/auth/recovery/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setResetError(data.message || "Unable to submit recovery request.");
        return;
      }
      setResetRequested(true);
      setResetStage("pending");
    } catch {
      setResetError("Unable to submit recovery request. Please try again.");
    } finally {
      setResetLoading(false);
    }
  }

  function generateNewRecoveryPhrase() {
    const words = [...recoveryWords];
    const result: string[] = [];
    while (result.length < 12) {
      const values = new Uint32Array(1);
      crypto.getRandomValues(values);
      const index = values[0] % words.length;
      result.push(words.splice(index, 1)[0]);
    }
    setNewRecoveryPhrase(result);
    setNewRecoveryConfirm([]);
    setResetError("");
  }

  async function verifyRecoveryResetCode() {
    const email = resetEmail.trim().toLowerCase();
    const code = resetCode.trim();
    if (!email || !code) {
      setResetError("Enter your registered email and reset code.");
      return;
    }
    setResetLoading(true);
    setResetError("");
    try {
      const res = await fetch("/api/auth/recovery/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resetCode: code }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setResetError(data.message || "Invalid or expired reset code.");
        return;
      }
      generateNewRecoveryPhrase();
      setResetStage("phrase");
    } catch {
      setResetError("Unable to verify the reset code. Please try again.");
    } finally {
      setResetLoading(false);
    }
  }

  async function completeRecoveryReset() {
    const phraseText = newRecoveryPhrase.join(" ");
    if (newRecoveryPhrase.length !== 12 || newRecoveryConfirm.join(" ") !== phraseText) {
      setResetError("Confirm all 12 recovery words in the correct order.");
      return;
    }
    setResetLoading(true);
    setResetError("");
    try {
      const res = await fetch("/api/auth/recovery/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim().toLowerCase(), resetCode: resetCode.trim(), recoveryPhrase: phraseText }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setResetError(data.message || "Unable to save your new recovery phrase.");
        return;
      }
      setResetStage("complete");
    } catch {
      setResetError("Unable to complete recovery. Please try again.");
    } finally {
      setResetLoading(false);
    }
  }

  if (showSplash) {
    return (
      <div className="striverse-splash" role="img" aria-label="Striverse splash screen">
        <div className="striverse-splash-art">
          <Image
            src="/striverse-final-splash.png"
            alt="STRIVERSE — STRIVE • GROW • BELONG"
            fill
            priority
            sizes="100vw"
            className="striverse-splash-image"
          />
          <button
            type="button"
            aria-label="Explore Striverse"
            className="striverse-splash-hotspot"
            onClick={() => setShowSplash(false)}
          />
        </div>
      </div>
    );
  }

  function createPhrase() {
    setPhrase([...demoWords].sort(() => Math.random() - .5));
    setAuth("phrase");
  }

  function finishSignup() {
    if (!referral.trim()) return;
    setUserName("Striverse User");
    setAuth("done");
  }

  function copyAddress() {
    navigator.clipboard?.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  const stvPreview = selected.usdt * 1000;

  if (auth !== "done") return <AuthFlow auth={auth} setAuth={setAuth} referral={referral} setReferral={setReferral} phrase={phrase} phraseConfirm={phraseConfirm} setPhraseConfirm={setPhraseConfirm} showPhrase={showPhrase} setShowPhrase={setShowPhrase} createPhrase={createPhrase} finishSignup={finishSignup} theme={theme} resetRequested={resetRequested} setResetRequested={setResetRequested} resetEmail={resetEmail} setResetEmail={setResetEmail} resetPhone={resetPhone} setResetPhone={setResetPhone} resetLoading={resetLoading} resetError={resetError} setResetError={setResetError} resetCode={resetCode} setResetCode={setResetCode} verifyRecoveryResetCode={verifyRecoveryResetCode} newRecoveryPhrase={newRecoveryPhrase} setNewRecoveryPhrase={setNewRecoveryPhrase} newRecoveryConfirm={newRecoveryConfirm} setNewRecoveryConfirm={setNewRecoveryConfirm} completeRecoveryReset={completeRecoveryReset} submitRecoveryRequest={submitRecoveryRequest} resetStage={resetStage} setResetStage={setResetStage} />;

  return (
    <div className="str-app" style={{ "--a": theme.accent, "--b": theme.accent2, "--g": theme.glow, "--bg": theme.bg } as React.CSSProperties}>
      <div className="cosmic-noise" /><div className="orb orb-a" /><div className="orb orb-b" /><div className="stars" />
      <header className="app-header">
        <div className="brand"><Image src="/striverse-symbol.png" width={42} height={42} alt="Striverse" /><div><strong>STRIVERSE</strong><span>ENTER THE NEXT DIMENSION</span></div></div>
        <button className="icon-btn"><Bell size={19}/><i/></button>
      </header>

      <main className="mobile-main">
        <AnimatePresence mode="wait">
          {screen === "home" && <HomeScreen key="home" userName={userName} theme={theme} referralUSDT={referralUSDT} onBuy={() => {setScreen("buy"); setPaymentStep("details")}} onReferral={() => setScreen("referral")} onWallet={() => setScreen("wallet")} />}
          {screen === "buy" && <BuyScreen key="buy" selected={selected} setSelected={setSelected} network={network} setNetwork={setNetwork} paymentStep={paymentStep} setPaymentStep={setPaymentStep} stvPreview={stvPreview} copied={copied} copyAddress={copyAddress} proofFile={proofFile} setProofFile={setProofFile} txHash={txHash} setTxHash={setTxHash} onBack={() => setScreen("home")} />}
          {screen === "history" && <HistoryScreen key="history" />}
          {screen === "referral" && <ReferralScreen key="referral" referralUSDT={referralUSDT} setReferralUSDT={setReferralUSDT} convertOpen={convertOpen} setConvertOpen={setConvertOpen} withdrawOpen={withdrawOpen} setWithdrawOpen={setWithdrawOpen} />}
          {screen === "wallet" && <WalletScreen key="wallet" />}
          {screen === "profile" && <ProfileScreen key="profile" userName={userName} onLogout={() => setAuth("welcome")} onReset={() => setAuth("forgot")} />}
        </AnimatePresence>
      </main>

      {launchMessage && <motion.div className="theme-toast" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}}>{launchMessage}</motion.div>}
      <nav className="bottom-nav">
        <Nav active={screen === "home"} icon={<Home size={19}/>} label="Home" onClick={() => setScreen("home")} />
        <Nav active={screen === "buy"} icon={<Sparkles size={19}/>} label="Buy STV" onClick={() => {setScreen("buy"); setPaymentStep("details")}} />
        <Nav active={screen === "history"} icon={<History size={19}/>} label="History" onClick={() => setScreen("history")} />
        <Nav active={screen === "profile"} icon={<UserRound size={19}/>} label="Profile" onClick={() => setScreen("profile")} />
      </nav>
    </div>
  );
}

function AuthFlow({ auth, setAuth, referral, setReferral, phrase, phraseConfirm, setPhraseConfirm, showPhrase, setShowPhrase, createPhrase, finishSignup, theme, resetRequested, setResetRequested, resetEmail, setResetEmail, resetPhone, setResetPhone, resetLoading, resetError, setResetError, resetCode, setResetCode, verifyRecoveryResetCode, newRecoveryPhrase, setNewRecoveryPhrase, newRecoveryConfirm, setNewRecoveryConfirm, completeRecoveryReset, submitRecoveryRequest, resetStage, setResetStage }: any) {
  return <div className="auth-shell" style={{ "--a": theme.accent, "--b": theme.accent2, "--g": theme.glow, "--bg": theme.bg } as React.CSSProperties}><div className="stars"/><div className="auth-glow"/>
    <div className="auth-logo"><Image src="/striverse-auth-transparent.png" width={672} height={530} alt="STRIVERSE — STRIVE • GROW • BELONG" priority /></div>
    {auth === "welcome" && <div className="auth-card"><p className="eyebrow">WELCOME TO STRIVERSE</p><h1>Your next dimension<br/><em>starts here.</em></h1><p>Secure account access with a recovery phrase and a verified Partner Program code.</p><button className="primary" onClick={() => setAuth("signup")}>Create Account <ChevronRight size={18}/></button><button className="secondary" onClick={() => setAuth("login")}>Sign In</button></div>}
    {auth === "signup" && <div className="auth-card"><Back onClick={() => setAuth("welcome")}/><p className="eyebrow">CREATE ACCOUNT</p><h2>Join Striverse</h2><p className="muted">Partner Program code is mandatory for every new account.</p><input placeholder="Full name"/><input placeholder="Email address" type="email"/><input placeholder="Partner Program code *" value={referral} onChange={e => setReferral(e.target.value.toUpperCase())}/><label className="check"><input type="checkbox" defaultChecked/> I agree to the Terms & Privacy Policy</label><button className="primary" disabled={!referral.trim()} onClick={createPhrase}>Continue to Wallet <ChevronRight size={18}/></button></div>}
    {auth === "phrase" && <div className="auth-card"><Back onClick={() => setAuth("signup")}/><p className="eyebrow">SECURE YOUR ACCOUNT</p><h2>Your 12-word recovery phrase</h2><p className="muted">Save it offline. Striverse will never display it to an admin.</p><div className="phrase-grid">{phrase.map((w: string, i: number) => <div key={w}><small>{i+1}</small>{showPhrase ? w : "••••••"}</div>)}</div><button className="secondary" onClick={() => setShowPhrase(!showPhrase)}>{showPhrase ? "Hide Phrase" : "Reveal Phrase"}</button><button className="primary" onClick={() => setAuth("confirm")}>I Saved It <Check size={18}/></button></div>}
    {auth === "confirm" && <div className="auth-card"><Back onClick={() => setAuth("phrase")}/><p className="eyebrow">CONFIRM PHRASE</p><h2>Confirm your recovery phrase</h2><p className="muted">Tap the words in the correct order.</p><div className="phrase-grid selectable">{[...phrase].sort(() => Math.random()-.5).map((w: string) => <button key={w} onClick={() => setPhraseConfirm((p: string[]) => p.includes(w) ? p.filter(x=>x!==w) : [...p,w])}>{w}</button>)}</div><div className="confirm-line">{phraseConfirm.map((w: string, i: number) => <span key={i}>{i+1}. {w}</span>)}</div><button className="primary" disabled={phraseConfirm.length !== phrase.length || phraseConfirm.join(" ") !== phrase.join(" ")} onClick={finishSignup}>Activate Account <Check size={18}/></button></div>}
    {auth === "login" && <div className="auth-card"><Back onClick={() => setAuth("welcome")}/><p className="eyebrow">SIGN IN</p><h2>Welcome back</h2><p className="muted">Use your registered email and recovery phrase.</p><input placeholder="Email address" type="email"/><input placeholder="12-word recovery phrase" type="password"/><button className="primary" onClick={() => setAuth("done")}>Sign In <ChevronRight size={18}/></button><button className="link-btn" onClick={() => setAuth("forgot")}>Forgot recovery phrase?</button></div>}
    {auth === "forgot" && <div className="auth-card"><Back onClick={() => setAuth("login")}/><LockKeyhole size={42} color={theme.accent}/><p className="eyebrow">RECOVERY</p><h2>{resetStage === "phrase" || resetStage === "complete" ? "Create a new recovery phrase" : "Forgot your phrase?"}</h2>{resetStage === "request" && <><p className="muted">Enter your registered email and mobile number. An admin will review the request. Your recovery phrase is never shown to the admin.</p><input placeholder="Registered email address" type="email" value={resetEmail} onChange={e=>setResetEmail(e.target.value)}/><input placeholder="Registered mobile number" type="tel" value={resetPhone} onChange={e=>setResetPhone(e.target.value)}/>{resetError && <p className="error-text">{resetError}</p>}<button className="danger" disabled={resetLoading || !resetEmail.trim() || !resetPhone.trim()} onClick={submitRecoveryRequest}>{resetLoading ? "Submitting…" : "Request Admin Reset"}</button></>}
      {resetStage === "pending" && <><p className="muted">Your request is waiting for admin verification. After approval, enter the one-time reset code you receive from the trusted support channel.</p><div className="status-box success"><Check size={20}/> Reset request submitted.<br/><small>Admin verification is pending.</small></div><button className="primary" onClick={() => { setResetStage("code"); setResetError(""); }}>I Have My Reset Code</button></>}
      {resetStage === "code" && <><p className="muted">Enter the one-time reset code provided by the verified admin. The code does not reveal your old recovery phrase.</p><input placeholder="One-time reset code" value={resetCode} onChange={e=>setResetCode(e.target.value)}/>{resetError && <p className="error-text">{resetError}</p>}<button className="primary" disabled={resetLoading || !resetCode.trim()} onClick={verifyRecoveryResetCode}>{resetLoading ? "Verifying…" : "Verify Reset Code"}</button></>}
      {resetStage === "phrase" && <><p className="muted">Your new recovery phrase has been generated on this device. Save it offline. Striverse never shows it to admins.</p><div className="phrase-grid">{newRecoveryPhrase.map((w: string, i: number) => <div key={`${w}-${i}`}><small>{i+1}</small>{w}</div>)}</div><p className="muted">Confirm the 12 words in the same order.</p><div className="phrase-grid selectable">{[...newRecoveryPhrase].sort(() => Math.random()-.5).map((w: string, i: number) => <button key={`${w}-${i}`} onClick={() => setNewRecoveryConfirm((p: string[]) => p.includes(w) ? p.filter(x=>x!==w) : [...p,w])}>{w}</button>)}</div><div className="confirm-line">{newRecoveryConfirm.map((w: string, i: number) => <span key={i}>{i+1}. {w}</span>)}</div>{resetError && <p className="error-text">{resetError}</p>}<button className="primary" disabled={resetLoading || newRecoveryConfirm.length !== 12 || newRecoveryConfirm.join(" ") !== newRecoveryPhrase.join(" ")} onClick={completeRecoveryReset}>{resetLoading ? "Saving…" : "Save New Recovery Phrase"}</button></>}
      {resetStage === "complete" && <><p className="muted">Your new recovery phrase is saved. Keep it offline and private. The one-time reset code can no longer be used.</p><div className="status-box success"><Check size={20}/> Recovery completed successfully.</div><button className="primary" onClick={() => setAuth("login")}>Continue to Sign In <ChevronRight size={18}/></button></>}
    </div>}
  </div>
}

function HomeScreen({userName, onBuy, onReferral, onWallet}: any) { return <motion.section className="screen" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}><div className="welcome-row"><div><span className="muted">Welcome back</span><h1>{userName}</h1></div><div className="avatar">S</div></div><div className="balance-card"><div className="balance-top"><span>Locked STV Balance</span><LockKeyhole size={16}/></div><strong>250,000.00 <small>STV</small></strong><div className="usd">≈ $250.00 USDT</div><div className="balance-line"><span>Purchased</span><span>250,000 STV</span></div></div><div className="quick-grid"><Quick icon={<Sparkles/>} label="Buy STV" onClick={onBuy}/><Quick icon={<Gift/>} label="Partner Program" onClick={onReferral}/><Quick icon={<Wallet/>} label="Wallet" onClick={onWallet}/><Quick icon={<History/>} label="Orders" onClick={() => {}}/></div><div className="promo"><div><span>STRIVERSE COSMIC PACKAGES</span><h3>Choose your<br/><b>next dimension.</b></h3><button onClick={onBuy}>Explore Packages <ChevronRight size={15}/></button></div><div className="planet-art">◉</div></div><div className="section-head"><h3>Partner Reward</h3><span className="pill green">+25 USDT</span></div><div className="reward-card"><div className="reward-icon"><Gift size={22}/></div><div><strong>Available after 24 hours</strong><p>Partner reward is withdrawable or convertible to locked STV.</p></div><ChevronRight size={18}/></div></motion.section> }

function BuyScreen({selected,setSelected,network,setNetwork,paymentStep,setPaymentStep,stvPreview,copied,copyAddress,onBack,proofFile,setProofFile,txHash,setTxHash}: any) { return <motion.section className="screen" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}><Back onClick={onBack}/><div className="title-row"><div><span className="muted">STRIVERSE PRESALE</span><h1>Buy STV</h1></div><div className="live-dot">LIVE</div></div>{paymentStep === "details" && <><p className="muted">Select a cosmic package to continue.</p><div className="package-list">{packages.map(p => <button className={`package ${selected.name===p.name?"active":""}`} key={p.name} onClick={() => setSelected(p)}><span className="package-planet">{p.planet}</span><span><b>{p.name}</b><small>{p.usdt} USDT · {format(p.stv)} STV</small></span><ChevronRight size={18}/></button>)}</div><div className="detail-card"><span>You pay</span><strong>{selected.usdt} USDT</strong><span>You receive</span><strong>{format(selected.stv)} STV <i>LOCKED</i></strong></div><button className="primary" onClick={() => setPaymentStep("payment")}>Continue to Payment <ChevronRight size={18}/></button></>}{paymentStep === "payment" && <><div className="payment-card"><div className="qr"><QRCode value={`usdt:${walletAddressStatic()}?amount=${selected.usdt}`} size={118} bgColor="#ffffff" fgColor="#050816"/><span>SCAN TO PAY</span></div><div className="pay-amount">Send exactly <b>{selected.usdt} USDT</b></div><select value={network} onChange={e=>setNetwork(e.target.value)}><option>TRC20</option><option>BEP20</option><option>ERC20</option></select><div className="address"><span>{walletAddressStatic()}</span><button onClick={copyAddress}>{copied?<Check size={17}/>:<Copy size={17}/>}</button></div><div className="wallet-buttons"><button>🦊 MetaMask</button><button>🔷 Trust Wallet</button></div><p className="warning">Send only USDT on {network}. Wrong network may result in loss of funds.</p></div><button className="primary" onClick={() => setPaymentStep("proof")}>I Have Sent USDT <Check size={18}/></button></>}{paymentStep === "proof" && <><div className="proof-card"><div className="proof-summary"><span>Package <b>{selected.name}</b></span><span>Amount <b>{selected.usdt} USDT</b></span><span>STV <b>{format(stvPreview)}</b></span></div><label className="upload"><Upload size={28}/><b>{proofFile ? proofFile.name : "Upload transaction screenshot"}</b><small>PNG, JPG up to 8MB · tap to choose</small><input type="file" accept="image/png,image/jpeg" onChange={e=>setProofFile(e.target.files?.[0] || null)} style={{display:"none"}}/></label><input placeholder="Transaction hash *" value={txHash} onChange={e=>setTxHash(e.target.value)} /><button
  className="primary"
  disabled={!proofFile || !txHash.trim()}
  onClick={async () => {
    if (!proofFile || !txHash.trim()) return;

    try {
      const formData = new FormData();
      formData.append("usdtAmount", String(selected.usdt));
      formData.append("packageName", selected.name);
      formData.append("network", network);
      formData.append("txHash", txHash.trim());
      formData.append("walletAddress", walletAddressStatic());
      formData.append("proofImage", proofFile);

      const response = await fetch("/api/purchase/create", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok || data.success !== true) {
        const message =
          data.message ||
          data.error ||
          "Payment could not be submitted. Please try again.";

        window.alert(message);
        return;
      }

      setPaymentStep("pending");
    } catch (error) {
      console.error("Payment submission failed:", error);
      window.alert("Unable to submit payment. Please check your connection and try again.");
    }
  }}
>
  Submit Payment <ChevronRight size={18}/>
</button></div></>}{paymentStep === "pending" && <div className="center-card"><div className="hourglass"><RefreshCw size={38}/></div><h2>Payment Under Review</h2><p>Your payment proof has been submitted. Admin verification is pending.</p><div className="order-mini"><span>Order</span><b>#STV-{selected.usdt}001</b><span>Status</span><i className="pill amber">PENDING</i></div>{TEST_MODE && <button className="primary" onClick={() => setPaymentStep("success")}>Test: Admin Approval</button>}</div>}{paymentStep === "success" && <div className="center-card success-screen"><div className="success-icon"><Check size={46}/></div><h2>Purchase Successful!</h2><p>{format(selected.stv)} STV has been added to your <b>locked</b> balance.</p><div className="order-mini"><span>Package</span><b>{selected.name}</b><span>USDT</span><b>{selected.usdt}</b><span>STV Added</span><b>{format(selected.stv)}</b></div><button className="primary" onClick={onBack}>Back to Home</button></div>}</motion.section> }

function HistoryScreen(){return <motion.section className="screen" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}><div className="title-row"><div><span className="muted">YOUR ACTIVITY</span><h1>My Orders</h1></div><History/></div><div className="tabs"><span className="active">All</span><span>Pending</span><span>Approved</span><span>Rejected</span></div>{packages.slice(0,3).map((p,i)=><div className="order-card" key={p.name}><span className="mini-planet">{p.planet}</span><div><b>{p.name}</b><small>#{"STV2505"}{(i+1)}81234</small><small>{format(p.stv)} STV · {p.usdt} USDT</small></div><span className={`pill ${i===0?"amber":"green"}`}>{i===0?"PENDING":"APPROVED"}</span></div>)}</motion.section>}

function ReferralScreen({referralUSDT,setReferralUSDT,convertOpen,setConvertOpen,withdrawOpen,setWithdrawOpen}: any){return <motion.section className="screen" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}><Back onClick={()=>setConvertOpen(false)}/><div className="title-row"><div><span className="muted">REWARD CENTER</span><h1>Partner Program</h1></div><Gift/></div><div className="ref-code"><span>MY PARTNER CODE</span><b>STV7X9K2</b><button onClick={()=>navigator.clipboard?.writeText("STV7X9K2")}><Copy size={16}/> Copy</button></div><div className="ref-balance"><span>Available Partner USDT</span><strong>{referralUSDT.toFixed(2)} <small>USDT</small></strong><p>Unlocks 24 hours after eligible activity.</p></div><div className="action-row"><button onClick={()=>setWithdrawOpen(true)}>Withdraw</button><button onClick={()=>setConvertOpen(true)}>Convert to STV</button></div><div className="info-card"><ShieldCheck size={21}/><div><b>Purchased STV stays locked</b><p>Only Partner USDT can be withdrawn or converted to locked STV.</p></div></div>{convertOpen&&<div className="modal"><div><X className="close" onClick={()=>setConvertOpen(false)}/><h3>Convert Partner USDT</h3><p>25 USDT → <b>25,000 STV</b> at 1 USDT = 1,000 STV.</p><button className="primary" onClick={()=>{setReferralUSDT(0);setConvertOpen(false)}}>Confirm Conversion</button></div></div>}{withdrawOpen&&<div className="modal"><div><X className="close" onClick={()=>setWithdrawOpen(false)}/><h3>Withdraw Partner USDT</h3><input placeholder="USDT wallet address"/><button className="primary" onClick={()=>setWithdrawOpen(false)}>Submit Withdrawal</button></div></div>}</motion.section>}

function WalletScreen(){return <motion.section className="screen" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}><Back onClick={()=>{}}/><span className="muted">SECURE WALLET</span><h1>My Wallet</h1><div className="wallet-hero"><Wallet size={25}/><span>Total Locked STV</span><strong>250,000.00 STV</strong><small>≈ $250.00 USDT</small></div><div className="wallet-row"><div><span>Locked</span><b>250,000 STV</b></div><div><span>Unlocked</span><b>0 STV</b></div></div><div className="info-card"><LockKeyhole size={20}/><div><b>STV is locked</b><p>Purchased STV cannot be withdrawn. Referral rewards are handled separately in your reward wallet.</p></div></div></motion.section>}

function ProfileScreen({userName,onLogout,onReset}: any){return <motion.section className="screen" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}><div className="profile-head"><div className="big-avatar">S</div><div><h2>{userName}</h2><span className="muted">user@striverse.app</span></div></div>{[[UserRound,"Personal Information"],[ShieldCheck,"Security"],[LockKeyhole,"Recovery Phrase"],[Bell,"Notifications"]].map(([Icon,label]: any)=><button className="menu-item" key={label} onClick={label==='Recovery Phrase'?onReset:undefined}><Icon size={18}/><span>{label}</span><ChevronRight size={17}/></button>)}<button className="menu-item logout" onClick={onLogout}><LogOut size={18}/><span>Sign Out</span></button></motion.section>}

function Nav({active,icon,label,onClick}:any){return <button className={active?"nav-item active":"nav-item"} onClick={onClick}>{icon}<span>{label}</span></button>}
function Quick({icon,label,onClick}:any){return <button className="quick" onClick={onClick}>{icon}<span>{label}</span></button>}
function Back({onClick}:any){return <button className="back" onClick={onClick}><ArrowLeft size={19}/></button>}
function walletAddressStatic(){return "TUXHjD9eY8Jtcn6n3KJQd1m7O3gK"}














