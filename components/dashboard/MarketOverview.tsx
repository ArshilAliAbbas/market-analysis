"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { Loader2, AlertTriangle, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMarketData } from "@/services/api";

const MASTER_ASSETS = [
  { symbol: "SPY", name: "S&P 500", category: "Indices", display: "SPX" },
  { symbol: "QQQ", name: "Nasdaq 100", category: "Indices", display: "NDX" },
  { symbol: "DIA", name: "Dow Jones", category: "Indices", display: "DJIA" },
  { symbol: "AAPL", name: "Apple Inc.", category: "Stocks", display: "AAPL" },
  { symbol: "MSFT", name: "Microsoft", category: "Stocks", display: "MSFT" },
  { symbol: "TSLA", name: "Tesla", category: "Stocks", display: "TSLA" },
  { symbol: "NVDA", name: "NVIDIA", category: "Stocks", display: "NVDA" },
  { symbol: "BINANCE:BTCUSDT", name: "Bitcoin", category: "Crypto", display: "BTCUSD" },
  { symbol: "BINANCE:ETHUSDT", name: "Ethereum", category: "Crypto", display: "ETHUSD" },
  { symbol: "BINANCE:SOLUSDT", name: "Solana", category: "Crypto", display: "SOLUSD" },
  { symbol: "FOREX:EURUSD", name: "EUR/USD", category: "Forex", display: "EURUSD", from: "EUR" },
  { symbol: "FOREX:GBPUSD", name: "GBP/USD", category: "Forex", display: "GBPUSD", from: "GBP" },
  { symbol: "FOREX:AUDUSD", name: "AUD/USD", category: "Forex", display: "AUDUSD", from: "AUD" },
];

const DEFAULT_WATCHLIST = [
  MASTER_ASSETS[0], // SPY
  MASTER_ASSETS[1], // QQQ
  MASTER_ASSETS[7], // BTC
  MASTER_ASSETS[10] // EURUSD
];

