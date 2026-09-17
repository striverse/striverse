"use client";

import { motion } from "framer-motion";

interface WelcomeOverlayProps {
  userName: string;
  onEnter: () => void;
}

export default function WelcomeOverlay({
  userName,
  onEnter,
}: WelcomeOverlayProps) {
  function handleEnter() {
    sessionStorage.setItem("striverseEntered", "true");
    onEnter();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050816]"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-[#0B1220] p-8 text-center shadow-2xl"
      >
        <img
          src="/logo1.png"
          alt="STRIVERSE"
          className="mx-auto h-20 w-20"
        />

        <h1 className="mt-6 text-3xl font-bold text-white">
          Welcome
        </h1>

        <p className="mt-2 text-lg text-cyan-400">
          {userName}
        </p>

        <p className="mt-4 text-sm text-gray-400">
          Welcome to your STRIVERSE Dashboard
        </p>

        <button
          onClick={handleEnter}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 py-4 font-bold text-white transition hover:scale-[1.02]"
        >
          Enter Dashboard
        </button>
      </motion.div>
    </motion.div>
  );
}