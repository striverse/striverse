"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Login failed.");
      if (data.user?.role !== "ADMIN" && data.user?.role !== "DEVELOPER") {
        return alert("Admin or Developer access required.");
      }
      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#03040a] px-5 text-white">
      <div className="w-full max-w-md rounded-[30px] border border-cyan-500/20 bg-white/[.06] backdrop-blur-2xl p-7 shadow-[0_0_70px_rgba(95,50,255,.16)]">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 border border-cyan-300/20">
            <ShieldCheck />
          </div>
          <p className="text-xs uppercase tracking-[.3em] text-cyan-300/70">Secure Access</p>
          <h1 className="mt-2 text-3xl font-bold">Admin / Developer Login</h1>
          <p className="text-white/50 mt-2">Sign in with your email and password.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-xl bg-black/40 border border-cyan-500/20 px-4 py-4 outline-none focus:border-cyan-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-xl bg-black/40 border border-cyan-500/20 px-4 py-4 outline-none focus:border-cyan-400"
          />
          <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 py-4 font-bold disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
