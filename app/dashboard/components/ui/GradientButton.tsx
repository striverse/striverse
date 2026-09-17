"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GradientButtonProps extends HTMLMotionProps<"button"> {
    children: ReactNode;
    fullWidth?: boolean;
    loading?: boolean;
}

export default function GradientButton({
  children,
  className = "",
  fullWidth = false,
  loading = false,
  disabled,
  ...props
}: GradientButtonProps) {
  return (
    <motion.button
      whileHover={{
        scale: disabled || loading ? 1 : 1.02,
        y: disabled || loading ? 0 : -2,
      }}
      whileTap={{
        scale: disabled || loading ? 1 : 0.98,
      }}
      transition={{
        duration: 0.2,
      }}
      disabled={disabled || loading}
      className={`
        relative
        overflow-hidden
        rounded-2xl
        px-6
        py-3
        font-semibold
        text-white
        bg-gradient-to-r
        from-cyan-500
        via-sky-500
        to-blue-600
        shadow-lg
        shadow-cyan-500/30
        transition-all
        duration-300
        hover:shadow-cyan-400/50
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {/* Glow */}
      <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 hover:opacity-100" />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Loading...
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}