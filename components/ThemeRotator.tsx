"use client";

import { useEffect } from "react";

export default function ThemeRotator() {
  useEffect(() => {
    const saved = localStorage.getItem("striverse-theme");
    document.documentElement.dataset.mode = saved === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = "blue";
  }, []);

  return null;
}
