"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Settings, User, Command, X } from "lucide-react";
import { Badge } from "../ui/Badge";
import { SmartAlert, getAlertIcon, getAlertAccent } from "./SmartAlerts";

interface TopBarProps {
  alerts: SmartAlert[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  activeMarket: string;
  setActiveMarket: (market: string) => void;
}

export default function TopBar({ alerts, unreadCount, onMarkAllRead, onClearAll, activeMarket, setActiveMarket }: TopBarProps) {
  const [time, setTime] = useState<{ local: string; ny: string; london: string; tokyo: string; sydney: string }>({ local: "--:--", ny: "--:--", london: "--:--", tokyo: "--:--", sydney: "--:--" });
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fmt = (tz?: string) => new Date().toLocaleTimeString("en-GB", { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
    const updateTime = () => {
      setTime({
        local: fmt(),
        ny: fmt("America/New_York"),
        london: fmt("Europe/London"),
        tokyo: fmt("Asia/Tokyo"),
        sydney: fmt("Australia/Sydney"),
      });
    };
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowPanel(false);
      }
    };
    if (showPanel) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPanel]);

  const handleBellClick = () => {
    setShowPanel(prev => !prev);
    if (!showPanel) onMarkAllRead();
  };

  return (
    <header className="flex items-center justify-between axiom-panel axiom-corner-tl border-accent/20 rounded-none px-4 py-2 shrink-0 h-14 relative z-40 bg-card/80">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-accent/10 flex items-center justify-center border border-accent/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Command className="w-4 h-4 text-accent animate-pulse-accent" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-[0.15em] text-white uppercase italic">
              Axiom <span className="text-accent underline decoration-accent/40 decoration-2 underline-offset-4">Terminal</span>
            </h1>
            <span className="text-[9px] font-black text-accent/40 tracking-[0.3em] -mt-0.5">V.4.0.2_INTEL</span>
          </div>
        </div>
        
        <div className="w-px h-4 bg-white/[0.06]" />
        
        <select 
          value={activeMarket}
          onChange={(e) => setActiveMarket(e.target.value)}
          className="bg-white/[0.04] text-xs text-white/70 border border-white/[0.05] rounded-md outline-none cursor-pointer hover:text-white hover:bg-white/[0.08] transition-colors font-medium px-2 py-1"
        >
          <option value="Global Equities">Global Equities</option>
          <option value="Crypto Liquidity">Crypto Liquidity</option>
          <option value="FX Majors">FX Majors</option>
        </select>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden lg:flex items-center gap-3 data-value divide-x divide-white/[0.06]">
          {[
            { label: "LCL", val: time.local },
            { label: "NYC", val: time.ny },
            { label: "LON", val: time.london },
            { label: "TYO", val: time.tokyo },
            { label: "SYD", val: time.sydney },
          ].map(({ label, val }) => (
            <div key={label} className="flex flex-col items-center justify-center px-4 first:pl-0 border-r border-accent/10">
              <span className="text-accent text-[8px] font-black uppercase tracking-[0.2em] mb-0.5">{label}</span>
              <span className="text-white text-[12px] font-bold font-mono tabular-nums leading-none">{val}</span>
            </div>
          ))}
        </div>
        {/* Mobile: only local + NY */}
        <div className="flex lg:hidden items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-white/30 text-[9px] font-bold uppercase tracking-widest">LCL</span>
            <span className="text-white text-xs font-semibold font-mono">{time.local}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-white/30 text-[9px] font-bold uppercase tracking-widest">NYC</span>
            <span className="text-white text-xs font-mono font-semibold">{time.ny}</span>
          </div>
        </div>

        <div className="w-px h-4 bg-white/[0.06]" />

        <div className="flex gap-1.5">
          <Badge variant="bullish">FX OPEN</Badge>
          <Badge variant="default">EQ CLOSED</Badge>
          <Badge variant="bullish">CRYPTO 24/7</Badge>
        </div>
        
        <div className="w-px h-4 bg-white/[0.06]" />
        
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Sentiment</span>
          <span className="text-xs font-extrabold text-bullish tracking-tight data-value">BULLISH 72%</span>
        </div>
        
        <div className="w-px h-4 bg-white/[0.06]" />
        
        <div className="flex items-center gap-0.5">
          {/* Notification Bell */}
          <div className="relative" ref={panelRef}>
            <button
              onClick={handleBellClick}
              className={`p-1.5 rounded-md transition-all relative ${
                showPanel
                  ? "bg-white/[0.08] text-white"
                  : "hover:bg-white/[0.04] text-white/40 hover:text-white/70"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-red-500 text-[8px] font-extrabold text-white flex items-center justify-center px-[3px] leading-none shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showPanel && (
              <div className="absolute top-full right-0 mt-2 w-[380px] max-h-[480px] bg-black border border-white/[0.08] rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden z-50 backdrop-blur-xl">
                {/* Panel Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Alerts
                  </span>
                  <div className="flex items-center gap-2">
                    {alerts.length > 0 && (
                      <button
                        onClick={onClearAll}
                        className="text-[9px] font-bold uppercase tracking-wider text-white/30 hover:text-white/70 transition-colors flex items-center gap-1"
                      >
                        <X className="w-2.5 h-2.5" />
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Alert List */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-2 text-white/30">
                      <Bell className="w-5 h-5" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">No alerts</span>
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex gap-3 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors relative group"
                      >
                        {/* Left accent */}
                        <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${getAlertAccent(alert.type)}`} />

                        <div className="shrink-0 mt-0.5">
                          {getAlertIcon(alert.type, "w-3.5 h-3.5")}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex items-start justify-between gap-2 mb-0.5">
                            <span className="text-[12px] font-bold text-white leading-tight truncate">
                              {alert.title}
                            </span>
                            <span className="text-[9px] text-white/30 font-mono shrink-0">{alert.timestamp}</span>
                          </div>

                          <p className="text-[11px] text-white/50 leading-snug mb-2 line-clamp-2">
                            {alert.explanation}
                          </p>

                          <div className="flex items-center gap-1.5">
                            {alert.priority === "critical" && (
                              <span className="text-[8px] font-extrabold uppercase tracking-widest text-red-500 mr-1">CRITICAL</span>
                            )}
                            {alert.assets.map((asset, i) => (
                              <span key={i} className="text-[8px] uppercase font-bold text-white/60 tracking-widest bg-white/[0.04] border border-white/[0.06] px-1 py-[1px] rounded">
                                {asset}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="p-1.5 rounded-md hover:bg-white/[0.04] transition-colors text-white/30 hover:text-white/60">
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-white/[0.04] transition-colors text-white/30 hover:text-white/60">
            <User className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
