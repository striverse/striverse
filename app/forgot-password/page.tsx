"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      setMessage(data.message);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050816] px-6">
      <div className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-white/5 backdrop-blur-xl p-8">

        <h1 className="text-3xl font-bold text-white">
          Forgot Password?
        </h1>

        <p className="mt-2 text-gray-400">
          Enter Email
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl bg-black/40 border border-cyan-500/20 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 font-bold text-white transition hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        

        <p className="mt-6 text-center text-gray-400">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Sign In
          </Link>
        </p>

      </div>
    </main>
  );
}