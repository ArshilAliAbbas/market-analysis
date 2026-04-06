import { NextResponse } from "next/server";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

// ─── Asset Configuration ───
// Finnhub free tier supports US stocks and crypto via BINANCE exchange
// Forex is fetched separately from a free exchange rate API
const STOCK_CRYPTO_ASSETS = [
  { symbol: "SPY",             name: "S&P 500",   category: "Indices", display: "SPX" },
  { symbol: "QQQ",             name: "Nasdaq 100", category: "Indices", display: "NDX" },
  { symbol: "BINANCE:BTCUSDT", name: "Bitcoin",    category: "Crypto",  display: "BTCUSD" },
  { symbol: "BINANCE:ETHUSDT", name: "Ethereum",   category: "Crypto",  display: "ETHUSD" },
];

const FOREX_PAIRS = [
  { from: "EUR", to: "USD", name: "EUR/USD", display: "EURUSD" },
  { from: "GBP", to: "USD", name: "GBP/USD", display: "GBPUSD" },
];

// Fetch a single Finnhub quote
async function fetchFinnhubQuote(symbol: string) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_KEY}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

// Fetch forex rates from free API (exchangerate-api or open.er-api)
async function fetchForexRates(): Promise<any[]> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", { cache: "no-store" });
    if (!res.ok) throw new Error(`Forex API returned ${res.status}`);
    const data = await res.json();
    const rates = data.rates || {};

    return FOREX_PAIRS.map((pair) => {
      // The API returns rates relative to USD, so EUR rate = 1/rates.EUR
      const rate = rates[pair.from] ? 1 / rates[pair.from] : 0;
      return {
        symbol: pair.display,
        name: pair.name,
        category: "Forex",
        price: parseFloat(rate.toFixed(5)),
        change: 0,
        percentChange: 0,
        high: parseFloat(rate.toFixed(5)),
        low: parseFloat(rate.toFixed(5)),
        open: parseFloat(rate.toFixed(5)),
        prevClose: parseFloat(rate.toFixed(5)),
      };
    });
  } catch (e) {
    console.error("[Market API] Forex fetch failed:", e);
    return [];
  }
}

export async function GET() {
  console.log("[Market API] Called — fetching", STOCK_CRYPTO_ASSETS.length, "assets + forex");

  if (!FINNHUB_KEY || FINNHUB_KEY === "YOUR_FINNHUB_KEY") {
    console.warn("[Market API] ⚠ FINNHUB_API_KEY not configured");
    return NextResponse.json(
      { error: "FINNHUB_API_KEY not configured. Add it to .env" },
      { status: 503 }
    );
  }

  try {
    // Fetch stocks + crypto from Finnhub
    const finnhubResults = await Promise.allSettled(
      STOCK_CRYPTO_ASSETS.map(async (asset) => {
        const data = await fetchFinnhubQuote(asset.symbol);

        if (!data || data.c === 0) {
          console.warn(`[Market API] Zero/null data for ${asset.symbol}`);
        }

        return {
          symbol: asset.display || asset.symbol,
          name: asset.name,
          category: asset.category,
          price: data.c ?? 0,
          change: data.d ?? 0,
          percentChange: data.dp ?? 0,
          high: data.h ?? 0,
          low: data.l ?? 0,
          open: data.o ?? 0,
          prevClose: data.pc ?? 0,
        };
      })
    );

    const stockCryptoData = finnhubResults
      .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
      .map((r) => r.value);

    // Fetch forex rates from free API
    const forexData = await fetchForexRates();

    // Combine: Indices first, then Forex, then Crypto
    const allData = [
      ...stockCryptoData.filter((a) => a.category === "Indices"),
      ...forexData,
      ...stockCryptoData.filter((a) => a.category === "Crypto"),
    ];

    const failed = finnhubResults.filter((r) => r.status === "rejected").length;
    if (failed > 0) {
      console.warn(`[Market API] ${failed}/${STOCK_CRYPTO_ASSETS.length} Finnhub assets failed`);
    }

    console.log("[Market API] ✓ Returning", allData.length, "total assets");
    return NextResponse.json(allData);
  } catch (error) {
    console.error("[Market API] Critical error:", error);
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}
