import { NextResponse } from "next/server";

export const runtime = "edge";

type RequestType = "news-analysis" | "market-narrative" | "trade-setup" | "trade-plan";

interface RequestBody {
  type: RequestType;
  payload: any;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { type, payload } = body;

    let prompt = "";

    if (type === "news-analysis") {
      prompt = `
Return ONLY JSON:

{
  "summary": "concise, high-signal summary",
  "sentiment": "bullish | bearish | neutral",
  "impact": "high | medium | low",
  "affected_assets": ["specific tickers or pairs"],
  "trade_bias": "buy | sell | wait",
  "confidence": "low | medium | high",
  "explanation": "clear reasoning referencing macro, liquidity, or sentiment"
}

Rules:
- Be decisive
- No vague language
- Mention WHY market moves
- Think like a hedge fund analyst

News:
${JSON.stringify(payload)}
`;
    } else if (type === "market-narrative") {
      prompt = `
Return ONLY JSON:

{
  "market_summary": "tight paragraph explaining current conditions",
  "sentiment": "bullish | bearish | neutral",
  "key_drivers": ["interest rates", "inflation", "etc"],
  "risk_factors": ["geopolitics", "liquidity risk"],
  "opportunities": ["specific setups or sectors"]
}

Rules:
- Focus on macro + flows
- No fluff

Data:
${JSON.stringify(payload)}
`;
    } else if (type === "trade-setup" || type === "trade-plan") {
      prompt = `
Return ONLY valid JSON.
Do NOT include markdown.
Do NOT include explanations outside JSON.

{
  "primary": {
    "direction": "buy | sell",
    "entry": "...",
    "stop_loss": "...",
    "take_profit": "...",
    "confidence": "low | medium | high",
    "reasoning": "..."
  },
  "alternate": {
    "direction": "buy | sell",
    "entry": "...",
    "stop_loss": "...",
    "take_profit": "...",
    "confidence": "low | medium | high",
    "reasoning": "..."
  },
  "breakdown": {
    "direction": "buy | sell",
    "entry": "...",
    "stop_loss": "...",
    "take_profit": "...",
    "confidence": "low | medium | high",
    "reasoning": "..."
  },
  "key_levels": {
    "resistance": ["...", "..."],
    "support": ["...", "..."],
    "liquidity": ["...", "..."]
  }
}

Rules:
- Be decisive
- Use real trading logic (structure, liquidity, momentum)
- Avoid generic statements

Data:
${JSON.stringify(payload)}
`;
    }

    const accountId = process.env.CF_ACCOUNT_ID;
    const apiToken = process.env.CF_API_TOKEN;

    if (!accountId || !apiToken) {
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

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3-8b-instruct`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a financial analyst AI. Respond ONLY with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
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

    const data = await response.json();

    const raw =
      data?.result?.response ||
      data?.result?.output_text ||
      "";

    console.log("RAW AI RESPONSE:", raw);

    let parsed;

    try {
      let cleaned = raw
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      
      parsed = JSON.parse(cleaned);

      if (type === "trade-setup" || type === "trade-plan") {
        if (parsed.primary) {
          parsed = {
            primary: parsed.primary,
            alternate: parsed.alternate || null,
            breakdown: parsed.breakdown || null,
            key_levels: parsed.key_levels || { resistance: [], support: [], liquidity: [] }
          };
        } else {
          parsed = {
            primary: parsed,
            alternate: null,
            breakdown: null,
            key_levels: { resistance: [], support: [], liquidity: [] }
          };
        }
      }
    } catch (e) {
      console.error("PARSE FAILED:", raw);

      if (type === "trade-setup" || type === "trade-plan") {
        parsed = {
          primary: { direction: "-", entry: "-", stop_loss: "-", take_profit: "-", confidence: "low", reasoning: raw || "Fallback used due to AI failure" },
          alternate: { direction: "-", entry: "-", stop_loss: "-", take_profit: "-", confidence: "low", reasoning: "Fallback used" },
          breakdown: { direction: "-", entry: "-", stop_loss: "-", take_profit: "-", confidence: "low", reasoning: "Fallback used" },
          key_levels: { resistance: [], support: [], liquidity: [] }
        };
      } else {
        parsed = {
          summary: raw || "No response",
          sentiment: "neutral",
          impact: "low",
          affected_assets: [],
          trade_bias: "wait",
          confidence: "low",
          explanation: "Fallback used"
        };
      }
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI WORKER ERROR:", error);
    return NextResponse.json({
      summary: "AI failed",
      sentiment: "neutral",
      impact: "low",
      affected_assets: [],
      trade_bias: "wait",
      confidence: "low",
      explanation: "API error fallback",
      primary: { direction: "-", entry: "-", stop_loss: "-", take_profit: "-", confidence: "low", reasoning: "Fallback used" }
    });
  }
}
