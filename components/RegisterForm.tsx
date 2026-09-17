"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, ShieldCheck, Sparkles } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [recoveryPhrase, setRecoveryPhrase] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setReferralCode(ref.toUpperCase());
  }, [searchParams]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!referralCode.trim()) return alert("Partner Code is required.");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, referralCode }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message); return; }
      setRecoveryPhrase(data.recoveryPhrase);
    } catch { alert("Registration failed."); }
    finally { setLoading(false); }
  }

  if (recoveryPhrase) return (
    <section className="min-h-screen flex items-center justify-center px-5 py-10 bg-[#03040a] text-white">
      <div className="w-full max-w-md rounded-[30px] border border-cyan-400/20 bg-white/[.06] backdrop-blur-2xl p-6 shadow-[0_0_70px_rgba(95,50,255,.16)]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 border border-cyan-300/20"><ShieldCheck /></div>
          <h1 className="text-2xl font-bold">Your Recovery Phrase</h1>
          <p className="text-sm text-white/55 mt-2">Save all 12 words offline. This phrase is shown only once and is required for recovery login.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-6 rounded-2xl bg-black/45 border border-white/10 p-4">
          {recoveryPhrase.split(" ").map((w,i)=><div key={i} className="rounded-xl bg-white/[.05] px-3 py-2 text-sm"><span className="text-cyan-300/45 mr-2">{i+1}</span>{w}</div>)}
        </div>
        <button onClick={()=>{navigator.clipboard?.writeText(recoveryPhrase);setSaved(true)}} className="mt-5 w-full rounded-xl border border-cyan-400/30 py-3 flex items-center justify-center gap-2"> <Copy size={17}/> {saved ? "Phrase Copied" : "Copy Phrase"}</button>
        <button disabled={!saved} onClick={()=>router.push("/login")} className="mt-3 w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 py-3 font-bold disabled:opacity-40">I Saved It — Continue</button>
      </div>
    </section>
  );

  return <section className="min-h-screen flex items-center justify-center px-5 py-10 bg-[#03040a] text-white">
    <form onSubmit={handleRegister} className="w-full max-w-md rounded-[30px] border border-cyan-500/20 bg-white/[.06] backdrop-blur-2xl p-6 shadow-[0_0_70px_rgba(95,50,255,.16)]">
      <div className="text-center mb-7"><div className="inline-flex mb-4 rounded-2xl p-3 bg-gradient-to-br from-cyan-400/20 to-violet-500/20"><Sparkles /></div><h1 className="text-3xl font-bold">Join Striverse</h1><p className="text-white/50 mt-2">Create your cosmic wallet account</p></div>
      <div className="space-y-4">
        {([["fullName","Full Name","text"],["email","Email Address","email"],["phone","Phone Number","tel"]] as const).map(([name,ph,type])=><input key={name} name={name} type={type} placeholder={ph} value={form[name]} onChange={e=>setForm({...form,[name]:e.target.value})} required className="w-full rounded-xl bg-black/40 border border-cyan-500/20 p-4 outline-none focus:border-cyan-400"/>)}
        <input value={referralCode} onChange={e=>setReferralCode(e.target.value.toUpperCase())} placeholder="Partner Code *" required readOnly={!!searchParams.get("ref")} className="w-full rounded-xl bg-black/40 border border-cyan-500/20 p-4 outline-none focus:border-cyan-400"/>
        <p className="text-xs text-white/40">A valid referral code is required.</p>
      </div>
      <button disabled={loading} className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 py-4 font-bold disabled:opacity-60">{loading?"Creating Wallet…":"Create Account"}</button>
      <p className="mt-5 text-center text-white/50">Already registered? <Link href="/login" className="text-cyan-400">Sign In</Link></p>
    </form>
  </section>;
}
