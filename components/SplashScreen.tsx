"use client";

export default function SplashScreen({ onExplore }: { onExplore: () => void }) {
  return (
    <main className="striverse-splash" aria-label="STRIVERSE welcome">
      <div className="striverse-splash-brand" aria-label="STRIVERSE — Enlightening The Wealth">
        <div className="striverse-splash-logo-crop">
          <img src="/striverse-header-logo.png" alt="STRIVERSE" draggable={false} />
        </div>
        <div className="striverse-splash-tagline">Enlightening The Wealth</div>
      </div>

      <button
        type="button"
        className="striverse-splash-explore"
        aria-label="Explore STRIVERSE"
        onClick={onExplore}
      >
        <span>EXPLORE</span><span aria-hidden="true">→</span>
      </button>
    </main>
  );
}
