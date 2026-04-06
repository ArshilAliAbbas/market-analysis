import { NextResponse } from "next/server";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;
const NEWS_KEY = process.env.NEWS_API_KEY;

export async function GET() {
  console.log("[News API] Called");

  // ─── Try Finnhub first ───
  try {
    if (FINNHUB_KEY && FINNHUB_KEY !== "YOUR_FINNHUB_KEY") {
      const res = await fetch(
        `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_KEY}`,
        { next: { revalidate: 0 } }
      );

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          console.log("[News API] ✓ Finnhub returned", data.length, "articles — slicing to 10");
          return NextResponse.json(data.slice(0, 10));
        }
        console.warn("[News API] Finnhub returned empty array, falling back to NewsAPI");
      } else {
        console.warn("[News API] Finnhub responded with", res.status, "— falling back to NewsAPI");
      }
    } else {
      console.warn("[News API] FINNHUB_API_KEY missing — skipping Finnhub");
    }
  } catch (e) {
    console.error("[News API] Finnhub exception:", e);
  }

  // ─── Fallback: NewsAPI ───
  try {
    if (!NEWS_KEY || NEWS_KEY === "YOUR_NEWSAPI_KEY") {
      console.warn("[News API] ⚠ NEWS_API_KEY is missing or placeholder");
      return NextResponse.json(
        { error: "Both FINNHUB_API_KEY and NEWS_API_KEY are unavailable" },
        { status: 503 }
      );
    }

    const fallbackRes = await fetch(
      `https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=10&apiKey=${NEWS_KEY}`,
      { next: { revalidate: 0 } }
    );

    if (!fallbackRes.ok) {
      throw new Error(`NewsAPI responded ${fallbackRes.status}`);
    }

    const fallbackData = await fallbackRes.json();

    const formattedData = (fallbackData.articles || []).map((article: any) => ({
      headline: article.title || "Untitled",
      summary: article.description || "",
      url: article.url || "",
      source: article.source?.name || "Unknown",
      datetime: article.publishedAt
        ? Math.floor(new Date(article.publishedAt).getTime() / 1000)
        : Math.floor(Date.now() / 1000),
      image: article.urlToImage || "",
    }));

    console.log("[News API] ✓ NewsAPI fallback returned", formattedData.length, "articles");
    return NextResponse.json(formattedData.slice(0, 10));
  } catch (error) {
    console.error("[News API] All sources failed:", error);
    return NextResponse.json({ error: "Failed to fetch news data" }, { status: 500 });
  }
}
