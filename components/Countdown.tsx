"use client";

import { useEffect, useState } from "react";

export default function Countdown() {
  const [targetDate, setTargetDate] = useState<number | null>(null);

  const [time, setTime] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // Load Presale End Date
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/presale/stats", {
          cache: "no-store",
        });

        const data = await res.json();

        if (res.ok) {
          setTargetDate(new Date(data.endDate).getTime());
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadSettings();
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(timer);

        setTime({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });

        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) /
          (1000 * 60)
      );
      const seconds = Math.floor(
        (distance % (1000 * 60)) / 1000
      );

      setTime({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const Card = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <div className="glass rounded-xl p-6 text-center w-28">
      <h2 className="text-4xl font-bold text-cyan-400">
        {value}
      </h2>

      <p className="text-gray-400 mt-2">
        {label}
      </p>
    </div>
  );

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-4xl font-bold mb-10">
          Presale Ends In
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          <Card label="Days" value={time.days} />
          <Card label="Hours" value={time.hours} />
          <Card label="Minutes" value={time.minutes} />
          <Card label="Seconds" value={time.seconds} />
        </div>

      </div>
    </section>
  );
}