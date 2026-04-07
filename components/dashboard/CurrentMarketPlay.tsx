"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import { Loader2, Target, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMarketData } from "@/services/api";

type TradePlay = {
  setup: string;
  entry: string;
  stop_loss: string;
  take_profit: string;
  risk_reward: string;
  confidence: "low" | "medium" | "high";
  reasoning: string;
};

export default function CurrentMarketPlay() {
  const [play, setPlay] = useState<TradePlay | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchPlay = async () => {
      try {
        const cached = localStorage.getItem("axiom_current_play");
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 3 * 60 * 1000) { // 3 min cache
            setPlay(data);
            setIsLoading(false);
            return;
          }
        }

        const marketRaw = await getMarketData();
        const topAssets = (marketRaw || []).slice(0, 8).map((m: any) => ({
          symbol: m.symbol,
          price: m.price,
          change: m.percentChange
        }));

        const res = await fetch("/api/ai-worker", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "trade-setup",
            payload: { marketData: topAssets }
          })
        });

        const data = await res.json();
        
        const playData = data?.primary || data;
        
        if (active && playData) {
          const normalizedPlay: TradePlay = {
            setup: playData.setup || (playData.direction ? `Direction: ${playData.direction}` : "No setup"),
            entry: playData.entry || "-",
            stop_loss: playData.stop_loss || "-",
            take_profit: playData.take_profit || "-",
            risk_reward: playData.risk_reward || "-",
            confidence: playData.confidence || "low",
            reasoning: playData.reasoning || "No reasoning"
          };
          
          setPlay(normalizedPlay);
          localStorage.setItem("axiom_current_play", JSON.stringify({ data: normalizedPlay, timestamp: Date.now() }));
        }
      } catch (error) {
        console.error("Failed to load market play", error);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchPlay();
    return () => { active = false; };
  }, []);

  return (
    <Card className="flex flex-col h-full shrink-0 border-card-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-divider bg-surface-sunken/30">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
          <Target className="w-3.5 h-3.5" /> Current Market Play
        </h2>
        <div className="w-1.5 h-1.5 rounded-full bg-ai-primary animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-center overflow-hidden">
        {isLoading && !play ? (
          <div className="flex flex-col items-center justify-center gap-3 text-text-tertiary h-full">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Generating trade idea...</span>
          </div>
        ) : !play ? (
          <div className="flex items-center justify-center text-xs text-text-muted h-full">Unable to determine play.</div>
        ) : (
          <div className="flex flex-col h-full gap-4">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-[13px] font-extrabold text-white tracking-tight">{play.setup}</span>
                <span className="text-[9px] text-text-muted mt-1 uppercase tracking-widest flex items-center gap-1.5">
                  <Crosshair className="w-2.5 h-2.5" /> High Conviction Pattern
                </span>
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest",
                play.confidence === "high" ? "bg-bullish/10 text-bullish border border-bullish/20" :
                play.confidence === "medium" ? "bg-caution/10 text-caution border border-caution/20" :
                "bg-bearish/10 text-bearish border border-bearish/20"
              )}>
                {play.confidence} Conf
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="flex flex-col bg-surface-elevated/30 px-2 py-1.5 rounded border border-divider">
                <span className="text-[8px] text-text-muted uppercase font-bold tracking-widest">Entry</span>
                <span className="text-xs text-white font-bold">{play.entry}</span>
              </div>
              <div className="flex flex-col bg-surface-elevated/30 px-2 py-1.5 rounded border border-divider">
                <span className="text-[8px] text-text-muted uppercase font-bold tracking-widest">Risk/Reward</span>
                <span className="text-xs text-white font-bold">{play.risk_reward}</span>
              </div>
              <div className="flex flex-col bg-surface-elevated/30 px-2 py-1.5 rounded border border-divider border-l-2 border-l-bearish/50">
                <span className="text-[8px] text-text-muted uppercase font-bold tracking-widest">Stop Loss</span>
                <span className="text-xs text-bearish font-bold">{play.stop_loss}</span>
              </div>
              <div className="flex flex-col bg-surface-elevated/30 px-2 py-1.5 rounded border border-divider border-l-2 border-l-bullish/50">
                <span className="text-[8px] text-text-muted uppercase font-bold tracking-widest">Take Profit</span>
                <span className="text-xs text-bullish font-bold">{play.take_profit}</span>
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-divider overflow-y-auto no-scrollbar">
              <p className="text-[11px] text-text-secondary leading-relaxed border-l-[1.5px] border-white/20 pl-2">
                "{play.reasoning}"
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
