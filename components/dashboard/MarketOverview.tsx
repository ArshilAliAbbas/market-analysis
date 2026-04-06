"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMarketData } from "@/services/api";

export default function MarketOverview() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const categories = ["Indices", "Forex", "Crypto"];

  const fetchMarket = async () => {
    const market = await getMarketData();
    if (!market || !Array.isArray(market)) {
      if (data.length === 0) setError(true);
      setIsLoading(false);
      return;
    }
    setData(market);
    setError(false);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMarket();
    const interval = setInterval(fetchMarket, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-divider">
        <h2 className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Market Watch</h2>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-bullish animate-pulse" />
          <span className="text-[8px] uppercase font-bold tracking-widest text-text-muted">LIVE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {isLoading && data.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 gap-2 text-text-tertiary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Syncing</span>
          </div>
        ) : error ? (
           <div className="flex flex-col items-center justify-center p-10 gap-2 text-bearish">
             <AlertTriangle className="w-4 h-4" />
             <span className="text-[9px] font-bold uppercase tracking-widest">Connection Failed</span>
           </div>
        ) : (
          categories.map((category) => {
            const catAssets = data.filter(a => a.category === category);
            if (catAssets.length === 0) return null;

            return (
              <div key={category} className="flex flex-col">
                <h3 className="text-[8px] uppercase text-text-muted font-bold tracking-[0.2em] px-3 py-1.5 border-b border-divider bg-surface-sunken">
                  {category}
                </h3>
                <div className="flex flex-col">
                  {catAssets.map((asset) => {
                    const isBullish = asset.percentChange >= 0;
                    const isForex = category === "Forex";
                    const decimals = isForex ? 4 : category === "Crypto" ? 0 : 2;
                    const displayPrice = asset.price ? asset.price.toFixed(decimals) : "0.00";

                    return (
                      <div 
                        key={asset.symbol} 
                        className="flex justify-between items-center px-3 py-3 border-b border-divider hover:bg-white/[0.02] transition-colors cursor-pointer group"
                      >
                        <div className="w-[70px] shrink-0 flex flex-col">
                          <span className="font-extrabold text-[13px] text-text-primary tracking-tight leading-none">{asset.symbol}</span>
                          <span className="text-[8px] text-text-muted font-medium mt-1 truncate">{asset.name}</span>
                        </div>
                        
                        <div className="flex-1 flex justify-end pr-2">
                          <div className="flex gap-1.5 text-[9px] text-text-tertiary font-mono data-value">
                            <span>O:{asset.open?.toFixed(decimals) || '-'}</span>
                            <span className="text-text-muted">|</span>
                            <span>H:{asset.high?.toFixed(decimals) || '-'}</span>
                          </div>
                        </div>

                        <div className="w-[65px] shrink-0 flex flex-col items-end data-value">
                          <span className="font-extrabold text-[13px] text-text-primary leading-none">{displayPrice}</span>
                          <span className={cn(
                            "text-[10px] font-extrabold mt-1 leading-none",
                            isBullish ? "text-bullish" : "text-bearish"
                          )}>
                            {isBullish ? "+" : ""}{asset.percentChange?.toFixed(2) || "0.00"}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
