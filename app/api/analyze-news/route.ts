import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // Convert to absolute URL for Next.js server fetch
    const workerUrl = new URL("/api/ai-worker", req.url).toString();
    
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "news-analysis",
        payload
      })
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({
      summary: "AI failed",
      sentiment: "neutral",
      impact: "low",
      affected_assets: [],
      trade_bias: "wait",
      confidence: "low",
      explanation: "API error fallback"
    });
  }
}
