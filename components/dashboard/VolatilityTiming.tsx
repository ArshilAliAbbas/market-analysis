"use client";

import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { MapPin, Clock, Loader2, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getEconomicEvents } from "@/services/api";

interface EconomicEvent {
  time: string;
  event: string;
  country: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  estimate?: string;
  actual?: string;
}

export default function VolatilityTiming({ activeMarket = "Global Equities" }: { activeMarket?: string }) {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchEvents = async () => {
    const data = await getEconomicEvents();
    if (!data || !Array.isArray(data)) {
      if (events.length === 0) setError(true);
      setIsLoading(false);
      return;
    }
    
    const sorted = (data as EconomicEvent[]).sort((a, b) => {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    }).filter(evt => new Date(evt.time).getTime() > Date.now());

    setEvents(sorted.slice(0, 4));
    setError(false);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5 * 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timeString: string) => {
    const d = new Date(timeString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const marketEvents = events.filter((evt) => {
    if (activeMarket === "FX Majors") return evt.country === "US" || evt.country === "EU" || evt.country === "UK" || evt.country === "JP";
    if (activeMarket === "Crypto Liquidity") return evt.country === "US" || evt.impact === "HIGH";
    return true;
  });

  return (
    <div className="axiom-panel flex flex-col h-full bg-white/[0.02] border-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/5">
        <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5">
          <Clock className="w-3 h-3" /> VOL_TIMING_CAL
        </h2>
        <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">SYS_SYNC</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {isLoading && events.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 gap-1.5 text-white/20">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-[8px] uppercase font-bold tracking-widest">FETCH_EVENTS</span>
          </div>
        ) : error ? (
           <div className="flex flex-col items-center justify-center p-6 gap-1.5 text-bearish/60">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-[8px] uppercase font-bold tracking-widest">ERROR_LOC</span>
          </div>
        ) : marketEvents.length === 0 ? (
           <div className="flex flex-col items-center justify-center p-6 gap-1.5 text-white/10">
            <span className="text-[8px] uppercase font-bold tracking-widest">CAL_STREAM_EMPTY</span>
          </div>
        ) : (
          marketEvents.map((evt, idx) => {
            const isHigh = evt.impact === "HIGH";
            return (
              <div key={idx} className="w-full flex border-b border-white/5 hover:bg-white/5 transition-colors">
                <div className="w-[40px] flex flex-col items-center justify-center border-r border-white/5 py-2 bg-white/[0.01]">
                   {isHigh ? (
                     <div className="w-1.5 h-1.5 rounded-none bg-bearish animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.3)]" />
                   ) : (
                     <div className="w-1 h-1 rounded-none bg-white/20" />
                   )}
                   <span className={cn("text-[7px] mt-1 font-bold uppercase tracking-widest", isHigh ? "text-bearish" : "text-white/40")}>{isHigh ? "CRIT" : "LOW"}</span>
                </div>
                
                <div className="flex-1 py-2 px-3 flex flex-col justify-center">
                   <div className="flex justify-between items-start gap-2 mb-0.5">
                    <span className="text-[11px] font-bold text-white leading-tight line-clamp-1 italic uppercase">{evt.event}</span>
                    <span className="text-[10px] text-white/60 font-mono shrink-0 font-bold">
                      {formatTime(evt.time)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-1.5">
                      <MapPin className="w-2.5 h-2.5" /> GEO_{evt.country}
                    </span>
                    {(evt.estimate || evt.actual) && (
                      <span className="text-[9px] text-white/30 font-mono tracking-tighter">EST: {evt.estimate || "N/A"}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}
