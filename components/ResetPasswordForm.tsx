"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      setMessage("Invalid or missing reset token.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password minimum 8 characters undali.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords match avvatledu.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("Password successfully reset ayyindi.");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050816] px-6">
      <div className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-white/5 backdrop-blur-xl p-8">

        <h1 className="text-3xl font-bold text-white">
          Reset Password
        </h1>

        <p className="mt-2 text-gray-400">
          Mee new password create cheyyandi.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl bg-black/40 border border-cyan-500/20 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded-xl bg-black/40 border border-cyan-500/20 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 font-bold text-white transition hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

        {message && (
          <p className="mt-5 text-center text-cyan-300">
            {message}
          </p>
        )}

      </div>
    </main>
  );
}