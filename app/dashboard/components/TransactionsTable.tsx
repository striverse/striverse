"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import GlassCard from "./ui/GlassCard";

interface Purchase {
  id: string;
  createdAt: string;
  usdtAmount: number;
  stvAmount: number;
  network: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface TransactionsTableProps {
  purchases: Purchase[];
}

type Filter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

export default function TransactionsTable({
  purchases,
}: TransactionsTableProps) {
  const [expanded, setExpanded] = useState(true);
  const [filter, setFilter] = useState<Filter>("ALL");

  const filteredPurchases = useMemo(() => {
    if (filter === "ALL") return purchases;

    return purchases.filter(
      (purchase) => purchase.status === filter
    );
  }, [filter, purchases]);

  return (
    <GlassCard className="mt-10 p-6">
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="mb-6 flex cursor-pointer items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">
            Recent Transactions
          </h2>

          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-cyan-500/20 px-2 text-xs font-bold text-cyan-400">
            {filteredPurchases.length}
          </span>
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
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="overflow-hidden"
          >
            {/* Filter Buttons */}
            <div className="mb-6 flex flex-wrap gap-2">
              {(
                ["ALL", "PENDING", "APPROVED", "REJECTED"] as Filter[]
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    filter === status
                      ? "bg-cyan-500 text-white"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {filteredPurchases.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/5 py-12 text-center">
                <p className="text-lg font-medium text-white">
                  No Transactions
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  There are no transactions for the selected
                  filter.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full">
                  <thead className="sticky top-0 bg-white/5 backdrop-blur">
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Date
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        USDT
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        STV
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Network
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPurchases.map((purchase) => (
                      <tr
                        key={purchase.id}
                        className="border-b border-white/10 transition duration-200 hover:bg-white/5"
                      >
                        <td className="px-4 py-4 text-gray-300">
                          {new Date(
                            purchase.createdAt
                          ).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-4 font-medium text-white">
                          {purchase.usdtAmount} USDT
                        </td>

                        <td className="px-4 py-4 font-semibold text-cyan-400">
                          {purchase.stvAmount.toLocaleString()} STV
                        </td>

                        <td className="px-4 py-4 text-gray-300">
                          {purchase.network}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              purchase.status === "APPROVED"
                                ? "bg-green-500/20 text-green-400"
                                : purchase.status === "REJECTED"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {purchase.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}