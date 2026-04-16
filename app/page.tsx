"use client";

import { useState } from "react";
import TopBar from "@/components/dashboard/TopBar";
import MarketOverview from "@/components/dashboard/MarketOverview";
import MarketNarrative from "@/components/dashboard/MarketNarrative";
import MarketConditions from "@/components/dashboard/MarketConditions";
import NewsFeed from "@/components/dashboard/NewsFeed";
import TradeBias from "@/components/dashboard/TradeBias";
import VolatilityTiming from "@/components/dashboard/VolatilityTiming";
import { useAlerts, CriticalBanner } from "@/components/dashboard/SmartAlerts";
import RiskManager from "@/components/dashboard/RiskManager";

import CurrentMarketPlay from "@/components/dashboard/CurrentMarketPlay";
import LandingPage from "@/components/landing/LandingPage";

export default function Dashboard() {
  const [showTerminal, setShowTerminal] = useState(false);
  const { alerts, criticalBanner, dismissBanner, markAllRead, clearAll, unreadCount } = useAlerts();
  const [activeMarket, setActiveMarket] = useState("Global Equities");

  if (!showTerminal) {
    return <LandingPage onOpenTerminal={() => setShowTerminal(true)} />;
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-black text-text-primary max-w-[2560px] mx-auto w-full font-sans relative">
      {/* Subtle dark ambient texture if needed, removed glowing orbs for professional look */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CgkJPHBhdGggZD0iMTAwIDBoMjB2MjBIMHoiIGZpbGw9Im5vbmUiLz4KCQk8cGF0aCBkPSJNMCAxOS41aDIwTTE5LjUgMHYtMjAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-[0.15]" />
      
      <CriticalBanner alert={criticalBanner} onDismiss={dismissBanner} />
      
      {/* Top Bar */}
      <div className="relative z-10 px-3 pt-3">
        <TopBar 
          alerts={alerts}
          unreadCount={unreadCount}
          onMarkAllRead={markAllRead}
          onClearAll={clearAll}
          activeMarket={activeMarket}
          setActiveMarket={setActiveMarket}
        />
      </div>
      
      {/* Main Grid */}
      <div className="flex flex-col xl:flex-row flex-1 gap-3 overflow-hidden min-h-0 p-3 relative z-10">
        
        {/* Left Panel - Market Data */}
        <div className="hidden xl:flex w-[320px] shrink-0 flex-col gap-3 overflow-hidden min-h-0">
          <div className="flex-[6] overflow-hidden min-h-0">
            <MarketOverview />
          </div>
          <div className="flex-[4] overflow-hidden min-h-0">
            <CurrentMarketPlay />
          </div>
        </div>
        
        {/* Center Panel - Intelligence Hub */}
        <div className="flex-1 flex flex-col gap-3 overflow-hidden min-h-0 min-w-[340px] xl:min-w-[500px]">
          <MarketNarrative activeMarket={activeMarket} />
          <MarketConditions activeMarket={activeMarket} />
          
          <div className="flex-1 overflow-hidden min-h-0">
            <NewsFeed activeMarket={activeMarket} />
          </div>
          
          <div className="shrink-0 h-[120px] md:h-[150px]">
            <VolatilityTiming activeMarket={activeMarket} />
          </div>
        </div>
        
        {/* Right Panel - Trade Execution & Risk */}
        <div className="hidden xl:flex w-[400px] shrink-0 flex-col gap-3 overflow-hidden min-h-0">
          <div className="flex-[4] overflow-hidden min-h-0">
            <TradeBias activeMarket={activeMarket} />
          </div>
          <div className="flex-[3] overflow-hidden min-h-0">
            <RiskManager />
          </div>
        </div>
        
      </div>
    </div>
  );
}
