"use client";

import { Card } from "../ui/Card";
import { Globe2, Building2, Landmark, Activity, Zap, Clock, BarChart2, Globe } from "lucide-react";

export default function MarketConditions({ activeMarket = "Global Equities" }: { activeMarket?: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 shrink-0">
      <div className="axiom-panel axiom-corner-tl flex flex-col p-4 border-accent/20 overflow-hidden bg-accent/5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-1.5 italic">
            <Clock className="w-3 h-3" /> 
            {activeMarket === "Crypto Liquidity" ? "NET_CRYPTO_24" : activeMarket === "FX Majors" ? "EUR_LND_SESS" : "USA_NY_SESS"}
          </span>
          <div className="w-1.5 h-1.5 rounded-none bg-accent animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
        </div>
        <div className="flex items-baseline gap-2 data-value">
          <span className="text-base font-black text-white italic">
            {activeMarket === "Crypto Liquidity" ? "ACTIVE" : activeMarket === "FX Majors" ? "SESS_OPEN" : "SESS_OPEN"}
          </span>
          <span className="text-[10px] text-accent/40 font-black uppercase tracking-widest">
             {activeMarket === "Crypto Liquidity" ? "24H" : activeMarket === "FX Majors" ? "22:00" : "15:30"}
          </span>
        </div>
      </div>

      <div className="axiom-panel axiom-corner-tl flex flex-col p-4 border-accent/20 overflow-hidden bg-accent/5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-1.5 italic">
            <BarChart2 className="w-3 h-3" /> 
            VOL_METRIC_IDX
          </span>
          <span className="text-[10px] font-black text-bullish italic">+1.2%</span>
        </div>
        <div className="flex items-baseline gap-2 data-value">
          <span className="text-base font-black text-white italic font-mono">
            {activeMarket === "Crypto Liquidity" ? "42.50" : activeMarket === "FX Majors" ? "08.40" : "14.20"}
          </span>
          <span className="text-[10px] text-accent/40 font-black uppercase tracking-widest italic">REAL_VOL</span>
        </div>
      </div>

      <div className="axiom-panel axiom-corner-tl flex flex-col p-4 border-accent/20 overflow-hidden bg-accent/5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-1.5 italic">
            <Globe className="w-3 h-3" /> LIQ_DEPTH_MAP
          </span>
          <div className="flex items-center gap-0.5">
            <div className="w-1.5 h-2 bg-accent rounded-none opacity-100" />
            <div className="w-1.5 h-2 bg-accent rounded-none opacity-100" />
            <div className="w-1.5 h-3 bg-accent rounded-none opacity-100" />
            <div className="w-1.5 h-2 bg-accent/10 rounded-none" />
          </div>
        </div>
        <div className="flex items-baseline gap-2 data-value">
          <span className="text-base font-black text-accent italic underline decoration-accent/30 underline-offset-4">OPTIMAL</span>
          <span className="text-[10px] text-accent/40 font-black uppercase tracking-widest italic">S_LIQUIDITY</span>
        </div>
      </div>

      <div className="axiom-panel axiom-corner-tl flex flex-col p-4 border-accent/20 overflow-hidden bg-accent/5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-1.5 italic">
            <Activity className="w-3 h-3" /> REGIME_VEC
          </span>
          <span className="text-[9px] font-black text-white italic bg-accent/20 px-1 border border-accent/30 tracking-widest">NEURAL_AI</span>
        </div>
        <div className="flex items-baseline gap-2 data-value">
          <span className="text-base font-black text-white italic">
            {activeMarket === "Crypto Liquidity" ? "VECTOR_TREND" : activeMarket === "FX Majors" ? "MEAN_REV" : "RISK_ON"}
          </span>
          <span className="text-[10px] text-accent/40 font-black uppercase tracking-widest italic">P_STATE</span>
        </div>
      </div>
    </div>
  );
}
