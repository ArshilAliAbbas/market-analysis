"use client";

import { useRef, useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Search, Sun, Command, Terminal, Activity, ShieldAlert, BarChart3, Database, Globe, Cpu, Zap, ArrowRight, Code2, Lock } from "lucide-react";
import { WebcamPixelGrid } from "@/components/ui/webcam-pixel-grid";
gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  onOpenTerminal: () => void;
}

export default function LandingPage({ onOpenTerminal }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tradeRef = useRef<HTMLDivElement>(null);
  const codeBlockRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);
  const proTitleRef = useRef<HTMLHeadingElement>(null);
  const proCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const badgeRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Code Simulation
  const [codeLines, setCodeLines] = useState<number>(0);
  const [showCookies, setShowCookies] = useState(true);

  // Webcam Status
  const [webcamStatus, setWebcamStatus] = useState<"pending" | "ready" | "error">("pending");
  const handleWebcamReady = useCallback(() => setWebcamStatus("ready"), []);
  const handleWebcamError = useCallback(() => setWebcamStatus("error"), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCodeLines(prev => (prev < 5 ? prev + 1 : 0));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Lenis Smooth Scroll + GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // --- Hero entrance ---
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(badgeRef.current, { opacity: 0, scale: 0.8, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6 })
      .fromTo(h1Ref.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
      .fromTo(subRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
      .fromTo(ctaRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4");

    // --- Hero parallax on scroll ---
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        y: 250,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // --- Dashboard parallax ---
    if (dashRef.current) {
      gsap.fromTo(dashRef.current,
        { y: 120, scale: 0.88, rotateZ: 3, opacity: 0 },
        {
          y: 0, scale: 1, rotateZ: 0, opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: dashRef.current,
            start: "top 90%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );
    }

    // --- Description block ---
    if (descRef.current) {
      gsap.fromTo(descRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: { trigger: descRef.current, start: "top 80%", end: "top 40%", scrub: 1 },
        }
      );
    }

    // --- Feature cards staggered ---
    featureCardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8,
          delay: i * 0.15,
          scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
        }
      );
    });

    // --- "Anybody can trade" section ---
    if (tradeRef.current) {
      const heading = tradeRef.current.querySelector("h2");
      const para = tradeRef.current.querySelector("p");
      const toggles = tradeRef.current.querySelector("[data-toggles]");
      if (heading) gsap.fromTo(heading, { opacity: 0, scale: 0.9, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: heading, start: "top 80%" } });
      if (para) gsap.fromTo(para, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.1, scrollTrigger: { trigger: para, start: "top 85%" } });
      if (toggles) gsap.fromTo(toggles, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2, scrollTrigger: { trigger: toggles, start: "top 85%" } });
    }

    // --- Code block slide in ---
    if (codeBlockRef.current) {
      gsap.fromTo(codeBlockRef.current,
        { opacity: 0, x: -80, rotateY: 15 },
        { opacity: 1, x: 0, rotateY: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: codeBlockRef.current, start: "top 80%" } }
      );
    }
    if (rightContentRef.current) {
      gsap.fromTo(rightContentRef.current,
        { opacity: 0, x: 80 },
        { opacity: 1, x: 0, duration: 1, ease: "power2.out", delay: 0.2, scrollTrigger: { trigger: rightContentRef.current, start: "top 80%" } }
      );
    }

    // --- Pro section ---
    if (proTitleRef.current) {
      gsap.fromTo(proTitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: proTitleRef.current, start: "top 80%" } }
      );
    }
    proCardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { opacity: 0, y: 60, rotateX: 8 },
        {
          opacity: 1, y: 0, rotateX: 0, duration: 0.8,
          delay: i * 0.12,
          scrollTrigger: { trigger: card, start: "top 85%" },
        }
      );
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  const setProCard = useCallback((i: number) => (el: HTMLDivElement | null) => { proCardsRef.current[i] = el; }, []);
  const setFeatureCard = useCallback((i: number) => (el: HTMLDivElement | null) => { featureCardsRef.current[i] = el; }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground font-sans selection:bg-[#fce075]/30 selection:text-white overflow-x-hidden relative">

      {/* Webcam Request Notice */}
      {webcamStatus === "pending" && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-500">
          <div className="bg-[#050505] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-lg px-6 py-3.5 flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            <span className="text-[11px] font-mono tracking-widest text-white uppercase">Please allow webcam access for the full interactive experience.</span>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-0">
        <WebcamPixelGrid
          gridCols={60}
          gridRows={40}
          maxElevation={50}
          motionSensitivity={0.25}
          elevationSmoothing={0.2}
          colorMode="webcam"
          backgroundColor="#030303"
          mirror={true}
          gapRatio={0.05}
          invertColors={false}
          darken={0.6}
          borderColor="#ffffff"
          borderOpacity={0.06}
          className="w-full h-full"
          onWebcamReady={handleWebcamReady}
          onWebcamError={handleWebcamError}
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 w-full z-50 border-b border-white/5 bg-[#010101]/60 backdrop-blur-xl supports-[backdrop-filter]:bg-[#010101]/40 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 h-[65px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-6 h-6 rounded-none bg-[#fce075]/10 flex items-center justify-center border border-[#fce075]/20 shadow-[0_0_15px_rgba(252,224,117,0.2)] group-hover:rotate-90 transition-transform duration-300">
                 <Terminal className="w-3.5 h-3.5 text-[#fce075]" />
              </div>
              <span className="text-[15px] tracking-[0.2em] uppercase font-black text-white group-hover:text-[#fce075] transition-colors italic">
                Axiom_Terminal
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/40">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <div className="relative flex min-h-[calc(100vh-65px)] flex-col items-center justify-center px-4 pt-20">
          <div className="max-w-5xl text-center">
            {/* Badge */}
            <div ref={badgeRef} style={{ opacity: 0 }} className="mb-8 inline-flex items-center gap-3 rounded-none border border-[#fce075]/30 bg-[#fce075]/5 px-5 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#fce075] backdrop-blur-md shadow-[0_0_20px_rgba(252,224,117,0.1)] axiom-corner-tl italic">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fce075] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fce075]"></span>
              </span>
              SYSTEM_PROTOCOL // ACTIVE
            </div>

            {/* Title */}
            <h1
              ref={h1Ref}
              style={{ opacity: 0 }}
              className="mb-8 text-5xl font-black tracking-tighter text-white sm:text-7xl md:text-8xl lg:text-[110px] leading-[0.9] italic"
            >
              Ship stunning terminal <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">pages faster.</span>
            </h1>

            {/* Description */}
            <p
              ref={subRef}
              style={{ opacity: 0 }}
              className="mx-auto mb-12 max-w-2xl text-lg font-medium text-white/50 sm:text-xl leading-relaxed"
            >
              Build institutional-grade interfaces with Axiom component blocks. Aggregating order flow and routing execution with perfect clarity.
            </p>

            {/* Buttons */}
            <div
              ref={ctaRef}
              style={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-6 sm:flex-row"
            >
              <button
                onClick={onOpenTerminal}
                className="group relative inline-flex h-14 items-center justify-center gap-3 rounded-none bg-[#fce075] px-10 text-[13px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(252,224,117,0.3)] italic border border-[#fce075]"
              >
                Initialize_Core
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="inline-flex h-14 items-center justify-center gap-3 rounded-none border border-[#fce075]/20 bg-[#fce075]/5 px-10 text-[13px] font-black uppercase tracking-[0.2em] text-[#fce075] backdrop-blur-md transition-all hover:bg-[#fce075]/10 hover:border-[#fce075]/40 active:scale-95 italic">
                View_Protocol_Doc
              </button>
            </div>
          </div>
        </div>

          {/* Dashboard — GSAP scrub parallax */}
          <div
            ref={dashRef}
            style={{ opacity: 0 }}
            className="w-full bg-accent/5 rounded-none border border-accent/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden flex flex-col font-sans relative will-change-transform axiom-panel axiom-corner-tl"
          >
            {/* Top Shine */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#06b6d4]/50 to-transparent"></div>

            {/* Window Controls */}
            <div className="h-14 border-b border-accent/10 bg-accent/5 flex items-center px-6 gap-2.5">
              <div className="flex gap-2">
                 <div className="w-3.5 h-3.5 rounded-none bg-accent/20 border border-accent/40" />
                 <div className="w-3.5 h-3.5 rounded-none bg-accent/20 border border-accent/40" />
                 <div className="w-3.5 h-3.5 rounded-none bg-accent/20 border border-accent/40" />
              </div>
              <div className="ml-6 text-[11px] text-accent/40 font-mono tracking-[0.2em] flex items-center gap-2 uppercase italic font-black">
                <Lock className="w-3 h-3 text-accent" />
                terminal@axiom_core_remote: ~
              </div>
              <div className="ml-auto w-8 h-8 rounded-none bg-accent/10 border border-accent/20 flex items-center justify-center opacity-80 backdrop-blur-md">
                 <Terminal className="w-4 h-4 text-accent" />
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px] overflow-hidden bg-[#030303] relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CgkJPHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0ibm9uZSIvPgoJCTxwYXRoIGQ9Ik0wIDE5LjVoMjBNMTkuNSAwdi0yMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz4KCTwvc3ZnPg==')] opacity-50" />

              {/* Left Column */}
              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex-1 bg-[#000] border border-white/10 rounded-lg p-6 relative group transition-all duration-300 shadow-xl hover:border-white/30">
                   <div className="flex items-center gap-3 mb-6">
                     <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                       <Globe className="w-4 h-4 text-blue-400" />
                     </div>
                     <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80">Macro Overview</h3>
                   </div>
                   <div className="space-y-4">
                     {[
                       { l: "DXY", v: "104.25", c: "+0.12%", up: true },
                       { l: "US10Y", v: "4.32%", c: "+0.05", up: true },
                       { l: "SPX", v: "5,123.4", c: "-0.45%", up: false },
                     ].map((item, i) => (
                       <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-4 last:border-0 last:pb-0">
                         <span className="text-white/50 font-bold">{item.l}</span>
                         <div className="flex items-center gap-3">
                           <span className="font-mono text-white/90 text-[15px]">{item.v}</span>
                           <span className={`text-[10px] px-2 py-1 rounded-sm font-bold font-mono ${item.up ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                             {item.c}
                           </span>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="h-[240px] bg-[#000] border border-white/10 rounded-lg p-6 group transition-all duration-300 shadow-xl relative overflow-hidden hover:border-[#fce075]/30">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#fce075]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="w-8 h-8 rounded-lg bg-[#fce075]/10 flex items-center justify-center border border-[#fce075]/20">
                      <ShieldAlert className="w-4 h-4 text-[#fce075]" />
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#fce075]">Risk Matrix</h3>
                  </div>
                  <div className="flex justify-center items-center h-32 relative z-10">
                     <div className="relative w-32 h-32 rounded-full border-[6px] border-[#0a0a0a] flex items-center justify-center shadow-[0_0_30px_rgba(252,224,117,0.1)_inset]">
                       <svg className="absolute inset-0 w-full h-full -rotate-90">
                         <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-[#fce075] animate-[riskPulse_4s_ease-in-out_infinite]" style={{ filter: "drop-shadow(0px 0px 8px rgba(252,224,117,0.6))" }} strokeDasharray="351" />
                       </svg>
                       <div className="text-center">
                         <span className="text-4xl font-black text-white">78</span>
                         <span className="block text-[8px] text-[#fce075] uppercase tracking-widest font-bold mt-1">Factor</span>
                       </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Center & Right Column */}
              <div className="hidden md:flex flex-col col-span-2 gap-6 relative z-10">
                <div className="flex-[2] bg-[#000] border border-white/10 rounded-lg p-6 relative group transition-all duration-300 flex flex-col shadow-xl hover:border-white/30">
                   <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                         <BarChart3 className="w-4 h-4 text-purple-400" />
                       </div>
                       <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80">Actionable Plan</h3>
                     </div>
                     <span className="text-[10px] bg-red-500/20 border border-red-500/40 text-red-400 px-3 py-1.5 rounded-sm font-black tracking-[0.2em] animate-pulse flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                       LIVE
                     </span>
                   </div>
                   <div className="bg-[#000000] border border-white/10 rounded-xl p-6 font-mono text-[14px] leading-[1.8] text-emerald-400/90 flex-1 shadow-[inset_0_0_20px_rgba(0,0,0,1)] relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-20"><Code2 className="w-20 h-20 text-white" /></div>

                     <div style={{ opacity: codeLines >= 0 ? 1 : 0, transition: "opacity 0.3s" }}><span className="text-purple-400 font-bold">async function</span> <span className="text-blue-300">executeMarketEdge</span>() {'{'}</div>
                     <div style={{ opacity: codeLines >= 1 ? 1 : 0, transition: "opacity 0.3s" }}>{'  '}const narrative = <span className="text-[#fce075]">await</span> models.getSentiment(&quot;FED_FUNDS&quot;);</div>
                     <div style={{ opacity: codeLines >= 2 ? 1 : 0, transition: "opacity 0.3s" }}>{'  '}if (narrative.isHawkish &amp;&amp; structure.isBroken) {'{'}</div>
                     <div style={{ opacity: codeLines >= 3 ? 1 : 0, transition: "opacity 0.3s" }}>{'    '}<span className="text-blue-400 font-bold">executeShort</span>({'{'} target: &quot;NQ&quot;, size: &quot;2%&quot; {'}'});</div>
                     <div style={{ opacity: codeLines >= 4 ? 1 : 0, transition: "opacity 0.3s" }}>{'  }'}</div>
                     <div style={{ opacity: codeLines >= 5 ? 1 : 0, transition: "opacity 0.3s" }}>{'}'}</div>

                     <br/>
                     <div style={{ opacity: codeLines >= 5 ? 1 : 0, transition: "opacity 0.3s" }} className="text-white/40 border-l-2 border-[#fce075]/40 pl-4 mt-2">
                       // Model Output: High probability mean reversion setup detected. Wait for liquidity sweep.
                     </div>
                     <div className="inline-block w-2.5 h-4 bg-[#fce075] ml-1 align-middle mt-2 animate-[blink_1s_steps(1)_infinite]" />
                   </div>
                </div>

                <div className="h-[200px] grid grid-cols-2 gap-6">
                  <div className="bg-[#000] border border-white/10 rounded-lg p-6 flex flex-col justify-between group transition-all duration-300 shadow-xl relative overflow-hidden hover:border-cyan-400/30">
                     <div className="absolute inset-0 bg-gradient-to-t from-[#fce075]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                     <div className="flex items-center gap-3 mb-2 relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-[#fce075]/10 flex items-center justify-center border border-[#fce075]/20">
                          <Database className="w-4 h-4 text-cyan-400" />
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80">Data Stream</h3>
                      </div>
                      <div className="text-[42px] font-black text-white font-mono tracking-tighter relative z-10">14.2M<span className="text-xl text-white/40 tracking-normal">/s</span></div>
                      <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden relative z-10">
                        <div className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-[dataStream_5s_ease-in-out_infinite]" />
                      </div>
                  </div>
                  <div className="bg-[#000] border border-white/10 rounded-lg p-6 flex flex-col justify-between group transition-all duration-300 shadow-xl relative overflow-hidden hover:border-red-500/30">
                     <div className="absolute inset-0 bg-gradient-to-t from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                     <div className="flex items-center gap-3 mb-2 relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                          <Activity className="w-4 h-4 text-red-500" />
                        </div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80">Volatility Scope</h3>
                      </div>
                      <div className="text-[36px] font-black text-white tracking-tight relative z-10">Elevated</div>
                      <div className="flex gap-2 mt-2 relative z-10 h-6 items-end">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-full flex-1 rounded-sm ${i < 8 ? 'bg-red-500/90 shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'bg-white/10'}`}
                            style={{
                              height: '100%',
                              animation: `volBar ${1 + i * 0.2}s ease-in-out ${i * 0.1}s infinite alternate`
                            }}
                          />
                        ))}
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

      {/* Description Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-40 pb-40 text-center md:text-left">
         <div ref={descRef} style={{ opacity: 0 }} className="will-change-transform">
           <p className="text-[36px] md:text-[48px] leading-[1.2] font-semibold text-[#f1f1f1] tracking-tighter mb-20 max-w-4xl italic">
              Axiom is an <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fce075] to-amber-200 font-black">INSTITUTIONAL</span> trading framework for <span className="text-[#fce075] font-black">PROFESSIONALS</span>, beautifully engineered for high-fidelity execution. Elevating your speed with absolute clarity at its core.
           </p>
         </div>

         <div id="features" className="grid grid-cols-1 md:grid-cols-3 bg-[#030303] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative">
            {[
               { icon: Globe, title: "Live Order Flow", desc: "Direct market data integration with sub-millisecond parsing and analysis logic built right in." },
               { icon: Cpu, title: "Quantitative Core", desc: "Extract momentum and stat-arb setups locally from advanced probabilistic engines." },
               { icon: Zap, title: "Terminal Speed", desc: "Built from the ground up for maximum visual performance without web bloat." }
            ].map((item, i) => (
              <div
                 key={i}
                 ref={setFeatureCard(i)}
                 style={{ opacity: 0 }}
                 className="group p-10 md:p-12 border-b md:border-b-0 md:border-r border-white/10 last:border-0 hover:bg-[#0a0a0a] transition-colors duration-500 relative flex flex-col will-change-transform"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="flex items-center justify-between mb-12">
                  <div className="w-12 h-12 bg-black border border-white/10 rounded items-center justify-center flex shrink-0 group-hover:border-white/30 transition-colors shadow-inner">
                    <item.icon className="w-5 h-5 text-white/40 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="text-[10px] font-mono text-white/20 font-bold uppercase tracking-widest">Sys_0{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-[14px] text-white/50 leading-[1.8] font-medium group-hover:text-white/70 transition-colors">{item.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Anybody can trade section */}
      <section
        ref={tradeRef}
        className="relative z-10 max-w-[1400px] w-full mx-auto px-6 py-40 border-t border-white/5 overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-[#fce075]/20 to-transparent" />

        <div className="text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl bg-[#fce075]/5 blur-[100px] rounded-full -z-10" />
          <h2 className="text-5xl md:text-[60px] font-black text-[#fce075] mb-8 tracking-tighter italic">Anybody can trade.</h2>
          <p className="text-white/60 font-medium max-w-3xl mx-auto text-[18px] leading-relaxed">
            Native support for Crypto, FX & Equities, offering intuitive, convenient and extensive intelligence for <span className="text-white font-bold">retail traders, quant developers, and professional firms.</span>
          </p>
          <div data-toggles className="flex items-center justify-center gap-6 mt-12 text-[15px] font-black text-white/30 tracking-[0.2em] uppercase italic">
            <span className="text-[#fce075] cursor-pointer transition-colors shadow-[0_0_20px_rgba(252,224,117,0.4)] px-4 py-2 rounded-none border border-[#fce075]/20 bg-[#fce075]/10 hover:scale-110 active:scale-95 transition-transform">Trader</span>
            <span className="text-white/10">→</span>
            <span className="cursor-pointer hover:text-[#fce075] hover:scale-110 active:scale-95 transition-all">Quant</span>
            <span className="text-white/10">→</span>
            <span className="cursor-pointer hover:text-[#fce075] hover:scale-110 active:scale-95 transition-all">Automation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left Code Block */}
          <div
             ref={codeBlockRef}
             style={{ opacity: 0 }}
             className="bg-[#0c0c0c] border border-white/10 rounded-xl p-8 font-mono text-[14px] text-white/70 shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-[#fce075]/30 transition-colors will-change-transform"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="absolute top-6 right-6 text-white/20 hover:text-[#fce075] cursor-pointer transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
             </div>
             <div className="text-white/30 mb-8 leading-[2] border-b border-white/5 pb-6">
               <span className="text-pink-500/50">---</span><br/>
               <span className="text-blue-300/80 font-bold">strategy:</span> <span className="text-white font-bold tracking-wide">Mean Reversion</span><br/>
               <span className="text-pink-500/50">---</span>
             </div>
             <div className="leading-[2]">
               <span className="text-blue-400 font-bold text-lg">##</span> <span className="text-white font-bold text-lg tracking-tight">Overview</span><br/><br/>
               I love <span className="text-[#fce075] font-bold bg-[#fce075]/10 px-2 py-0.5 rounded">**AxiomTerminal**</span>!<br/><br/>
               <div className="bg-[#000] p-4 rounded-xl border border-white/5 mt-4">
                 <span className="text-purple-400">{"`"}ts tab=&quot;Tab 1&quot;</span><br/>
                 <span className="text-purple-400 font-bold">console</span>.log(<span className="text-[#fce075]">&quot;Execute Long&quot;</span>)<br/>
                 <span className="text-purple-400">{"`"}</span><br/><br/>
                 <span className="text-purple-400">{"`"}ts tab=&quot;Tab 2&quot;</span><br/>
                 <span className="text-pink-500 font-bold">return</span> <span className="text-blue-400 font-bold">0</span>;<br/>
                 <span className="text-purple-400">{"`"}</span>
               </div>
             </div>
          </div>

          {/* Right Content */}
          <div
             ref={rightContentRef}
             style={{ opacity: 0 }}
             className="pl-0 lg:pl-10 will-change-transform"
          >
            <h3 className="text-[36px] font-black text-white mb-8 tracking-tighter">The familiar structure.</h3>
            <p className="text-white/50 text-[18px] mb-12 leading-relaxed font-medium">It is real-time processing, with additional features seamlessly composing into the execution without bloated syntax.</p>

            <ul className="space-y-5 text-[15px] text-white/70 font-semibold tracking-wide">
              {["Live market data indexing", "Deep predictive analytics (Powered by local models)", "Execution blocks", "Risk matrices", "Dynamic Cards", "Custom strategy anchors"].map((text, i) => (
                <li
                  key={i}
                  className="flex items-center gap-4 cursor-pointer transition-all hover:translate-x-2.5 hover:text-white"
                >
                  <div className="w-2 h-2 rounded-none bg-gradient-to-br from-[#fce075] to-amber-500 shadow-[0_0_10px_rgba(252,224,117,1)] shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Terminal For Professionals section */}
      <section id="architecture" className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-white/5 pb-40">
         <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#ea580c]/30 to-transparent" />

         <h2
            ref={proTitleRef}
            style={{ opacity: 0 }}
            className="text-5xl md:text-[60px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a3a3a3] text-center mb-20 tracking-tighter will-change-transform"
         >
           Terminal For <span className="text-[#fce075]">Professionals.</span>
         </h2>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Card 1 */}
           <div
             ref={setProCard(0)}
             style={{ opacity: 0 }}
             className="bg-[#0c0c0c] border border-white/10 rounded-3xl p-10 overflow-hidden relative min-h-[350px] flex flex-col group shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-2.5 hover:scale-[1.02] will-change-transform"
           >
             <div className="absolute -bottom-[30%] -right-[20%] w-[150%] h-[120%] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJCTxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSIjZmNlMDc1Ii8+Cjwvc3ZnPg==')] opacity-[0.15] mix-blend-screen transition-transform duration-1000 group-hover:scale-125 group-hover:opacity-[0.25] group-hover:rotate-6"></div>
             <h3 className="text-[28px] font-black text-white mb-5 relative z-10 tracking-tight">Market Agnostic</h3>
             <p className="text-white/50 text-[16px] leading-[1.8] relative z-10 max-w-[320px] font-medium">
               Official support for Crypto, FX, Equities, Commodities — portable to any global market with zero latency.
             </p>
                 <div className="mt-auto relative z-10 flex gap-4">
               {[
                 <svg key="s" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                 <Globe key="g" className="w-5 h-5"/>,
                 <Activity key="a" className="w-5 h-5"/>
               ].map((icon, i) => (
                 <div
                   key={i}
                   className="w-12 h-12 rounded-none bg-[#fce075]/10 border border-[#fce075]/20 flex items-center justify-center text-[#fce075] font-bold shadow-xl transition-all cursor-crosshair hover:-translate-y-1 hover:border-[#fce075] hover:bg-[#fce075]/20"
                 >
                   {icon}
                 </div>
               ))}
             </div>
           </div>

           {/* Card 2 */}
           <div
             ref={setProCard(1)}
             style={{ opacity: 0 }}
             className="bg-[#fce075]/5 border border-[#fce075]/20 rounded-none p-10 overflow-hidden relative min-h-[350px] flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-500 group will-change-transform axiom-panel axiom-corner-tl"
           >
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-[#fce075]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             <h3 className="text-[28px] font-black text-white mb-4 tracking-tight relative z-10 italic uppercase">COMPOSABLE_CORE</h3>
             <p className="text-white/50 text-[16px] leading-[1.8] mb-8 font-medium relative z-10">
               Separated as <span className="text-[#fce075] font-black tracking-widest italic">DATA :: CORE :: EXECUTION</span>, offering the high composability that quants love.
             </p>

             <div className="flex flex-col font-mono text-[13px] text-[#fce075]/40 mt-auto relative z-10 space-y-1">
               {[
                 { t: "axiom-data", d: "Raw tick and sentiment streams." },
                 { t: "axiom-core", d: "Headless logic engine." },
                 { t: "axiom-ui", d: "UI components." },
                 { t: "axiom-models", d: "Local execution models." }
               ].map((item, i) => (
                 <div
                   key={i}
                   className="flex items-center justify-between border-t border-dashed border-[#fce075]/30 py-3.5 px-2 rounded-none transition-all cursor-pointer hover:translate-x-1 hover:bg-[#fce075]/5"
                 >
                   <span className="text-[#fce075] font-bold">{item.t}</span>
                   <span className="text-[#fce075]/30 hidden sm:block">{item.d}</span>
                 </div>
               ))}
             </div>
           </div>

           {/* Card 3 */}
           <div
             ref={setProCard(2)}
             style={{ opacity: 0 }}
             className="bg-[#fce075]/5 border border-[#fce075]/20 rounded-none p-10 overflow-hidden relative min-h-[350px] flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-500 group will-change-transform axiom-panel axiom-corner-tl"
           >
             <h3 className="text-[28px] font-black text-white mb-4 tracking-tight italic uppercase">MULTI_SOURCE_CONNECT</h3>
             <p className="text-white/50 text-[16px] leading-[1.8] mb-8 font-medium">
               Designed to integrate with any <span className="text-[#fce075] font-black italic">EXECUTION_SOURCE</span>. Zero vendor lock-in.
             </p>
             <div className="flex items-center gap-6 text-[#fce075] text-[15px] font-black mb-8 tracking-widest uppercase italic">
               <span className="cursor-pointer hover:scale-110 transition-transform">Binance</span>
               <span className="cursor-pointer hover:scale-110 transition-transform">IBKR</span>
               <span className="cursor-pointer hover:scale-110 transition-transform">Coinbase</span>
             </div>

             <div className="mt-auto bg-black border border-[#fce075]/20 rounded-none p-6 font-mono text-[13px] shadow-[inset_0_0_20px_rgba(0,0,0,1)] transition-colors hover:border-[#fce075]/40">
               <div className="flex items-center justify-between border-b border-[#fce075]/10 pb-4 mb-4 text-[#fce075]/50 font-black tracking-widest uppercase text-[10px] italic">
                 AXIOM_BROKER_CONFIG
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
               </div>
               <div className="leading-[2]">
                 <span className="text-pink-500 font-bold">import</span> {'{'} loader {'}'} <span className="text-pink-500 font-bold">from</span> <span className="text-[#fce075]">&apos;axiom/source&apos;</span>;<br/>
                 <span className="text-pink-500 font-bold">export const</span> source = loader({'{'}<br/>
                 &nbsp;&nbsp;venue: <span className="text-[#fce075]">&apos;BINANCE_FUTURES&apos;</span><br/>
                 {'}'});
               </div>
             </div>
           </div>

           {/* Card 4 */}
           <div
             ref={setProCard(3)}
             style={{ opacity: 0 }}
             className="bg-[#fce075]/5 border border-[#fce075]/20 rounded-none p-10 overflow-hidden relative min-h-[350px] shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-500 will-change-transform axiom-panel axiom-corner-tl"
           >
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJCTxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSIjMDZiNmQ0Ii8+Cjwvc3ZnPg==')] opacity-[0.15] mix-blend-screen mix-blend-plus-lighter"></div>

             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#fce075]/20 blur-[80px] rounded-full z-0 animate-[glowRotate_10s_ease-in-out_infinite]" />

             {/* Abstract Mockup Back Window */}
             <div className="absolute top-8 left-8 w-[85%] h-[240px] bg-black rounded-none border border-[#fce075]/20 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden z-10 animate-[floatUp_8s_ease-in-out_infinite]">
                <div className="text-[#fce075]/40 text-[11px] font-mono font-black tracking-widest uppercase px-5 py-3.5 border-b border-[#fce075]/10 flex items-center justify-between italic">CONTEXT_STREAMS</div>
                <div className="p-4 space-y-2 text-[14px] text-white/70 font-medium">
                  {["Spot Markets", "Derivatives", "FX Majors"].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-none cursor-pointer transition-colors hover:bg-white/5 hover:translate-x-1"
                    >
                      <span className="flex items-center gap-3 italic"><Globe className="w-4 h-4 text-[#fce075]"/> {item}</span>
                      {i === 0 && <span className="bg-[#fce075] text-background px-2.5 py-1 rounded-none text-[10px] font-black uppercase tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.5)] italic">ACTIVE</span>}
                    </div>
                  ))}
                </div>
             </div>

             {/* Abstract Mockup Front Window */}
             <div className="absolute top-36 right-4 w-[85%] h-[220px] bg-[#020617] rounded-none border border-[#fce075]/40 shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden z-20 animate-[floatDown_9s_ease-in-out_infinite]">
                <div className="text-[#fce075]/60 text-[11px] font-mono font-black tracking-widest uppercase px-5 py-3.5 border-b border-[#fce075]/20 bg-[#fce075]/5 italic underline">EXEC_EDITOR_V1</div>
                <div className="p-6 font-mono text-[13px] text-white/80 leading-[2] relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Code2 className="w-16 h-16 text-white" /></div>
                  <span className="text-[#fce075]/30 font-black">---</span><br/>
                  <span className="text-[#fce075] font-bold">strategy:</span> <span className="text-white italic">Mean_Reversion_Lp</span><br/>
                  <span className="text-[#fce075]/30 font-black">---</span><br/><br/>
                  <span className="text-[#fce075] font-bold text-lg">#</span> <span className="font-black text-lg italic">EXECUTE_SEQUENCER</span><br/><br/>
                  <span className="text-white/60">System isolated...</span>
                  <span className="inline-block w-2.5 h-4 bg-[#fce075] ml-1 align-middle animate-[blink_1s_steps(1)_infinite]"/>
                </div>
             </div>
           </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#fce075]/10 bg-background py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start">
             <div onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex items-center gap-3 text-white mb-2 group cursor-pointer">
               <div className="w-6 h-6 rounded-none bg-[#fce075]/10 flex items-center justify-center border border-[#fce075]/30 group-hover:rotate-180 transition-transform duration-500">
                 <Terminal className="w-3.5 h-3.5 text-[#fce075]" />
               </div>
               <span className="text-base font-black tracking-[0.2em] uppercase group-hover:text-[#fce075] transition-colors italic">Axiom_Terminal</span>
             </div>
             <span className="text-[11px] text-[#fce075]/40 uppercase tracking-[0.2em] font-mono font-black mt-2 italic">
                ESTABLISHED :: 2024 // SYSTEM_NODE_REMOTE
             </span>
          </div>

          <div className="flex items-center gap-8 text-[12px] uppercase tracking-[0.2em] font-black text-[#fce075]/40 border border-[#fce075]/5 bg-[#fce075]/5 px-6 py-3 rounded-none italic">
             <Link href="/legal/terms" className="hover:text-[#fce075] transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#fce075] hover:after:w-full after:transition-all">Terms_Of_Service</Link>
             <div className="w-1 h-1 rounded-none bg-[#fce075]/20" />
             <Link href="/legal/privacy" className="hover:text-[#fce075] transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-[#fce075] hover:after:w-full after:transition-all">Privacy_Protocol</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes riskPulse {
          0%, 100% { stroke-dashoffset: 200; }
          50% { stroke-dashoffset: 70; }
        }
        @keyframes dataStream {
          0% { width: 15%; }
          25% { width: 85%; }
          50% { width: 40%; }
          75% { width: 95%; }
          100% { width: 15%; }
        }
        @keyframes volBar {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(0.3); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(-10px) rotateX(0deg) rotateY(0deg); }
          50% { transform: translateY(10px) rotateX(5deg) rotateY(-5deg); }
        }
        @keyframes floatDown {
          0%, 100% { transform: translateY(10px) rotateX(5deg) rotateY(-5deg); }
          50% { transform: translateY(-10px) rotateX(0deg) rotateY(0deg); }
        }
        @keyframes glowRotate {
          0%, 100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          50% { transform: translate(-50%, -50%) scale(1.2) rotate(90deg); }
        }
        html {
          scroll-behavior: initial !important;
        }
      `}</style>

      {/* Cookie Banner */}
      {showCookies && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md bg-background/90 backdrop-blur-xl border border-[#fce075]/20 p-6 rounded-none z-[100] shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex flex-col gap-4 axiom-panel axiom-corner-tl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-none bg-[#fce075]/10 flex items-center justify-center border border-[#fce075]/20 shrink-0">
              <ShieldAlert className="w-5 h-5 text-[#fce075]" />
            </div>
            <div>
              <h4 className="text-white font-black mb-1 uppercase tracking-widest text-sm italic">Privacy_Handshake</h4>
              <p className="text-[#fce075]/50 text-xs leading-relaxed font-black uppercase tracking-tight italic">
                We use cookies to secure session logic and optimize intelligence flows. Consent is implied by continued terminal usage.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCookies(false)} className="flex-1 bg-[#fce075] text-background font-black py-2.5 rounded-none hover:bg-[#fce075]/80 transition-colors text-xs italic uppercase tracking-widest">Accept_All</button>
            <button onClick={() => setShowCookies(false)} className="flex-1 bg-[#fce075]/5 text-[#fce075] font-black py-2.5 rounded-none hover:bg-[#fce075]/10 transition-colors border border-[#fce075]/20 text-xs italic uppercase tracking-widest">Deny</button>
          </div>
        </div>
      )}
    </div>
  );
}
