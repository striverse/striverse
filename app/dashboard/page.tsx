"use client";
import toast from "react-hot-toast";
import WelcomeOverlay from "@/components/dashboard/WelcomeOverlay";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "./types";
import Link from "next/link";
import { Bell, LayoutDashboard, ShoppingCart, ReceiptText, Gift, Wallet, ShieldCheck, LogOut, ChevronRight } from "lucide-react";
import BackgroundEffects from "./components/BackgroundEffects";
import PortfolioSection from "./components/PortfolioSection";
import BuyPanel from "./components/BuyPanel";
import BuyModal from "@/components/dashboard/buy-modal/BuyModal";
import ProfileCard from "./components/ProfileCard";
import ReferralDrawer from "./components/ReferralDrawer";
import TransactionsTable from "./components/TransactionsTable";
import DashboardStats from "./components/DashboardStats";
import AnnouncementBanner from "./components/AnnouncementBanner";
import RecentActivity from "./components/RecentActivity";
import NotificationDrawer from "./components/NotificationDrawer";

export default function DashboardPage() {
  
  const router = useRouter();
  
  const [entered, setEntered] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [buyPanelCollapsed, setBuyPanelCollapsed] = useState(false);

  const [selectedAmount, setSelectedAmount] = useState<number>(100);

  const [walletAddress, setWalletAddress] = useState("");
  
  const [txHash, setTxHash] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  

  const [network, setNetwork] = useState("BEP20");

  const [purchases, setPurchases] = useState<any[]>([]);

  const [referral, setReferral] = useState({
  referralCode: "",
  totalPartners: 0,
  referralEarnings: 0,
});

const [showReferral, setShowReferral] = useState(false);

 useEffect(() => {
  const alreadyEntered = sessionStorage.getItem("striverseEntered");

if (alreadyEntered === "true") {
  setEntered(true);
}
  async function loadUser() {
    try {
      const res = await fetch("/api/user/me", {
  credentials: "include",
  cache: "no-store",
});

async function loadReferral() {
  const res = await fetch("/api/user/referral", {
    credentials: "include",
  });

  const data = await res.json();

  if (data.success) {
    setReferral(data.user);
  }
}

loadReferral();
      if (!res.ok) {
  router.replace("/");
  router.refresh();
  return;
}

      const data = await res.json();

      setUser(data.user);
      setWalletAddress(data.user.walletAddress || "");
    } catch (error) {
      console.error(error);
      router.replace("/");
    }
  }

  async function loadPurchases() {
    try {
      const res = await fetch("/api/purchase/history", {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setPurchases(data.purchases);
      }
    } catch (error) {
      console.error(error);
    }
  }

  loadUser();
  loadPurchases();
  async function loadUnread() {
    try {
      const res = await fetch("/api/user/notifications", { credentials: "include", cache: "no-store" });
      const data = await res.json();
      if (res.ok) setNotificationCount(Number(data.unread || 0));
    } catch {}
  }
  loadUnread();
  const poll = window.setInterval(loadUnread, 30000);
  return () => window.clearInterval(poll);
}, [router]);

  async function handleLogout() {
  // 👇 Add this line
  sessionStorage.removeItem("striverseEntered");

  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error(error);
  }

  router.replace("/");
  router.refresh();
}
  async function saveWallet() {
  try {
    const res = await fetch("/api/user/wallet", {
      method: "POST",
     
      credentials: "include",
      body: JSON.stringify({
        walletAddress,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Wallet saved successfully!");

    const userRes = await fetch("/api/user/me", {
      credentials: "include",
    });

    const userData = await userRes.json();

    if (userRes.ok) {
      setUser(userData.user);
    }

  } catch (error) {
    console.error(error);
    toast.error("Failed to save wallet.");
  }
}
  async function handlePurchase() {
  if (!user?.walletAddress) {
    toast.error("Please save your wallet address first.");
    return;
  }

  if (!txHash.trim()) {
    toast.error("Please enter Transaction Hash.");
    return;
  }

  if (!selectedFile) {
    toast.error("Please upload payment screenshot.");
    return;
  }

  try {
    setPurchaseLoading(true);

    const formData = new FormData();

    formData.append("usdtAmount", selectedAmount.toString());

    const packageNames: Record<number, string> = {
      100: "LUNA",
      300: "AURORA",
      500: "ANDROMEDA",
      700: "ORION",
      1000: "CELESTIA",
    };
    const packageName = packageNames[selectedAmount];
    if (!packageName) {
      toast.error("Invalid package selected.");
      return;
    }
    formData.append("packageName", packageName);
    formData.append("network", network);
    formData.append("txHash", txHash);
    formData.append("walletAddress", user.walletAddress);
    formData.append("proofImage", selectedFile);

    const res = await fetch("/api/purchase/create", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Purchase submitted successfully!");

    setShowBuyModal(false);
    setTxHash("");
    setSelectedFile(null);
    setNetwork("BEP20");
  } catch (error) {
  console.error(error);
  toast.error("Purchase failed.");
} finally {
  setPurchaseLoading(false);
}
}
  const stvAmount = selectedAmount * 1000;
  const approvedPurchases = purchases.filter(
  (p) => p.status === "APPROVED"
);

const totalInvested = approvedPurchases.reduce(
  (sum, p) => sum + p.usdtAmount,
  0
);
const stvBalance = approvedPurchases.reduce(
  (sum, p) => sum + p.stvAmount,
  0
);
const approvedOrders = approvedPurchases.length;

const pendingOrders = purchases.filter(
  (p) => p.status === "PENDING"
).length;
if (!entered) {
  return (
    <WelcomeOverlay
      userName={user?.fullName || "Investor"}
      onEnter={() => setEntered(true)}
    />
  );
}
  return (
    <>
      <BackgroundEffects />
      <main className="dashboard-light relative min-h-screen px-3 py-4 text-slate-900 sm:px-5 lg:px-6">
        <div className="mx-auto max-w-[1600px]">
          <header className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
            <Link href="/dashboard" className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-700 text-sm font-bold tracking-tight text-white">S</span>
              <span className="text-lg font-bold tracking-[0.22em] text-slate-900 sm:text-xl">STRI<span className="text-teal-700">VERSE</span></span>
            </Link>
            <div className="hidden max-w-md flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 md:flex">
              <span className="mr-3 text-cyan-300">⌕</span> Your investor dashboard
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button type="button" onClick={() => setShowNotifications(true)} aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200">
                <Bell size={18} />
                {notificationCount > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-cyan-400 px-1 text-[10px] font-bold text-slate-950">{notificationCount}</span>}
              </button>
              <button type="button" onClick={() => setShowReferral(true)} aria-label="Partner program" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-cyan-300/40 hover:text-cyan-200"><Gift size={17} /></button>
              <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-xl px-1 py-1 transition hover:bg-white/5 sm:px-2">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 font-semibold text-cyan-200">{(user?.fullName || "I").charAt(0).toUpperCase()}</span>
                <span className="hidden text-left sm:block"><span className="block max-w-36 truncate text-sm font-semibold">{user?.fullName || "Investor"}</span><span className="block text-xs text-slate-400">STRIVERSE member</span></span>
              </Link>
              <button type="button" onClick={handleLogout} aria-label="Sign out" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-rose-400/30 hover:text-rose-300"><LogOut size={17} /></button>
            </div>
          </header>

          <div className="grid gap-5 lg:grid-cols-[190px_minmax(0,1fr)] xl:grid-cols-[205px_minmax(0,1fr)]">
            <aside className="hidden lg:flex lg:flex-col">
              <nav className="sticky top-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="px-3 pb-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Workspace</p>
                {[
                  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
                  { label: "Buy STV", href: "#buy-stv", icon: ShoppingCart },
                  { label: "My Purchases", href: "/dashboard/purchases", icon: ReceiptText },
                  { label: "Partner Program", href: "/dashboard/referral", icon: Gift },
                  { label: "Wallet & Profile", href: "/dashboard/profile", icon: Wallet },
                  { label: "Security", href: "/dashboard/settings", icon: ShieldCheck },
                ].map((item) => {
                  const Icon = item.icon;
                  const content = <><Icon size={17} /><span className="flex-1 text-left">{item.label}</span>{item.active && <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />}</>;
                  return item.href.startsWith("#")
                    ? <a key={item.label} href={item.href} onClick={(event) => { event.preventDefault(); document.getElementById("buy-stv")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-white">{content}</a>
                    : <Link key={item.label} href={item.href} className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${item.active ? "border border-cyan-300/15 bg-cyan-300/[0.10] text-cyan-100" : "text-slate-400 hover:bg-white/[0.05] hover:text-white"}`}>{content}</Link>;
                })}
                <div className="mt-5 rounded-xl border border-cyan-300/10 bg-gradient-to-br from-cyan-300/[0.08] to-violet-400/[0.06] p-4">
                  <p className="text-xs font-semibold text-slate-200">Grow with STRIVERSE</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Manage your STV journey in one place.</p>
                  <button type="button" onClick={() => document.getElementById("buy-stv")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="mt-3 flex w-full items-center justify-between rounded-lg bg-cyan-300 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-cyan-200">Explore STV <ChevronRight size={14} /></button>
                </div>
              </nav>
            </aside>

            <div className="min-w-0">
              <nav className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                {[
                  ["Dashboard", "/dashboard"],
                  ["Buy STV", "#buy-stv"],
                  ["Purchases", "/dashboard/purchases"],
                  ["Partners", "/dashboard/referral"],
                  ["Profile", "/dashboard/profile"],
                ].map(([label, href]) => href.startsWith("#")
                  ? <button key={label} type="button" onClick={() => document.getElementById("buy-stv")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300">{label}</button>
                  : <Link key={label} href={href} className={`shrink-0 rounded-xl border px-3 py-2 text-xs ${label === "Dashboard" ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100" : "border-white/10 bg-white/[0.04] text-slate-300"}`}>{label}</Link>)}
              </nav>

              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-teal-700">Investor workspace</p>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Welcome back, {user?.fullName?.split(" ")[0] || "Investor"}</h1>
                  <p className="mt-1 text-sm text-slate-600">Your account overview and latest activity.</p>
                </div>
                <div className="text-xs text-slate-600">{new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</div>
              </div>

              <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                <div className="min-w-0">
                  <PortfolioSection lockedSTV={user?.wallet?.lockedSTV ?? 0} availableSTV={user?.wallet?.unlockedSTV ?? 0} totalInvested={totalInvested} walletConnected={!!user?.walletAddress} />
                  <AnnouncementBanner />
                  <DashboardStats purchasedSTV={stvBalance} referralBonus={referral.referralEarnings} approvedOrders={approvedOrders} pendingOrders={pendingOrders} />
                  <div className="mt-5"><RecentActivity purchases={purchases} /></div>
                  <div className="mt-5"><TransactionsTable purchases={purchases} /></div>
                  <div className="mt-5"><ProfileCard user={user} walletAddress={walletAddress} setWalletAddress={setWalletAddress} onSaveWallet={saveWallet} /></div>
                </div>
                <aside id="buy-stv" className="min-w-0 scroll-mt-5">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/80">Quick purchase</p><p className="mt-1 text-xs text-slate-500">Choose a package to continue</p></div>
                    <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-2 py-1 text-[10px] text-emerald-200">Secure flow</span>
                  </div>
                  <BuyPanel collapsed={buyPanelCollapsed} onToggleCollapsed={() => setBuyPanelCollapsed((value) => !value)} onBuy={(amount, network) => { setSelectedAmount(amount); setNetwork(network); setShowBuyModal(true); }} />
                </aside>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BuyModal open={showBuyModal} onClose={() => setShowBuyModal(false)} user={user} selectedAmount={selectedAmount} stvAmount={stvAmount} network={network} txHash={txHash} setTxHash={setTxHash} selectedFile={selectedFile} setSelectedFile={setSelectedFile} loading={purchaseLoading} onSubmit={handlePurchase} />
      <ReferralDrawer open={showReferral} onClose={() => setShowReferral(false)} referralCode={referral.referralCode} totalPartners={referral.totalPartners} referralEarnings={referral.referralEarnings} />
      <NotificationDrawer open={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  );
}
