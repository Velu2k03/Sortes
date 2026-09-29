import { NextResponse } from "next/server";
import OpenAI from "openai";
import { serverEnv } from "@/lib/env";

interface ReadingRequest {
  spreadType: "single" | "three-card";
  cards: { name: string; position?: string; reversed?: boolean }[];
  question?: string;
}

export async function POST(req: Request) {
  try {
    const { spreadType, cards, question } = (await req.json()) as ReadingRequest;
    const env = serverEnv();
    
    if (!env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OpenRouter API Key is not configured." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: env.OPENROUTER_API_KEY,
    });

    const systemPrompt = `You are an expert Tarot reader. You provide insightful, psychological, and mystical interpretations of Tarot spreads. Be concise, empathetic, and profound. Format your response in clean Markdown.`;
    
    let prompt = "";
    if (spreadType === "single") {
      prompt = `The user drew a single card: **${cards[0].name}** ${cards[0].reversed ? "(Reversed)" : "(Upright)"}.`;
      if (question) prompt += ` Their question or focus was: "${question}".`;
      prompt += `\nPlease provide a clear, insightful interpretation of this card in this context.`;
    } else {
      prompt = `The user drew a 3-card spread (Past, Present, Future).
1. Past: **${cards[0].name}** ${cards[0].reversed ? "(Reversed)" : "(Upright)"}
2. Present: **${cards[1].name}** ${cards[1].reversed ? "(Reversed)" : "(Upright)"}
3. Future: **${cards[2].name}** ${cards[2].reversed ? "(Reversed)" : "(Upright)"}
`;
      if (question) prompt += ` Their question or focus was: "${question}".`;
      prompt += `\nPlease provide an insightful narrative reading weaving these cards together.`;
    }

    const response = await openai.chat.completions.create({
      model: env.OPENROUTER_MODELS?.[0] || "google/gemini-2.5-flash:free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const text = response.choices[0]?.message?.content || "No interpretation generated.";

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Reading generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate reading from OpenRouter." },
      { status: 500 }
    );
  }
}
