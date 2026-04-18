"use client";

import { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { AlertTriangle, Command, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getNews, analyzeNewsWithAI } from "@/services/api";

interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  explanation: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  assets: string[];
  timeAgo: string;
  category: "Macro" | "Crypto" | "Stocks" | "Forex" | "General";
  url?: string;
}

const formatTimeAgo = (timestamp: number) => {
  const diffInMinutes = Math.floor((Date.now() / 1000 - timestamp) / 60);
  if (diffInMinutes < 60) return `${Math.max(1, diffInMinutes)}m`;
  return `${Math.floor(diffInMinutes / 60)}h`;
};

export default function NewsFeed({ activeMarket = "Global Equities" }: { activeMarket?: string }) {
  const [filter, setFilter] = useState<string>("All");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const filters = ["All", "High Impact", "Macro", "General"];

  const fetchNewsParams = async () => {
    setIsLoading(true);
    const rawNews = await getNews();
    if (!rawNews || !Array.isArray(rawNews)) {
      setError(true);
      setIsLoading(false);
      return;
    }

    const processedNews: NewsItem[] = await Promise.all(
      rawNews.slice(0, 5).map(async (item: any) => {
        const id = Math.random().toString(36).substr(2, 9);
        const headline = item.headline || item.title || "";
        const summary = item.summary || item.description || "";
        
        const aiAnalysis = await analyzeNewsWithAI(headline, summary);
        
        return {
          id,
          headline,
          summary: aiAnalysis?.summary || summary,
          explanation: aiAnalysis?.explanation || "No AI explanation generated.",
          impact: (aiAnalysis?.impact?.toUpperCase() || "MEDIUM") as "HIGH" | "MEDIUM" | "LOW",
          assets: aiAnalysis?.affected_assets || [],
          timeAgo: item.datetime ? formatTimeAgo(item.datetime) : "1m",
          category: "General",
          url: item.url
        };
      })
    );

    setNews(processedNews);
    setError(false);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNewsParams();
    const interval = setInterval(fetchNewsParams, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredNews = news.filter(n => {
    // Basic market-based semantic filtering (simulated)
    const matchesMarket = 
      activeMarket === "Crypto Liquidity" ? n.assets.includes("BTC") || n.assets.includes("ETH") || n.category === "Crypto"
      : activeMarket === "FX Majors" ? n.assets.includes("USD") || n.assets.includes("EUR") || n.category === "Forex"
      : n.category === "Stocks" || n.category === "Macro";

    // For demo purposes, we randomly allow some to pass if we don't have enough matches, 
    // but we heavily prioritize the activeMarket.
    const passesMarket = matchesMarket || Math.random() > 0.5;

    if (!passesMarket && filter !== "All") return false;

    if (filter === "All") return true;
    if (filter === "High Impact") return n.impact === "HIGH";
    return n.category === filter || filter === "General";
  }).sort((a, b) => {
    // Push activeMarket relevant news to the top
    const aMatch = activeMarket === "Crypto Liquidity" && a.assets.includes("BTC") ? 1 : 0;
    const bMatch = activeMarket === "Crypto Liquidity" && b.assets.includes("BTC") ? 1 : 0;
    return bMatch - aMatch;
  });

  return (
    <div className="axiom-panel axiom-corner-tl border-accent/20 flex flex-col h-full flex-1 bg-card/40">
      <div className="flex items-center justify-between px-4 py-3 border-b border-accent/10 bg-accent/5">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
          <div className="w-1 h-3 bg-accent animate-pulse-accent" />
          Intelligence Flow
        </h2>
        <div className="flex items-center gap-1.5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-none text-[9px] font-black uppercase tracking-widest transition-all
                ${filter === f 
                  ? "bg-accent text-background shadow-[0_0_10px_rgba(6,182,212,0.3)]" 
                  : "text-accent/40 hover:text-accent hover:bg-accent/10"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {isLoading && news.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-text-tertiary">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Compiling intelligence</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-bearish text-center p-6">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Connection failed</span>
            <button onClick={fetchNewsParams} className="text-[9px] text-text-tertiary bg-white/[0.03] px-2.5 py-1 rounded uppercase tracking-wider hover:bg-white/[0.06] border border-card-border">Retry</button>
          </div>
        ) : (
          <AnimatePresence>
            {filteredNews.map((item, index) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, delay: index * 0.03 }}
                key={item.id}
                className="px-5 py-5 border-b border-divider hover:bg-white/[0.015] transition-colors group relative"
              >
                {item.impact === "HIGH" && <div className="absolute left-0 top-0 bottom-0 w-1 bg-bearish" />}
                
                <div className="flex gap-4">
                  <div className="w-12 shrink-0 flex flex-col items-center data-value mt-1">
                    <span className="text-[10px] font-black text-accent/60 italic">{item.timeAgo}</span>
                    <div className="w-px h-full bg-accent/10 mt-2" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      {item.impact === "HIGH" && <Badge variant="high">CRITICAL</Badge>}
                      {item.impact === "MEDIUM" && <Badge variant="medium">ELEVATED</Badge>}
                      {item.impact === "LOW" && <Badge variant="low">LOW</Badge>}
                      
                      <div className="flex gap-1 ml-1">
                        {item.assets.map((asset, i) => (
                          <span key={i} className="text-[9px] bg-accent/5 border border-accent/20 px-1.5 py-0.5 rounded-none text-accent font-black tracking-widest italic opacity-70">
                            {asset}
                          </span>
                        ))}
                      </div>
                    </div>

                    <a href={item.url} target="_blank" rel="noreferrer" className="block text-lg font-black tracking-tight text-white mb-2 leading-tight hover:text-accent transition-colors">
                      {item.headline}
                    </a>
                    <p className="text-[13px] text-slate-400 font-medium leading-relaxed mb-5">{item.summary}</p>
                    
                    <div className="bg-accent/[0.03] border border-accent/20 rounded-none p-4 text-[12px] relative overflow-hidden group/analysis">
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-accent/10 border-b border-l border-accent/20 text-[8px] font-black text-accent/40 tracking-widest">
                        CORE_LOG_PRC
                      </div>
                      <div className="flex gap-3 items-start relative z-10">
                        <Command className="w-4 h-4 text-accent animate-pulse-accent shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                          <span className="text-accent text-[9px] font-black uppercase tracking-[0.2em] block">Synthea_Intelligence_Node</span>
                          <p className="text-slate-200 text-[13px] font-mono leading-relaxed">
                            {item.explanation || "AI insight is currently syncing and unavailable."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
