"use client";

import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { 
  Crosshair, TrendingUp, TrendingDown, Info, 
  CheckCircle, Activity, ShieldAlert, Shield, ShieldCheck, 
  Zap, XCircle, CheckSquare 
} from "lucide-react";

interface TradeIdea {
  id: string;
  asset: string;
  direction: "Long" | "Short";
  setupType: "Breakout" | "Pullback" | "Reversal";
  entryZone: string;
  takeProfit: string;
  stopLoss: string;
  timeframe: string;
  confirmationRule: string;
  invalidationTrigger: string;
  riskRating: "Low" | "Medium" | "High";
  confidence: number;
  reasoning: string;
  structureStatus: "Trending Up" | "Trending Down" | "Ranging" | "Breakout Potential";
  keyResistance: string;
  keySupport: string;
  liquidityZone: string;
  prevHighLow: string;
  sessionHighLow: string;
}

const mockIdeas: TradeIdea[] = [
  {
    id: "1",
    asset: "EURUSD",
    direction: "Long",
    setupType: "Breakout",
    entryZone: "1.0820 - 1.0835",
    takeProfit: "1.0900",
    stopLoss: "1.0790",
    timeframe: "Intraday",
    confirmationRule: "Wait for 15m candle close clear above 1.0835.",
    invalidationTrigger: "4H candle close below 1.0780 invalidates structure.",
    riskRating: "Medium",
    confidence: 78,
    reasoning: "ECB dovish signals fully absorbed. Euro finding macro support while DXY loses intraday momentum.",
    structureStatus: "Breakout Potential",
    keyResistance: "1.0875 (Major)",
    keySupport: "1.0795",
    liquidityZone: "1.0805 - 1.0815",
    prevHighLow: "1.0862 / 1.0788",
    sessionHighLow: "1.0850 / 1.0810"
  },
  {
    id: "2",
    asset: "NDX",
    direction: "Short",
    setupType: "Reversal",
    entryZone: "18,100 - 18,150",
    takeProfit: "17,800",
    stopLoss: "18,250",
    timeframe: "Swing",
    confirmationRule: "Rejection wick forming on 1H chart near 18,150 resistance.",
    invalidationTrigger: "Price holds and consolidates strongly above 18,200.",
    riskRating: "High",
    confidence: 62,
    reasoning: "Index hitting major supply wall. Momentum indicators (RSI) severely overbought on daily timeframe.",
    structureStatus: "Trending Down",
    keyResistance: "18,200",
    keySupport: "17,950 (Key)",
    liquidityZone: "18,150 - 18,180",
    prevHighLow: "18,140 / 17,920",
    sessionHighLow: "18,115 / 18,050"
  }
];

