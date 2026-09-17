"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phrase, setPhrase] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method:"POST", headers:{"Content-Type":"application/json"}, credentials:"include", body:JSON.stringify({email, recoveryPhrase:phrase}) });
      const data = await res.json();
      if (!res.ok) return alert(data.message);
      router.replace(data.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard"); router.refresh();
    } catch { alert("Something went wrong."); } finally { setLoading(false); }
  }
  return <main className="min-h-screen flex items-center justify-center bg-[#03040a] px-5 text-white">
    <div className="w-full max-w-md rounded-[30px] border border-cyan-500/20 bg-white/[.06] backdrop-blur-2xl p-7 shadow-[0_0_70px_rgba(95,50,255,.16)]">
      <div className="text-center mb-8"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 border border-cyan-300/20"><ShieldCheck /></div><h1 className="text-3xl font-bold">Welcome Back</h1><p className="text-white/50 mt-2">Sign in with your recovery phrase.</p></div>
      <form onSubmit={handleLogin} className="space-y-5">
        <input type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full rounded-xl bg-black/40 border border-cyan-500/20 px-4 py-4 outline-none focus:border-cyan-400"/>
        <textarea placeholder="Enter your 12-word recovery phrase" value={phrase} onChange={e=>setPhrase(e.target.value)} required rows={4} className="w-full resize-none rounded-xl bg-black/40 border border-cyan-500/20 px-4 py-4 outline-none focus:border-cyan-400"/>
        <button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 py-4 font-bold disabled:opacity-60">{loading?"Verifying…":"Sign In Securely"}</button>
      </form>
      <p className="mt-6 text-center text-white/50">Don't have an account? <button onClick={()=>router.push("/register")} className="text-cyan-400">Register</button></p>
      <p className="mt-4 text-center text-xs text-white/35">Lost your phrase? Recovery requires the one-time admin recovery process.</p>
    </div>
  </main>;
}
