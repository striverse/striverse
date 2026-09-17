"use client";

const stars = [
  { id: 1, top: "5%", left: "8%", size: 2, delay: "0s", duration: "2s" },
  { id: 2, top: "12%", left: "22%", size: 3, delay: "1s", duration: "3s" },
  { id: 3, top: "18%", left: "70%", size: 2, delay: "2s", duration: "2.5s" },
  { id: 4, top: "8%", left: "88%", size: 2, delay: "0.5s", duration: "3s" },
  { id: 5, top: "28%", left: "12%", size: 3, delay: "1.5s", duration: "2.8s" },
  { id: 6, top: "36%", left: "34%", size: 2, delay: "2.2s", duration: "2.4s" },
  { id: 7, top: "42%", left: "58%", size: 3, delay: "0.7s", duration: "3.2s" },
  { id: 8, top: "30%", left: "84%", size: 2, delay: "2.8s", duration: "2.3s" },
  { id: 9, top: "56%", left: "18%", size: 2, delay: "1.3s", duration: "2.7s" },
  { id: 10, top: "62%", left: "42%", size: 3, delay: "0.4s", duration: "3s" },
  { id: 11, top: "68%", left: "74%", size: 2, delay: "2.1s", duration: "2.6s" },
  { id: 12, top: "78%", left: "90%", size: 3, delay: "1.7s", duration: "3.1s" },
  { id: 13, top: "84%", left: "10%", size: 2, delay: "0.8s", duration: "2.2s" },
  { id: 14, top: "90%", left: "36%", size: 3, delay: "2.5s", duration: "3.3s" },
  { id: 15, top: "82%", left: "62%", size: 2, delay: "1.1s", duration: "2.5s" },
  { id: 16, top: "14%", left: "48%", size: 2, delay: "2.4s", duration: "3s" },
  { id: 17, top: "24%", left: "96%", size: 3, delay: "0.2s", duration: "2.7s" },
  { id: 18, top: "48%", left: "6%", size: 2, delay: "1.9s", duration: "3.2s" },
  { id: 19, top: "72%", left: "52%", size: 3, delay: "0.6s", duration: "2.9s" },
  { id: 20, top: "94%", left: "78%", size: 2, delay: "2.7s", duration: "2.4s" },
];

export default function Stars() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      {stars.map((star) => (
        <span
          key={star.id}
          className="hero-star"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}
    </div>
  );
}