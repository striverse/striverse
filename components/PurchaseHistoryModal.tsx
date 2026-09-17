"use client";

import Image from "next/image";

interface Purchase {
  id: string;
  usdtAmount: number;
  stvAmount: number;
  network: string;
  walletAddress: string;
  txHash: string;
  proofImage: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminRemarks: string | null;
  createdAt: string;
}

interface PurchaseHistoryModalProps {
  purchase: Purchase;
  onClose: () => void;
}

export default function PurchaseHistoryModal({
  purchase,
  onClose,
}: PurchaseHistoryModalProps) {
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch {
      alert("Copy failed.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">

      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-500/20 bg-[#08101d]">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-cyan-500/20 p-6">

          <div>
            <h2 className="text-2xl font-bold text-cyan-400">
              Purchase Details
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              View your purchase information
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-red-500 transition"
          >
            ✕
          </button>

        </div>

        {/* Body */}

        <div className="space-y-6 p-6">

          {/* Status */}

          <div className="flex justify-center">

            <span
              className={`px-5 py-2 rounded-full font-semibold ${
                purchase.status === "APPROVED"
                  ? "bg-green-600"
                  : purchase.status === "REJECTED"
                  ? "bg-red-600"
                  : "bg-yellow-500 text-black"
              }`}
            >
              {purchase.status}
            </span>

          </div>

          {/* Amount Cards */}

          <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-xl bg-cyan-500/10 p-5">
              <p className="text-gray-400">USDT</p>

              <h3 className="mt-2 text-3xl font-bold">
                ${purchase.usdtAmount}
              </h3>
            </div>

            <div className="rounded-xl bg-green-500/10 p-5">
              <p className="text-gray-400">STV</p>

              <h3 className="mt-2 text-3xl font-bold">
                {purchase.stvAmount.toLocaleString()}
              </h3>
            </div>

            <div className="rounded-xl bg-purple-500/10 p-5">
              <p className="text-gray-400">Network</p>

              <h3 className="mt-2 text-2xl font-bold">
                {purchase.network}
              </h3>
            </div>

          </div>

          {/* Wallet */}

          <div className="rounded-xl bg-white/5 p-5">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-sm text-gray-400">
                  Wallet Address
                </p>

                <p className="mt-2 break-all">
                  {purchase.walletAddress}
                </p>
              </div>

              <button
                onClick={() => copy(purchase.walletAddress)}
                className="rounded-lg bg-cyan-600 px-4 py-2 hover:bg-cyan-700 transition"
              >
                Copy
              </button>

            </div>

          </div>

          {/* TX Hash */}

          <div className="rounded-xl bg-white/5 p-5">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-sm text-gray-400">
                  Transaction Hash
                </p>

                <p className="mt-2 break-all">
                  {purchase.txHash}
                </p>
              </div>

              <button
                onClick={() => copy(purchase.txHash)}
                className="rounded-lg bg-cyan-600 px-4 py-2 hover:bg-cyan-700 transition"
              >
                Copy
              </button>

            </div>

          </div>

          {/* Proof Image */}

          <div>

            <p className="mb-3 text-gray-400">
              Payment Proof
            </p>

            <div className="overflow-hidden rounded-xl border border-cyan-500/20">

              <Image
                src={purchase.proofImage}
                alt="Payment Proof"
                width={1200}
                height={700}
                className="h-auto w-full"
              />

            </div>

          </div>

          {/* Remarks */}

          <div className="rounded-xl bg-white/5 p-5">

            <p className="mb-2 text-sm text-gray-400">
              Admin Remarks
            </p>

            <p className="break-words">
              {purchase.adminRemarks?.trim() || "No remarks available."}
            </p>

          </div>

          {/* Date */}

          <div className="rounded-xl bg-white/5 p-5">

            <p className="text-sm text-gray-400">
              Purchase Date
            </p>

            <p className="mt-2">
              {new Date(purchase.createdAt).toLocaleString()}
            </p>

          </div>

          {/* Footer */}

          <div className="pt-2">

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-cyan-600 py-3 font-semibold hover:bg-cyan-700 transition"
            >
              Close
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}