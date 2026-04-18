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
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-background text-text-primary max-w-[2560px] mx-auto w-full font-mono relative">
      {/* Axiom Terminal Effects */}
      <div className="axiom-scanlines" />
      
      {/* Subtle digital grid backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_70%)]" />
      
      {/* Critical Alerts - High visual priority */}
      <div className="fixed top-0 inset-x-0 z-[160] p-3 pointer-events-none">
        <div className="max-w-[1400px] mx-auto pointer-events-auto">
          <CriticalBanner alert={criticalBanner} onDismiss={dismissBanner} />
        </div>
      </div>
      
      {/* Top Bar */}
      <div className="relative z-[150] px-3 pt-3">
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
