"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import { Loader2, Target, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMarketData } from "@/services/api";

type MarketData = {
  symbol: string;
  price: number;
  percentChange: number;
};

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
          if (Date.now() - timestamp < 3 * 60 * 1000) {
            // 3 min cache
            setPlay(data);
            setIsLoading(false);
            return;
          }
        }

        const marketRaw = await getMarketData();
        const topAssets = (marketRaw || []).slice(0, 8).map((m: MarketData) => ({
          symbol: m.symbol,
          price: m.price,
          change: m.percentChange,
        }));

        const res = await fetch("/api/ai-worker", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "trade-setup",
            payload: { marketData: topAssets },
          }),
        });

        const data = await res.json();

        const playData = data?.primary || data;

        if (active && playData) {
          const normalizedPlay: TradePlay = {
            setup:
              playData.setup ||
              (playData.direction
                ? `Direction: ${playData.direction}`
                : "No setup"),
            entry: playData.entry || "-",
            stop_loss: playData.stop_loss || "-",
            take_profit: playData.take_profit || "-",
            risk_reward: playData.risk_reward || "-",
            confidence: playData.confidence || "low",
            reasoning: playData.reasoning || "No reasoning",
          };

          setPlay(normalizedPlay);
          localStorage.setItem(
            "axiom_current_play",
            JSON.stringify({ data: normalizedPlay, timestamp: Date.now() }),
          );
        }
      } catch (error) {
        console.error("Failed to load market play", error);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchPlay();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="axiom-panel axiom-corner-tl border-accent/20 flex flex-col h-full shrink-0 overflow-hidden bg-card/40">
      <div className="flex items-center justify-between px-4 py-3 border-b border-accent/10 bg-accent/5">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-accent animate-pulse-accent" /> Quantitative Edge
        </h2>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-center overflow-hidden">
        {isLoading && !play ? (
          <div className="flex flex-col items-center justify-center gap-3 text-text-tertiary h-full">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">
              Processing algorithmic vectors...
            </span>
          </div>
        ) : !play ? (
          <div className="flex items-center justify-center text-xs text-text-muted h-full">
            Unable to determine play.
          </div>
        ) : (
          <div className="flex flex-col h-full gap-5">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-sm font-black text-white tracking-widest italic uppercase">
                  {play.setup}
                </span>
                <span className="text-[9px] text-accent/50 mt-1.5 uppercase tracking-widest flex items-center gap-1.5 font-black">
                  <Crosshair className="w-3 h-3" /> VECTOR_LOCK_SCN
                </span>
              </div>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-none text-[9px] font-black uppercase tracking-widest italic border",
                  play.confidence === "high"
                    ? "bg-bullish-dim text-bullish border-bullish/30"
                    : play.confidence === "medium"
                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
                      : "bg-bearish-dim text-bearish border-bearish/30",
                )}
              >
                {play.confidence}_CONF
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="flex flex-col bg-accent/5 px-2.5 py-2 rounded-none border border-accent/10">
                <span className="text-[8px] text-accent/40 uppercase font-black tracking-widest mb-1 italic">
                  ENTRY_PRC
                </span>
                <span className="text-sm text-white font-black font-mono">
                  {play.entry}
                </span>
              </div>
              <div className="flex flex-col bg-accent/5 px-2.5 py-2 rounded-none border border-accent/10">
                <span className="text-[8px] text-accent/40 uppercase font-black tracking-widest mb-1 italic">
                  RR_RATIO
                </span>
                <span className="text-sm text-white font-black font-mono">
                  {play.risk_reward}
                </span>
              </div>
              <div className="flex flex-col bg-bearish-dim/5 px-2.5 py-2 rounded-none border border-bearish/20 border-l-2 border-l-bearish">
                <span className="text-[8px] text-bearish/50 uppercase font-black tracking-widest mb-1 italic">
                  STOP_THRES
                </span>
                <span className="text-sm text-bearish font-black font-mono">
                  {play.stop_loss}
                </span>
              </div>
              <div className="flex flex-col bg-bullish-dim/5 px-2.5 py-2 rounded-none border border-bullish/20 border-l-2 border-l-bullish">
                <span className="text-[8px] text-bullish/50 uppercase font-black tracking-widest mb-1 italic">
                  TARGET_EXIT
                </span>
                <span className="text-sm text-bullish font-black font-mono">
                  {play.take_profit}
                </span>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-accent/10 overflow-y-auto no-scrollbar">
              <p className="text-[11px] text-slate-400 font-mono leading-relaxed border-l-2 border-accent/20 pl-3">
                &gt; {play.reasoning}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
