"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EditProfileModal from "@/components/EditProfileModal";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  walletAddress: string | null;
  stvBalance: number;
  isVerified: boolean;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await fetch("/api/user/profile", {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white text-xl">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-red-500 text-xl">
        User not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

          <div>
            <h1 className="text-4xl font-bold text-cyan-400">
              My Profile
            </h1>

            <p className="text-gray-400 mt-2">
              Manage your STRIVERSE account
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-xl bg-cyan-600 hover:bg-cyan-700 transition px-6 py-3 font-semibold"
          >
            ← Back to Dashboard
          </button>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Card */}

          <div className="rounded-3xl border border-cyan-500/20 bg-[#101827] p-8">

            <div className="w-28 h-28 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-5xl font-bold mx-auto">
              {user.fullName.charAt(0).toUpperCase()}
            </div>

            <h2 className="text-2xl font-bold text-center mt-6">
              {user.fullName}
            </h2>

            <p className="text-center text-gray-400 mt-2">
              {user.email}
            </p>

            <div className="flex justify-center mt-6">

              <span
                className={`px-5 py-2 rounded-full font-semibold ${
                  user.isVerified
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {user.isVerified
                  ? "✅ Verified"
                  : "❌ Not Verified"}
              </span>

            </div>

          </div>

          {/* Right Card */}

          <div className="lg:col-span-2 rounded-3xl border border-cyan-500/20 bg-[#101827] p-8">

            <h2 className="text-2xl font-bold mb-8">
              Account Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <p className="text-gray-400 text-sm">
                  Full Name
                </p>

                <div className="mt-2 rounded-xl bg-white/5 p-4">
                  {user.fullName}
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Email
                </p>

                <div className="mt-2 rounded-xl bg-white/5 p-4">
                  {user.email}
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Phone
                </p>

                <div className="mt-2 rounded-xl bg-white/5 p-4">
                  {user.phone}
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Wallet Address
                </p>

                <div className="mt-2 rounded-xl bg-white/5 p-4 flex items-center justify-between gap-3">

                  <span className="truncate">
                    {user.walletAddress || "Not Connected"}
                  </span>

                  {user.walletAddress && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(user.walletAddress!);
                        toast.success("Wallet copied.");
                      }}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      📋 Copy
                    </button>
                  )}

                </div>
              </div>
                            <div>
                <p className="text-gray-400 text-sm">
                  STV Balance
                </p>

                <div className="mt-2 rounded-xl bg-cyan-500/10 p-4 text-cyan-400 text-xl font-bold">
                  {user.stvBalance.toLocaleString()} STV
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Member Since
                </p>

                <div className="mt-2 rounded-xl bg-white/5 p-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm">
                  Partner Code
                </p>

                <div className="mt-2 rounded-xl bg-white/5 p-4 flex items-center justify-between">

                  <span>
                    {user.id.slice(0, 8).toUpperCase()}
                  </span>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        user.id.slice(0, 8).toUpperCase()
                      );
                      toast.success("Partner code copied.");
                    }}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    📋 Copy
                  </button>

                </div>
              </div>

            </div>

            <button
              onClick={() => setShowEditModal(true)}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold hover:opacity-90 transition"
            >
              ✏ Edit Profile
            </button>

          </div>

        </div>

        {/* Statistics */}

        <div className="mt-10 rounded-3xl border border-cyan-500/20 bg-[#101827] p-8">

          <h2 className="text-2xl font-bold mb-6">
            Account Statistics
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="rounded-2xl bg-white/5 p-6">
              <p className="text-gray-400 text-sm">
                Verification Status
              </p>

              <p className="mt-3 text-xl font-bold text-green-400">
                {user.isVerified ? "Verified" : "Pending"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6">
              <p className="text-gray-400 text-sm">
                Member Since
              </p>

              <p className="mt-3 text-xl font-bold">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-6">
              <p className="text-gray-400 text-sm">
                STV Balance
              </p>

              <p className="mt-3 text-xl font-bold text-cyan-400">
                {user.stvBalance.toLocaleString()} STV
              </p>
            </div>

          </div>

        </div>

      </div>

      {showEditModal && user && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdated={loadProfile}
        />
      )}

    </div>
  );
}