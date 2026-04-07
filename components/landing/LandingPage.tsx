"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Activity, Cpu, ShieldAlert, Zap } from "lucide-react";
import { useRef } from "react";

interface LandingPageProps {
  onOpenTerminal: () => void;
}

export default function LandingPage({ onOpenTerminal }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#06090D] text-white font-sans selection:bg-white/10 selection:text-white bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgibm9pc2VGaWx0ZXIpIiBvcGFjaXR5PSIwLjAyIi8+PC9zdmc+')]">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#06090D]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-[12px] md:text-sm tracking-[0.4em] uppercase font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
            Axiom
          </div>
          <button
            onClick={onOpenTerminal}
            className="text-xs font-bold uppercase tracking-widest bg-white text-black px-4 py-2 rounded text-[10px] hover:bg-gray-200 transition-colors"
          >
            Launch Terminal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4 overflow-hidden"
      >
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent blur-3xl rounded-full" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
           <motion.div
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
             className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Terminal Access Live
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-[1.1] mb-8"
          >
            See what <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30">actually</span>
            <br /> moves the market.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            Institutional-grade data, AI-driven narrative insights, and absolute clarity—all distilled into a singular terminal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <button
              onClick={onOpenTerminal}
              className="group relative px-8 py-4 bg-white text-black font-extrabold uppercase tracking-widest text-xs rounded shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all overflow-hidden"
            >
               <span className="relative z-10 flex items-center gap-2">
                  Open Terminal
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
               </span>
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold">Discover</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="relative py-32 px-4 border-t border-white/5 bg-[#0A0D12]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
                Raw intelligence,<br /> <span className="text-white/50">refined execution.</span>
              </h2>
              <p className="text-lg text-white/50 leading-relaxed mb-8">
                Axiom bypasses the noise. By aggregating live order flow, macro developments, and news sentiment, we generate AI-structured setups exactly when volatility presents opportunity.
              </p>
              
              <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded bg-white/5 flex items-center justify-center border border-white/10">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-widest uppercase mb-1">Real-Time Dashboards</h3>
                    <p className="text-sm text-white/40">Context-aware panels tailored for Crypto, Equities, and FX.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded bg-white/5 flex items-center justify-center border border-white/10">
                    <Cpu className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-widest uppercase mb-1">AI Smart Setups</h3>
                    <p className="text-sm text-white/40">Multi-scenario trade plans generated instantly using LLaMA infrastructure.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded bg-white/5 flex items-center justify-center border border-white/10">
                    <ShieldAlert className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold tracking-widest uppercase mb-1">Risk Matrices</h3>
                    <p className="text-sm text-white/40">Automated sizing suggestions to maintain institutional capital preservation.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual Mockup Element */}
            <div className="relative aspect-square md:aspect-[4/3] rounded-xl border border-white/10 bg-[#06090D] shadow-[0_0_100px_rgba(255,255,255,0.02)] overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent" />
              <div className="w-3/4 h-3/4 border border-white/10 rounded flex flex-col bg-[#0A0D12]">
                <div className="h-8 border-b border-white/10 flex items-center px-4 gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 p-4 flex flex-col gap-3">
                  <div className="w-1/3 h-4 bg-white/10 rounded" />
                  <div className="flex-1 flex gap-3">
                    <div className="w-1/2 h-full bg-white/5 rounded" />
                    <div className="w-1/2 h-full bg-white/5 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-40 px-4 text-center">
         <div className="absolute inset-0 bg-[#06090D]" />
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />
         
         <div className="relative z-10">
           <Zap className="w-8 h-8 mx-auto mb-6 text-white/80" />
           <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-8">
             Ready to trade <span className="text-white/40">clearer?</span>
           </h2>
           <button
             onClick={onOpenTerminal}
             className="px-10 py-5 bg-white text-black font-extrabold uppercase tracking-[0.2em] text-sm rounded shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all"
           >
             Enter Terminal
           </button>
         </div>
      </section>

      {/* Footer / Links */}
      <footer className="border-t border-white/5 bg-[#030406] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
             <span className="text-sm font-extrabold tracking-widest uppercase mb-1">Axiom Terminal</span>
             <span className="text-[10px] text-white/40 uppercase tracking-widest">
                A <a href="https://www.softpulser.com" target="_blank" rel="noreferrer" className="text-white hover:text-white/80 transition-colors underline underline-offset-4 decoration-white/30">Softpulser</a> Company
             </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-white/40 font-bold font-sans">
             <Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link>
             <span>•</span>
             <Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link>
             <span>•</span>
             <Link href="/legal/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
            Designed by <a href="" target="_blank" rel="noreferrer" className="text-white hover:text-white/80 font-sans font-bold transition-colors ml-1">Ars</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
