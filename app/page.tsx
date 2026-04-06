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

export default function Dashboard() {
  const { alerts, criticalBanner, dismissBanner, markAllRead, clearAll, unreadCount } = useAlerts();
  const [activeMarket, setActiveMarket] = useState("Global Equities");

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-[#0B0F14] text-text-primary p-3 md:p-4 gap-3 md:gap-4 max-w-[2560px] mx-auto w-full font-sans relative">
      <CriticalBanner alert={criticalBanner} onDismiss={dismissBanner} />
      <TopBar 
        alerts={alerts}
        unreadCount={unreadCount}
        onMarkAllRead={markAllRead}
        onClearAll={clearAll}
        activeMarket={activeMarket}
        setActiveMarket={setActiveMarket}
      />
      <div className="flex flex-col xl:flex-row flex-1 gap-3 md:gap-4 overflow-hidden min-h-0">
        
        {/* Left Panel - Market Data */}
        <div className="hidden xl:flex w-[320px] shrink-0 flex-col gap-3 md:gap-4 overflow-hidden min-h-0">
          <MarketOverview />
        </div>
        
        {/* Center Panel - Dominant Intelligence Area */}
        <div className="flex-1 flex flex-col gap-3 md:gap-4 overflow-hidden min-h-0 min-w-[340px] xl:min-w-[500px]">
          <MarketNarrative activeMarket={activeMarket} />
          <MarketConditions activeMarket={activeMarket} />
          
          <div className="flex-1 overflow-hidden min-h-0">
            <NewsFeed activeMarket={activeMarket} />
          </div>
          
          <div className="shrink-0 h-[120px] md:h-[150px]">
            <VolatilityTiming activeMarket={activeMarket} />
          </div>
        </div>
        
        {/* Right Panel - Insights, Setups & Risk */}
        <div className="hidden xl:flex w-[400px] shrink-0 flex-col gap-3 md:gap-4 overflow-hidden min-h-0">
          <div className="flex-[4] overflow-hidden min-h-0">
            <TradeBias activeMarket={activeMarket} />
          </div>
          <div className="flex-[3] overflow-hidden min-h-0">
            <RiskManager activeMarket={activeMarket} />
          </div>
        </div>
        
      </div>
    </div>
  );
}
