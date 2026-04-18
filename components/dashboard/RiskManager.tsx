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
    <div className="axiom-panel axiom-corner-tl border-accent/20 flex flex-col h-full shrink-0 overflow-hidden bg-card/40 relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-accent/10 bg-accent/5">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
          <Calculator className="w-4 h-4 text-accent animate-pulse-accent" />
          Risk_Protocol_v2
        </h2>
        
        {/* Asset Selection */}
        <select 
          value={assetType}
          onChange={(e) => setAssetType(e.target.value as AssetType)}
          className="bg-accent/10 text-[9px] uppercase font-black tracking-widest text-accent outline-none border border-accent/20 rounded-none px-2 py-1 cursor-crosshair hover:bg-accent/20 transition-all italic"
        >
          <option value="STOCK">ASSET_STOCK</option>
          <option value="FOREX">ASSET_FOREX</option>
          <option value="CRYPTO">ASSET_CRYPTO</option>
          <option value="INDEX">ASSET_INDEX</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pointer-events-auto p-5 flex flex-col gap-6 ">
        
        {/* Account Inputs */}
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="text-[9px] uppercase font-black text-accent/50 mb-2 tracking-widest italic">CAPITAL_BASE ($)</label>
            <input 
              type="number" 
              value={balance} 
              onChange={(e) => setBalance(Number(e.target.value))} 
              className="bg-transparent border-b border-accent/20 px-1 py-1.5 text-base font-black text-white outline-none focus:border-accent transition-all w-full font-mono" 
            />
          </div>
          <div className="flex flex-col justify-end pb-1.5">
            <label className="text-[9px] uppercase font-black text-accent/50 mb-2 tracking-widest flex justify-between italic">
              RISK_TOL <span className="text-accent underline decoration-accent/30">{riskPercent.toFixed(1)}%</span>
            </label>
            <input 
              type="range" 
              min="0.1" max="5" step="0.1" 
              value={riskPercent} 
              onChange={(e) => setRiskPercent(Number(e.target.value))} 
              className="w-full accent-accent" 
            />
          </div>
        </div>

        {/* Trade Inputs */}
        <div className="grid grid-cols-3 gap-4 border border-accent/10 p-4 rounded-none bg-accent/[0.03] relative">
          <div className="absolute top-0 right-0 px-1.5 py-0.5 bg-accent/10 border-b border-l border-accent/20 text-[7px] font-black text-accent/40 tracking-widest">
            IN_VAL
          </div>
          <div className="flex flex-col">
            <label className="text-[8px] uppercase font-black text-accent/40 mb-1.5 tracking-widest">ENTRY</label>
            <input 
              type="number" 
              value={entry} 
              onChange={(e) => setEntry(Number(e.target.value))} 
              className="bg-transparent border-b border-accent/20 px-1 py-1 text-xs font-black text-white outline-none focus:border-white/50 transition-all w-full font-mono" 
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[8px] uppercase font-black text-bearish/50 mb-1.5 tracking-widest">STOP</label>
            <input 
              type="number" 
              value={stopLoss} 
              onChange={(e) => setStopLoss(Number(e.target.value))} 
              className="bg-transparent border-b border-bearish/30 px-1 py-1 text-xs font-black text-bearish outline-none focus:border-bearish transition-all w-full font-mono" 
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[8px] uppercase font-black text-bullish/50 mb-1.5 tracking-widest">TP_TARGET</label>
            <input 
              type="number" 
              value={takeProfit} 
              onChange={(e) => setTakeProfit(Number(e.target.value))} 
              className="bg-transparent border-b border-bullish/30 px-1 py-1 text-xs font-black text-bullish outline-none focus:border-bullish transition-all w-full font-mono" 
            />
          </div>
        </div>

        {/* Instant Outputs */}
        <div className="mt-2 bg-accent/[0.05] border border-accent/20 rounded-none p-5 grid grid-cols-3 gap-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          
          <div className="flex flex-col">
            <span className="text-[8px] uppercase font-black text-accent/40 tracking-widest mb-2 italic">POS_SIZE</span>
            <span className="text-lg font-black text-white tracking-tight font-mono">{positionSizeStr}</span>
            <span className="text-[8px] uppercase text-accent/30 mt-1.5 tracking-widest font-black leading-none">{unitLabel}</span>
          </div>

          <div className="flex flex-col border-l border-accent/10">
            <span className="text-[8px] uppercase font-black text-accent/40 tracking-widest mb-2 italic">VAL_AT_RISK</span>
            <span className="text-lg font-black text-bearish tracking-tight font-mono">${Math.round(riskAmount).toLocaleString()}</span>
            <span className="text-[8px] uppercase text-bearish/30 mt-1.5 tracking-widest font-black leading-none">{riskPercent.toFixed(1)}% TOT</span>
          </div>

          <div className="flex flex-col border-l border-accent/10">
            <span className="text-[8px] uppercase font-black text-accent/40 tracking-widest mb-2 italic">R:R_RATIO</span>
            <span className={cn("text-lg font-black tracking-tight font-mono", rrColor)}>1 : {rrRatio.toFixed(1)}</span>
            <span className="text-[8px] uppercase text-accent/30 mt-1.5 tracking-widest font-black leading-none">TARGET</span>
          </div>
        </div>
      </div>
    </div>
  );
}
