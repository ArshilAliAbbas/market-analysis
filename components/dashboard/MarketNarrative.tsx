"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { Sparkles, Loader2 } from "lucide-react";
import { getNews, generateMarketNarrative } from "@/services/api";

export default function MarketNarrative({ activeMarket = "Global Equities" }: { activeMarket?: string }) {
  const [narrative, setNarrative] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNarrativeData = async () => {
      setIsLoading(true);
      const rawNews = await getNews();
      
      if (!rawNews || rawNews.length === 0) {
        if (activeMarket === "FX Majors") {
          setNarrative("USD strength dominates on hawkish Fed comments. EUR/USD testing major support at 1.0800.");
        } else if (activeMarket === "Crypto Liquidity") {
          setNarrative("Bitcoin ETF inflows remain robust. BTC/USD absorbing sell pressure, looking for breakout above recent highs.");
        } else {
          setNarrative("Equities holding key technical levels despite macro headwinds. Tech sector showing structural resilience.");
        }
        setIsLoading(false);
        return;
      }
      
      const limitedNews = rawNews.slice(0, 5);
      const res = await generateMarketNarrative(limitedNews);
      
      if (res && res.narrative) {
        setNarrative(res.narrative);
      } else {
        setNarrative("Unable to synthesize market narrative at this time.");
      }
      setIsLoading(false);
    };

    fetchNarrativeData();
    const interval = setInterval(fetchNarrativeData, 5 * 60000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="axiom-panel flex flex-col shrink-0 p-4 min-h-[120px] border-white/5 bg-white/[0.02]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-white/40" />
          Neural Core Synthesis
        </h2>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 border border-white/10">
          <div className="w-1.5 h-1.5 rounded-none bg-white/40 animate-pulse" />
          <span className="text-[8px] uppercase font-black tracking-widest text-white/40 italic">ACTIVE_LINK</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {isLoading && !narrative ? (
           <div className="flex items-center gap-2 text-text-tertiary">
             <Loader2 className="w-3 h-3 animate-spin" />
             <span className="text-[9px] uppercase font-bold tracking-widest">Synthesizing macro context...</span>
           </div>
        ) : (
          <p className="text-white/70 text-[13px] font-mono leading-relaxed border-l-2 border-white/20 pl-4 py-1">
            {narrative}
          </p>
        )}
      </div>
    </div>
  );
}
