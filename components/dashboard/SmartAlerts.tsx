"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Activity, TrendingUp, Zap } from "lucide-react";

export type AlertType = "News" | "Volatility" | "Breakout" | "Unusual";
export type AlertPriority = "critical" | "normal";

export interface SmartAlert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  explanation: string;
  assets: string[];
  timestamp: string;
  read: boolean;
}

const mockAlertPool: Omit<SmartAlert, "id" | "timestamp" | "read">[] = [
  {
    type: "News",
    priority: "critical",
    title: "High-Impact Data Release",
    explanation: "US Core PCE came in higher than expected (0.4% MoM), accelerating hawkish sentiment.",
    assets: ["USD", "NDX", "XAUUSD"]
  },
  {
    type: "Volatility",
    priority: "normal",
    title: "Volatility Spike Detected",
    explanation: "Massive volume influx causing erratic spread widening in JPY crosses.",
    assets: ["USDJPY", "EURJPY"]
  },
  {
    type: "Breakout",
    priority: "normal",
    title: "Major Support Failed",
    explanation: "Crude Oil has broken standard support levels at $78.00 showing weak accumulation.",
    assets: ["USOIL"]
  },
  {
    type: "Unusual",
    priority: "normal",
    title: "Unusual Options Activity",
    explanation: "Large block trades identified rolling short calls out to next month.",
    assets: ["SPX"]
  },
  {
    type: "Breakout",
    priority: "critical",
    title: "Trend Continuation — Resistance Cleared",
    explanation: "Bitcoin cleared intra-session resistance at 64,500. Next liquidity cluster is 65k.",
    assets: ["BTCUSD"]
  },
  {
    type: "News",
    priority: "critical",
    title: "CPI Data Released — Above Forecast",
    explanation: "Core CPI at 3.8% vs 3.6% expected. Markets repricing rate cut expectations.",
    assets: ["USD", "SPX", "XAUUSD"]
  }
];

// ─── Icon helper ───
export function getAlertIcon(type: AlertType, size = "w-3.5 h-3.5") {
  switch (type) {
    case "News": return <AlertTriangle className={`${size} text-bearish`} />;
    case "Volatility": return <Activity className={`${size} text-caution`} />;
    case "Breakout": return <TrendingUp className={`${size} text-bullish`} />;
    case "Unusual": return <Zap className={`${size} text-ai-primary`} />;
  }
}

export function getAlertAccent(type: AlertType) {
  switch (type) {
    case "News": return "bg-bearish";
    case "Volatility": return "bg-caution";
    case "Breakout": return "bg-bullish";
    case "Unusual": return "bg-ai-primary";
  }
}

// ─── Hook: alert engine ───
export function useAlerts() {
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [criticalBanner, setCriticalBanner] = useState<SmartAlert | null>(null);

  const triggerRandomAlert = useCallback(() => {
    const template = mockAlertPool[Math.floor(Math.random() * mockAlertPool.length)];
    const newAlert: SmartAlert = {
      ...template,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
      read: false,
    };

    setAlerts(prev => [newAlert, ...prev].slice(0, 50));

    if (newAlert.priority === "critical") {
      setCriticalBanner(newAlert);
    }
  }, []);

  const dismissBanner = useCallback(() => setCriticalBanner(null), []);
  const markAllRead = useCallback(() => setAlerts(prev => prev.map(a => ({ ...a, read: true }))), []);
  const clearAll = useCallback(() => { setAlerts([]); setCriticalBanner(null); }, []);

  const unreadCount = alerts.filter(a => !a.read).length;

  useEffect(() => {
    const first = setTimeout(triggerRandomAlert, 5000);
    const interval = setInterval(triggerRandomAlert, 30000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, [triggerRandomAlert]);

  // Auto-dismiss critical banner after 6 seconds
  useEffect(() => {
    if (!criticalBanner) return;
    const timeout = setTimeout(dismissBanner, 6000);
    return () => clearTimeout(timeout);
  }, [criticalBanner, dismissBanner]);

  return { alerts, criticalBanner, dismissBanner, markAllRead, clearAll, unreadCount };
}

// ─── Critical Banner Component (iPhone-style full-width) ───
export function CriticalBanner({ alert, onDismiss }: { alert: SmartAlert | null; onDismiss: () => void }) {
  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="overflow-hidden shrink-0"
        >
          <div
            onClick={onDismiss}
            className="flex items-center gap-3 px-4 py-2 bg-bearish/[0.06] border border-bearish/20 rounded cursor-pointer hover:bg-bearish/[0.08] transition-colors relative"
          >
            {/* Left accent stripe */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-bearish rounded-l" />

            <div className="shrink-0">
              {getAlertIcon(alert.type, "w-4 h-4")}
            </div>

            <div className="flex-1 min-w-0 flex items-center gap-3">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-bearish shrink-0">
                CRITICAL
              </span>
              <span className="text-[12px] font-bold text-text-primary truncate">
                {alert.title}
              </span>
              <span className="text-[11px] text-text-secondary truncate hidden md:inline">
                {alert.explanation}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex gap-1">
                {alert.assets.slice(0, 3).map((asset, i) => (
                  <span key={i} className="text-[8px] uppercase font-bold text-text-secondary tracking-widest bg-white/[0.04] border border-card-border px-1 py-[1px] rounded">
                    {asset}
                  </span>
                ))}
              </div>
              <span className="text-[9px] text-text-muted font-mono">{alert.timestamp}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
