"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import { 
  Loader2, ArrowDownRight, 
  ArrowUpRight, Target, Activity, Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";

type TradePlan = {
  primary: {
    setup?: string;
    direction?: string;
    entry: string;
    stop_loss: string;
    take_profit: string;
    confidence: "low" | "medium" | "high";
    reasoning: string;
  };
  alternate: {
    setup?: string;
    direction?: string;
    entry: string;
    stop_loss: string;
    take_profit: string;
    confidence: "low" | "medium" | "high";
    reasoning: string;
  };
  breakdown: {
    setup?: string;
    direction?: string;
    entry: string;
    stop_loss: string;
    take_profit: string;
    confidence: "low" | "medium" | "high";
    reasoning: string;
  };
  key_levels: {
    resistance: string[];
    support: string[];
    liquidity: string[];
  };
};

type SetupType = "primary" | "alternate" | "breakdown";

export default function TradeBias({ activeMarket = "Global Equities" }: { activeMarket?: string }) {
  const [plan, setPlan] = useState<TradePlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [strategy, setStrategy] = useState("Breakout");
  const [timeframe, setTimeframe] = useState("intraday");
  const [activeTab, setActiveTab] = useState<SetupType>("primary");

  const targetAsset = activeMarket === "Global Equities" ? "SPX" : 
                      activeMarket === "Crypto Liquidity" ? "BTC" : 
                      activeMarket === "FX Majors" ? "EURUSD" : "SPX";

  useEffect(() => {
    let active = true;
    const fetchPlan = async () => {
      setIsLoading(true);
      try {
        const cacheKey = `axiom_trade_plan_${targetAsset}_${strategy}_${timeframe}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 3 * 60 * 1000) { // 3 min cache
            setPlan(data);
            setIsLoading(false);
            return;
          }
        }

        const res = await fetch("/api/ai-worker", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "trade-setup",
            payload: { 
              targetAsset, 
              strategy,
              timeframe,
              data: `Analyze ${targetAsset} for a multi-scenario trade setup using ${strategy} strategy on a ${timeframe} timeframe.` 
            }
          })
        });

        if (!res.ok) throw new Error("Failed to fetch plan");
        
        const data = await res.json();
        
        if (active && data && data.primary) {
          setPlan(data);
          localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
        } else {
          // If the AI somehow returns a structure that misses the primary field or fails
          if (active) setPlan(null);
        }
      } catch (error) {
        console.error("Failed to load trade plan", error);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchPlan();
    return () => { active = false; };
  }, [targetAsset, strategy, timeframe]);

  const getDirColor = (dir?: string) => {
    const d = dir?.toLowerCase() || "";
    return d.includes("buy") || d.includes("long") ? "text-bullish" : "text-bearish";
  };
  const getDirBg = (dir?: string) => {
    const d = dir?.toLowerCase() || "";
    return d.includes("buy") || d.includes("long") ? "bg-bullish/10 border-bullish/20" : "bg-bearish/10 border-bearish/20";
  };
  const DirIcon = ({ dir, className }: { dir?: string, className?: string }) => {
    const d = dir?.toLowerCase() || "";
    return d.includes("buy") || d.includes("long") ? <ArrowUpRight className={className} /> : <ArrowDownRight className={className} />;
  };

  const getConfidenceBadge = (conf?: string) => {
    const c = conf?.toLowerCase() || "";
    if (c === "high") return <span className="bg-bullish/20 text-bullish border border-bullish/30 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-bold flex items-center justify-center">High Conf</span>;
    if (c === "medium") return <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-bold flex items-center justify-center">Med Conf</span>;
    return <span className="bg-bearish/20 text-bearish border border-bearish/30 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-widest font-bold flex items-center justify-center">Low Conf</span>;
  };

  const currentSetup = plan ? plan[activeTab] : null;

  return (
    <Card className="flex flex-col h-full overflow-hidden border-card-border relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-divider bg-surface-sunken/40">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
          <Target className="w-3.5 h-3.5" /> Trade Planning
        </h2>
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-text-tertiary" />}
      </div>

      {/* Control Bar: Strategy & Timeframe */}
      <div className="bg-[#0B0F14] border-b border-divider p-3 flex flex-col gap-2.5">
        <div className="relative flex bg-[#111] rounded-full p-1 border border-[#222] w-full">
          <div 
            className="absolute top-1 bottom-1 bg-[#1a1a1a] rounded-full shadow-[0_0_8px_rgba(255,255,255,0.05)] border border-[#333] transition-all duration-300 ease-out z-0" 
            style={{ 
              width: `calc(100% / 4 - 2px)`, 
              left: `calc(${["Breakout", "Reversal", "Trend", "Range"].indexOf(strategy === "Trend Continuation" ? "Trend" : strategy)} * (100% / 4) + 1px)`,
            }} 
          />
          {["Breakout", "Reversal", "Trend", "Range"].map(s => {
            const actualStrategy = s === "Trend" ? "Trend Continuation" : s;
            const isActive = strategy === actualStrategy;
            return (
              <button
                key={s}
                onClick={() => setStrategy(actualStrategy)}
                className={cn(
                  "relative flex-1 py-1.5 text-[9px] uppercase font-bold tracking-widest z-10 transition-colors duration-200 flex items-center justify-center gap-1.5",
                  isActive ? "text-white" : "text-[#777] hover:text-[#aaa]"
                )}
              >
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-bullish shadow-[0_0_5px_rgba(74,222,128,0.5)]" />}
                {s}
              </button>
            );
          })}
        </div>
        
        <div className="relative flex bg-[#111] rounded-full p-1 border border-[#222] w-full">
          <div 
            className="absolute top-1 bottom-1 bg-[#1a1a1a] rounded-full shadow-[0_0_8px_rgba(255,255,255,0.05)] border border-[#333] transition-all duration-300 ease-out z-0" 
            style={{ 
              width: `calc(100% / 3 - 2.66px)`, 
              left: `calc(${["scalp", "intraday", "swing"].indexOf(timeframe === "scalping" ? "scalp" : timeframe)} * (100% / 3) + 1px)`,
            }} 
          />
          {["scalp", "intraday", "swing"].map(tf => {
            const actualTf = tf === "scalp" ? "scalping" : tf;
            const isActive = timeframe === actualTf || timeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "relative flex-1 py-1 text-[8px] uppercase font-bold tracking-widest z-10 transition-colors duration-200 flex items-center justify-center gap-1.5",
                  isActive ? "text-white" : "text-[#777] hover:text-[#aaa]"
                )}
              >
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-bullish shadow-[0_0_5px_rgba(74,222,128,0.5)]" />}
                {tf}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-0">
        {isLoading && (!plan || !currentSetup) ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-text-tertiary p-6">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Structuring Scenarios...</span>
          </div>
        ) : !plan || !plan.primary || !currentSetup ? (
          <div className="flex items-center justify-center h-full text-xs text-text-muted p-6">No trade setup available</div>
        ) : (
          <div className="flex flex-col p-4 pb-6 gap-5">
            
            <div className="flex justify-between items-center">
               <span className="font-extrabold text-2xl tracking-tight leading-none text-white">{targetAsset}</span>
            </div>

            {/* Tabs for scenarios */}
            <div className="flex gap-2">
              {(["primary", "alternate", "breakdown"] as SetupType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-1.5 text-[9px] uppercase font-bold tracking-widest rounded border transition-all text-center",
                    activeTab === tab 
                      ? "bg-surface-elevated text-white border-text-tertiary/50" 
                      : "bg-surface-sunken/30 text-text-muted border-transparent hover:border-divider"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Active Setup Content */}
            <div className="flex flex-col bg-surface-sunken/20 border border-divider rounded-lg p-4 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded border", getDirBg(currentSetup.setup || currentSetup.direction))}>
                    <DirIcon dir={currentSetup.setup || currentSetup.direction} className={cn("w-3.5 h-3.5", getDirColor(currentSetup.setup || currentSetup.direction))} />
                    <span className={cn("text-[9px] uppercase font-extrabold tracking-widest", getDirColor(currentSetup.setup || currentSetup.direction))}>
                      {currentSetup.setup || currentSetup.direction || "SETUP"}
                    </span>
                  </div>
                </div>
                {getConfidenceBadge(currentSetup.confidence)}
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 border-b border-divider pb-4">
                <div className="flex flex-col">
                  <span className="text-[8px] text-text-tertiary uppercase tracking-widest font-bold mb-1">Entry Zone</span>
                  <span className="text-sm font-extrabold text-white">{currentSetup.entry}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-bearish/70 uppercase tracking-widest font-bold mb-1">Stop Loss</span>
                  <span className="text-sm font-extrabold text-bearish">{currentSetup.stop_loss}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-bullish/70 uppercase tracking-widest font-bold mb-1">Take Profit</span>
                  <span className="text-sm font-extrabold text-bullish">{currentSetup.take_profit}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[8px] text-text-muted uppercase tracking-widest font-bold mb-1.5">Reasoning</span>
                <p className="text-[11px] text-white/80 leading-relaxed font-medium">
                  {currentSetup.reasoning}
                </p>
              </div>
            </div>

            {/* Key Levels */}
            {(plan.key_levels?.resistance?.length > 0 || plan.key_levels?.support?.length > 0) && (
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-[0.2em] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Key Levels
                </span>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[8px] text-bearish/70 uppercase tracking-widest font-bold border-b border-divider pb-1">Resistance</span>
                    {plan.key_levels?.resistance?.slice(0, 3).map((lvl, idx) => (
                      <span key={idx} className="text-[10px] text-white/90 font-mono bg-surface-sunken/40 px-1.5 py-1 rounded border border-divider/50 truncate" title={lvl}>{lvl}</span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[8px] text-bullish/70 uppercase tracking-widest font-bold border-b border-divider pb-1">Support</span>
                    {plan.key_levels?.support?.slice(0, 3).map((lvl, idx) => (
                      <span key={idx} className="text-[10px] text-white/90 font-mono bg-surface-sunken/40 px-1.5 py-1 rounded border border-divider/50 truncate" title={lvl}>{lvl}</span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[8px] text-text-tertiary uppercase tracking-widest font-bold border-b border-divider pb-1">Liquidity</span>
                    {plan.key_levels?.liquidity?.slice(0, 3).map((lvl, idx) => (
                      <span key={idx} className="text-[10px] text-white/90 font-mono bg-surface-sunken/40 px-1.5 py-1 rounded border border-divider/50 truncate" title={lvl}>{lvl}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </Card>
  );
}
