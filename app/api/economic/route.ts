import { NextResponse } from "next/server";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

export async function GET() {
  console.log("[Economic API] Called");

  // ─── Try Finnhub (requires paid plan) ───
  if (FINNHUB_KEY && FINNHUB_KEY !== "YOUR_FINNHUB_KEY") {
    try {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const from = today.toISOString().slice(0, 10);
      const to = nextWeek.toISOString().slice(0, 10);

      const res = await fetch(
        `https://finnhub.io/api/v1/calendar/economic?from=${from}&to=${to}&token=${FINNHUB_KEY}`,
        { cache: "no-store" }
      );

      if (res.ok) {
        const data = await res.json();
        const events = data.economicCalendar || [];
        if (events.length > 0) {
          console.log("[Economic API] ✓ Finnhub returned", events.length, "events");
          return NextResponse.json(events);
        }
      } else {
        console.warn("[Economic API] Finnhub returned", res.status, "— likely requires paid plan");
      }
    } catch (e) {
      console.error("[Economic API] Finnhub fetch error:", e);
    }
  }

  // ─── Fallback: curated economic calendar ───
  // When Finnhub paid plan isn't available, provide a realistic set of
  // upcoming high-impact macro events based on the typical weekly schedule
  console.log("[Economic API] Using curated event fallback");

  const now = new Date();
  const makeTime = (daysFromNow: number, hour: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hour, 30, 0, 0);
    return d.toISOString();
  };

  const fallbackEvents = [
    {
      event: "US CPI (YoY)",
      time: makeTime(1, 8),
      country: "US",
      impact: "high",
      estimate: "3.1%",
      actual: null,
      unit: "%",
    },
    {
      event: "FOMC Meeting Minutes",
      time: makeTime(2, 14),
      country: "US",
      impact: "high",
      estimate: null,
      actual: null,
      unit: "",
    },
    {
      event: "UK GDP (MoM)",
      time: makeTime(2, 2),
      country: "GB",
      impact: "medium",
      estimate: "0.2%",
      actual: null,
      unit: "%",
    },
    {
      event: "US Initial Jobless Claims",
      time: makeTime(3, 8),
      country: "US",
      impact: "medium",
      estimate: "220K",
      actual: null,
      unit: "K",
    },
    {
      event: "ECB Interest Rate Decision",
      time: makeTime(4, 7),
      country: "EU",
      impact: "high",
      estimate: "4.25%",
      actual: null,
      unit: "%",
    },
    {
      event: "US PPI (MoM)",
      time: makeTime(4, 8),
      country: "US",
      impact: "medium",
      estimate: "0.3%",
      actual: null,
      unit: "%",
    },
    {
      event: "US Retail Sales (MoM)",
      time: makeTime(5, 8),
      country: "US",
      impact: "high",
      estimate: "0.4%",
      actual: null,
      unit: "%",
    },
    {
      event: "US Michigan Consumer Sentiment",
      time: makeTime(5, 10),
      country: "US",
      impact: "medium",
      estimate: "77.2",
      actual: null,
      unit: "",
    },
  ];

  return NextResponse.json(fallbackEvents);
}
