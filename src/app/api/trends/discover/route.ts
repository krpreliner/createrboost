import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

const openaiApiKey = process.env.OPENAI_API_KEY || "";
const openai = openaiApiKey && openaiApiKey !== "your_openai_api_key_here" 
  ? new OpenAI({ apiKey: openaiApiKey }) 
  : null;

function cleanJSON(text: string): string {
  let cleaned = text
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/gi, '')
    .trim();

  const firstBracket = cleaned.search(/[\[{]/);
  const lastBracket = Math.max(cleaned.lastIndexOf(']'), cleaned.lastIndexOf('}'));

  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    cleaned = cleaned.slice(firstBracket, lastBracket + 1);
  }

  return cleaned;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectToDatabase();
    
    let user = null;
    if (db && session.user.id !== "mock_user_123") {
      user = await User.findById(session.user.id);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (user.aiCredits < 1) {
        return NextResponse.json(
          { error: "Insufficient AI credits. Please upgrade your plan." },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { niche } = body;

    if (!niche || typeof niche !== 'string') {
      return NextResponse.json({ error: "Niche is required" }, { status: 400 });
    }

    const prompt = `You are a world-class YouTube strategist and viral trend analyst. The user's niche is: "${niche}".
    
Identify exactly 5 "hot" or "exploding" topics within this niche right now that would make excellent YouTube videos. 
Also, provide an overarching AI trend prediction paragraph (2-3 sentences) analyzing where this niche is heading in the next few months.

Return ONLY a valid JSON object (no markdown, no explanation) with the following structure:
{
  "prediction": "Your 2-3 sentence overarching trend prediction based on current market dynamics...",
  "trends": [
    {
      "topic": "The specific topic name",
      "growth": "+X%", // A realistic sounding growth percentage, e.g., "+350%"
      "status": "Exploding" | "Steady" | "Viral" | "Trending" | "Growing",
      "category": "A short 1-2 word category"
    },
    ... (exactly 5 items)
  ]
}`;

    // Try OpenAI first
    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 1500,
        });
        
        const text = response.choices[0].message.content || "";
        const cleanedText = cleanJSON(text);
        
        try {
          const parsedResponse = JSON.parse(cleanedText);
          if (user) {
            user.aiCredits -= 1;
            await user.save();
          }
          return NextResponse.json({ data: parsedResponse, source: "openai" });
        } catch (parseError: any) {
          console.error("JSON parse failed for openai trends. Raw text:", cleanedText.slice(0, 500));
        }
      } catch (err: any) {
        console.warn("OpenAI trends attempt failed:", err.message || err);
      }
    }

    // Try Gemini
    if (geminiApiKey && geminiApiKey !== "your_gemini_api_key_here" && genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1500,
          },
        });
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanedText = cleanJSON(text);
        
        try {
          const parsedResponse = JSON.parse(cleanedText);
          if (user) {
            user.aiCredits -= 1;
            await user.save();
          }
          return NextResponse.json({ data: parsedResponse, source: "gemini" });
        } catch (parseError: any) {
          console.error("JSON parse failed for gemini trends. Raw text:", cleanedText.slice(0, 500));
        }
      } catch (err: any) {
        console.warn("Gemini trends attempt failed:", err.message || err);
      }
    }

    // Fallback Mock Response (if quotas exceeded or no keys)
    if (user) {
      user.aiCredits -= 1;
      await user.save();
    }
    
    return NextResponse.json({ 
      data: {
        prediction: `Based on your interest in "${niche}", the algorithm predicts a surge in hyper-specific, problem-solving content. Creators who focus on deep-dive tutorials over general overviews are seeing a 3.4x higher reach. (Note: This is a mock response because AI API limits were reached).`,
        trends: [
          { topic: `Advanced ${niche} Strategies`, growth: "+450%", status: "Exploding", category: "Education" },
          { topic: `${niche} for Beginners in 2026`, growth: "+120%", status: "Steady", category: "Tutorial" },
          { topic: `The biggest mistake in ${niche}`, growth: "+310%", status: "Viral", category: "Entertainment" },
          { topic: `My journey with ${niche}`, growth: "+85%", status: "Trending", category: "Storytelling" },
          { topic: `Top tools for ${niche}`, growth: "+150%", status: "Growing", category: "Tech" },
        ]
      },
      source: "mock" 
    });

  } catch (error) {
    console.error("Trends API Error:", error);
    return NextResponse.json({ error: "Failed to generate trends" }, { status: 500 });
  }
}
