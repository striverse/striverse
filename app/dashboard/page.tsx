"use client";
import toast from "react-hot-toast";
import WelcomeOverlay from "@/components/dashboard/WelcomeOverlay";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "./types";
import Header from "./components/Header";
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

  <main className="relative min-h-screen px-6 py-8 text-white">
    <div className="max-w-7xl mx-auto">
  <Header
  userName={user?.fullName ?? "Investor"}
  notificationCount={notificationCount}
  onLogout={handleLogout}
  onNotifications={() => setShowNotifications(true)}
  onReferral={() => setShowReferral(true)}
/>

  <PortfolioSection
    lockedSTV={user?.wallet?.lockedSTV ?? 0}
    availableSTV={user?.wallet?.unlockedSTV ?? 0}
    totalInvested={totalInvested}
    walletConnected={!!user?.walletAddress}
  />
  <AnnouncementBanner />
   <DashboardStats
  purchasedSTV={stvBalance}
  referralBonus={referral.referralEarnings}
  approvedOrders={approvedOrders}
  pendingOrders={pendingOrders}
/>
 <RecentActivity purchases={purchases} />

<div className="grid lg:grid-cols-2 gap-8 mt-10"></div>

      
        <div className="grid lg:grid-cols-2 gap-8 mt-12">

          <ProfileCard
  user={user}
  walletAddress={walletAddress}
  setWalletAddress={setWalletAddress}
  onSaveWallet={saveWallet}
/>
          <BuyPanel
  onBuy={(amount, network) => {
    setSelectedAmount(amount);
    setNetwork(network);
    setShowBuyModal(true);
  }}
/>

        </div>

<TransactionsTable purchases={purchases} />
<ReferralDrawer
  open={showReferral}
  onClose={() => setShowReferral(false)}
  referralCode={referral.referralCode}
  totalPartners={referral.totalPartners}
  referralEarnings={referral.referralEarnings}
/>

      </div>
<BuyModal
  open={showBuyModal}
  onClose={() => setShowBuyModal(false)}
  user={user}
  selectedAmount={selectedAmount}
  stvAmount={stvAmount}
  network={network}
  txHash={txHash}
  setTxHash={setTxHash}
  selectedFile={selectedFile}
  setSelectedFile={setSelectedFile}
  loading={purchaseLoading}
  onSubmit={handlePurchase}
/>       
   
    </main>
</>
  );
}
