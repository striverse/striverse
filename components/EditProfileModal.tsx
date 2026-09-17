"use client";

import { useEffect, useState } from "react";

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

interface EditProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onUpdated: () => Promise<void>;
}

export default function EditProfileModal({
  user,
  onClose,
  onUpdated,
}: EditProfileModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFullName(user.fullName);
    setPhone(user.phone);
    setWalletAddress(user.walletAddress ?? "");
  }, [user]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-5">

      <div className="w-full max-w-xl rounded-2xl border border-cyan-500/20 bg-[#08101d]">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-cyan-500/20 p-6">

          <div>

            <h2 className="text-2xl font-bold text-cyan-400">
              Edit Profile
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Update your account information
            </p>

          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-red-500 transition"
          >
            ✕
          </button>

        </div>

        {/* Body */}

        <div className="space-y-6 p-6">

          {/* Name */}

          <div>

            <label className="mb-2 block text-sm text-gray-300">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-cyan-500/20 bg-white/5 p-4 outline-none focus:border-cyan-400"
            />

          </div>

          {/* Email */}

          <div>

            <label className="mb-2 block text-sm text-gray-300">
              Email
            </label>

            <input
              type="email"
              value={user.email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-cyan-500/20 bg-gray-700/40 p-4 text-gray-400"
            />

            <p className="mt-2 text-xs text-gray-500">
              Email address cannot be changed.
            </p>

          </div>

          {/* Phone */}

          <div>

            <label className="mb-2 block text-sm text-gray-300">
              Phone Number
            </label>

            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-cyan-500/20 bg-white/5 p-4 outline-none focus:border-cyan-400"
            />

          </div>

          {/* Wallet */}

          <div>

            <label className="mb-2 block text-sm text-gray-300">
              Wallet Address
            </label>

            <textarea
              rows={3}
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your wallet address"
              className="w-full rounded-xl border border-cyan-500/20 bg-white/5 p-4 outline-none focus:border-cyan-400 resize-none"
            />

          </div>

                    <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-cyan-500/20 py-3 font-semibold transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                if (!fullName.trim()) {
                  alert("Full name is required.");
                  return;
                }

                if (!phone.trim()) {
                  alert("Phone number is required.");
                  return;
                }

                try {
                  setLoading(true);

                  const res = await fetch(
                    "/api/user/profile/update",
                    {
                      method: "PATCH",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        fullName: fullName.trim(),
                        phone: phone.trim(),
                        walletAddress: walletAddress.trim(),
                      }),
                    }
                  );

                  const data = await res.json();

                  if (!res.ok) {
                    alert(data.message);
                    return;
                  }

                  alert("Profile updated successfully.");

                  await onUpdated();

                  onClose();

                } catch (error) {
                  console.error(error);
                  alert("Failed to update profile.");
                } finally {
                  setLoading(false);
                }
              }}
              className="flex-1 rounded-xl bg-cyan-600 py-3 font-semibold transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "💾 Save Changes"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}