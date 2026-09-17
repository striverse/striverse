"use client";
import toast from "react-hot-toast";
import GlassCard from "@/app/dashboard/components/ui/GlassCard";
import GradientButton from "@/app/dashboard/components/ui/GradientButton";
import { X, Copy, Users, DollarSign, Gift } from "lucide-react";

interface ReferralDrawerProps {
  open: boolean;
  onClose: () => void;
  referralCode: string;
  totalPartners: number;
  referralEarnings: number;
}

export default function ReferralDrawer({
  open,
  onClose,
  referralCode,
  totalPartners,
  referralEarnings,
}: ReferralDrawerProps) {
  if (!open) return null;

  const referralLink = `https://striverse.com/register?ref=${referralCode}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-full w-full max-w-md p-4">
        <GlassCard className="h-full p-6">

          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="text-cyan-400" />
              <h2 className="text-2xl font-bold">Striverse Partner Program</h2>
            </div>

            <button onClick={onClose}>
              <X />
            </button>
          </div>

          <div className="space-y-6">

            <div>
              <p className="mb-2 text-gray-400">
                Partner Code
              </p>

              <div className="rounded-xl bg-white/5 p-4 font-bold text-cyan-400">
                {referralCode}
              </div>
            </div>

            <div>
              <p className="mb-2 text-gray-400">
                Partner Link
              </p>

              <div className="flex gap-2">
                <input
                  readOnly
                  value={referralLink}
                  className="flex-1 rounded-xl bg-white/5 p-3"
                />

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralLink);
                    toast.success("Partner Link Copied");
                  }}
                  className="rounded-xl bg-cyan-500 px-4"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <GlassCard className="p-4 text-center">
                <Users className="mx-auto mb-2 text-green-400" />
                <h3 className="text-3xl font-bold">
                  {totalPartners}
                </h3>
                <p className="text-gray-400 text-sm">
                  Partners
                </p>
              </GlassCard>

              <GlassCard className="p-4 text-center">
                <DollarSign className="mx-auto mb-2 text-yellow-400" />
                <h3 className="text-3xl font-bold">
                  {referralEarnings} USDT
                </h3>
                <p className="text-gray-400 text-sm">
                  Earnings
                </p>
              </GlassCard>

            </div>

            <GradientButton fullWidth>
              Share Partner Link
            </GradientButton>

          </div>

        </GlassCard>
      </div>
    </div>
  );
}