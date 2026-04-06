// ═══════════════════════════════════════════════════════════════
// Market Pulse AI — Frontend API Service Layer
// All calls hit Next.js API routes (/api/*), never external APIs directly
// ═══════════════════════════════════════════════════════════════

const BASE = ""; // Same origin — Next.js API routes

// ─── Helper ───
async function safeFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${url}`, {
      ...options,
      cache: "no-store",
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      console.error(`[API] ${url} failed (${res.status}):`, errorBody);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`[API] ${url} exception:`, error);
    return null;
  }
}

// ─── Market Data (refresh: 5-10s) ───
export async function getMarketData() {
  return safeFetch<any[]>("/api/market");
}

// ─── News Feed (refresh: 30-60s) ───
export async function getNews() {
  return safeFetch<any[]>("/api/news");
}

// ─── Economic Calendar (refresh: 5min) ───
export async function getEconomicEvents() {
  return safeFetch<any[]>("/api/economic");
}

// ─── AI: Analyze a single news item ───
export async function analyzeNewsWithAI(
  headline: string,
  description: string,
  symbols: string[] = []
) {
  return safeFetch<{
    summary: string;
    sentiment: string;
    impact: string;
    affected_assets: string[];
    explanation: string;
    trade_bias: string;
  }>("/api/analyze-news", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ headline, description, symbols }),
  });
}

// ─── AI: Generate market narrative from news ───
export async function generateMarketNarrative(newsItems: any[]) {
  return safeFetch<{ narrative: string }>("/api/market-narrative", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newsItems }),
  });
}
