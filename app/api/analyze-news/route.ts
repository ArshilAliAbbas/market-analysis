import { NextResponse } from "next/server";
import OpenAI from "openai";

let openai: OpenAI | null = null;

function getOpenAI(): OpenAI | null {
  if (openai) return openai;
  
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.error("AI ERROR:", "process.env.OPENAI_API_KEY is missing");
    return null;
  }
  
  if (key === "YOUR_OPENAI_KEY" || key.includes("PASTE_YOUR")) return null;
  
  openai = new OpenAI({ apiKey: key });
  return openai;
}

export async function POST(req: Request) {
  console.log("[Analyze-News API] Called");

  try {
    const { headline, description, symbols } = await req.json();
    console.log("[Analyze-News API] Request payload:", { headline, description, symbols });

    if (!headline) {
      return NextResponse.json({ error: "Missing headline" }, { status: 400 });
    }

    const client = getOpenAI();

    if (!client) {
      console.warn("[Analyze-News API] OpenAI key missing");
      return NextResponse.json({
        summary: "No AI insight available",
        sentiment: "neutral",
        impact: "low",
        affected_assets: [],
        explanation: "AI processing unavailable",
        trade_bias: "neutral",
        confidence: 0
      });
    }

    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a professional macro trader and market analyst.

You analyze financial news in terms of:
- liquidity
- interest rates
- risk sentiment (risk-on / risk-off)
- institutional behavior

You DO NOT give hype or generic explanations.
You speak like a real trader.`
          },
          {
            role: "user",
            content: `Analyze this news:

TITLE: ${headline}
DESCRIPTION: ${description || "No description provided"}

Return ONLY JSON:

{
  "summary": "clear, simple explanation",
  "sentiment": "bullish | bearish | neutral",
  "impact": "high | medium | low",
  "affected_assets": ["USD", "Gold", "Stocks"],
  "explanation": "explain WHY this moves the market (macro reasoning)",
  "trade_bias": "long | short | neutral",
  "confidence": 0-100
}`
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const raw = completion.choices[0].message.content || "{}";
      console.log("[Analyze-News API] OpenAI raw output:", raw);
      
      const parsed = JSON.parse(raw);
      console.log("[Analyze-News API] ✓ AI analysis complete, Returning JSON");
      return NextResponse.json(parsed);
    } catch (err: any) {
      console.error("AI ERROR:", err.message || "Failed to process OpenAI request");
      return NextResponse.json({
        summary: "No AI insight available",
        sentiment: "neutral",
        impact: "low",
        affected_assets: [],
        explanation: "AI processing unavailable",
        trade_bias: "neutral",
        confidence: 0
      });
    }
  } catch (error: any) {
    console.error("AI ERROR:", error.message || error);
    return NextResponse.json({ error: "Failed to analyze news" }, { status: 500 });
  }
}
