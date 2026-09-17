"use client";

import { useEffect, useState } from "react";

interface CounterProps {
  end: number;
}

export default function Counter({ end }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;

    const interval = setInterval(() => {
      current++;

      if (current >= end) {
        current = end;
        clearInterval(interval);
      }

      setCount(current);
    }, 30);

    return () => clearInterval(interval);
  }, [end]);

  return <>{count}%</>;
}