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
    <Card className="flex flex-col shrink-0 p-4 min-h-[120px] border-ai-primary/15">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[9px] font-bold uppercase tracking-widest text-ai-primary flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          AI Market Narrative
        </h2>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-ai-primary/50" />
          <span className="text-[8px] uppercase font-bold tracking-widest text-text-muted">SYNC</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {isLoading && !narrative ? (
           <div className="flex items-center gap-2 text-text-tertiary">
             <Loader2 className="w-3 h-3 animate-spin" />
             <span className="text-[9px] uppercase font-bold tracking-widest">Synthesizing macro context...</span>
           </div>
        ) : (
          <p className="text-text-secondary text-[13px] leading-relaxed border-l-2 border-ai-primary/25 pl-3">
            {narrative}
          </p>
        )}
      </div>
    </Card>
  );
}
