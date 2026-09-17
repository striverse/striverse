"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -4,
              scale: 1.01,
            }
          : {}
      }
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-2xl
        shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        ${className}
      `}
    >
      {/* Top Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}