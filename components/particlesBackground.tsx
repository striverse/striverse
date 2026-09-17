"use client";

/**
 * Lightweight decorative background.
 * Kept dependency-free so the production build does not require tsParticles.
 */
export default function ParticlesBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <div className="absolute left-[8%] top-[12%] h-1 w-1 rounded-full bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
      <div className="absolute left-[22%] top-[34%] h-1 w-1 rounded-full bg-white/60 shadow-[0_0_9px_rgba(255,255,255,0.7)]" />
      <div className="absolute left-[44%] top-[18%] h-1 w-1 rounded-full bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
      <div className="absolute left-[67%] top-[28%] h-1 w-1 rounded-full bg-white/60 shadow-[0_0_9px_rgba(255,255,255,0.7)]" />
      <div className="absolute left-[84%] top-[15%] h-1 w-1 rounded-full bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
      <div className="absolute left-[76%] top-[54%] h-1 w-1 rounded-full bg-white/60 shadow-[0_0_9px_rgba(255,255,255,0.7)]" />
      <div className="absolute left-[31%] top-[72%] h-1 w-1 rounded-full bg-white/60 shadow-[0_0_9px_rgba(255,255,255,0.7)]" />
      <div className="absolute left-[58%] top-[82%] h-1 w-1 rounded-full bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
    </div>
  );
}
