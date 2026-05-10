"use client";

import { Card } from "../ui/Card";
import { Globe2, Building2, Landmark, Activity, Zap, Clock, BarChart2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MarketConditions({ activeMarket = "Global Equities" }: { activeMarket?: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 shrink-0">
      <div className="axiom-panel flex flex-col p-4 border-white/5 overflow-hidden bg-white/[0.02]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> 
            {activeMarket === "Crypto Liquidity" ? "NET_CRYPTO_24" : activeMarket === "FX Majors" ? "EUR_LND_SESS" : "USA_NY_SESS"}
          </span>
          <div className="w-1.5 h-1.5 rounded-none bg-white/20 animate-pulse" />
        </div>
        <div className="flex items-baseline gap-2 data-value">
          <span className="text-base font-bold text-white uppercase italic">
            {activeMarket === "Crypto Liquidity" ? "ACTIVE" : activeMarket === "FX Majors" ? "SESS_OPEN" : "SESS_OPEN"}
          </span>
          <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
             {activeMarket === "Crypto Liquidity" ? "24H" : activeMarket === "FX Majors" ? "22:00" : "15:30"}
          </span>
        </div>
      </div>

      <div className="axiom-panel flex flex-col p-4 border-white/5 overflow-hidden bg-white/[0.02]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5">
            <BarChart2 className="w-3 h-3" /> 
            VOL_METRIC_IDX
          </span>
          <span className="text-[10px] font-bold text-bullish">+1.2%</span>
        </div>
        <div className="flex items-baseline gap-2 data-value">
          <span className="text-base font-bold text-white italic font-mono">
            {activeMarket === "Crypto Liquidity" ? "42.50" : activeMarket === "FX Majors" ? "08.40" : "14.20"}
          </span>
          <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">REAL_VOL</span>
        </div>
      </div>

      <div className="axiom-panel flex flex-col p-4 border-white/5 overflow-hidden bg-white/[0.02]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5">
            <Globe className="w-3 h-3" /> LIQ_DEPTH_MAP
          </span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={cn("w-1.5 rounded-none bg-white/20", i === 3 ? "h-3 bg-white/40" : "h-2")} />
            ))}
          </div>
        </div>
        <div className="flex items-baseline gap-2 data-value">
          <span className="text-base font-bold text-white uppercase italic">OPTIMAL</span>
          <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">S_LIQUIDITY</span>
        </div>
      </div>

      <div className="axiom-panel flex flex-col p-4 border-white/5 overflow-hidden bg-white/[0.02]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5">
            <Activity className="w-3 h-3" /> REGIME_VEC
          </span>
          <span className="text-[9px] font-bold text-white/60 bg-white/10 px-1 border border-white/10 tracking-widest uppercase">NEURAL_AI</span>
        </div>
        <div className="flex items-baseline gap-2 data-value">
          <span className="text-base font-bold text-white uppercase italic">
            {activeMarket === "Crypto Liquidity" ? "VECTOR_TREND" : activeMarket === "FX Majors" ? "MEAN_REV" : "RISK_ON"}
          </span>
          <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">P_STATE</span>
        </div>
      </div>
    </div>
  );
}
