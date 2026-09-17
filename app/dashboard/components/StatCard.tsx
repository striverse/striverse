"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import GlassCard from "./ui/GlassCard";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconColor?: string;
  suffix?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = "text-cyan-400",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <GlassCard className="p-6 h-full">
        <div className="flex items-start justify-between">
          {/* Left */}
          <div>
            <p className="text-sm font-medium text-gray-400">
              {title}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              {value}
            </h2>

            {subtitle && (
              <p className="mt-2 text-sm text-gray-500">
                {subtitle}
              </p>
            )}
          </div>

          {/* Icon */}
          <div
            className={`
              flex h-14 w-14 items-center justify-center
              rounded-2xl
              bg-white/5
              border border-white/10
              ${iconColor}
            `}
          >
            {icon}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}