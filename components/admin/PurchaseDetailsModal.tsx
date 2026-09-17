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
  status: string;
  adminRemarks?: string;
  createdAt: string;
}

interface PurchaseDetailsModalProps {
  purchase: Purchase;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

export default function PurchaseDetailsModal({
  purchase,
  onClose,
  onApprove,
  onReject,
}: PurchaseDetailsModalProps) {
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch {
      alert("Copy failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">

      <div className="relative w-[95%] max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-500/20 bg-[#0b1220] p-8">

        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-2xl text-white hover:text-red-400 transition"
        >
          ✕
        </button>

        <h2 className="mb-8 text-3xl font-bold text-cyan-400">
          Purchase Details
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left */}

          <div className="space-y-5">

            <InfoRow
              title="Network"
              value={purchase.network}
            />

            <InfoRow
              title="USDT"
              value={purchase.usdtAmount.toString()}
            />

            <InfoRow
              title="STV"
              value={purchase.stvAmount.toLocaleString()}
            />

            <InfoRow
              title="Wallet"
              value={purchase.walletAddress}
            />

            <button
              onClick={() => copyText(purchase.walletAddress)}
              className="rounded-lg bg-cyan-500 px-4 py-2 text-black font-semibold hover:bg-cyan-400 transition"
            >
              Copy Wallet
            </button>

            <InfoRow
              title="TX Hash"
              value={purchase.txHash}
            />

            <button
              onClick={() => copyText(purchase.txHash)}
              className="rounded-lg bg-cyan-500 px-4 py-2 text-black font-semibold hover:bg-cyan-400 transition"
            >
              Copy TX Hash
            </button>

            <div>

              <p className="text-gray-400 mb-2">
                Status
              </p>

              <span
                className={`px-4 py-2 rounded-full font-semibold ${
                  purchase.status === "APPROVED"
                    ? "bg-green-500/20 text-green-400"
                    : purchase.status === "REJECTED"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {purchase.status}
              </span>

            </div>

            <InfoRow
              title="Remarks"
              value={purchase.adminRemarks || "-"}
            />

            <InfoRow
              title="Created"
              value={new Date(
                purchase.createdAt
              ).toLocaleString()}
            />

          </div>

          {/* Right */}

          <div>

            <h3 className="text-xl font-bold text-cyan-400 mb-4">
              Payment Proof
            </h3>

            {purchase.proofImage ? (

              <Image
                src={purchase.proofImage}
                alt="Payment Proof"
                width={900}
                height={700}
                className="rounded-xl w-full object-contain border border-cyan-500/20"
              />

            ) : (

              <div className="rounded-xl border border-dashed border-gray-600 h-80 flex items-center justify-center text-gray-500">
                No Proof Uploaded
              </div>

            )}

          </div>

        </div>

        <div className="mt-10 flex flex-wrap gap-4 justify-end">

          {purchase.status === "PENDING" && (
            <>
              <button
                onClick={onApprove}
                className="rounded-xl bg-green-600 px-6 py-3 font-semibold hover:bg-green-500 transition"
              >
                Approve
              </button>

              <button
                onClick={onReject}
                className="rounded-xl bg-red-600 px-6 py-3 font-semibold hover:bg-red-500 transition"
              >
                Reject
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="rounded-xl bg-gray-700 px-6 py-3 hover:bg-gray-600 transition"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

function InfoRow({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <p className="break-all text-white">
        {value}
      </p>
    </div>
  );
}