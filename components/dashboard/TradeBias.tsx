"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/Card";
import { 
  Loader2, Zap, ArrowRight, ArrowDownRight, 
  ArrowUpRight, GitBranch, Target, Crosshair, 
  Activity, BarChart2, ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";

type TradePlan = {
  asset: string;
  primary: {
    direction: "long" | "short";
    entry: string;
    stop_loss: string;
    take_profit: string;
    confidence: "low" | "medium" | "high";
  };
  alternative: {
    condition: string;
    direction: "long" | "short";
    entry: string;
    stop_loss: string;
    take_profit: string;
  };
  levels: {
    resistance: string[];
    support: string[];
  };
  context: {
    trend: "bullish" | "bearish" | "ranging";
    volatility: "low" | "medium" | "high";
    session_bias: string;
  };
  execution: {
    confirmation: string;
    invalidation: string;
  };
};

export default function TradeBias({ activeMarket = "Global Equities" }: { activeMarket?: string }) {
  const [plan, setPlan] = useState<TradePlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const targetAsset = activeMarket === "Global Equities" ? "SPX" : 
                      activeMarket === "Crypto Liquidity" ? "BTC" : 
                      activeMarket === "FX Majors" ? "EURUSD" : "SPX";

  useEffect(() => {
    let active = true;
    const fetchPlan = async () => {
      setIsLoading(true);
      try {
        const cacheKey = `axiom_trade_plan_${targetAsset}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 4 * 60 * 1000) { // 4 min cache
            setPlan(data);
            setIsLoading(false);
            return;
          }
        }

        const res = await fetch("/api/ai-worker", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "trade-plan",
            payload: { targetAsset, data: `Analyze ${targetAsset} for a multi-scenario trade setup.` }
          })
        });

        const data = await res.json();
        
        if (active && data && data.primary) {
          setPlan(data);
          localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
        }
      } catch (error) {
        console.error("Failed to load trade plan", error);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchPlan();
    return () => { active = false; };
  }, [targetAsset]);

  const getDirColor = (dir: string) => dir?.toLowerCase() === "long" ? "text-bullish" : "text-bearish";
  const getDirBg = (dir: string) => dir?.toLowerCase() === "long" ? "bg-bullish/10 border-bullish/20" : "bg-bearish/10 border-bearish/20";
  const DirIcon = ({ dir, className }: { dir: string, className?: string }) => 
    dir?.toLowerCase() === "long" ? <ArrowUpRight className={className} /> : <ArrowDownRight className={className} />;

  return (
    <Card className="flex flex-col h-full overflow-hidden border-card-border relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-divider bg-surface-sunken/40">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
          <Target className="w-3.5 h-3.5" /> Trade Planning
        </h2>
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-text-tertiary" />}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-0">
        {isLoading && !plan ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-text-tertiary">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Structuring Scenarios...</span>
          </div>
        ) : !plan ? (
          <div className="flex items-center justify-center h-full text-xs text-text-muted">Analysis unavailable.</div>
        ) : (
          <div className="flex flex-col">
            
            {/* Header: Asset & Context */}
            <div className="p-4 border-b border-divider">
              <div className="flex justify-between items-start mb-4">
                <span className="font-extrabold text-2xl tracking-tight leading-none text-white">{plan.asset}</span>
                <span className="text-[9px] uppercase font-bold text-text-tertiary tracking-[0.2em] bg-surface-elevated px-2 py-1 rounded">
                  {plan.context.session_bias} Session
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-surface-sunken/50 p-2 rounded border border-divider">
                  <Activity className="w-3.5 h-3.5 text-text-muted" />
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-widest text-text-muted font-bold">Trend</span>
                    <span className={cn("text-xs font-bold uppercase", plan.context.trend.toLowerCase() === 'bullish' ? 'text-bullish' : plan.context.trend.toLowerCase() === 'bearish' ? 'text-bearish' : 'text-text-primary')}>{plan.context.trend}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-surface-sunken/50 p-2 rounded border border-divider">
                  <BarChart2 className="w-3.5 h-3.5 text-text-muted" />
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-widest text-text-muted font-bold">Volatility</span>
                    <span className="text-xs text-white font-bold uppercase">{plan.context.volatility}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Part 1: Primary Setup */}
            <div className="p-4 border-b border-divider relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Target className="w-24 h-24" />
              </div>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-[0.2em]">1. Primary Setup</span>
                <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded border", getDirBg(plan.primary.direction))}>
                  <DirIcon dir={plan.primary.direction} className={cn("w-3.5 h-3.5", getDirColor(plan.primary.direction))} />
                  <span className={cn("text-[9px] uppercase font-extrabold tracking-widest", getDirColor(plan.primary.direction))}>{plan.primary.direction}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex flex-col">
                  <span className="text-[8px] text-text-tertiary uppercase tracking-widest font-bold mb-1">Entry Zone</span>
                  <span className="text-[13px] font-extrabold text-white">{plan.primary.entry}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-bearish/70 uppercase tracking-widest font-bold mb-1">Stop Loss</span>
                  <span className="text-[13px] font-extrabold text-bearish">{plan.primary.stop_loss}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-bullish/70 uppercase tracking-widest font-bold mb-1">Take Profit</span>
                  <span className="text-[13px] font-extrabold text-bullish">{plan.primary.take_profit}</span>
                </div>
              </div>

              <div className="flex flex-col bg-surface-elevated/30 border border-divider p-2.5 rounded">
                <span className="text-[8px] text-text-muted uppercase tracking-widest font-bold mb-1 flex items-center gap-1.5">
                  <Crosshair className="w-3 h-3" /> Execution Rule
                </span>
                <span className="text-[11px] text-white/90 leading-relaxed font-medium">{plan.execution.confirmation}</span>
              </div>
            </div>

            {/* Part 2: Alternative Scenario */}
            <div className="p-4 border-b border-divider bg-surface-sunken/20">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-[0.2em] flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" /> 2. Alt Scenario
                </span>
                <div className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded border border-divider", getDirBg(plan.alternative.direction))}>
                  <span className={cn("text-[8px] uppercase font-extrabold tracking-widest", getDirColor(plan.alternative.direction))}>{plan.alternative.direction}</span>
                </div>
              </div>

              <div className="mb-3 pl-3 border-l-[1.5px] border-text-tertiary">
                <span className="text-[8px] text-text-tertiary uppercase tracking-widest font-bold mb-0.5 block">Trigger Condition</span>
                <span className="text-xs text-white/80">{plan.alternative.condition}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex flex-col">
                  <span className="text-[7px] text-text-tertiary uppercase tracking-widest font-bold mb-0.5">Entry</span>
                  <span className="text-[11px] font-bold text-white">{plan.alternative.entry}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] text-text-tertiary uppercase tracking-widest font-bold mb-0.5">SL</span>
                  <span className="text-[11px] font-bold text-bearish">{plan.alternative.stop_loss}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] text-text-tertiary uppercase tracking-widest font-bold mb-0.5">TP</span>
                  <span className="text-[11px] font-bold text-bullish">{plan.alternative.take_profit}</span>
                </div>
              </div>
            </div>

            {/* Part 3: Support / Resistance */}
            <div className="p-4 flex flex-col gap-3">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-[0.2em]">3. Key Levels</span>
              
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <span className="text-[8px] text-bearish/70 uppercase tracking-widest font-bold">Resistance</span>
                  {plan.levels.resistance.map((lvl, idx) => (
                    <div key={idx} className="bg-bearish/5 border border-bearish/10 px-2 py-1 rounded text-xs text-white/90 font-mono">
                      {lvl}
                    </div>
                  ))}
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <span className="text-[8px] text-bullish/70 uppercase tracking-widest font-bold">Support</span>
                  {plan.levels.support.map((lvl, idx) => (
                    <div key={idx} className="bg-bullish/5 border border-bullish/10 px-2 py-1 rounded text-xs text-white/90 font-mono">
                      {lvl}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2 mt-2 bg-surface-elevated/30 border border-card-border p-2 rounded">
                <ShieldAlert className="w-3.5 h-3.5 text-bearish shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[8px] text-text-tertiary uppercase tracking-widest font-bold mb-1">Invalidation</span>
                  <span className="text-[10px] text-text-secondary leading-tight">{plan.execution.invalidation}</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </Card>
  );
}
