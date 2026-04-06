"use client";

import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { MapPin, Clock, Loader2, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getEconomicEvents } from "@/services/api";

export default function VolatilityTiming({ activeMarket = "Global Equities" }: { activeMarket?: string }) {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchEvents = async () => {
    const data = await getEconomicEvents();
    if (!data || !Array.isArray(data)) {
      if (events.length === 0) setError(true);
      setIsLoading(false);
      return;
    }
    
    const sorted = data.sort((a: any, b: any) => {
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

  const marketEvents = events.filter((evt: any) => {
    if (activeMarket === "FX Majors") return evt.country === "US" || evt.country === "EU" || evt.country === "UK" || evt.country === "JP";
    if (activeMarket === "Crypto Liquidity") return evt.country === "US" || evt.impact === "HIGH";
    return true;
  });

  return (
    <Card className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-divider">
        <h2 className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary flex items-center gap-1">
          <Clock className="w-3 h-3" /> Economic Calendar
        </h2>
        <span className="text-[8px] font-bold uppercase tracking-widest text-text-tertiary">LIVE</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {isLoading && events.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 gap-1.5 text-text-tertiary">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-[8px] uppercase font-bold tracking-widest">Loading events</span>
          </div>
        ) : error ? (
           <div className="flex flex-col items-center justify-center p-6 gap-1.5 text-bearish">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-[8px] uppercase font-bold tracking-widest">Failed</span>
          </div>
        ) : marketEvents.length === 0 ? (
           <div className="flex flex-col items-center justify-center p-6 gap-1.5 text-text-tertiary">
            <span className="text-[8px] uppercase font-bold tracking-widest">No events upcoming</span>
          </div>
        ) : (
          marketEvents.map((evt, idx) => {
            const isHigh = evt.impact === "HIGH";
            return (
              <div key={idx} className="w-full flex border-b border-divider hover:bg-white/[0.01] transition-colors">
                <div className="w-[40px] flex flex-col items-center justify-center border-r border-divider py-2">
                   {isHigh ? (
                     <div className="w-1.5 h-1.5 rounded-full bg-bearish/80" />
                   ) : (
                     <div className="w-1 h-1 rounded-full bg-text-tertiary/40" />
                   )}
                   <span className={cn("text-[7px] mt-0.5 font-bold uppercase", isHigh ? "text-bearish/80" : "text-text-tertiary")}>{isHigh ? "HIGH" : "MED"}</span>
                </div>
                
                <div className="flex-1 py-2 px-2.5 flex flex-col justify-center">
                  <div className="flex justify-between items-start gap-2 mb-0.5">
                    <span className="text-[11px] font-bold text-text-primary leading-tight line-clamp-1">{evt.event}</span>
                    <span className="text-[9px] text-text-tertiary font-mono shrink-0 font-bold">
                      {formatTime(evt.time)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" /> {evt.country}
                    </span>
                    {(evt.estimate || evt.actual) && (
                      <span className="text-[9px] text-text-tertiary font-mono">Est: {evt.estimate || "-"}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  );
}
