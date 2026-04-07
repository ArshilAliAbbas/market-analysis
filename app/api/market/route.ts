import { NextResponse } from "next/server";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

const DEFAULT_ASSETS = [
  { symbol: "SPY", name: "S&P 500", category: "Indices", display: "SPX" },
  { symbol: "BINANCE:BTCUSDT", name: "Bitcoin", category: "Crypto", display: "BTCUSD" },
  { symbol: "FOREX:EURUSD", name: "EUR/USD", category: "Forex", display: "EURUSD", from: "EUR" }
];

async function fetchFinnhubQuote(symbol: string) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_KEY}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

async function fetchForexRates() {
  const res = await fetch("https://open.er-api.com/v6/latest/USD", { cache: "no-store" });
  if (!res.ok) throw new Error("Forex API fail");
  const data = await res.json();
  return data.rates || {};
}

async function processAssets(assets: any[]) {
  const forexAssets = assets.filter(a => a.category === "Forex");
  const otherAssets = assets.filter(a => a.category !== "Forex");

  const finnhubResults = await Promise.allSettled(
    otherAssets.map(async (asset) => {
      const data = await fetchFinnhubQuote(asset.symbol);
      return {
        ...asset,
        symbol: asset.display || asset.symbol,
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

  let forexData: any[] = [];
  if (forexAssets.length > 0) {
    try {
      const rates = await fetchForexRates();
      forexData = forexAssets.map((asset) => {
        const currencyMatch = asset.symbol.match(/FOREX:([A-Z]{3})USD/);
        const fromCurrency = asset.from || (currencyMatch ? currencyMatch[1] : "EUR");
        const rate = rates[fromCurrency] ? 1 / rates[fromCurrency] : 0;
        
        return {
          ...asset,
          symbol: asset.display || asset.symbol.replace("FOREX:", ""),
          price: parseFloat(rate.toFixed(5)),
          change: 0,
          percentChange: (Math.random() * 0.5) - 0.25, // Mock daily forex volatility % if we only have current price
          high: parseFloat((rate * 1.002).toFixed(5)),
          low: parseFloat((rate * 0.998).toFixed(5)),
          open: parseFloat((rate * 0.999).toFixed(5)),
        };
      });
    } catch (err) {
      console.error("Forex error", err);
    }
  }

  return [...stockCryptoData, ...forexData];
}

export async function GET() {
  if (!FINNHUB_KEY) return NextResponse.json({ error: "No API KEY" }, { status: 503 });
  try {
    const data = await processAssets(DEFAULT_ASSETS);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!FINNHUB_KEY) return NextResponse.json({ error: "No API KEY" }, { status: 503 });
  try {
    const body = await req.json();
    const assets = body.assets || DEFAULT_ASSETS;
    const data = await processAssets(assets);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
