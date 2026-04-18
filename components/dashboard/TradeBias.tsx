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
    <div className="axiom-panel axiom-corner-tl border-accent/20 flex flex-col h-full overflow-hidden bg-card/40 relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-accent/10 bg-accent/5">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
          <Target className="w-4 h-4 text-accent animate-pulse-accent" />
          Tactical Matrix
        </h2>
        <div className="flex items-center gap-2">
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />}
          <div className="w-px h-3 bg-accent/20" />
          <span className="text-[8px] font-black text-accent/40 tracking-widest italic uppercase">SY_STRAT_01</span>
        </div>
      </div>

      {/* Control Bar: Strategy & Timeframe */}
      <div className="bg-background/20 border-b border-accent/10 p-3 flex flex-col gap-2.5">
        <div className="relative flex bg-accent/5 rounded-none p-1 border border-accent/10 w-full group/strat">
          <div 
            className="absolute top-1 bottom-1 bg-accent/20 rounded-none shadow-[0_0_15px_rgba(6,182,212,0.1)] border border-accent/30 transition-all duration-300 ease-out z-0" 
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
                  "relative flex-1 py-1.5 text-[9px] uppercase font-black tracking-widest z-10 transition-colors duration-200 flex items-center justify-center gap-1.5 italic",
                  isActive ? "text-accent" : "text-white/30 hover:text-white/60"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
        
        <div className="relative flex bg-accent/5 rounded-none p-1 border border-accent/10 w-full group/time">
          <div 
            className="absolute top-1 bottom-1 bg-accent/20 rounded-none shadow-[0_0_15px_rgba(6,182,212,0.1)] border border-accent/30 transition-all duration-300 ease-out z-0" 
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
                  "relative flex-1 py-1 text-[8px] uppercase font-black tracking-widest z-10 transition-colors duration-200 flex items-center justify-center gap-1.5 italic",
                  isActive ? "text-accent" : "text-white/30 hover:text-white/60"
                )}
              >
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
                    "flex-1 py-2 text-[9px] font-black uppercase tracking-[0.2em] rounded-none border transition-all text-center italic",
                    activeTab === tab 
                      ? "bg-accent/20 text-accent border-accent/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                      : "bg-accent/5 text-accent/40 border-accent/10 hover:border-accent/30 hover:text-accent/60"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Active Setup Content */}
            <div className="flex flex-col bg-accent/[0.03] border border-accent/20 rounded-none p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-2 py-0.5 bg-accent/10 border-b border-l border-accent/20 text-[8px] font-black text-accent/40 tracking-widest uppercase">
                STRAT_SCENARIO_LNK
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-none border italic", getDirBg(currentSetup.setup || currentSetup.direction))}>
                    <DirIcon dir={currentSetup.setup || currentSetup.direction} className={cn("w-4 h-4", getDirColor(currentSetup.setup || currentSetup.direction))} />
                    <span className={cn("text-[10px] uppercase font-black tracking-[0.2em]", getDirColor(currentSetup.setup || currentSetup.direction))}>
                      {currentSetup.setup || currentSetup.direction || "SETUP"}
                    </span>
                  </div>
                </div>
                {getConfidenceBadge(currentSetup.confidence)}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 border-b border-accent/10 pb-6">
                <div className="flex flex-col">
                  <span className="text-[8px] text-accent/50 uppercase tracking-[0.2em] font-black mb-1.5">ENTRY_ZONE</span>
                  <span className="text-[15px] font-black text-white font-mono tabular-nums">{currentSetup.entry}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-bearish/50 uppercase tracking-[0.2em] font-black mb-1.5">STOP_LOSS</span>
                  <span className="text-[15px] font-black text-bearish font-mono tabular-nums">{currentSetup.stop_loss}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-bullish/50 uppercase tracking-[0.2em] font-black mb-1.5">TAKE_PROFIT</span>
                  <span className="text-[15px] font-black text-bullish font-mono tabular-nums">{currentSetup.take_profit}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[8px] text-accent/50 uppercase tracking-[0.2em] font-black mb-2 italic">ANALYSIS_LOG</span>
                <p className="text-[12px] text-slate-300 font-mono leading-relaxed pl-3 border-l border-accent/30">
                  {currentSetup.reasoning}
                </p>
              </div>
            </div>

            {/* Key Levels */}
            {(plan.key_levels?.resistance?.length > 0 || plan.key_levels?.support?.length > 0) && (
              <div className="flex flex-col gap-3">
                <span className="text-[10px] uppercase font-black text-accent tracking-[0.2em] flex items-center gap-1.5 italic">
                  <Activity className="w-3.5 h-3.5 animate-pulse-accent" /> SEC_LEVELS_IND
                </span>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] text-bearish/50 uppercase tracking-[0.15em] font-black border-b border-accent/10 pb-1 italic">RESISTANCE</span>
                    {plan.key_levels?.resistance?.slice(0, 3).map((lvl, idx) => (
                      <span key={idx} className="text-[11px] text-white/90 font-mono bg-accent/5 px-2 py-1.5 border border-accent/10 truncate italic" title={lvl}>{lvl}</span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] text-bullish/50 uppercase tracking-[0.15em] font-black border-b border-accent/10 pb-1 italic">SUPPORT</span>
                    {plan.key_levels?.support?.slice(0, 3).map((lvl, idx) => (
                      <span key={idx} className="text-[11px] text-white/90 font-mono bg-accent/5 px-2 py-1.5 border border-accent/10 truncate italic" title={lvl}>{lvl}</span>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] text-slate-500 uppercase tracking-[0.15em] font-black border-b border-accent/10 pb-1 italic">LIQUIDITY</span>
                    {plan.key_levels?.liquidity?.slice(0, 3).map((lvl, idx) => (
                      <span key={idx} className="text-[11px] text-white/90 font-mono bg-accent/5 px-2 py-1.5 border border-accent/10 truncate italic" title={lvl}>{lvl}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
