"use client";

import { useState } from "react";
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

  user: {
    fullName: string;
    email: string;
  };
}

interface PurchaseModalProps {
  purchase: Purchase;
  onClose: () => void;
  onUpdated: () => Promise<void>;
}

export default function PurchaseModal({
  purchase,
  onClose,
  onUpdated,
}: PurchaseModalProps) {
  const [remarks, setRemarks] = useState(
    purchase.adminRemarks ?? ""
  );

  const [loading, setLoading] = useState(false);

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center p-5">

      <div className="bg-[#08101d] border border-cyan-500/20 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="flex justify-between items-center border-b border-cyan-500/20 p-6">

          <div>

            <h2 className="text-2xl font-bold text-cyan-400">
              Purchase Details
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Review purchase before approval
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-2xl"
          >
            ✕
          </button>

        </div>

        {/* Body */}

        <div className="p-6 space-y-6">

          {/* User */}

          <div className="grid md:grid-cols-2 gap-5">

            <div className="bg-white/5 rounded-xl p-4">

              <p className="text-gray-400 text-sm">
                User
              </p>

              <p className="font-semibold text-lg mt-1">
                {purchase.user.fullName}
              </p>

              <p className="text-gray-400">
                {purchase.user.email}
              </p>

            </div>

            <div className="bg-white/5 rounded-xl p-4">

              <p className="text-gray-400 text-sm">
                Purchase Date
              </p>

              <p className="font-semibold mt-1">
                {new Date(
                  purchase.createdAt
                ).toLocaleString()}
              </p>

            </div>

          </div>

          {/* Amount */}

          <div className="grid md:grid-cols-3 gap-5">

            <div className="bg-cyan-500/10 rounded-xl p-5">

              <p className="text-gray-400">
                USDT
              </p>

              <h3 className="text-3xl font-bold mt-2">
                ${purchase.usdtAmount}
              </h3>

            </div>

            <div className="bg-green-500/10 rounded-xl p-5">

              <p className="text-gray-400">
                STV
              </p>

              <h3 className="text-3xl font-bold mt-2">
                {purchase.stvAmount.toLocaleString()}
              </h3>

            </div>

            <div className="bg-purple-500/10 rounded-xl p-5">

              <p className="text-gray-400">
                Network
              </p>

              <h3 className="text-2xl font-bold mt-2">
                {purchase.network}
              </h3>

            </div>

          </div>

          {/* Wallet */}

          <div className="bg-white/5 rounded-xl p-5">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-400 text-sm">
                  Wallet Address
                </p>

                <p className="mt-2 break-all">
                  {purchase.walletAddress}
                </p>

              </div>

              <button
                onClick={() =>
                  copy(purchase.walletAddress)
                }
                className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg"
              >
                Copy
              </button>

            </div>

          </div>

          {/* TX Hash */}

          <div className="bg-white/5 rounded-xl p-5">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-400 text-sm">
                  Transaction Hash
                </p>

                <p className="mt-2 break-all">
                  {purchase.txHash}
                </p>

              </div>

              <button
                onClick={() =>
                  copy(purchase.txHash)
                }
                className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg"
              >
                Copy
              </button>

            </div>

          </div>

          {/* Proof */}

          <div>

            <p className="text-gray-400 mb-3">
              Payment Proof
            </p>

            <div className="rounded-xl overflow-hidden border border-cyan-500/20">

              <Image
                src={purchase.proofImage}
                alt="Proof"
                width={1200}
                height={700}
                className="w-full h-auto"
              />

            </div>

          </div>

          {/* Remarks */}

          <div>

            <label className="block mb-2 text-gray-300">
              Admin Remarks
            </label>

            <textarea
              rows={4}
              value={remarks}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
              className="w-full rounded-xl bg-white/5 border border-cyan-500/20 p-4 outline-none focus:border-cyan-400"
              placeholder="Optional remarks..."
            />

          </div>
                  <div className="flex flex-col md:flex-row gap-4 pt-4">

            <button
              disabled={loading || purchase.status !== "PENDING"}
              onClick={async () => {
                try {
                  setLoading(true);

                  const res = await fetch(
                    `/api/admin/purchases/${purchase.id}`,
                    {
                      method: "PATCH",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        status: "REJECTED",
                        remarks,
                      }),
                    }
                  );

                  const data = await res.json();

                  if (!res.ok) {
                    alert(data.message);
                    return;
                  }

                  alert("Purchase rejected successfully.");

                  await onUpdated();
                  onClose();

                } catch (error) {
                  console.error(error);
                  alert("Something went wrong.");
                } finally {
                  setLoading(false);
                }
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Processing..." : "❌ Reject"}
            </button>

            <button
              disabled={loading || purchase.status !== "PENDING"}
              onClick={async () => {
                try {
                  setLoading(true);

                  const res = await fetch(
                    `/api/admin/purchases/${purchase.id}`,
                    {
                      method: "PATCH",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        status: "APPROVED",
                        remarks,
                      }),
                    }
                  );

                  const data = await res.json();

                  if (!res.ok) {
                    alert(data.message);
                    return;
                  }

                  alert("Purchase approved successfully.");

                  await onUpdated();
                  onClose();

                } catch (error) {
                  console.error(error);
                  alert("Something went wrong.");
                } finally {
                  setLoading(false);
                }
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Processing..." : "✅ Approve"}
            </button>

          </div>

          {purchase.status !== "PENDING" && (
            <div className="rounded-xl border border-cyan-500/20 bg-white/5 p-4">

              <p className="text-gray-400 mb-2">
                Current Status
              </p>

              <span
                className={`inline-flex px-4 py-2 rounded-full font-semibold ${
                  purchase.status === "APPROVED"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {purchase.status}
              </span>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
