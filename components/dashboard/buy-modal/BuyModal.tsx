"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import QRCode from "react-qr-code";
import toast from "react-hot-toast";

import type { User } from "@/app/dashboard/types";

interface BuyModalProps {
  open: boolean;
  onClose: () => void;

  user: User | null;

  selectedAmount: number;
  stvAmount: number;

  network: string;

  txHash: string;
  setTxHash: (value: string) => void;

  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;

  loading?: boolean;

  onSubmit: () => void;
}

export default function BuyModal({
  open,
  onClose,

  user,

  selectedAmount,
  stvAmount,

  network,

  txHash,
  setTxHash,

  selectedFile,
  setSelectedFile,

  loading = false,

  onSubmit,
}: BuyModalProps) {
  const [showQR, setShowQR] = useState(false);

  if (!open) return null;

  const wallet =
    process.env.NEXT_PUBLIC_USDT_WALLET ||
    "0x123456789ABCDEF123456789ABCDEF1234567890";

  function copyWallet() {
    navigator.clipboard.writeText(wallet);
    toast.success("Wallet copied");
  }

  function handleFile(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  }

  const disabled =
    !txHash.trim() ||
    !selectedFile;

  return (
    <AnimatePresence>
      <motion.div
        className="
          fixed
          inset-0
          z-[999]
          flex
          items-center
          justify-center
          bg-black/75
          backdrop-blur-md
          p-4
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 20,
          }}
          transition={{
            duration: 0.25,
          }}
          className="
            w-full
            max-w-[540px]
            rounded-3xl
            border
            border-cyan-500/20
            bg-[#0B1220]
            shadow-[0_20px_80px_rgba(0,0,0,0.6)]
            overflow-hidden
          "
        >
          {/* Header */}

          <div
            className="
              flex
              items-center
              justify-between
              px-6
              py-4
              border-b
              border-white/10
            "
          >
            <div>
              

              <p className="text-sm text-gray-400 mt-2">
                Confirm your STV purchase
              </p>
            </div>

            <button
              onClick={onClose}
              className="
                h-10
                w-10
                rounded-xl
                bg-white/5
                hover:bg-red-500/20
                transition
                flex
                items-center
                justify-center
              "
            >
              <X size={20} />
            </button>
          </div>

          {/* BODY */}

          <div className="p-4 space-y-4">
                      {/* Purchase Summary */}

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Package</span>

              <span className="font-semibold text-white">
                {selectedAmount} USDT
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-400">You Receive</span>

              <span className="font-bold text-cyan-400">
                {stvAmount.toLocaleString()} STV
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-gray-400">Network</span>

              <span className="font-semibold text-white">
                {network}
              </span>
            </div>
          </div>

          {/* Wallet */}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                STRIVERSE Wallet
              </p>

              <button
                onClick={copyWallet}
                className="flex items-center gap-2 text-cyan-400 transition hover:text-cyan-300"
              >
                <Copy size={16} />
                Copy
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#111827] px-4 py-2.5 font-mono text-[11px] break-all">
              {wallet}
            </div>
          </div>

          {/* QR Code */}

          <div className="rounded-xl border border-white/10 bg-[#111827] overflow-hidden">
            <button
              onClick={() => setShowQR(!showQR)}
              className="flex w-full items-center justify-between px-4 py-3 transition hover:bg-white/5"
            >
              <span className="font-medium">
                {showQR ? "Hide QR Code" : "Show QR Code"}
              </span>

              {showQR ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

            <AnimatePresence>
              {showQR && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="overflow-hidden"
                >
                  <div className="flex justify-center border-t border-white/10 py-5">
                    <div className="rounded-2xl bg-white p-3">
                      <QRCode
                        value={wallet}
                        size={135}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Transaction Hash */}

          <div>
            <label className="text-sm text-gray-400">
              Transaction Hash
            </label>

            <input
              value={txHash}
              onChange={(e) =>
                setTxHash(e.target.value)
              }
              placeholder="Paste Transaction Hash"
              className="
                mt-2
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#111827]
                px-4
                py-2.5
                outline-none
                transition
                focus:border-cyan-400
              "
            />
          </div>

          {/* Upload */}

          <div>
            <label className="text-sm text-gray-400">
              Payment Screenshot
            </label>

            <label
              htmlFor="proof"
              className="
                mt-2
                flex
                cursor-pointer
                items-center
                justify-between
                rounded-xl
                border
                border-dashed
                border-cyan-500/20
                bg-[#111827]
                px-4
                py-2.5
                transition
                hover:border-cyan-400
              "
            >
              <span className="truncate text-sm">
                {selectedFile
                  ? selectedFile.name
                  : "Choose Screenshot"}
              </span>

              <span className="rounded-lg bg-cyan-500 px-3 py-1 text-xs font-semibold text-white">
                Browse
              </span>
            </label>

            <input
              id="proof"
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </div>
                   {/* Submit */}

          <button
            onClick={onSubmit}
            disabled={disabled || loading}
            className={`
              w-full
              rounded-2xl
              py-3.5
              text-base
              font-bold
              transition-all
              duration-300

              ${
                disabled || loading
                  ? "cursor-not-allowed bg-gray-700 text-gray-400"
                  : "bg-gradient-to-r from-cyan-500 via-sky-500 to-purple-600 text-white hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-cyan-500/20"
              }
            `}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div
                  className="
                    h-5
                    w-5
                    animate-spin
                    rounded-full
                    border-2
                    border-white
                    border-t-transparent
                  "
                />

                Processing Purchase...
              </div>
            ) : (
              "Submit Purchase"
            )}
          </button>

          <p className="text-center text-xs text-gray-500">
            Your payment will be verified by the STRIVERSE Admin
            within a few minutes after submission.
          </p>

        </div>

      </motion.div>

    </motion.div>

  </AnimatePresence>
);
}