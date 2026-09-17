"use client";

import Image from "next/image";

const coins = [
  {
    src: "/coins/bitcoin.png",
    left: "8%",
    delay: "0s",
    duration: "7s",
    size: 48,
  },
  {
    src: "/coins/ethereum.png",
    left: "28%",
    delay: "2s",
    duration: "8s",
    size: 42,
  },
  {
    src: "/coins/solana.png",
    left: "48%",
    delay: "4s",
    duration: "6.5s",
    size: 38,
  },
  {
    src: "/coins/usdt.png",
    left: "68%",
    delay: "1s",
    duration: "7.5s",
    size: 44,
  },
  {
    src: "/coins/bnb.png",
    left: "85%",
    delay: "3s",
    duration: "8.5s",
    size: 42,
  },
];

export default function FlyingCoins() {
  return (
    <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-[48%] overflow-hidden">
      {coins.map((coin, index) => (
        <div
          key={index}
          className="absolute -top-20 animate-crypto-fall"
          style={{
            left: coin.left,
            animationDelay: coin.delay,
            animationDuration: coin.duration,
          }}
        >
          <Image
            src={coin.src}
            alt=""
            width={coin.size}
            height={coin.size}
            className="drop-shadow-[0_0_18px_rgba(0,200,255,0.45)]"
          />
        </div>
      ))}
    </div>
  );
}