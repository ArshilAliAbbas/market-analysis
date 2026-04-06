"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { ShieldCheck, ShieldAlert, Calculator, Crosshair, Activity } from "lucide-react";
import { cn, calculateRisk } from "@/lib/utils";

export default function RiskManager({ activeMarket = "Global Equities" }: { activeMarket?: string }) {
  const [balance, setBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  const [maxDailyRisk, setMaxDailyRisk] = useState<number>(5);
  const [utilizedRisk] = useState<number>(2.5);

  const [asset, setAsset] = useState<string>("EURUSD");
  const [entryPrice, setEntryPrice] = useState<number>(1.0825);
  const [stopLoss, setStopLoss] = useState<number>(1.0790);
  const [takeProfit, setTakeProfit] = useState<number>(1.0900);

  useEffect(() => {
    if (activeMarket === "Crypto Liquidity") {
      setAsset("BTCUSD");
      setEntryPrice(65000);
      setStopLoss(62000);
      setTakeProfit(71000);
    } else if (activeMarket === "FX Majors") {
      setAsset("EURUSD");
      setEntryPrice(1.0825);
      setStopLoss(1.0790);
      setTakeProfit(1.0900);
    } else {
      setAsset("SPX");
      setEntryPrice(5100);
      setStopLoss(5050);
      setTakeProfit(5200);
    }
  }, [activeMarket]);

  const { riskAmount, positionSize, riskRewardRatio: rrRatio } = calculateRisk({
    accountBalance: balance,
    riskPercent,
    entryPrice,
    stopLossPrice: stopLoss,
    takeProfitPrice: takeProfit
  });

  const totalProjectedRisk = utilizedRisk + riskPercent;
  const isDailyRiskExceeded = totalProjectedRisk > maxDailyRisk;
  const riskRemaining = Math.max(0, maxDailyRisk - utilizedRisk);

  let qualityScore = 50;
  let suggestedAction = "Avoid trade";
  let actionColor = "text-bearish";
  
  if (rrRatio >= 2 && riskPercent <= riskRemaining && !isDailyRiskExceeded) {
    qualityScore = 85;
    suggestedAction = "Good setup";
    actionColor = "text-bullish";
  } else if (rrRatio >= 1 && !isDailyRiskExceeded) {
    qualityScore = 65;
    suggestedAction = "Marginal";
    actionColor = "text-caution";
  } else if (isDailyRiskExceeded) {
    qualityScore = 20;
    suggestedAction = "Overexposed";
    actionColor = "text-bearish";
  }

  const formattedPositionSize = asset.includes("USD") && entryPrice < 2 
    ? (positionSize / 100000).toFixed(2) + " Lots"
    : (positionSize).toFixed(4) + " Units";

  return (
    <Card className="flex flex-col h-full shrink-0 overflow-hidden border-card-border">
      <div className="flex items-center justify-between px-3 py-2 border-b border-divider">
        <h2 className="text-[9px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
          <Calculator className="w-3 h-3" /> Risk Manager
        </h2>
      </div>

      <div className="flex flex-col overflow-y-auto no-scrollbar pointer-events-auto flex-1">
        
        {/* Daily Risk */}
        <div className={cn(
          "px-3 py-2 border-b border-divider transition-colors",
          isDailyRiskExceeded ? "bg-bearish/[0.04]" : ""
        )}>
           <div className="flex justify-between items-center mb-1">
             <span className="text-[8px] uppercase font-bold tracking-widest flex items-center gap-1 text-text-muted">
               <Activity className="w-2.5 h-2.5" /> Daily Limit
             </span>
             <span className="text-[8px] font-bold text-text-muted uppercase">
               Max: <input type="number" value={maxDailyRisk} onChange={(e) => setMaxDailyRisk(Number(e.target.value))} className="w-7 bg-transparent border border-divider rounded-[2px] px-0.5 outline-none text-right text-text-secondary font-extrabold" />%
             </span>
           </div>
           
           <div className="w-full bg-divider h-1 rounded-sm overflow-hidden my-1 flex">
             <div className="h-full bg-text-tertiary/50" style={{ width: `${(utilizedRisk/maxDailyRisk)*100}%` }} />
             <div className={cn("h-full", isDailyRiskExceeded ? "bg-bearish" : "bg-ai-primary/60")} style={{ width: `${(riskPercent/maxDailyRisk)*100}%` }} />
           </div>

           <div className="flex justify-between items-center mt-1">
             <span className={cn("text-[8px] font-bold tracking-wider uppercase", isDailyRiskExceeded ? "text-bearish" : "text-text-muted")}>
               {isDailyRiskExceeded ? "Limit Exceeded" : "Safe"}
             </span>
             <span className={cn("text-[8px] font-extrabold", isDailyRiskExceeded ? "text-bearish" : "text-text-secondary")}>
               {totalProjectedRisk.toFixed(1)}% / {maxDailyRisk}%
             </span>
           </div>
        </div>

        {/* Inputs */}
        <div className="p-3 border-b border-divider">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="flex flex-col">
              <label className="text-[8px] uppercase font-bold text-text-muted mb-0.5 tracking-widest">Balance</label>
              <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="bg-surface-sunken border border-divider rounded-[2px] px-1.5 py-0.5 text-[11px] font-extrabold text-text-primary outline-none focus:border-ai-primary/50 transition-colors" />
            </div>
            <div className="flex flex-col">
              <label className="text-[8px] uppercase font-bold text-text-muted flex justify-between mb-0.5 tracking-widest">
                Risk 
                <span className={cn("font-extrabold", isDailyRiskExceeded ? "text-bearish" : "text-text-secondary")}>{riskPercent}%</span>
              </label>
              <input type="range" min="0.1" max="10" step="0.1" value={riskPercent} onChange={(e) => setRiskPercent(Number(e.target.value))} className="w-full mt-1 accent-ai-primary" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <div className="flex flex-col">
              <label className="text-[8px] uppercase font-bold text-text-muted mb-0.5 tracking-widest">Entry</label>
              <input type="number" value={entryPrice} onChange={(e) => setEntryPrice(Number(e.target.value))} className="bg-surface-sunken border border-divider rounded-[2px] px-1.5 py-0.5 text-[11px] font-extrabold text-text-primary outline-none focus:border-ai-primary/50 transition-colors" />
            </div>
            <div className="flex flex-col">
              <label className="text-[8px] uppercase font-bold text-bearish mb-0.5 tracking-widest">SL</label>
              <input type="number" value={stopLoss} onChange={(e) => setStopLoss(Number(e.target.value))} className="bg-surface-sunken border border-divider rounded-[2px] px-1.5 py-0.5 text-[11px] font-extrabold text-text-primary outline-none focus:border-bearish/50 transition-colors" />
            </div>
            <div className="flex flex-col">
              <label className="text-[8px] uppercase font-bold text-bullish mb-0.5 tracking-widest">TP</label>
              <input type="number" value={takeProfit} onChange={(e) => setTakeProfit(Number(e.target.value))} className="bg-surface-sunken border border-divider rounded-[2px] px-1.5 py-0.5 text-[11px] font-extrabold text-text-primary outline-none focus:border-bullish/50 transition-colors" />
            </div>
          </div>
        </div>

        {/* Outputs */}
        <div className="p-3 border-b border-divider data-value">
          <div className="grid grid-cols-2 gap-y-2 gap-x-3">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase font-bold text-text-muted tracking-widest">Risk $</span>
              <span className="text-[13px] font-extrabold text-bearish">${riskAmount.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase font-bold text-text-muted tracking-widest">Size</span>
              <span className="text-[13px] font-extrabold text-text-primary">{formattedPositionSize}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase font-bold text-text-muted tracking-widest">R:R</span>
              <span className="text-[13px] font-extrabold text-ai-primary">1:{rrRatio.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase font-bold text-text-muted tracking-widest mb-0.5">Quality</span>
              <div className="flex items-center gap-1.5">
                <div className="w-full bg-divider h-1 rounded-sm overflow-hidden">
                  <div className={`h-full ${actionColor.replace('text-', 'bg-')}`} style={{ width: `${qualityScore}%` }} />
                </div>
                <span className={`text-[11px] font-extrabold ${actionColor}`}>{qualityScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment */}
        <div className="p-3 flex flex-col gap-2">
          <div className={cn("flex items-start gap-2 border rounded p-2", isDailyRiskExceeded ? "border-bearish/30" : "border-card-border")}>
            {qualityScore > 70 ? <ShieldCheck className="w-3 h-3 text-bullish shrink-0 mt-0.5" /> : <ShieldAlert className="w-3 h-3 text-caution shrink-0 mt-0.5" />}
            <div className="flex flex-col">
              <span className="text-[8px] uppercase font-bold text-text-muted tracking-widest mb-0.5">Assessment</span>
              <span className={cn("text-[10px] font-extrabold uppercase leading-none", actionColor)}>{suggestedAction}</span>
              {isDailyRiskExceeded && (
                <span className="text-[8px] text-bearish font-bold mt-1">
                  Daily limit reached. Step away.
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-1.5 mt-0.5">
            <Crosshair className="w-2.5 h-2.5 text-text-muted shrink-0 mt-0.5" />
            <span className="text-[9px] text-text-muted leading-tight">Limit orders at pullbacks improve R:R.</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
