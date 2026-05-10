"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Terminal, Activity, ShieldAlert, BarChart3, Database, Globe, Cpu, Zap, ArrowRight, Lock } from "lucide-react";

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
  const proTitleRef = useRef<HTMLHeadingElement>(null);
  const proCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const badgeRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [showCookies, setShowCookies] = useState(true);

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

    // --- Hero parallax ---
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
        { y: 120, scale: 0.9, opacity: 0 },
        {
          y: 0, scale: 1, opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: dashRef.current,
            start: "top 95%",
            end: "top 40%",
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

    // --- Feature cards ---
    featureCardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8,
          delay: i * 0.1,
          scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" },
        }
      );
    });

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
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 0.8,
          delay: i * 0.1,
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
    <div ref={containerRef} className="min-h-screen bg-black text-white font-sans selection:bg-white/30 selection:text-white overflow-x-hidden relative">
      
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <nav className="sticky top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex items-center gap-3 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 group-hover:rotate-90 transition-transform duration-500">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <span className="text-[16px] font-bold tracking-[0.2em] uppercase text-white">
                Axiom Terminal
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section ref={heroRef} className="relative flex min-h-[calc(100vh-70px)] flex-col items-center justify-center px-4 pt-10">
          <div className="max-w-5xl text-center">
            <div ref={badgeRef} style={{ opacity: 0 }} className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              Institutional Intelligence
            </div>

            <h1 ref={h1Ref} style={{ opacity: 0 }} className="mb-10 text-6xl font-medium tracking-tight text-white sm:text-8xl lg:text-[100px] leading-[1]">
              The definitive <br/> <span className="text-white/20">trading interface.</span>
            </h1>

            <p ref={subRef} style={{ opacity: 0 }} className="mx-auto mb-14 max-w-2xl text-lg font-medium text-white/50 sm:text-xl leading-relaxed">
              Aggregating global order flow and high-fidelity intelligence into a singular, professional-grade terminal.
            </p>

            <div ref={ctaRef} style={{ opacity: 0 }} className="flex flex-col items-center justify-center gap-5 sm:flex-row">
              <button onClick={onOpenTerminal} className="group h-14 inline-flex items-center justify-center gap-3 rounded-full bg-white px-10 text-sm font-semibold text-black transition-all hover:bg-white/90 active:scale-95">
                Launch Terminal
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="h-14 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-10 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-95">
                Documentation
              </button>
            </div>
          </div>
        </section>

        {/* Dashboard Mockup */}
        <section className="px-6 pb-40">
          <div ref={dashRef} style={{ opacity: 0 }} className="max-w-7xl mx-auto w-full bg-white/[0.02] backdrop-blur-3xl rounded-[32px] border border-white/5 shadow-[0_40px_120px_-20px_rgba(0,0,0,1)] overflow-hidden flex flex-col font-sans relative will-change-transform">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <div className="h-14 border-b border-white/5 bg-white/[0.02] flex items-center px-8 gap-3">
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-white/10" />
                 <div className="w-3 h-3 rounded-full bg-white/10" />
                 <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="ml-4 text-[10px] text-white/20 font-medium tracking-widest flex items-center gap-2 uppercase">
                <Lock className="w-3 h-3" />
                terminal.axiom.local
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[600px] bg-black/40">
              {/* Left Panel */}
              <div className="flex flex-col gap-8">
                <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-8">
                   <div className="flex items-center gap-4 mb-8">
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                       <Globe className="w-5 h-5 text-white/40" />
                     </div>
                     <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20">Market Feed</h3>
                   </div>
                   <div className="space-y-6">
                     {[
                       { l: "DXY", v: "104.25", c: "+0.12%", up: true },
                       { l: "US10Y", v: "4.32%", c: "+0.05", up: true },
                       { l: "SPX", v: "5,123.4", c: "-0.45%", up: false },
                     ].map((item, i) => (
                       <div key={i} className="flex justify-between items-center text-sm">
                         <span className="text-white/20 font-medium tracking-wide">{item.l}</span>
                         <div className="flex items-center gap-4 font-mono">
                           <span className="text-white/60">{item.v}</span>
                           <span className={item.up ? 'text-emerald-500' : 'text-rose-500'}>{item.c}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
                <div className="h-[220px] bg-white/[0.02] border border-white/5 rounded-2xl p-8 flex flex-col justify-center items-center text-center">
                    <ShieldAlert className="w-8 h-8 text-white/20 mb-4" />
                    <span className="text-4xl font-light text-white mb-1">78.4</span>
                    <span className="text-[10px] uppercase tracking-widest text-white/20">Confidence Score</span>
                </div>
              </div>

              {/* Center & Right Column */}
              <div className="md:col-span-2 flex flex-col gap-8">
                <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-3xl p-10 flex flex-col justify-center items-center text-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)]" />
                   <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 relative z-10 border border-white/10">
                     <Activity className="w-10 h-10 text-white/40" />
                   </div>
                   <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight relative z-10">Institutional Intelligence</h3>
                   <p className="text-base text-white/40 max-w-md font-medium relative z-10">Real-time data feeds processed with millisecond latency for the competitive edge.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 flex flex-col justify-between">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                           <Database className="w-5 h-5 text-white/40" />
                         </div>
                         <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20">Network</h3>
                       </div>
                       <div className="text-3xl font-light text-white mt-4">24 <span className="text-xs text-white/20 ml-2 font-medium">Nodes Active</span></div>
                   </div>
                   <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 flex flex-col justify-between">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                           <Zap className="w-5 h-5 text-white/40" />
                         </div>
                         <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20">Performance</h3>
                       </div>
                       <div className="text-3xl font-light text-white mt-4">0.8ms <span className="text-xs text-white/20 ml-2 font-medium">Avg Latency</span></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="max-w-5xl mx-auto px-6 py-40">
           <div ref={descRef} style={{ opacity: 0 }} className="text-center md:text-left">
             <p className="text-4xl md:text-6xl leading-[1.1] font-medium text-white tracking-tight mb-24 max-w-4xl">
                Axiom Terminal provides <span className="text-white/20">institutional grade intelligence</span> for professional traders, designed with precision and simplicity at its core.
             </p>
           </div>

           <div id="features" className="grid grid-cols-1 md:grid-cols-3 bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-3xl">
              {[
                 { icon: Globe, title: "Market Data", desc: "Real-time feeds from global exchanges with millisecond precision." },
                 { icon: Cpu, title: "AI Analytics", desc: "Advanced pattern recognition and sentiment analysis powered by local models." },
                 { icon: Zap, title: "Performance", desc: "Built for speed and reliability, ensuring zero lag during critical moments." }
              ].map((item, i) => (
                <div key={i} ref={setFeatureCard(i)} style={{ opacity: 0 }} className="group p-12 md:p-16 border-b md:border-b-0 md:border-r border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors duration-500 flex flex-col">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl items-center justify-center flex mb-10 group-hover:bg-white/10 transition-colors">
                    <item.icon className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-base text-white/40 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Professionals Section */}
        <section id="architecture" className="max-w-7xl mx-auto px-6 py-40 border-t border-white/5">
           <h2 ref={proTitleRef} style={{ opacity: 0 }} className="text-5xl md:text-7xl font-medium text-white text-center mb-32 tracking-tight">
             Designed for <span className="text-white/20">professionals.</span>
           </h2>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { title: "Market Agnostic", desc: "Official support for Crypto, FX, Equities, and Commodities — portable to any global market.", icon: Globe },
                { title: "Advanced Analytics", desc: "Leverage advanced pattern recognition and sentiment analysis powered by institutional AI models.", icon: BarChart3 },
                { title: "Global Connectivity", desc: "Connect to global exchanges and liquidity providers with zero vendor lock-in.", icon: Globe },
                { title: "Secure & Private", desc: "Built on private, encrypted nodes. Your data never leaves your infrastructure.", icon: Lock },
              ].map((card, i) => (
                <div key={i} ref={setProCard(i)} style={{ opacity: 0 }} className="bg-white/[0.02] border border-white/5 rounded-[40px] p-12 md:p-16 flex flex-col group shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:bg-white/[0.03]">
                  <h3 className="text-3xl font-semibold text-white mb-6 tracking-tight">{card.title}</h3>
                  <p className="text-lg text-white/50 leading-relaxed mb-12 font-medium">{card.desc}</p>
                  <div className="mt-auto">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <card.icon className="w-8 h-8 text-white/20" />
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
             <div onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex items-center gap-4 text-white mb-6 group cursor-pointer">
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:rotate-180 transition-transform duration-700">
                 <Terminal className="w-5 h-5 text-white" />
               </div>
               <span className="text-xl font-bold tracking-[0.2em] uppercase text-white">Axiom Terminal</span>
             </div>
             <p className="text-xs text-white/20 uppercase tracking-[0.2em] font-semibold">
                Established 2024. The gold standard in market intelligence.
             </p>
          </div>

          <div className="flex items-center gap-12 text-[11px] uppercase tracking-[0.2em] font-bold text-white/30">
             <Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
             <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
             <Link href="/documentation" className="hover:text-white transition-colors">Docs</Link>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      {showCookies && (
        <div className="fixed bottom-10 left-10 right-10 md:left-auto md:max-w-sm bg-black/80 backdrop-blur-3xl border border-white/10 p-8 rounded-[32px] z-[100] shadow-2xl flex flex-col gap-8">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-white/40" />
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2 text-base tracking-tight">Privacy Policy</h4>
              <p className="text-white/40 text-sm leading-relaxed">
                We use cookies to enhance your terminal experience. By continuing, you agree to our use of cookies.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowCookies(false)} className="flex-1 bg-white text-black font-bold py-3 rounded-2xl hover:bg-white/90 transition-all text-xs active:scale-95">Accept</button>
            <button onClick={() => setShowCookies(false)} className="flex-1 bg-white/5 text-white font-bold py-3 rounded-2xl hover:bg-white/10 transition-all border border-white/10 text-xs active:scale-95">Decline</button>
          </div>
        </div>
      )}
    </div>
  );
}
