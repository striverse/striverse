"use client";

import GlassCard from "@/app/dashboard/components/ui/GlassCard";
import GradientButton from "@/app/dashboard/components/ui/GradientButton";
import { User } from "../types";

interface ProfileCardProps {
  user: User | null;
  walletAddress: string;
  setWalletAddress: (value: string) => void;
  onSaveWallet: () => void;
}

export default function ProfileCard({
  user,
  walletAddress,
  setWalletAddress,
  onSaveWallet,
}: ProfileCardProps) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold">
          {user?.fullName?.charAt(0).toUpperCase() || "U"}
        </div>

        <div>
          <h2 className="text-xl font-bold">
            {user?.fullName || "Investor"}
          </h2>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Phone
          </label>
          <div className="rounded-xl bg-white/5 p-3">
            {user?.phone || "-"}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">
            Wallet Address
          </label>

          <input
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter BEP20 Wallet Address"
            className="w-full rounded-xl border border-cyan-500/20 bg-black/30 p-3 outline-none focus:border-cyan-400"
          />
        </div>

        <GradientButton
          fullWidth
          onClick={onSaveWallet}
        >
          Save Wallet
        </GradientButton>
      </div>
    </GlassCard>
  );
}