const Sparkline = ({ open, high, low, price, color }: { open: number; high: number; low: number; price: number; color: string }) => {
  const min = Math.min(low, open, price);
  const max = Math.max(high, open, price);
  const range = (max - min) || 1;
  const getY = (val: number) => 22 - ((val - min) / range) * 20;

  const points = `0,${getY(open)} 30,${getY(open > price ? high : low)} 70,${getY(open > price ? low : high)} 100,${getY(price)}`;

  return (
    <svg width="50" height="24" viewBox="0 0 100 24" preserveAspectRatio="none" className="overflow-visible opacity-80">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function MarketOverview() {
  const [data, setData] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<typeof MASTER_ASSETS>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("axiom_watchlist");
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        setWatchlist(DEFAULT_WATCHLIST);
      }
    } else {
      setWatchlist(DEFAULT_WATCHLIST);
    }
  }, []);

  const saveWatchlist = (newList: typeof MASTER_ASSETS) => {
    setWatchlist(newList);
    localStorage.setItem("axiom_watchlist", JSON.stringify(newList));
  };

  const addAsset = (asset: typeof MASTER_ASSETS[0]) => {
    if (watchlist.find(a => a.symbol === asset.symbol)) return;
    saveWatchlist([...watchlist, asset]);
    setIsAdding(false);
  };

  const removeAsset = (symbol: string) => {
    saveWatchlist(watchlist.filter(a => a.symbol !== symbol));
  };

  const fetchMarket = async () => {
    if (watchlist.length === 0) {
      setIsLoading(false);
      setData([]);
      return;
    }
    const market = await getMarketData(watchlist);
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
    if (watchlist.length > 0) fetchMarket();
    const interval = setInterval(fetchMarket, 20000); // 20s poller
    return () => clearInterval(interval);
  }, [watchlist]);

  const unselectedAssets = MASTER_ASSETS.filter(ma => !watchlist.find(w => w.symbol === ma.symbol));

  return (
    <div className="axiom-panel axiom-corner-tl border-accent/20 flex flex-col h-full relative overflow-hidden bg-card/40">
      <div className="flex items-center justify-between px-4 py-3 border-b border-accent/10 bg-accent/5">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
          <div className="w-1 h-3 bg-accent animate-pulse-accent" />
          Market Intelligence
        </h2>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-bullish animate-pulse" />
            <span className="text-[8px] uppercase font-bold tracking-widest text-text-muted">LIVE</span>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="w-5 h-5 rounded hover:bg-white/10 flex items-center justify-center transition-colors text-text-muted hover:text-white"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="absolute top-[38px] right-0 left-0 z-50 bg-surface-elevated border-b border-divider p-2 shadow-2xl max-h-[200px] overflow-y-auto thin-scrollbar">
          <div className="text-[9px] uppercase font-bold text-text-tertiary mb-2 px-2 tracking-widest">Select Asset</div>
          <div className="flex flex-col gap-1">
            {unselectedAssets.length === 0 ? (
              <div className="text-xs text-text-muted px-2 py-1">All assets tracked.</div>
            ) : unselectedAssets.map(asset => (
              <button 
                key={asset.symbol}
                onClick={() => addAsset(asset)}
                className="flex items-center justify-between text-left px-2 py-1.5 hover:bg-white/5 rounded text-xs transition-colors"
              >
                <span className="font-bold text-text-secondary">{asset.display}</span>
                <span className="text-[9px] text-text-tertiary px-1.5 py-0.5 rounded bg-white/5">{asset.category}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-0">
        {isLoading && data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-tertiary gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Pricing data...</span>
          </div>
        ) : error ? (
           <div className="flex flex-col items-center justify-center h-full text-bearish gap-2">
             <AlertTriangle className="w-4 h-4" />
             <span className="text-[9px] font-bold uppercase tracking-widest">Connection Failed</span>
           </div>
        ) : data.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-text-muted px-6 text-center">
             <span className="text-xs">Watchlist empty.</span>
           </div>
        ) : (
          <div className="flex flex-col pb-4">
            {["Indices", "Forex", "Crypto"].map(category => {
              const catWatchlist = watchlist.filter(w => w.category === category);
              if (catWatchlist.length === 0) return null;

              return (
                <div key={category} className="flex flex-col mb-1.5">
                  <h3 className="text-[9px] uppercase font-black tracking-[0.3em] px-4 py-2 bg-accent/10 text-accent border-y border-accent/20 sticky top-0 z-10 w-full italic">
                    {category} :: TERMINAL_INPUT
                  </h3>
                  
                  <div className="flex flex-col divide-y divide-accent/5">
                    {catWatchlist.map((asset) => {
                      const liveData = data.find(d => d.symbol === asset.display || d.symbol === asset.symbol);
                      if (!liveData) return null;

                      const isBullish = liveData.percentChange >= 0;
                      const isForex = asset.category === "Forex";
                      const decimals = isForex ? 4 : asset.category === "Crypto" ? 1 : 2;
                      const displayPrice = liveData.price ? liveData.price.toFixed(decimals) : "0.00";
                      const high = liveData.high ? liveData.high.toFixed(decimals) : "-";
                      const low = liveData.low ? liveData.low.toFixed(decimals) : "-";
                      const color = isBullish ? "var(--color-bullish)" : "var(--color-bearish)";

                      return (
                        <div 
                          key={asset.symbol} 
                          className="group relative flex items-center px-4 py-3 hover:bg-accent/5 transition-all cursor-crosshair overflow-hidden"
                        >
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeAsset(asset.symbol); }}
                            className="absolute -left-10 group-hover:left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-sm bg-bearish/20 flex items-center justify-center text-bearish transition-all hover:bg-bearish hover:text-white z-20"
                          >
                            <X className="w-3 h-3" />
                          </button>

                          <div className="w-[85px] shrink-0 flex flex-col group-hover:translate-x-5 transition-transform">
                            <span className="font-extrabold text-[13px] text-text-primary tracking-tight leading-none mb-1.5">{asset.display}</span>
                            <div className="flex gap-1.5 text-[8px] text-text-tertiary font-mono">
                              <span className="text-text-secondary opacity-80">H: {high}</span>
                              <span className="text-text-secondary opacity-60">L: {low}</span>
                            </div>
                          </div>
                          
                          <div className="flex-1 flex justify-center px-2 group-hover:translate-x-3 transition-transform group-hover:opacity-30">
                            <Sparkline open={liveData.open} high={liveData.high} low={liveData.low} price={liveData.price} color={color} />
                          </div>

                          <div className="w-[60px] shrink-0 flex flex-col items-end data-value group-hover:translate-x-1 transition-transform">
                            <span className="font-extrabold text-[13px] text-text-primary leading-none">{displayPrice}</span>
                            <span className={cn(
                              "text-[9px] font-bold mt-1.5 leading-none",
                              isBullish ? "text-bullish" : "text-bearish"
                            )}>
                              {isBullish ? "+" : ""}{liveData.percentChange?.toFixed(2) || "0.00"}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
