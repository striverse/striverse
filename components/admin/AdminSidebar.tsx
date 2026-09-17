"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, Gift, Bell, Settings, ShieldCheck, BarChart3, Wallet, Megaphone, UserCog, ListTodo, Wrench, Target, Banknote, KeyRound } from "lucide-react";

const items=[
 ["Dashboard","/admin/dashboard",LayoutDashboard,"all"],["Users","/admin/users",Users,"all"],["Purchases","/admin/purchases",CreditCard,"all"],["Withdrawals","/admin/withdrawals",Banknote,"all"],["Partner Program","/admin/referrals",Gift,"all"],["Finance","/admin/finance",Wallet,"developer"],["Campaigns & Incentives","/admin/campaigns",Target,"developer"],["Banners & Notifications","/admin/banners",Megaphone,"developer"],["Notifications","/admin/notifications",Bell,"all"],["Recovery Reset","/admin/recovery",KeyRound,"all"],["Analytics","/admin/analytics",BarChart3,"all"],["Admin Management","/admin/admins",UserCog,"developer"],["Tasks","/admin/tasks",ListTodo,"developer"],["Security & Audit","/admin/audit",ShieldCheck,"developer"],["App Settings","/admin/settings",Settings,"developer"],["Maintenance","/admin/maintenance",Wrench,"developer"],
] as const;
export default function AdminSidebar(){
 const pathname=usePathname(); const [role,setRole]=React.useState(""); const [permissions,setPermissions]=React.useState<string[]>([]);
 React.useEffect(()=>{fetch('/api/admin/me',{cache:'no-store'}).then(r=>r.json()).then(d=>{setRole(d.admin?.role||'');setPermissions(d.admin?.permissions||[]);});},[]);
 return <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-[#08101F]">
  <div className="border-b border-white/10 px-6 py-7"><div className="text-2xl font-black tracking-[.16em] text-white">STRIVERSE</div><div className="mt-1 text-[10px] uppercase tracking-[.3em] text-cyan-300">Control Center</div><div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-slate-400">{role||'Staff'} session</div></div>
  <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">{items.filter(x=>x[3]==='all' ? (role==='DEVELOPER'||permissions.includes(`${String(x[1]).replace('/admin/','')}:VIEW`)||permissions.includes(String(x[1]))) : role==='DEVELOPER').map(([title,href,Icon])=>{const active=pathname===href;return <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active?'bg-cyan-400/10 text-cyan-200 border border-cyan-400/20':'text-slate-400 hover:bg-white/5 hover:text-white'}`}><Icon size={17}/><span>{title}</span></Link>})}</nav>
  <div className="border-t border-white/10 p-4"><Link href="/login/admin" className="block rounded-xl border border-red-400/15 bg-red-400/5 px-4 py-3 text-center text-sm font-semibold text-red-300">Logout</Link></div>
 </aside>
}