export default function TradeBias({ activeMarket = "Global Equities" }: { activeMarket?: string }) {
  const assetSymbol = activeMarket === "FX Majors" ? "EUR/USD" : activeMarket === "Crypto Liquidity" ? "BTC/USD" : "SPX/NDX";

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-divider">
        <h2 className="text-[9px] font-bold uppercase tracking-widest text-text-muted">
          <span>Trade Planning:</span> <span className="ml-1 text-text-primary">{assetSymbol}</span>
        </h2>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-bullish"/>
          <span className="text-[9px] font-extrabold text-bullish uppercase tracking-widest">BULLISH</span>
        </div>
      </div>

      <div className="flex flex-col gap-0 overflow-y-auto no-scrollbar flex-1">
        {mockIdeas.map((idea, idx) => (
          <div key={idea.id} className={`p-3 hover:bg-white/[0.015] transition-colors ${idx !== mockIdeas.length - 1 ? 'border-b border-divider' : ''}`}>
            
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-extrabold text-lg tracking-tight text-text-primary leading-none">{idea.asset}</span>
                  <Badge variant={idea.direction === "Long" ? "bullish" : "bearish"} className="px-1.5 py-0">
                    {idea.direction === "Long" ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                    {idea.direction}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[8px] text-text-muted font-bold uppercase tracking-widest">
                    {idea.setupType}
                  </span>
                  <span className="text-text-muted">·</span>
                  <span className={`text-[8px] font-bold uppercase tracking-widest ${
                    idea.structureStatus === 'Breakout Potential' ? 'text-ai-primary/60' : 
                    idea.structureStatus === 'Trending Up' ? 'text-bullish/70' :
                    idea.structureStatus === 'Trending Down' ? 'text-bearish/70' : 'text-text-tertiary'
                  }`}>{idea.structureStatus}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1 data-value">
                <div className="flex items-center gap-1">
                  <span className="text-[8px] uppercase font-bold text-text-muted tracking-widest">Prob</span>
                  <span className={`text-xs font-extrabold ${idea.confidence > 70 ? 'text-bullish' : 'text-text-secondary'}`}>{idea.confidence}%</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {idea.riskRating === "Low" && <ShieldCheck className="w-3 h-3 text-bullish/60" />}
                  {idea.riskRating === "Medium" && <Shield className="w-3 h-3 text-caution/60" />}
                  {idea.riskRating === "High" && <ShieldAlert className="w-3 h-3 text-bearish/60" />}
                  <span className={`text-[8px] font-extrabold uppercase ${idea.riskRating === 'High' ? 'text-bearish' : idea.riskRating === 'Medium' ? 'text-caution' : 'text-bullish'}`}>{idea.riskRating}</span>
                </div>
              </div>
            </div>

            {/* Order Flow Grid */}
            <div className="mb-3 text-[11px] font-medium text-text-secondary w-full border border-card-border rounded overflow-hidden data-value">
              <div className="grid grid-cols-2">
                <div className="px-2.5 py-1.5 border-b border-r border-divider flex justify-between items-center">
                  <span className="text-[8px] uppercase font-bold text-text-muted tracking-widest">Res</span>
                  <span className="text-text-primary text-[10px] font-semibold">{idea.keyResistance}</span>
                </div>
                <div className="px-2.5 py-1.5 border-b border-divider flex justify-between items-center">
                  <span className="text-[8px] uppercase font-bold text-text-muted tracking-widest">Sup</span>
                  <span className="text-text-primary text-[10px] font-semibold">{idea.keySupport}</span>
                </div>
                <div className="px-2.5 py-1.5 border-b border-r border-divider flex justify-between items-center">
                  <span className="text-[8px] uppercase font-bold text-text-muted tracking-widest">Liq</span>
                  <span className="text-ai-primary/60 text-[10px] font-semibold">{idea.liquidityZone}</span>
                </div>
                <div className="px-2.5 py-1.5 border-b border-divider flex justify-between items-center">
                  <span className="text-[8px] uppercase font-bold text-text-muted tracking-widest">Sess</span>
                  <span className="text-text-primary text-[10px] font-semibold">{idea.sessionHighLow}</span>
                </div>
              </div>
            </div>

            {/* Entry / Target / SL */}
            <div className="border border-card-border rounded p-2.5 mb-3 data-value">
              <div className="flex justify-between items-center border-b border-divider pb-2 mb-2">
                <span className="text-[8px] text-text-muted uppercase font-bold tracking-widest flex items-center gap-1"><Crosshair className="w-2.5 h-2.5" /> Entry</span>
                <span className="text-[12px] font-bold text-text-primary">{idea.entryZone}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] text-bullish/60 uppercase font-bold tracking-widest">TP</span>
                  <span className="text-[12px] font-bold text-bullish">{idea.takeProfit}</span>
                </div>
                <div className="flex justify-between items-center pl-3 border-l border-divider">
                  <span className="text-[8px] text-bearish/60 uppercase font-bold tracking-widest">SL</span>
                  <span className="text-[12px] font-bold text-bearish">{idea.stopLoss}</span>
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="flex flex-col gap-2 mb-3 border border-card-border rounded p-2.5">
              <div className="flex gap-2 items-start">
                <CheckSquare className="w-3 h-3 text-bullish/50 shrink-0 mt-[1px]" />
                <div className="flex flex-col">
                  <span className="text-[8px] text-bullish/50 font-bold uppercase tracking-widest mb-0.5">Confirm</span>
                  <span className="text-[10px] text-text-secondary leading-tight">{idea.confirmationRule}</span>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <XCircle className="w-3 h-3 text-bearish/50 shrink-0 mt-[1px]" />
                <div className="flex flex-col">
                  <span className="text-[8px] text-bearish/50 font-bold uppercase tracking-widest mb-0.5">Invalid</span>
                  <span className="text-[10px] text-text-secondary leading-tight">{idea.invalidationTrigger}</span>
                </div>
              </div>
            </div>

            {/* Rationale */}
            <div>
              <span className="text-[8px] text-ai-primary/50 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> Rationale
              </span>
              <p className="text-[11px] text-text-tertiary leading-relaxed">{idea.reasoning}</p>
            </div>
            
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-divider">
        <p className="text-[9px] text-text-muted leading-snug flex items-start gap-1.5">
          <Info className="w-3 h-3 shrink-0 mt-0.5" />
          <span>AI-assisted analysis for research only. Not financial advice.</span>
        </p>
      </div>
    </Card>
  );
}
