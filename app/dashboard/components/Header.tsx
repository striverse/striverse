"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Gift,
  User,
  LogOut,
} from "lucide-react";

interface HeaderProps {
  userName: string;
  notificationCount: number;
  onLogout: () => void;
  onNotifications: () => void;
  onReferral: () => void;
}

export default function Header({
  userName,
  notificationCount,
  onLogout,
  onNotifications,
  onReferral,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const firstLetter =
    userName?.charAt(0).toUpperCase() || "U";

  return (
    <header className="w-full">
      <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="group flex items-center gap-3"
            >
              <Image
                src="/logo1.png"
                alt="STRIVERSE"
                width={52}
                height={52}
                priority
                className="transition duration-500 group-hover:rotate-12 group-hover:scale-110"
              />

              <div className="flex flex-col">
  <div className="relative h-[42px] w-[210px] overflow-hidden">
    <Image
      src="/striverse-wordmark.png"
      alt="STRIVERSE"
      fill
      priority
      sizes="210px"
      className="object-contain object-left animate-[logoBlink_2.5s_ease-in-out_infinite]"
    />
  </div>

  <p className="mt-1 text-xs uppercase tracking-[3px] text-cyan-300">
    Investor Dashboard
  </p>
</div>
            </Link>
          </div>

          {/* Right */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Notification */}
            <button
              onClick={onNotifications}
              className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              <Bell size={20} />

              {notificationCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Referral */}
            <button
              onClick={onReferral}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              <Gift size={20} />
            </button>

            {/* Profile */}
            <Link href="/dashboard/profile">
              <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-300">
                <User size={20} />
              </button>
            </Link>

            {/* Avatar */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-bold text-white shadow-lg">
              {firstLetter}
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 font-semibold text-red-300 transition-all duration-300 hover:bg-red-500 hover:text-white"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mt-8 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-4xl font-bold text-white">
              Welcome {userName}
            </h2>

            <p className="mt-2 text-gray-400">
              
                          </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-right backdrop-blur">
            <p className="text-sm text-gray-400">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <p className="mt-1 text-2xl font-bold text-cyan-300">
              {currentTime.toLocaleTimeString("en-US")}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}