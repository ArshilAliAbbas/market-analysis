"use client";

import { Card } from "../ui/Card";
import { Globe2, Building2, Landmark, Activity, Zap, Clock, BarChart2, Globe } from "lucide-react";

export default function MarketConditions({ activeMarket = "Global Equities" }: { activeMarket?: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 shrink-0">
      <Card className="flex flex-col p-3 border-card-border overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
            <Clock className="w-2.5 h-2.5" /> 
            {activeMarket === "Crypto Liquidity" ? "Crypto" : activeMarket === "FX Majors" ? "London" : "NYSE"}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-bullish shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
        </div>
        <div className="flex items-baseline gap-1.5 data-value mb-1">
          <span className="text-sm font-extrabold text-text-primary">
            {activeMarket === "Crypto Liquidity" ? "24/7" : activeMarket === "FX Majors" ? "OPEN" : "OPEN"}
          </span>
          <span className="text-[10px] text-text-muted font-bold uppercase">
             {activeMarket === "Crypto Liquidity" ? "Active" : activeMarket === "FX Majors" ? "- 2H left" : "- 4H left"}
          </span>
        </div>
      </Card>

      <Card className="flex flex-col p-3 border-card-border overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
            <BarChart2 className="w-2.5 h-2.5" /> 
            {activeMarket === "Crypto Liquidity" ? "BTC Vol" : activeMarket === "FX Majors" ? "EUR/USD Vol" : "VIX"}
          </span>
          <span className="text-[9px] font-extrabold text-bullish">+1.2%</span>
        </div>
        <div className="flex items-baseline gap-1.5 data-value mb-1">
          <span className="text-sm font-extrabold text-text-primary">
            {activeMarket === "Crypto Liquidity" ? "42.5" : activeMarket === "FX Majors" ? "8.4" : "14.2"}
          </span>
          <span className="text-[10px] text-text-muted font-bold uppercase">Crush</span>
        </div>
      </Card>

      <Card className="flex flex-col p-3 border-card-border overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
            <Globe className="w-2.5 h-2.5" /> Liquidity
          </span>
          <div className="flex items-center gap-0.5">
            <div className="w-1 h-2 bg-bullish rounded-sm opacity-100" />
            <div className="w-1 h-2 bg-bullish rounded-sm opacity-100" />
            <div className="w-1 h-3 bg-bullish rounded-sm opacity-100" />
            <div className="w-1 h-2 bg-divider rounded-sm" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 data-value mb-1">
          <span className="text-sm font-extrabold text-bullish">GOOD</span>
          <span className="text-[10px] text-text-muted font-bold uppercase">Depth</span>
        </div>
      </Card>

      <Card className="flex flex-col p-3 border-card-border overflow-hidden relative group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
            <Activity className="w-2.5 h-2.5" /> Regime
          </span>
          <span className="text-[9px] font-extrabold text-ai-primary">AI</span>
        </div>
        <div className="flex items-baseline gap-1.5 data-value mb-1">
          <span className="text-sm font-extrabold text-text-primary">
            {activeMarket === "Crypto Liquidity" ? "Trend" : activeMarket === "FX Majors" ? "Mean Rev" : "Risk-On"}
          </span>
          <span className="text-[10px] text-text-muted font-bold uppercase">Mode</span>
        </div>
      </Card>
    </div>
  );
}
