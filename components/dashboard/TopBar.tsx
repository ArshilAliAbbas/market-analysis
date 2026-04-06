"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Settings, User, Command, X, Check } from "lucide-react";
import { Badge } from "../ui/Badge";
import { motion, AnimatePresence } from "framer-motion";
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
  const [time, setTime] = useState<{ local: string; ny: string }>({ local: "--:--:--", ny: "--:--:--" });
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime({
        local: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        ny: now.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
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
    <header className="flex items-center justify-between bg-card border border-card-border rounded px-4 py-2 shrink-0 h-12 relative z-40">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-ai-subtle flex items-center justify-center border border-ai-primary/20">
            <Command className="w-3 h-3 text-ai-primary" />
          </div>
          <h1 className="text-sm font-semibold tracking-tight text-text-primary">
            Axiom <span className="text-ai-primary font-medium">Terminal</span>
          </h1>
        </div>
        
        <div className="w-px h-4 bg-divider" />
        
        <select 
          value={activeMarket}
          onChange={(e) => setActiveMarket(e.target.value)}
          className="bg-transparent text-xs text-text-tertiary border-none outline-none cursor-pointer hover:text-text-secondary transition-colors appearance-none font-medium"
        >
          <option value="Global Equities">Global Equities</option>
          <option value="Crypto Liquidity">Crypto Liquidity</option>
          <option value="FX Majors">FX Majors</option>
        </select>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-4 data-value">
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest">Local</span>
            <span className="text-text-primary text-xs font-semibold font-mono">{time.local}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest">NY</span>
            <span className="text-text-primary text-xs font-mono font-semibold">{time.ny}</span>
          </div>
        </div>

        <div className="w-px h-4 bg-divider" />

        <div className="flex gap-1.5">
          <Badge variant="bullish">FX OPEN</Badge>
          <Badge variant="default">EQ CLOSED</Badge>
          <Badge variant="ai">CRYPTO 24/7</Badge>
        </div>
        
        <div className="w-px h-4 bg-divider" />
        
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Sentiment</span>
          <span className="text-xs font-extrabold text-bullish tracking-tight data-value">BULLISH 72%</span>
        </div>
        
        <div className="w-px h-4 bg-divider" />
        
        <div className="flex items-center gap-0.5">
          {/* ─── Notification Bell ─── */}
          <div className="relative" ref={panelRef}>
            <button
              onClick={handleBellClick}
              className={`p-1.5 rounded transition-colors relative ${
                showPanel
                  ? "bg-white/[0.06] text-text-primary"
                  : "hover:bg-white/[0.04] text-text-tertiary hover:text-text-secondary"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-bearish text-[8px] font-extrabold text-white flex items-center justify-center px-[3px] leading-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* ─── Notification Dropdown Panel ─── */}
            <AnimatePresence>
              {showPanel && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-[380px] max-h-[480px] bg-card border border-card-border rounded shadow-2xl shadow-black/40 flex flex-col overflow-hidden z-50"
                >
                  {/* Panel Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-divider">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                      Alerts
                    </span>
                    <div className="flex items-center gap-2">
                      {alerts.length > 0 && (
                        <button
                          onClick={onClearAll}
                          className="text-[9px] font-bold uppercase tracking-wider text-text-tertiary hover:text-text-secondary transition-colors flex items-center gap-1"
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
                      <div className="flex flex-col items-center justify-center py-12 gap-2 text-text-muted">
                        <Bell className="w-5 h-5" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">No alerts</span>
                      </div>
                    ) : (
                      alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="flex gap-3 px-4 py-3 border-b border-divider hover:bg-white/[0.015] transition-colors relative group"
                        >
                          {/* Left accent */}
                          <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${getAlertAccent(alert.type)}`} />

                          <div className="shrink-0 mt-0.5">
                            {getAlertIcon(alert.type, "w-3.5 h-3.5")}
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex items-start justify-between gap-2 mb-0.5">
                              <span className="text-[12px] font-bold text-text-primary leading-tight truncate">
                                {alert.title}
                              </span>
                              <span className="text-[9px] text-text-muted font-mono shrink-0">{alert.timestamp}</span>
                            </div>

                            <p className="text-[11px] text-text-tertiary leading-snug mb-2 line-clamp-2">
                              {alert.explanation}
                            </p>

                            <div className="flex items-center gap-1.5">
                              {alert.priority === "critical" && (
                                <span className="text-[8px] font-extrabold uppercase tracking-widest text-bearish mr-1">CRITICAL</span>
                              )}
                              {alert.assets.map((asset, i) => (
                                <span key={i} className="text-[8px] uppercase font-bold text-text-secondary tracking-widest bg-white/[0.03] border border-card-border px-1 py-[1px] rounded">
                                  {asset}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="p-1.5 rounded hover:bg-white/[0.04] transition-colors text-text-tertiary hover:text-text-secondary">
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded hover:bg-white/[0.04] transition-colors text-text-tertiary hover:text-text-secondary">
            <User className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
