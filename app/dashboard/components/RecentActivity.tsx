"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Clock3,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import GlassCard from "./ui/GlassCard";

interface Purchase {
  id: string;
  status: string;
  usdtAmount: number;
  stvAmount: number;
  createdAt: string;
}

interface RecentActivityProps {
  purchases: Purchase[];
}

export default function RecentActivity({
  purchases,
}: RecentActivityProps) {
  const [expanded, setExpanded] = useState(false);

  const latest = [...purchases]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const latestActivityId = latest[0]?.id ?? "";

  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    if (!latestActivityId) return;

    const viewedId = localStorage.getItem("lastViewedActivity");
    setHasViewed(viewedId === latestActivityId);
  }, [latestActivityId]);

  const handleToggle = () => {
    const nextExpanded = !expanded;
    setExpanded(nextExpanded);

    if (nextExpanded && latestActivityId) {
      localStorage.setItem(
        "lastViewedActivity",
        latestActivityId
      );
      setHasViewed(true);
    }
  };

  return (
    <GlassCard className="mt-8 p-6">
      {/* Header */}
      <div
        onClick={handleToggle}
        className="flex cursor-pointer items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">
            Recent Activity
          </h2>

          {!hasViewed && latest.length > 0 && (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
              {latest.length}
            </span>
          )}
        </div>

        {expanded ? (
          <ChevronUp
            size={22}
            className="text-cyan-400 transition-transform"
          />
        ) : (
          <ChevronDown
            size={22}
            className="text-cyan-400 transition-transform"
          />
        )}
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-6 space-y-5">
              {latest.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 py-10 text-center text-gray-400">
                  No recent activity.
                </div>
              ) : (
                latest.map((purchase) => {
                  const approved = purchase.status === "APPROVED";
                  const pending = purchase.status === "PENDING";

                  return (
                    <div
                      key={purchase.id}
                      className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-500/30 hover:bg-white/10"
                    >
                      <div className="mt-1">
                        {approved ? (
                          <CheckCircle
                            size={24}
                            className="text-green-400"
                          />
                        ) : pending ? (
                          <Clock3
                            size={24}
                            className="text-yellow-400"
                          />
                        ) : (
                          <XCircle
                            size={24}
                            className="text-red-400"
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-white">
                          {approved
                            ? "Purchase Approved"
                            : pending
                            ? "Purchase Pending"
                            : "Purchase Rejected"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                          {purchase.usdtAmount} USDT →{" "}
                          {purchase.stvAmount.toLocaleString()} STV
                        </p>

                        <p className="mt-2 text-xs text-gray-500">
                          {new Date(
                            purchase.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          approved
                            ? "bg-green-500/20 text-green-400"
                            : pending
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}