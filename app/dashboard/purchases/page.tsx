"use client";

import { useEffect, useMemo, useState } from "react";
import PurchaseHistoryModal from "../../../components/PurchaseHistoryModal";

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

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPurchase, setSelectedPurchase] =
    useState<Purchase | null>(null);

  useEffect(() => {
    loadPurchases();
  }, []);

  async function loadPurchases() {
    try {
      const res = await fetch("/api/user/purchases", {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setPurchases(data.purchases);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load purchases.");
    } finally {
      setLoading(false);
    }
  }

  const filteredPurchases = useMemo(() => {
    const q = search.toLowerCase();

    return purchases.filter((purchase) => {
      return (
        purchase.network.toLowerCase().includes(q) ||
        purchase.txHash.toLowerCase().includes(q) ||
        purchase.status.toLowerCase().includes(q)
      );
    });
  }, [search, purchases]);

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-8">

        <div>
          <h1 className="text-4xl font-bold text-cyan-400">
            Purchase History
          </h1>

          <p className="text-gray-400 mt-2">
            Track all your STRIVERSE purchases
          </p>
        </div>

        <div className="text-right">
          <p className="text-gray-400">
            Total Purchases
          </p>

          <h2 className="text-3xl font-bold">
            {purchases.length}
          </h2>
        </div>

      </div>

      <input
        type="text"
        placeholder="Search by network, status or TX Hash..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full lg:w-96 rounded-xl bg-[#101827] border border-cyan-500/20 px-4 py-3 outline-none focus:border-cyan-400 mb-8"
      />

      {loading ? (
        <div className="text-center py-20 text-gray-400">
          Loading purchases...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-cyan-500/20 bg-[#101827]">

          <table className="w-full">

            <thead className="bg-cyan-600">

              <tr>
                <th className="p-4 text-left">USDT</th>
                <th className="p-4 text-left">STV</th>
                <th className="p-4 text-left">Network</th>
                <th className="p-4 text-left">Wallet</th>
                <th className="p-4 text-left">TX Hash</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Date</th>
              </tr>

            </thead>

            <tbody>

              {filteredPurchases.map((purchase) => (

                <tr
                  key={purchase.id}
                  onClick={() => setSelectedPurchase(purchase)}
                  className="border-t border-cyan-500/20 hover:bg-cyan-500/10 transition cursor-pointer"
                >

                  <td className="p-4">
                    ${purchase.usdtAmount}
                  </td>

                  <td className="p-4">
                    {purchase.stvAmount.toLocaleString()}
                  </td>

                  <td className="p-4">
                    {purchase.network}
                  </td>

                  <td className="p-4 max-w-[180px] truncate">
                    {purchase.walletAddress}
                  </td>

                  <td className="p-4 max-w-[180px] truncate">
                    {purchase.txHash}
                  </td>

                  <td className="text-center">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        purchase.status === "APPROVED"
                          ? "bg-green-600"
                          : purchase.status === "REJECTED"
                          ? "bg-red-600"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {purchase.status}
                    </span>

                  </td>

                  <td className="text-center">
                    {new Date(
                      purchase.createdAt
                    ).toLocaleDateString()}
                  </td>

                </tr>

              ))}

              {filteredPurchases.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-10 text-gray-400"
                  >
                    No purchases found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      )}

      {selectedPurchase && (
        <PurchaseHistoryModal
          purchase={selectedPurchase}
          onClose={() => setSelectedPurchase(null)}
        />
      )}

    </div>
  );
}