"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";



const features = [
  ["01", "Invest", "Grow your portfolio with clear STV ecosystem opportunities.", "invest"],
  ["02", "Stake", "Earn rewards while supporting the network and community.", "stake"],
  ["03", "Vest", "Track long-term allocations and unlocks with clear visibility.", "vest"],
  ["04", "Airdrops", "Be part of community campaigns, rewards and exclusive drops.", "airdrop"],
];

const distribution = [
  ["Community & Airdrop", "Community allocation"],
  ["Staking Rewards", "Rewards reserve"],
  ["Ecosystem Growth", "Development & expansion"],
  ["Liquidity", "Market liquidity"],
  ["Team & Operations", "Long-term operations"],
];

const roadmap = [
  ["01", "Genesis", "STRIVERSE launch, STV token launch, website, documentation and community foundation.", "◈"],
  ["02", "Liquidity", "Presale completion, DEX liquidity, trading launch and transparent token distribution.", "◉"],
  ["03", "Earn", "STV staking, vesting, rewards and community incentive programs.", "✦"],
  ["04", "Govern", "Community governance, ecosystem proposals and treasury participation.", "⌁"],
  ["05", "Scale", "CEX expansion, DeFi integrations, cross-chain growth, mobile experiences and strategic partnerships.", "↗"],
];

