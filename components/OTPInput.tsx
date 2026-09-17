"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function OTPInput() {
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(120);

  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const email = sessionStorage.getItem("pendingEmail");

    if (!email) {
      router.replace("/register");
    }
  }, [router]);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;

    const copy = [...otp];
    copy[index] = value;
    setOtp(copy);

    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  async function verifyOTP() {
    const code = otp.join("");

    if (code.length !== 6) {
      alert("Please enter the complete OTP.");
      return;
    }

    const email = sessionStorage.getItem("pendingEmail");

    if (!email) {
      alert("Registration session expired.");
      router.replace("/register");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      sessionStorage.removeItem("pendingEmail");

      alert("Email verified successfully.");

      router.replace("/");
    } catch (error) {
      console.error(error);
      alert("OTP verification failed.");
    } finally {
      setLoading(false);
    }
  }

  function resendOTP() {
    alert("Resend OTP will be added in the next step.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#050816]">
      <div className="w-full max-w-lg rounded-3xl border border-cyan-500/20 bg-white/5 backdrop-blur-xl p-10">

        <h1 className="text-4xl font-bold text-white mb-3">
          Verify OTP
        </h1>

        <p className="text-gray-400 mb-8">
          Enter the 6-digit OTP sent to your email.
        </p>

        <div className="flex justify-between gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                refs.current[index] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength={1}
              className="h-14 w-14 rounded-xl border border-cyan-500/20 bg-black/40 text-center text-2xl text-white outline-none focus:border-cyan-400"
            />
          ))}
        </div>

        <p className="mt-6 text-center text-gray-400">
          OTP expires in{" "}
          <span className="font-bold text-red-400">
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </span>
        </p>

        <button
          onClick={verifyOTP}
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 py-4 font-bold hover:scale-105 transition disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={resendOTP}
          disabled={seconds > 0}
          className={`mt-5 w-full font-semibold transition ${
            seconds > 0
              ? "text-gray-500 cursor-not-allowed"
              : "text-cyan-400 hover:text-cyan-300"
          }`}
        >
          {seconds > 0
            ? `Resend OTP (${seconds}s)`
            : "Resend OTP"}
        </button>

      </div>
    </div>
  );
}