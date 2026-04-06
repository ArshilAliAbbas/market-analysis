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
  console.log("[Market-Narrative API] Called");

  try {
    const { newsItems } = await req.json();
    console.log("[Market-Narrative API] Items received:", newsItems?.length);

    if (!newsItems || newsItems.length === 0) {
      console.log("[Market-Narrative API] No data to process.");
      return NextResponse.json({
        narrative: "Market data is currently limited. Awaiting new inputs.",
      });
    }

    const client = getOpenAI();

    if (!client) {
      console.warn("[Market-Narrative API] OpenAI key missing");
      return NextResponse.json({
        narrative: "Market data is currently limited. Awaiting new inputs."
      });
    }

    const newsContext = newsItems
      .slice(0, 8)
      .map((n: any, i: number) => `${i + 1}. ${n.headline || n.title}: ${n.summary || n.description || ""}`)
      .join("\n");

    try {
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a professional financial analyst. Be concise, accurate, and avoid hype.",
          },
          {
            role: "user",
            content: `Summarize the current global market in 2-3 sentences.
Focus on:
- risk sentiment (risk-on / risk-off)
- USD direction
- stocks / crypto direction
Keep it simple and professional.

Current top news:
${newsContext}

Return ONLY a JSON object: { "narrative": "your summary here" }`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      });

      const raw = completion.choices[0].message.content || "{}";
      console.log("[Market-Narrative API] OpenAI raw output:", raw);
      
      const parsed = JSON.parse(raw);
      console.log("[Market-Narrative API] ✓ Narrative generated, Returning JSON");
      return NextResponse.json(parsed);
    } catch (err: any) {
      console.error("AI ERROR:", err.message || "Failed to process OpenAI request");
      return NextResponse.json({
        narrative: "Market data is currently limited. Awaiting new inputs."
      });
    }
  } catch (error: any) {
    console.error("AI ERROR:", error.message || error);
    return NextResponse.json({ error: "Failed to generate narrative" }, { status: 500 });
  }
}