function FeatureIcon({ type }: { type: string }) {
  const common = { viewBox: "0 0 64 64", "aria-hidden": true as const };
  if (type === "invest") return (
    <svg {...common}>
      <defs><linearGradient id="investLogo" x1="8" y1="56" x2="56" y2="8"><stop stopColor="#19d9eb"/><stop offset="1" stopColor="#7b55ff"/></linearGradient></defs>
      <path d="M32 5 56 19v26L32 59 8 45V19L32 5Z" fill="none" stroke="url(#investLogo)" strokeWidth="2.5"/>
      <path d="m17 39 10-10 7 6 13-15" fill="none" stroke="#63e9f5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M43 20h4v4" fill="none" stroke="#a78bff" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
  if (type === "stake") return (
    <svg {...common}>
      <defs><linearGradient id="stakeLogo" x1="10" y1="54" x2="54" y2="10"><stop stopColor="#18dce9"/><stop offset="1" stopColor="#8b55ff"/></linearGradient></defs>
      <circle cx="32" cy="32" r="25" fill="none" stroke="url(#stakeLogo)" strokeWidth="2.5"/>
      <path d="M20 23h19a8 8 0 0 1 0 16H25a5 5 0 0 0 0 10h17" fill="none" stroke="#65eaf4" strokeWidth="4" strokeLinecap="round"/>
      <path d="M32 14v36" stroke="#a98cff" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
  if (type === "vest") return (
    <svg {...common}>
      <defs><linearGradient id="vestLogo" x1="8" y1="56" x2="56" y2="8"><stop stopColor="#23d9e9"/><stop offset="1" stopColor="#8157ff"/></linearGradient></defs>
      <path d="M32 6 53 18v24L32 54 11 42V18L32 6Z" fill="none" stroke="url(#vestLogo)" strokeWidth="2.5"/>
      <circle cx="32" cy="31" r="11" fill="none" stroke="#64e7f3" strokeWidth="3.5"/>
      <path d="M32 23v9l6 4" fill="none" stroke="#b092ff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M27 12h10" stroke="#64e7f3" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
  useEffect(() => {
    const clampTokenomicsScroll = () => {
      const site = document.querySelector<HTMLElement>(".reference-site");
      if (site?.dataset.activeSection !== "tokenomics") return;

      const section = document.getElementById("tokenomics");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      if (rect.bottom < window.innerHeight) {
        window.scrollTo({
          top: Math.max(0, window.scrollY + rect.bottom - window.innerHeight),
          behavior: "auto",
        });
      } else if (rect.top > 0 && window.scrollY > section.offsetTop) {
        window.scrollTo({
          top: section.offsetTop,
          behavior: "auto",
        });
      }
    };

    window.addEventListener("scroll", clampTokenomicsScroll, { passive: true });
    return () => window.removeEventListener("scroll", clampTokenomicsScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(max-width: 900px)").matches) return;

    const ids = ["features", "about", "tokenomics", "roadmap", "staking", "vesting", "more", "community"];
    let locked = false;
    let unlockTimer: number | undefined;

    const getTargets = () => {
      const navHeight = document.querySelector<HTMLElement>(".reference-nav-wrap")?.offsetHeight ?? 0;
      const offset = navHeight + 12;

      return [
        { id: "home", top: 0 },
        ...ids
          .map((id) => document.getElementById(id))
          .filter((section): section is HTMLElement => Boolean(section))
          .map((section) => ({
            id: section.id,
            top: Math.max(0, section.getBoundingClientRect().top + window.scrollY - offset),
          })),
      ];
    };

    const moveOneSection = (direction: 1 | -1) => {
      if (locked) return;

      const targets = getTargets();
      if (!targets.length) return;

      const currentY = window.scrollY;
      let targetIndex = -1;

      if (direction > 0) {
        targetIndex = targets.findIndex((target) => target.top > currentY + 40);
      } else {
        for (let index = targets.length - 1; index >= 0; index -= 1) {
          if (targets[index].top < currentY - 40) {
            targetIndex = index;
            break;
          }
        }
      }

      if (targetIndex < 0) return;

      locked = true;
      window.clearTimeout(unlockTimer);
      window.scrollTo({
        top: targets[targetIndex].top,
        behavior: "smooth",
      });

      unlockTimer = window.setTimeout(() => {
        locked = false;
      }, 750);
    };

    const onWheel = (event: WheelEvent) => {
      const site = document.querySelector<HTMLElement>(".reference-site");
      if (site?.dataset.activeSection && site.dataset.activeSection !== "home") return;
      if (Math.abs(event.deltaY) < 10 || locked) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const targets = getTargets();
      const currentY = window.scrollY;

      const hasTarget = direction > 0
        ? targets.some((target) => target.top > currentY + 40)
        : targets.some((target) => target.top < currentY - 40);

      if (!hasTarget) return;

      event.preventDefault();
      moveOneSection(direction);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(unlockTimer);
    };
  }, []);

  return (
    <svg {...common}>
      <defs><linearGradient id="airdropLogo" x1="8" y1="56" x2="56" y2="8"><stop stopColor="#19dce9"/><stop offset="1" stopColor="#9b50ff"/></linearGradient></defs>
      <path d="M32 7 39 24l18 8-18 8-7 17-7-17-18-8 18-8 7-17Z" fill="none" stroke="url(#airdropLogo)" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M32 17v20M22 27h20" stroke="#69eaf5" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="m48 10 2 5m2-2-5 2" stroke="#ad8cff" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState("home");

  useEffect(() => {
    const syncView = () => {
      const hash = window.location.hash.replace("#", "");
      setActiveView(hash || "home");
    };
    const onSectionChange = (event: Event) => {
      const section = (event as CustomEvent<{ section?: string }>).detail?.section;
      setActiveView(section || "home");
    };
    syncView();
    window.addEventListener("hashchange", syncView);
    window.addEventListener("striverse-section-change", onSectionChange);
    return () => {
      window.removeEventListener("hashchange", syncView);
      window.removeEventListener("striverse-section-change", onSectionChange);
    };
  }, []);

  return (
    <main className="reference-site community-fit" data-active-section={activeView}>
      <Navbar />
      <style jsx global>{`

        @media (max-width: 900px){
          html{scroll-behavior:smooth;scroll-padding-top:92px}
          .reference-site{scroll-snap-type:y proximity;overscroll-behavior-y:auto}
          .reference-site>.site-section{scroll-snap-align:start;scroll-snap-stop:normal}
          .reference-site>.community-section{scroll-snap-align:start}
          .token-section{
            min-height:calc(100svh - 92px)!important;
            height:calc(100svh - 92px)!important;
            scroll-margin-top:92px!important
          }
          .tokenomics-reference-image-wrap{
            width:100%!important;
            height:calc(100svh - 92px)!important;
            min-height:0!important;
            max-height:calc(100svh - 92px)!important;
            aspect-ratio:auto!important;
            padding:0!important
          }
          .tokenomics-reference-image{
            width:100%!important;
            height:auto!important;
            max-width:100%!important;
            max-height:100%!important;
            min-height:0!important;
            object-fit:contain!important
          }
          .roadmap-section{
            min-height:auto!important;
            height:auto!important;
            scroll-margin-top:92px!important
          }
          .community-fit .community-section{
            min-height:calc(100svh - 92px)!important;
            height:auto!important;
            scroll-margin-top:92px!important
          }
        }

        .roadmap-section{
          position:relative;
          isolation:isolate;
          overflow:hidden;
          min-height:calc(100vh - 84px);
          padding:54px 0 58px!important;
          background:
            radial-gradient(circle at 12% 15%,rgba(52,226,255,.12),transparent 25%),
            radial-gradient(circle at 88% 20%,rgba(123,82,255,.12),transparent 26%),
            linear-gradient(180deg,#030b1d 0%,#020714 100%)!important
        }
        .roadmap-section::before{
          content:"";
          position:absolute;inset:0;pointer-events:none;z-index:-1;
          background-image:linear-gradient(rgba(100,205,235,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(100,205,235,.045) 1px,transparent 1px);
          background-size:64px 64px;
          mask-image:linear-gradient(to bottom,transparent,black 10%,black 90%,transparent)
        }
        .roadmap-shell{position:relative}
        .roadmap-topline{
          display:flex;align-items:flex-end;justify-content:space-between;gap:60px;
          margin-bottom:54px
        }
        .roadmap-topline h2{
          margin:10px 0 0!important;
          font-size:clamp(48px,5.8vw,78px)!important;
          line-height:.9!important;
          letter-spacing:-.055em!important
        }
        .roadmap-topline h2 span{
          color:#55dce9;
          text-shadow:0 0 28px rgba(85,220,233,.16)
        }
        .roadmap-intro{
          width:min(390px,34%);
          margin:0 0 4px!important;
          color:#8e9db5!important;
          font-size:14px!important;
          line-height:1.65!important
        }
        .roadmap-track{
          position:relative;
          display:grid;
          grid-template-columns:repeat(5,minmax(0,1fr));
          gap:14px;
          padding-top:22px
        }
        .roadmap-track-line{
          position:absolute;
          left:4%;
          right:4%;
          top:8px;
          height:1px;
          background:linear-gradient(90deg,#35e4f2 0%,#6c72ff 25%,#f05bd8 50%,#ffb34f 75%,#42e6a5 100%);
          opacity:.55;
          box-shadow:0 0 22px rgba(73,220,240,.28)
        }
        .roadmap-track-line::before,.roadmap-track-line::after{
          content:"";
          position:absolute;top:50%;width:7px;height:7px;border-radius:50%;
          background:#58e1ed;box-shadow:0 0 14px #58e1ed;
          transform:translateY(-50%)
        }
        .roadmap-track-line::before{left:-1px}.roadmap-track-line::after{right:-1px;background:#43e5a6;box-shadow:0 0 14px #43e5a6}
        .crypto-roadmap-card{
          position:relative;
          min-height:338px!important;
          padding:22px!important;
          border-radius:24px!important;
          background:linear-gradient(180deg,rgba(11,29,58,.96),rgba(3,10,25,.98))!important;
          border:1px solid rgba(96,205,231,.16)!important;
          box-shadow:inset 0 1px 0 rgba(255,255,255,.045),0 22px 60px rgba(0,0,0,.22)!important;
          overflow:hidden;
          transition:transform .3s ease,border-color .3s ease,box-shadow .3s ease
        }
        .crypto-roadmap-card::before{
          content:"";position:absolute;inset:0;pointer-events:none;
          background:linear-gradient(145deg,rgba(72,221,255,.08),transparent 38%,rgba(120,76,255,.05))
        }
        .crypto-roadmap-card::after{
          content:"";position:absolute;right:-75px;bottom:-95px;width:220px;height:220px;border-radius:50%;
          background:radial-gradient(circle,rgba(64,222,255,.12),transparent 68%);pointer-events:none
        }
        .roadmap-card-top{
          position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between
        }
        .roadmap-index{
          display:inline-flex;align-items:center;justify-content:center;
          width:42px;height:28px;border-radius:9px;
          background:#54e2ef;color:#061526;font-size:10px;font-weight:950;letter-spacing:.12em;
          box-shadow:0 0 20px rgba(84,226,239,.2)
        }
        .roadmap-status{
          padding:6px 9px;border:1px solid rgba(145,168,201,.16);border-radius:999px;
          color:#7285a1;font-size:8px;letter-spacing:.14em;font-weight:800
        }
        .roadmap-node{
          position:relative;z-index:2;
          width:54px;height:54px;margin:24px 0 20px;
          display:grid;place-items:center;border-radius:18px;
          background:radial-gradient(circle at 35% 25%,rgba(70,226,255,.22),rgba(6,18,40,.88) 68%);
          border:1px solid rgba(79,220,239,.36);
          color:#5de4f1;font-size:25px;
          box-shadow:0 0 30px rgba(61,214,240,.12),inset 0 0 22px rgba(70,225,245,.06)
        }
        .phase-02 .roadmap-node{color:#b28bff;border-color:rgba(178,139,255,.42);background:radial-gradient(circle at 35% 25%,rgba(143,100,255,.22),rgba(11,12,38,.9) 68%)}
        .phase-03 .roadmap-node{color:#ff72d2;border-color:rgba(255,114,210,.42);background:radial-gradient(circle at 35% 25%,rgba(255,75,198,.2),rgba(33,11,39,.9) 68%)}
        .phase-04 .roadmap-node{color:#ffc35f;border-color:rgba(255,195,95,.42);background:radial-gradient(circle at 35% 25%,rgba(255,172,54,.2),rgba(38,24,10,.9) 68%)}
        .phase-05 .roadmap-node{color:#47e7aa;border-color:rgba(71,231,170,.42);background:radial-gradient(circle at 35% 25%,rgba(49,231,164,.2),rgba(8,34,28,.9) 68%)}
        .roadmap-card-copy{position:relative;z-index:2}
        .roadmap-phase-label{
          margin:0 0 7px!important;color:#607691!important;font-size:9px!important;font-weight:800!important;letter-spacing:.18em!important
        }
        .roadmap-card-copy h3{
          margin:0!important;font-size:27px!important;letter-spacing:-.035em!important
        }
        .roadmap-card-copy>p:last-child{
          margin:13px 0 0!important;color:#91a2bb!important;font-size:12px!important;line-height:1.6!important
        }
        .roadmap-card-footer{
          position:absolute;left:22px;right:22px;bottom:19px;
          display:flex;align-items:center;gap:10px;color:#526781;font-size:8px;font-weight:900;letter-spacing:.17em
        }
        .roadmap-card-footer i{
          height:1px;flex:1;background:rgba(112,137,169,.16);position:relative
        }
        .roadmap-card-footer i::after{
          content:"";position:absolute;left:0;top:-1px;width:28%;height:3px;border-radius:4px;background:#55dce9;box-shadow:0 0 12px rgba(85,220,233,.4)
        }
        .phase-02{border-color:rgba(145,104,255,.28)!important}.phase-03{border-color:rgba(255,78,197,.28)!important}.phase-04{border-color:rgba(255,178,62,.28)!important}.phase-05{border-color:rgba(63,229,166,.28)!important}
        .crypto-roadmap-card:hover{transform:translateY(-8px);border-color:rgba(85,224,240,.5)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 30px 80px rgba(23,185,245,.13)!important}
        @media(max-width:1050px){
          .roadmap-section{min-height:auto;padding:64px 0!important}
          .roadmap-topline{align-items:flex-start;flex-direction:column;gap:22px}
          .roadmap-intro{width:100%;max-width:620px}
          .roadmap-track{grid-template-columns:repeat(2,minmax(0,1fr));padding-top:0}
          .roadmap-track-line{display:none}
          .crypto-roadmap-card{min-height:310px!important}
        }
        @media(max-width:650px){
          .roadmap-section{padding:46px 0 52px!important}
          .roadmap-topline h2{font-size:46px!important}
          .roadmap-track{grid-template-columns:1fr;gap:12px}
          .crypto-roadmap-card{min-height:280px!important;padding:20px!important}
          .roadmap-node{margin:18px 0 16px}
          .roadmap-card-footer{left:20px;right:20px}
        }


        /* Tokenomics: one original 16:9 image, no side extensions or cropping */
        #tokenomics.token-section{
          width:100%!important;
          max-width:none!important;
          min-height:0!important;
          height:auto!important;
          margin:0!important;
          padding:0!important;
          overflow:hidden!important;
          background:#01030d!important
        }
        #tokenomics .tokenomics-reference-image-wrap{
          width:100%!important;
          max-width:none!important;
          height:auto!important;
          min-height:0!important;
          margin:0!important;
          padding:0!important;
          display:block!important;
          overflow:hidden!important;
          background:#01030d!important
        }
        #tokenomics .tokenomics-reference-image{
          display:block!important;
          width:100%!important;
          height:auto!important;
          max-width:none!important;
          max-height:none!important;
          min-width:0!important;
          min-height:0!important;
          margin:0!important;
          object-fit:initial!important;
          object-position:center center!important
        }
        @media (max-width:900px){
          #tokenomics.token-section{min-height:0!important;height:auto!important}
          #tokenomics .tokenomics-reference-image-wrap{height:auto!important}
          #tokenomics .tokenomics-reference-image{width:100%!important;height:auto!important}
        }

        /* Navbar focus mode: render only the section selected in the navbar. */
        .reference-site[data-active-section]:not([data-active-section="home"]) > .home-section,
        .reference-site[data-active-section]:not([data-active-section="home"]) > .site-section,
        .reference-site[data-active-section]:not([data-active-section="home"]) > .community-section{display:none!important}
        .reference-site[data-active-section="home"] > .home-section,
        .reference-site[data-active-section="home"] > .site-section,
        .reference-site[data-active-section="home"] > .community-section,
        .reference-site[data-active-section="features"] #features,
        .reference-site[data-active-section="about"] #about,
        .reference-site[data-active-section="tokenomics"] #tokenomics,
        .reference-site[data-active-section="roadmap"] #roadmap,
        .reference-site[data-active-section="staking"] #staking,
        .reference-site[data-active-section="vesting"] #vesting,
        .reference-site[data-active-section="airdrop"] #airdrop,
        .reference-site[data-active-section="more"] #more,
        .reference-site[data-active-section="community"] #community{
          display:block!important;
          visibility:visible!important;
          opacity:1!important;
        }
        .reference-site[data-active-section] > .site-footer{display:none!important}
        .reference-site[data-active-section="airdrop"] #more{display:block!important}
        .reference-site[data-active-section="airdrop"] #more .section-shell>*{display:none!important}
        .reference-site[data-active-section="airdrop"] #more .more-grid{display:block!important}
        .reference-site[data-active-section="airdrop"] #more #airdrop{display:block!important;margin:0 auto!important;max-width:760px!important}

        .reference-site > .home-section,
        .reference-site > .site-section,
        .reference-site > .community-section{
          min-height:calc(100vh - 110px);
          box-sizing:border-box;
          padding-top:110px!important;
          scroll-margin-top:110px!important;
        }
        .reference-site > #tokenomics.token-section{
          padding-top:110px!important;
          height:auto!important;
          min-height:0!important;
        }
        .reference-site > #roadmap.roadmap-section{
          min-height:calc(100vh - 110px)!important;
        }
        .reference-site > .home-section{
          /* Hero already has its own top spacing for the fixed navbar. */
          min-height:0!important;
          padding-top:0!important;
          box-sizing:border-box;
        }
        .reference-site[data-active-section="home"] .reference-hero-live{
          min-height:calc(100vh - 12px)!important;
        }

        .site-section{scroll-margin-top:108px}.reference-nav-wrap.nav-hidden{transform:translateY(calc(-100% - 18px))!important;opacity:0!important;pointer-events:none!important}.community-fit .community-section{min-height:calc(100vh - 96px);height:calc(100vh - 96px);padding:72px 0 48px;display:flex;align-items:center;box-sizing:border-box}.community-fit .community-section h2{font-size:clamp(54px,6.5vw,88px);line-height:.9;margin:12px 0 0}.community-fit .community-section>div>p:not(.section-kicker){margin:22px auto 0;font-size:16px}.community-fit .community-actions{margin-top:26px}.token-section{scroll-margin-top:0;min-height:calc(100vh - 96px)!important;height:calc(100vh - 96px)!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:center!important}.tokenomics-reference-image-wrap{width:100%!important;height:calc(100vh - 96px)!important;min-height:0!important;aspect-ratio:auto!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important}.tokenomics-reference-image{width:auto!important;height:auto!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important;object-position:center center!important}.roadmap-section{position:relative;isolation:isolate;overflow:visible;min-height:calc(100vh - 84px);padding:28px 0 34px!important;background:radial-gradient(circle at 50% 8%,rgba(50,224,255,.13),transparent 30%),radial-gradient(circle at 8% 58%,rgba(107,76,255,.10),transparent 28%),radial-gradient(circle at 92% 78%,rgba(255,67,198,.08),transparent 28%),#020918!important}
        .roadmap-section::before{content:"";position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(92,210,240,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(92,210,240,.045) 1px,transparent 1px);background-size:72px 72px;mask-image:linear-gradient(to bottom,transparent,black 18%,black 82%,transparent);z-index:-1}
        .roadmap-section .section-heading-row{gap:24px!important;align-items:end}.roadmap-section .section-heading-row h2{font-size:clamp(58px,6vw,82px)!important;line-height:.88!important}.roadmap-section .section-heading-row>p{font-size:15px!important;line-height:1.55!important}.roadmap-grid.crypto-roadmap-grid{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:12px!important;margin-top:30px!important}
        .crypto-roadmap-grid::before{left:6%;right:6%;top:64px;height:2px;background:linear-gradient(90deg,#36e4f6,#7d63ff,#ff4bc8,#ffb43f,#35e6a0);opacity:.5;box-shadow:0 0 24px rgba(54,228,246,.18)}
        .crypto-roadmap-card{min-height:258px!important;padding:22px!important;border-radius:28px!important;background:linear-gradient(180deg,rgba(12,29,61,.94),rgba(3,10,26,.98))!important;border:1px solid rgba(82,220,255,.2)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 18px 55px rgba(0,0,0,.18);overflow:hidden;transition:transform .35s ease,border-color .35s ease,box-shadow .35s ease}
        .crypto-roadmap-card::before{content:"";position:absolute;inset:0;background:linear-gradient(145deg,rgba(72,221,255,.09),transparent 35%,rgba(120,76,255,.05));pointer-events:none}
        .crypto-roadmap-card::after{content:"";position:absolute;width:180px;height:180px;right:-95px;top:-95px;border-radius:50%;background:radial-gradient(circle,rgba(61,226,255,.18),transparent 68%);pointer-events:none}
        .crypto-roadmap-card:nth-child(2){border-color:rgba(139,92,255,.34)!important}.crypto-roadmap-card:nth-child(3){border-color:rgba(255,61,196,.34)!important}.crypto-roadmap-card:nth-child(4){border-color:rgba(255,174,54,.32)!important}.crypto-roadmap-card:nth-child(5){border-color:rgba(49,231,164,.32)!important}
        .roadmap-phase{position:relative;z-index:3}.roadmap-phase span{display:inline-flex;align-items:center;justify-content:center;min-width:48px;height:28px;padding:0 10px;border-radius:999px;color:#071426!important;background:#55e4f3;font-size:10px;font-weight:950;letter-spacing:.16em;box-shadow:0 0 22px rgba(85,228,243,.28)}
        .roadmap-crypto-icon{width:58px;height:58px;margin:18px 0 16px;border-radius:22px;position:relative;z-index:2;font-size:30px;background:radial-gradient(circle at 35% 25%,rgba(65,229,255,.28),rgba(7,18,42,.78) 68%);box-shadow:0 0 34px rgba(45,206,255,.14),inset 0 0 24px rgba(60,215,255,.07)}
        .crypto-roadmap-card:nth-child(2) .roadmap-crypto-icon{color:#b48bff;border-color:rgba(180,139,255,.42);background:radial-gradient(circle at 35% 25%,rgba(153,102,255,.25),rgba(13,14,43,.78) 68%)}
        .crypto-roadmap-card:nth-child(3) .roadmap-crypto-icon{color:#ff69d1;border-color:rgba(255,105,209,.42);background:radial-gradient(circle at 35% 25%,rgba(255,76,197,.22),rgba(34,12,39,.78) 68%)}
        .crypto-roadmap-card:nth-child(4) .roadmap-crypto-icon{color:#ffc35d;border-color:rgba(255,195,93,.42);background:radial-gradient(circle at 35% 25%,rgba(255,174,54,.22),rgba(38,24,10,.78) 68%)}
        .crypto-roadmap-card:nth-child(5) .roadmap-crypto-icon{color:#45edaa;border-color:rgba(69,237,170,.42);background:radial-gradient(circle at 35% 25%,rgba(49,231,164,.22),rgba(8,35,29,.78) 68%)}
        .crypto-roadmap-card h3{margin:0!important;position:relative;z-index:2;font-size:23px!important;letter-spacing:-.03em}.crypto-roadmap-card p{position:relative;z-index:2;font-size:12px;line-height:1.55;margin:14px 0 0;color:#8fa1bb!important;max-width:30ch}
        .crypto-roadmap-card:hover{transform:translateY(-10px);border-color:rgba(85,228,243,.55)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 28px 70px rgba(22,171,255,.16)}
        @media(max-width:1050px){.roadmap-section{min-height:auto;padding:64px 0!important}.roadmap-section .section-heading-row h2{font-size:58px!important}.roadmap-grid.crypto-roadmap-grid{grid-template-columns:repeat(2,1fr)!important}.crypto-roadmap-grid::before{display:none}.crypto-roadmap-card{min-height:320px!important}}
        @media(max-width:650px){.roadmap-section{padding:52px 0!important}.roadmap-section .section-heading-row h2{font-size:50px!important}.roadmap-grid.crypto-roadmap-grid{grid-template-columns:1fr!important;gap:14px!important}.crypto-roadmap-card{min-height:300px!important;padding:20px!important}.roadmap-crypto-icon{margin:22px 0 18px}.crypto-roadmap-card p{max-width:none}}
      
        /* Final Tokenomics viewport fix: show the complete supplied artwork below the fixed navbar. */
        /* Final Tokenomics viewport fit: show the complete 16:9 artwork below the fixed navbar. */
        /* Tokenomics command-center redesign */
        .tokenomics-shell{position:relative;z-index:2;width:min(1540px,calc(100% - 64px))!important}
        .tokenomics-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:36px;margin-bottom:28px}
        .tokenomics-heading h2{margin:9px 0 0!important;font-size:clamp(48px,5.4vw,78px)!important;line-height:.86!important;letter-spacing:-.06em!important}
        .tokenomics-heading h2 span{color:#55e4f3;text-shadow:0 0 28px rgba(0,229,255,.3)}
        .tokenomics-supply{min-width:250px;padding:16px 20px;border:1px solid rgba(85,228,243,.35);border-radius:16px;background:rgba(4,18,37,.82);box-shadow:0 0 30px rgba(0,220,255,.07)}
        .tokenomics-supply span,.tokenomics-supply small{display:block;color:#7187a5;font-size:8px;letter-spacing:.22em;font-weight:900}.tokenomics-supply strong{display:block;margin:4px 0;font-size:28px;letter-spacing:-.04em}
        .tokenomics-command{position:relative;min-height:500px;display:grid;grid-template-columns:390px 1fr;align-items:center;gap:55px;padding:30px 20px;border:1px solid rgba(82,130,180,.18);border-radius:28px;background:radial-gradient(circle at 24% 50%,rgba(0,210,255,.09),transparent 26%),linear-gradient(120deg,rgba(3,17,36,.8),rgba(3,8,23,.56));overflow:hidden}
        .tokenomics-command::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(90,200,235,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(90,200,235,.035) 1px,transparent 1px);background-size:40px 40px;pointer-events:none}
        .tokenomics-core{position:relative;width:300px;aspect-ratio:1;margin:auto;display:grid;place-items:center;border-radius:50%}
        .tokenomics-core-glow{position:absolute;inset:14%;border-radius:50%;background:radial-gradient(circle,rgba(0,229,255,.22),rgba(120,60,255,.08) 48%,transparent 72%);filter:blur(15px);animation:corePulse 3s ease-in-out infinite}
        .tokenomics-core-ring{position:absolute;inset:4%;border-radius:50%;border:1px solid rgba(85,228,243,.35);border-top-color:#55e4f3;border-right-color:#b45cff;box-shadow:0 0 30px rgba(0,220,255,.12);animation:coreSpin 16s linear infinite}
        .tokenomics-core-ring::before,.tokenomics-core-ring::after{content:"";position:absolute;width:9px;height:9px;border-radius:50%;background:#55e4f3;box-shadow:0 0 16px #55e4f3}.tokenomics-core-ring::before{top:0;left:50%}.tokenomics-core-ring::after{bottom:14%;right:4%;background:#ff5ccc;box-shadow:0 0 16px #ff5ccc}
        .tokenomics-core-inner{position:relative;width:64%;aspect-ratio:1;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(85,228,243,.48);background:radial-gradient(circle at 35% 20%,rgba(55,230,255,.25),rgba(3,13,29,.98) 66%);box-shadow:inset 0 0 50px rgba(0,220,255,.1),0 0 50px rgba(0,220,255,.12)}
        .tokenomics-core-inner span{font-size:13px;color:#55e4f3;font-weight:950;letter-spacing:.3em}.tokenomics-core-inner strong{font-size:52px;line-height:1;letter-spacing:-.08em;text-shadow:0 0 25px rgba(85,228,243,.25)}.tokenomics-core-inner small{margin-top:8px;color:#6f849f;font-size:8px;letter-spacing:.25em}
        .tokenomics-nodes{position:relative;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
        .token-node{position:relative;min-height:112px;display:flex;align-items:center;gap:15px;padding:17px 18px;border:1px solid;border-radius:16px;background:rgba(4,15,32,.86);box-shadow:inset 0 0 24px rgba(0,0,0,.18);transition:.25s;overflow:hidden}
        .token-node::after{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:currentColor;box-shadow:0 0 18px currentColor}.token-node:hover{transform:translateY(-3px);box-shadow:0 0 24px currentColor}
        .token-node>div{display:flex;flex-direction:column}.token-node b{font-size:30px;line-height:1;letter-spacing:-.06em}.token-node strong{margin-top:7px;font-size:10px;letter-spacing:.15em;color:#eef7ff}.token-node small{margin-top:5px;font-size:9px;color:#7186a3}
        .node-index{font-size:8px;letter-spacing:.12em;opacity:.65;align-self:flex-start}
        .node-cyan{color:#55e4f3;border-color:rgba(85,228,243,.35)}.node-purple{color:#b47aff;border-color:rgba(180,122,255,.38)}.node-pink{color:#ff5ccc;border-color:rgba(255,92,204,.38)}.node-green{color:#45edaa;border-color:rgba(69,237,170,.38)}.node-orange{color:#ffad45;border-color:rgba(255,173,69,.38)}.node-blue{color:#45a7ff;border-color:rgba(69,167,255,.38)}.node-gold{color:#ffdc65;border-color:rgba(255,220,101,.38)}
        .tokenomics-total{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;margin-top:12px;border:1px solid rgba(85,130,175,.18);border-radius:12px;overflow:hidden;background:rgba(85,130,175,.08)}
        .tokenomics-total div{display:flex;align-items:center;gap:8px;padding:11px 10px;background:rgba(3,12,27,.78);min-width:0}.tokenomics-total span{font-size:12px;font-weight:950;color:#55e4f3}.tokenomics-total i{width:5px;height:5px;border-radius:50%;background:#55e4f3;box-shadow:0 0 8px #55e4f3;flex:0 0 auto}.tokenomics-total b{font-size:7px;letter-spacing:.08em;color:#8398b2;white-space:nowrap}
        @keyframes coreSpin{to{transform:rotate(360deg)}}@keyframes corePulse{50%{transform:scale(1.08);opacity:.72}}
        @media(max-width:900px){.tokenomics-shell{width:min(100% - 32px,680px)!important}.tokenomics-heading{align-items:flex-start;flex-direction:column;gap:16px}.tokenomics-command{grid-template-columns:1fr;min-height:0;padding:26px 14px;gap:20px}.tokenomics-core{width:min(260px,72vw)}.tokenomics-nodes{grid-template-columns:1fr}.tokenomics-total{grid-template-columns:repeat(2,1fr)}.tokenomics-total div:last-child{grid-column:1/-1}}
        
        /* Tokenomics: full-width artwork, preserve the complete image and allow page scroll for its full height. */
        #tokenomics.token-section{
          width:100%!important;
          height:auto!important;
          min-height:0!important;
          max-height:none!important;
          margin-top:0!important;
          margin-bottom:0!important;
          padding:0!important;
          overflow:visible!important;
          background:#01030d!important;
          display:block!important;
          box-sizing:border-box!important;
        }
        #tokenomics .tokenomics-reference-image-wrap{
          width:100%!important;
          height:auto!important;
          min-height:0!important;
          max-height:none!important;
          margin:0!important;
          padding:0!important;
          display:block!important;
          overflow:visible!important;
          background:#01030d!important;
        }
        #tokenomics .tokenomics-reference-image{
          display:block!important;
          width:100%!important;
          height:auto!important;
          max-width:100%!important;
          max-height:none!important;
          min-width:0!important;
          min-height:0!important;
          margin:0!important;
          object-fit:initial!important;
          object-position:center center!important;
          transform:none!important;
        }
        @media(max-width:900px){
          #tokenomics.token-section{
            height:calc(100svh - 92px)!important;
            margin-top:92px!important;
            min-height:0!important;
          }
          #tokenomics .tokenomics-reference-image-wrap{height:100%!important}
          #tokenomics .tokenomics-reference-image{
            width:auto!important;
            height:auto!important;
            max-width:94%!important;
            max-height:94%!important;
            object-fit:contain!important;
          }
        }
      `}</style>
      <div className="home-section"><Hero /></div>

      <section id="features" className="site-section features-section">
        <div className="section-shell">
          <p className="section-kicker">FEATURES</p>
          <div className="section-heading-row">
            <h2>Everything You Need to<br /><span>Build a Better Tomorrow</span></h2>
            <p>One connected ecosystem for investing, staking, vesting and community participation.</p>
          </div>
          <div className="feature-grid">
            {features.map(([num, title, text, icon]) => (
              <article className="feature-card" key={num}>
                <span className="card-number">{num}</span>
                <div className="card-orb" />
                <div className="feature-icon"><FeatureIcon type={icon} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      

<section id="about" className="site-section about-section">
        <div className="section-shell split-section">
          <div>
            <p className="section-kicker">ABOUT</p>
            <h2>STRIVERSE is built for enlightening the wealth.</h2>
          </div>
          <div className="section-copy">
            <p>STRIVERSE brings the core pieces of a digital asset ecosystem together in one focused experience.</p>
            <p>Explore STV, participate in the ecosystem, track your activity and discover new ways to engage with the community.</p>
            <Link href="/register" className="text-link">Explore the ecosystem ↗</Link>
          </div>
        </div>
      </section>



<section id="tokenomics" className="site-section token-section">
        <div className="section-shell tokenomics-shell">
          <div className="tokenomics-heading">
            <div>
              <p className="section-kicker">STV / TOKEN ECONOMY</p>
              <h2>One token.<br /><span>Seven allocations.</span></h2>
            </div>
          </div>

          <div className="tokenomics-command">
            <div className="tokenomics-core">
              <div className="tokenomics-core-glow" />
              <div className="tokenomics-core-ring" />
              <div className="tokenomics-core-inner">
                <span>STV</span>
                <strong>8.8₿</strong>
                <small>TOTAL SUPPLY</small>
              </div>
            </div>

            <div className="tokenomics-nodes">
              <article className="token-node node-cyan">
                <span className="node-index">01</span><div><b>25%</b><strong>PRESALE</strong><small>Public launch</small></div>
              </article>
              <article className="token-node node-purple">
                <span className="node-index">02</span><div><b>20%</b><strong>LIQUIDITY</strong><small>Market depth</small></div>
              </article>
              <article className="token-node node-pink">
                <span className="node-index">03</span><div><b>15%</b><strong>REWARDS</strong><small>Participation</small></div>
              </article>
              <article className="token-node node-green">
                <span className="node-index">04</span><div><b>15%</b><strong>ECOSYSTEM</strong><small>Development</small></div>
              </article>
              <article className="token-node node-orange">
                <span className="node-index">05</span><div><b>10%</b><strong>MARKETING</strong><small>Growth</small></div>
              </article>
              <article className="token-node node-blue">
                <span className="node-index">06</span><div><b>10%</b><strong>COMMUNITY</strong><small>Incentives</small></div>
              </article>
              <article className="token-node node-gold">
                <span className="node-index">07</span><div><b>5%</b><strong>TEAM &amp; ADVISORS</strong><small>Long-term</small></div>
              </article>
            </div>
          </div>
        </div>
      </section>

<section id="roadmap" className="site-section roadmap-section">
        <div className="section-shell roadmap-shell">
          <div className="roadmap-topline">
            <div>
              <p className="section-kicker">ROADMAP / 2026 →</p>
              <h2>Built in <span>phases.</span><br />Designed to scale.</h2>
            </div>
            <p className="roadmap-intro">A clear progression from launch and liquidity to rewards, governance and the wider STRIVERSE ecosystem.</p>
          </div>
          <div className="roadmap-track">
            <div className="roadmap-track-line" />
            {roadmap.map(([num, title, text, icon], index) => (
              <article key={num} className={`roadmap-card crypto-roadmap-card roadmap-phase-card phase-${num}`}>
                <div className="roadmap-card-top">
                  <span className="roadmap-index">0{num === "01" ? "1" : num.slice(1)}</span>
                  <span className="roadmap-status">{index === 0 ? "LIVE" : "UP NEXT"}</span>
                </div>
                <div className="roadmap-node"><span>{icon}</span></div>
                <div className="roadmap-card-copy">
                  <p className="roadmap-phase-label">PHASE {num}</p>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <div className="roadmap-card-footer"><span>{index === 0 ? "NOW" : "PLANNED"}</span><i /></div>
              </article>
            ))}
          </div>
        </div>
      </section>

<section id="staking" className="site-section dark-panel-section">
        <div className="section-shell split-section panel-split">
          <div>
            <p className="section-kicker">STAKING</p>
            <h2>Put your STV<br /><span>to work.</span></h2>
          </div>
          <div className="feature-panel">
            <div className="panel-glow" />
            <div className="panel-top"><span>STV STAKING</span><b>LIVE EXPERIENCE</b></div>
            <div className="staking-metric"><strong>Stake</strong><span>Lock STV and participate in the reward experience.</span></div>
            <div className="metric-row"><div><b>APY</b><span>Connected data</span></div><div><b>TERM</b><span>Pool dependent</span></div><div><b>REWARD</b><span>STV</span></div></div>
            <Link href="/app" className="panel-button">Open Staking ↗</Link>
          </div>
        </div>
      </section>

<section id="vesting" className="site-section vesting-section">
        <div className="section-shell split-section">
          <div>
            <p className="section-kicker">VESTING</p>
            <h2>Clear unlocks.<br /><span>Clear visibility.</span></h2>
          </div>
          <div className="vesting-card">
            <div className="vesting-line"><span>Allocation</span><b>STV</b></div>
            <div className="vesting-progress"><span /></div>
            <div className="vesting-grid"><div><small>VESTED</small><b>Connected data</b></div><div><small>CLAIMABLE</small><b>Connected data</b></div><div><small>NEXT UNLOCK</small><b>Schedule</b></div></div>
            <p>Vesting schedules can be surfaced here once the project's final allocation and unlock rules are connected.</p>
            <Link href="/app" className="text-link">View vesting ↗</Link>
          </div>
        </div>
      </section>

<section id="more" className="site-section more-section">
        <div className="section-shell">
          <p className="section-kicker">MORE</p>
          <h2>Airdrop.<br /><span>Roadmap. Community.</span></h2>
          <div className="more-grid">
            <article id="airdrop" className="more-card"><span>AIRDROP</span><h3>Grow with the community.</h3><p>Show eligibility, allocation, campaign progress and claim status here when the live airdrop rules are connected.</p><Link href="/register">Check eligibility ↗</Link></article>
            <article id="products" className="more-card"><span>PRODUCTS</span><h3>Explore the STRIVERSE app.</h3><p>Sign in to access the connected STV experiences, including the available ecosystem packages and account tools.</p><Link href="/app">Open the app ↗</Link></article>
          </div>
        </div>
      </section>



      <section id="community" className="site-section community-section">
        <div className="community-shell">
          <p className="section-kicker">COMMUNITY</p>
          <h2>Build the next dimension<br /><span>together.</span></h2>
          <p>Join the STRIVERSE community and follow the ecosystem as it grows.</p>
          <div className="community-actions"><a href="#about" className="panel-button">Explore STRIVERSE ↗</a><a href="#features" className="outline-button">Discover features ↗</a></div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-shell">
          <div><p className="section-kicker">STRIVERSE</p><h3>Strive. Grow. Belong.</h3><p>Next-generation digital ecosystem built around STV.</p></div>
          <div><b>Explore</b><a href="#about">About</a><a href="#features">Features</a><a href="#staking">Staking</a></div>
          <div><b>Token</b><a href="#tokenomics">Tokenomics</a><a href="#vesting">Vesting</a><a href="#airdrop">Airdrop</a><a href="#roadmap">Roadmap</a></div>
          <div><b>Community</b><a href="#community">Community</a><Link href="/register">Register</Link><Link href="/login">Login</Link></div>
        </div>
        <div className="footer-bottom"><span>© 2026 STRIVERSE</span><span>All Rights Reserved.</span></div>
      </footer>
    </main>
  );
}
