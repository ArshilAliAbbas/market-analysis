"use client";

import { useState } from "react";
import { Calculator, Shield, Target, AlertTriangle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AssetType = "STOCK" | "FOREX" | "CRYPTO" | "INDEX";

export default function RiskManager() {
  const [assetType, setAssetType] = useState<AssetType>("FOREX");
  const [balance, setBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1.0);
  
  const [entry, setEntry] = useState<number>(1.0825);
  const [stopLoss, setStopLoss] = useState<number>(1.0790);
  const [takeProfit, setTakeProfit] = useState<number>(1.0900);

  // Instant calculation bounds
  const riskAmount = balance * (riskPercent / 100);
  const slDistance = Math.abs(entry - stopLoss);
  const tpDistance = Math.abs(takeProfit - entry);
  
  let rawSize = 0;
  if (slDistance > 0 && entry > 0) {
    rawSize = riskAmount / slDistance;
  }

  let positionSizeStr = "0.00";
  let unitLabel = "Shares";

  switch (assetType) {
    case "FOREX":
      positionSizeStr = (rawSize / 100000).toFixed(2);
      unitLabel = "Lots";
      break;
    case "CRYPTO":
      positionSizeStr = rawSize.toFixed(4);
      unitLabel = "Coins";
      break;
    case "INDEX":
      positionSizeStr = Math.round(rawSize).toString();
      unitLabel = "Contracts";
      break;
    case "STOCK":
    default:
      positionSizeStr = Math.round(rawSize).toString();
      unitLabel = "Shares";
      break;
  }

  const rrRatio = slDistance > 0 ? (tpDistance / slDistance) : 0;
  const rrColor = rrRatio >= 2 ? "text-bullish" : rrRatio >= 1 ? "text-white/60" : "text-bearish";

  return (
    <div className="axiom-panel border-white/5 flex flex-col h-full shrink-0 overflow-hidden bg-white/[0.02]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
          <Shield className="w-3.5 h-3.5" />
          Risk Protocol V2
        </h2>
        
        <select 
          value={assetType}
          onChange={(e) => setAssetType(e.target.value as AssetType)}
          className="bg-white/5 text-[9px] uppercase font-bold tracking-widest text-white/40 outline-none border border-white/10 rounded-lg px-2 py-1 cursor-pointer hover:bg-white/10 transition-all"
        >
          <option value="STOCK">Equities</option>
          <option value="FOREX">Forex</option>
          <option value="CRYPTO">Crypto</option>
          <option value="INDEX">Indices</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-6">
        
        {/* Confidence & Reasoning - Institutional Addition */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
           <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold text-white/20 tracking-widest">Protocol Status</span>
              <div className="flex items-center gap-2">
                 <span className="text-[9px] font-bold text-bullish uppercase tracking-widest bg-bullish/10 px-2 py-0.5 rounded-full border border-bullish/20">High Confidence</span>
              </div>
           </div>
           <p className="text-[11px] text-white/40 leading-relaxed font-medium">
             Current volatility regime favors <span className="text-white/60">Mean Reversion</span> strategies. Risk parameters adjusted for lower-tail sensitivity.
           </p>
        </div>

        {/* Account Inputs */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase font-bold text-white/20 tracking-widest">Capital Base ($)</label>
            <input 
              type="number" 
              value={balance} 
              onChange={(e) => setBalance(Number(e.target.value))} 
              className="bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-sm font-bold text-white outline-none focus:border-white/20 transition-all w-full font-mono" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase font-bold text-white/20 tracking-widest flex justify-between">
              Risk Tolerance <span className="text-white/60">{riskPercent.toFixed(1)}%</span>
            </label>
            <div className="flex items-center h-full pt-1">
              <input 
                type="range" 
                min="0.1" max="5" step="0.1" 
                value={riskPercent} 
                onChange={(e) => setRiskPercent(Number(e.target.value))} 
                className="w-full accent-white" 
              />
            </div>
          </div>
        </div>

        {/* Trade Inputs */}
        <div className="grid grid-cols-3 gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase font-bold text-white/20 tracking-widest">Entry</label>
            <input 
              type="number" 
              value={entry} 
              onChange={(e) => setEntry(Number(e.target.value))} 
              className="bg-transparent border-b border-white/10 px-1 py-1 text-xs font-bold text-white outline-none focus:border-white/40 transition-all w-full font-mono" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase font-bold text-bearish/40 tracking-widest">Stop</label>
            <input 
              type="number" 
              value={stopLoss} 
              onChange={(e) => setStopLoss(Number(e.target.value))} 
              className="bg-transparent border-b border-bearish/20 px-1 py-1 text-xs font-bold text-bearish outline-none focus:border-bearish/40 transition-all w-full font-mono" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase font-bold text-bullish/40 tracking-widest">Target</label>
            <input 
              type="number" 
              value={takeProfit} 
              onChange={(e) => setTakeProfit(Number(e.target.value))} 
              className="bg-transparent border-b border-bullish/20 px-1 py-1 text-xs font-bold text-bullish outline-none focus:border-bullish/40 transition-all w-full font-mono" 
            />
          </div>
        </div>

        {/* Instant Outputs */}
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 flex flex-col gap-6 relative overflow-hidden">
          <div className="flex justify-between items-center">
             <div className="flex flex-col">
               <span className="text-[9px] uppercase font-bold text-white/20 tracking-widest mb-1">Position Size</span>
               <span className="text-2xl font-bold text-white tracking-tight font-mono">{positionSizeStr} <span className="text-sm text-white/20 ml-1 font-medium">{unitLabel}</span></span>
             </div>
             <div className="h-12 w-[1px] bg-white/5" />
             <div className="flex flex-col text-right">
               <span className="text-[9px] uppercase font-bold text-white/20 tracking-widest mb-1">Risk Reward</span>
               <span className={cn("text-2xl font-bold tracking-tight font-mono", rrColor)}>1 : {rrRatio.toFixed(1)}</span>
             </div>
          </div>
          
          <div className="pt-6 border-t border-white/5 flex justify-between items-center">
             <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-white/20 tracking-widest mb-1">Value at Risk</span>
                <span className="text-lg font-bold text-white/60 font-mono">${Math.round(riskAmount).toLocaleString()}</span>
             </div>
             <button className="bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-all active:scale-95 flex items-center gap-2">
                Execute Order <ChevronRight className="w-3 h-3" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
