"use client";

import { useState } from "react";
import { Card } from "../ui/Card";
import { Calculator } from "lucide-react";
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
      // Forex Standard Lot = 100,000 units of base currency
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
  const rrColor = rrRatio >= 2 ? "text-bullish" : rrRatio >= 1 ? "text-text-primary" : "text-bearish";

  return (
    <Card className="flex flex-col h-full shrink-0 border-card-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-divider bg-surface-sunken/30">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
          <Calculator className="w-3.5 h-3.5" /> Risk Calculator
        </h2>
        
        {/* Asset Selection */}
        <select 
          value={assetType}
          onChange={(e) => setAssetType(e.target.value as AssetType)}
          className="bg-surface-elevated text-[9px] uppercase font-bold tracking-[0.1em] text-text-primary outline-none border border-card-border rounded px-2 py-1 cursor-pointer hover:border-white/20 transition-all"
        >
          <option value="STOCK">Stock</option>
          <option value="FOREX">Forex</option>
          <option value="CRYPTO">Crypto</option>
          <option value="INDEX">Index</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pointer-events-auto p-4 flex flex-col gap-5 justify-center">
        
        {/* Account Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-[9px] uppercase font-bold text-text-muted mb-2 tracking-wide">Account Size ($)</label>
            <input 
              type="number" 
              value={balance} 
              onChange={(e) => setBalance(Number(e.target.value))} 
              className="bg-transparent border-b border-divider px-1 py-1.5 text-sm font-extrabold text-text-primary outline-none focus:border-white/50 transition-all w-full" 
            />
          </div>
          <div className="flex flex-col justify-end pb-1.5">
            <label className="text-[9px] uppercase font-bold text-text-muted mb-2 tracking-wide flex justify-between">
              Risk <span className="text-text-primary">{riskPercent.toFixed(1)}%</span>
            </label>
            <input 
              type="range" 
              min="0.1" max="5" step="0.1" 
              value={riskPercent} 
              onChange={(e) => setRiskPercent(Number(e.target.value))} 
              className="w-full" 
            />
          </div>
        </div>

        {/* Trade Inputs */}
        <div className="grid grid-cols-3 gap-3 border border-divider p-3 rounded-lg bg-surface-sunken/40">
          <div className="flex flex-col">
            <label className="text-[8px] uppercase font-bold text-text-muted mb-1.5 tracking-widest">Entry</label>
            <input 
              type="number" 
              value={entry} 
              onChange={(e) => setEntry(Number(e.target.value))} 
              className="bg-transparent border-b border-divider px-1 py-1 text-xs font-bold text-text-primary outline-none focus:border-white/30 transition-all w-full" 
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[8px] uppercase font-bold text-bearish/70 mb-1.5 tracking-widest">Stop Loss</label>
            <input 
              type="number" 
              value={stopLoss} 
              onChange={(e) => setStopLoss(Number(e.target.value))} 
              className="bg-transparent border-b border-divider px-1 py-1 text-xs font-bold text-text-primary outline-none focus:border-bearish/50 transition-all w-full" 
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[8px] uppercase font-bold text-bullish/70 mb-1.5 tracking-widest">Target (TP)</label>
            <input 
              type="number" 
              value={takeProfit} 
              onChange={(e) => setTakeProfit(Number(e.target.value))} 
              className="bg-transparent border-b border-divider px-1 py-1 text-xs font-bold text-text-primary outline-none focus:border-bullish/50 transition-all w-full" 
            />
          </div>
        </div>

        {/* Instant Outputs */}
        <div className="mt-2 bg-black border border-white/5 rounded-lg p-4 grid grid-cols-3 gap-2 text-center shadow-[inset_0_1px_10px_rgba(255,255,255,0.01)] relative">
          
          <div className="flex flex-col">
            <span className="text-[8px] uppercase font-bold text-text-muted tracking-widest mb-1.5">Position Size</span>
            <span className="text-base font-extrabold text-white tracking-tight">{positionSizeStr}</span>
            <span className="text-[8px] uppercase text-text-tertiary mt-1 tracking-widest">{unitLabel}</span>
          </div>

          <div className="flex flex-col border-l border-divider">
            <span className="text-[8px] uppercase font-bold text-text-muted tracking-widest mb-1.5">Dollar Risk</span>
            <span className="text-base font-extrabold text-bearish tracking-tight">${Math.round(riskAmount).toLocaleString()}</span>
            <span className="text-[8px] uppercase text-text-tertiary mt-1 tracking-widest">{riskPercent.toFixed(1)}% Max Drop</span>
          </div>

          <div className="flex flex-col border-l border-divider">
            <span className="text-[8px] uppercase font-bold text-text-muted tracking-widest mb-1.5">Risk:Reward</span>
            <span className={cn("text-base font-extrabold tracking-tight", rrColor)}>1 : {rrRatio.toFixed(1)}</span>
            <span className="text-[8px] uppercase text-text-tertiary mt-1 tracking-widest">Ratio</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
