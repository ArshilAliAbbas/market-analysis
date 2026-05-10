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
    <div className="axiom-panel border-white/5 flex flex-col h-full shrink-0 overflow-hidden bg-white/[0.02]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
          <Target className="w-3.5 h-3.5" /> Quantitative Analysis
        </h2>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-center overflow-hidden">
        {isLoading && !play ? (
          <div className="flex flex-col items-center justify-center gap-3 text-white/20 h-full">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              Analyzing market vectors...
            </span>
          </div>
        ) : !play ? (
          <div className="flex items-center justify-center text-xs text-white/20 h-full">
            Data unavailable.
          </div>
        ) : (
          <div className="flex flex-col h-full gap-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white tracking-tight uppercase">
                  {play.setup}
                </span>
                <span className="text-[9px] text-white/30 mt-1 uppercase tracking-widest flex items-center gap-1.5 font-medium">
                  <Crosshair className="w-3 h-3" /> Signal Locked
                </span>
              </div>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border",
                  play.confidence === "high"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : play.confidence === "medium"
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20",
                )}
              >
                {play.confidence} confidence
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col bg-white/5 px-3 py-2.5 rounded-lg border border-white/5">
                <span className="text-[8px] text-white/30 uppercase font-bold tracking-widest mb-1">
                  Entry
                </span>
                <span className="text-sm text-white/80 font-mono">
                  {play.entry}
                </span>
              </div>
              <div className="flex flex-col bg-white/5 px-3 py-2.5 rounded-lg border border-white/5">
                <span className="text-[8px] text-white/30 uppercase font-bold tracking-widest mb-1">
                  R/R Ratio
                </span>
                <span className="text-sm text-white/80 font-mono">
                  {play.risk_reward}
                </span>
              </div>
              <div className="flex flex-col bg-rose-500/5 px-3 py-2.5 rounded-lg border border-rose-500/10">
                <span className="text-[8px] text-rose-400/50 uppercase font-bold tracking-widest mb-1">
                  Stop Loss
                </span>
                <span className="text-sm text-rose-400/80 font-mono">
                  {play.stop_loss}
                </span>
              </div>
              <div className="flex flex-col bg-emerald-500/5 px-3 py-2.5 rounded-lg border border-emerald-500/10">
                <span className="text-[8px] text-emerald-400/50 uppercase font-bold tracking-widest mb-1">
                  Target
                </span>
                <span className="text-sm text-emerald-400/80 font-mono">
                  {play.take_profit}
                </span>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5">
              <p className="text-[11px] text-white/40 font-medium leading-relaxed">
                {play.reasoning}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
