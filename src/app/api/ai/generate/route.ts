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
  // Remove markdown code blocks
  let cleaned = text
    .replace(/```json\n?/gi, '')
    .replace(/```\n?/gi, '')
    .trim();

  // Find the first [ or { and last ] or }
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
    
    // MOCK MODE: If DB is down or it's a mock user, skip credit checks to allow testing
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
    const { tool, params } = body;

    const modelNames = ["gemini-2.5-flash", "gemini-2.0-flash"];
    let model = null;
    
    // Try to get a valid model (we'll use the first one that doesn't 404 in the actual call)
    if (genAI) {
      model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      });
    }

    let prompt = "";
    let imageData: { base64: string, mimeType: string } | null = null;

    if (params.image) {
      // Basic mime type detection based on base64 magic bytes
      let mimeType = "image/jpeg";
      if (params.image.startsWith("iVBORw0KGgo")) mimeType = "image/png";
      else if (params.image.startsWith("UklGR")) mimeType = "image/webp";
      
      imageData = {
        base64: params.image,
        mimeType
      };
    }

    switch (tool) {
      case "ideas":
        prompt = `You are a world-class viral content strategist who has helped 1000+ creators grow to millions of followers.

Generate exactly 10 highly viral and specific content ideas for the niche: "${params.niche}" on platform: "${params.platform}".

For each idea:
- Make the title punchy, specific, and scroll-stopping (not generic)
- Include real numbers, timeframes, or shocking facts when possible
- The description should be 2-3 sentences explaining the hook, content structure, and why it will go viral
- Assign the most fitting category

Return ONLY a valid JSON array (no markdown, no explanation) with exactly 10 objects, each having:
- "title": string (the video/post title, 8-15 words, specific and compelling)
- "category": string (one of: "Educational", "Entertainment", "Trending", "Personal Branding")
- "description": string (2-3 sentences on content strategy and viral potential)
- "estimatedViralScore": number (1-100, how viral this idea is likely to be)

Example format:
[{"title":"...","category":"...","description":"...","estimatedViralScore":87}]`;
        break;

      case "hooks":
        prompt = `You are an elite copywriter and behavioral psychologist who specializes in creating video hooks that stop the scroll.

Generate exactly 8 different high-retention hooks for a ${params.platform} video about: "${params.topic}".

Each hook must:
- Be under 15 words (for shorts/reels) or 20 words (for long-form YouTube)
- Trigger a specific psychological response
- Create an irresistible urge to keep watching
- Be completely unique from the others (use different structures)

Use these hook structures (mix them up):
1. Bold claim/counter-intuitive statement
2. "I did X for Y days and here's what happened"
3. Question that creates curiosity gap
4. Shocking statistic or number
5. Direct address ("You are doing X wrong")
6. Story opener ("The day I lost everything...")
7. Promise of transformation
8. Controversy/debate starter

Return ONLY a valid JSON array (no markdown, no explanation) with exactly 8 objects:
- "hookText": string (the actual hook, ready to use as-is)
- "psychologyTrigger": string (the specific psychological principle used, e.g. "Pattern Interrupt", "Loss Aversion", "Social Proof")
- "hookType": string (the structure type, e.g. "Curiosity Gap", "Bold Claim", "Story Opener")
- "platformFit": string ("Best for Shorts/Reels" or "Best for Long-form" or "Works on Both")`;
        break;

      case "script":
        const wordCountMap: Record<string, string> = {
          'youtube': '800-1000 words (8-10 minute video)',
          'shorts': '60-80 words (60 second short)',
          'reels': '60-80 words (30-60 second reel)',
          'tiktok': '100-150 words (60-90 second video)',
        };
        const wordCount = wordCountMap[params.platform] || '300-500 words';

        prompt = `You are a professional YouTube scriptwriter and content creator with 10+ years of experience writing scripts for channels with millions of subscribers.

Write a complete, ready-to-film ${params.platform} script about: "${params.topic}" with a "${params.tone}" tone.

The script must:
- Be ${wordCount} long
- Have a killer hook in the first 3 seconds that prevents skipping
- Include natural transitions between sections
- Have a strong call-to-action at the end
- Sound natural and conversational, not robotic
- Include [PAUSE], [EMPHASIZE], [B-ROLL CUE] and other production notes in brackets

Script structure:
[HOOK] - First 3-5 seconds (stop the scroll)
[INTRO] - Brief intro (max 15 seconds)
[SECTION 1] - First main point with example
[SECTION 2] - Second main point with example  
[SECTION 3] - Third main point with example (for longer videos)
[TRANSITION] - Smooth connection between points
[CTA] - Strong call-to-action

Return ONLY a valid JSON object (no markdown) with:
- "scriptText": string (the full complete script with section labels and production notes)
- "estimatedDuration": string (e.g. "8-10 minutes" or "45-60 seconds")
- "keyPoints": array of strings (3-5 main talking points)
- "thumbnailIdeas": array of strings (3 thumbnail concepts that would get high CTR)`;
        break;

      case "thumbnail":
        if (imageData) {
          prompt = `You are an expert YouTube thumbnail designer, visual psychologist, and click-through rate (CTR) specialist. Analyze the attached video thumbnail image alongside its title: "${params.title}".

Provide a detailed visual and textual analysis including:
1. A predicted CTR score (1-100) based on visual contrast, emotional expression, text readability, and title synergy.
2. A brief analysis of how well the visual design and title work together.
3. 3-5 specific strengths of the visual design and title.
4. 3-5 specific improvements to make the image more clickable (e.g. adjust brightness, make text larger, change facial expression).
5. 3 optimized title alternatives that better match the visual vibe.

Return ONLY a valid JSON object with:
- "ctrScore": number
- "analysis": string
- "strengths": string[]
- "improvements": string[]
- "betterTitles": string[]`;
        } else {
          prompt = `You are an expert YouTube thumbnail designer and click-through rate (CTR) specialist. Analyze the following video title: "${params.title}".

Provide a detailed analysis including:
1. A predicted CTR score (1-100).
2. A brief analysis of why this title works or doesn't work.
3. 3-5 specific strengths of the title.
4. 3-5 specific improvements to make it more clickable.
5. 3 optimized title alternatives.

Return ONLY a valid JSON object with:
- "ctrScore": number
- "analysis": string
- "strengths": string[]
- "improvements": string[]
- "betterTitles": string[]`;
        }
        break;

      default:
        return NextResponse.json({ error: "Invalid tool specified" }, { status: 400 });
    }

    // Make live API calls
    const finalPrompt = prompt + "\n\nIMPORTANT: Return ONLY a valid JSON structure. No markdown formatting, no code blocks, no other text.";
    
    // Try OpenAI first if available
    if (openai) {
      try {
        const messages: any[] = [{ role: "user", content: finalPrompt }];
        
        if (imageData) {
           messages[0].content = [
             { type: "text", text: finalPrompt },
             { type: "image_url", image_url: { url: `data:${imageData.mimeType};base64,${imageData.base64}` } }
           ];
        }

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages,
          temperature: 0.9,
          max_tokens: 4000,
        });
        
        const text = response.choices[0].message.content || "";
        const cleanedText = cleanJSON(text);
        
        try {
          const parsedResponse = JSON.parse(cleanedText);
          if (user) {
            user.aiCredits -= 1;
            await user.save();
          }
          return NextResponse.json({ data: parsedResponse, source: "openai", model: "gpt-4o" });
        } catch (parseError: any) {
          console.error("JSON parse failed for openai. Raw text:", cleanedText.slice(0, 500));
          // Fall back to Gemini
        }
      } catch (err: any) {
        console.warn("OpenAI attempt failed:", err.message || err);
        // Fall back to Gemini if OpenAI fails
      }
    }

    // Try Gemini
    if (geminiApiKey && geminiApiKey !== "your_gemini_api_key_here" && genAI) {
      let lastError: any = null;
      
      for (const modelName of modelNames) {
        try {
          const currentModel = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0.9,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            },
          });
          
          let result;
          if (imageData) {
            result = await currentModel.generateContent([
              finalPrompt,
              { inlineData: { data: imageData.base64, mimeType: imageData.mimeType } }
            ]);
          } else {
            result = await currentModel.generateContent(finalPrompt);
          }

          const text = result.response.text();
          const cleanedText = cleanJSON(text);
          
          try {
            const parsedResponse = JSON.parse(cleanedText);
            if (user) {
              user.aiCredits -= 1;
              await user.save();
            }
            return NextResponse.json({ data: parsedResponse, source: "gemini", model: modelName });
          } catch (parseError: any) {
            console.error(`JSON parse failed for ${modelName}. Raw text:`, cleanedText.slice(0, 500));
            return NextResponse.json({ error: "AI returned invalid format. Please try again." }, { status: 500 });
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Attempt with ${modelName} failed:`, err.message || err);
          if (err.status === 400 || err.status === 403 || err.message?.includes('API key')) {
             break;
          }
        }
      }
      
      console.error("All Gemini model attempts failed:", lastError?.message || lastError);
      if (!openai) {
        return NextResponse.json({ 
          error: `AI call failed: ${lastError?.message || "Unknown error"}. Check your API key and region.`,
          details: lastError?.message
        }, { status: 500 });
      }
    }

    // If both failed or are missing keys, it falls through to the mock response
    if (openai || (geminiApiKey && geminiApiKey !== "your_gemini_api_key_here")) {
       return NextResponse.json({ error: "All AI providers failed to generate content." }, { status: 500 });
    }

    // Rich fallback mock data
    let mockResponse;
    if (tool === "ideas") {
      mockResponse = [
        { title: `I tested every ${params.niche} strategy for 90 days — here are the results`, category: "Personal Branding", description: "Document a real experiment testing multiple approaches. Viewers love data-backed, honest results. High shareability due to unique personal experience.", estimatedViralScore: 92 },
        { title: `The ${params.niche} mistake that cost me $10,000 (and how to avoid it)`, category: "Educational", description: "Vulnerability-based storytelling with a strong lesson. The financial hook combined with personal failure creates emotional investment immediately.", estimatedViralScore: 88 },
        { title: `5 ${params.niche} secrets the experts don't want you to know`, category: "Trending", description: "Insider knowledge framing creates curiosity and urgency. Works on every platform. Pair with a direct-to-camera hook to maximize watch time.", estimatedViralScore: 85 },
        { title: `How I went from 0 to 10,000 in ${params.niche} in 6 months`, category: "Personal Branding", description: "Transformation stories are evergreen viral content. Shows a relatable starting point and aspirational outcome. Great for gaining followers.", estimatedViralScore: 90 },
        { title: `Why everything you know about ${params.niche} is wrong`, category: "Entertainment", description: "Counter-intuitive content gets shared heavily because it disrupts existing beliefs. Great for debate in comments which boosts the algorithm.", estimatedViralScore: 87 },
        { title: `Beginners guide to ${params.niche} that nobody shares`, category: "Educational", description: "Filling a gap in easily accessible knowledge. The exclusivity framing ('that nobody shares') creates intrigue and higher click-through rates.", estimatedViralScore: 82 },
        { title: `I asked 100 ${params.niche} experts the same question — here's what they said`, category: "Trending", description: "Research-based content builds authority and generates discussion. The large sample size adds credibility and makes content more shareable.", estimatedViralScore: 86 },
        { title: `${params.niche} in 2026: What's changing and how to prepare`, category: "Trending", description: "Future-focused content always drives massive views because everyone wants to stay ahead. Position yourself as a thought leader in your space.", estimatedViralScore: 84 },
        { title: `A day in my life as a ${params.niche} creator (raw and unfiltered)`, category: "Entertainment", description: "Authenticity-driven vlog content builds parasocial relationships. 'Raw and unfiltered' framing sets expectations of honest, relatable content.", estimatedViralScore: 78 },
        { title: `The ${params.niche} tool I use daily that changed everything`, category: "Educational", description: "Product/tool recommendations with a personal endorsement angle. High affiliate potential and evergreen search traffic from interested viewers.", estimatedViralScore: 80 },
      ];
    } else if (tool === "hooks") {
      mockResponse = [
        { hookText: `I wasted 2 years on ${params.topic} until I discovered this one thing.`, psychologyTrigger: "Loss Aversion + Curiosity Gap", hookType: "Story Opener", platformFit: "Works on Both" },
        { hookText: `Stop. If you're doing ${params.topic}, you're probably doing it completely wrong.`, psychologyTrigger: "Pattern Interrupt + Fear", hookType: "Bold Claim", platformFit: "Best for Shorts/Reels" },
        { hookText: `What if everything you know about ${params.topic} is a lie?`, psychologyTrigger: "Cognitive Dissonance", hookType: "Controversy Starter", platformFit: "Best for Long-form" },
        { hookText: `In the next 60 seconds, I'll show you the ${params.topic} trick that took me 3 years to learn.`, psychologyTrigger: "Time Pressure + Authority", hookType: "Promise of Transformation", platformFit: "Best for Shorts/Reels" },
        { hookText: `Nobody talks about this ${params.topic} strategy. It's the reason I grew 10x faster.`, psychologyTrigger: "Exclusivity + Social Proof", hookType: "Insider Secret", platformFit: "Works on Both" },
        { hookText: `The #1 mistake people make with ${params.topic} — and how to fix it today.`, psychologyTrigger: "Problem Awareness + Solution", hookType: "Direct Address", platformFit: "Works on Both" },
        { hookText: `I did ${params.topic} every day for 30 days. Here's what nobody expected.`, psychologyTrigger: "Anticipation + Curiosity", hookType: "Challenge/Experiment", platformFit: "Best for Long-form" },
        { hookText: `This ${params.topic} method is so simple it feels illegal. But it works.`, psychologyTrigger: "Intrigue + Humor", hookType: "Bold Claim", platformFit: "Best for Shorts/Reels" },
      ];
    } else if (tool === "script") {
      mockResponse = {
        scriptText: `[HOOK] 
Are you still struggling with ${params.topic}? [PAUSE] Because in the next few minutes, I'm going to show you exactly why — and how to fix it permanently.

[INTRO]
Hey, what's up everyone! Today we're diving deep into ${params.topic}. I've spent months testing this, made every mistake in the book, and now I'm giving you the shortcut I wish I had. Let's get into it.

[SECTION 1 — The Problem]
Here's what most people get wrong about ${params.topic}. [EMPHASIZE] They focus on the wrong things entirely. [B-ROLL CUE: show screen recording or relevant footage] Instead of starting with the foundation, they jump straight to advanced tactics — and then wonder why nothing works. Sound familiar?

[SECTION 2 — The Solution]  
So here's what actually works. And this applies whether you're a complete beginner or you've been at this for years. The key insight is this: [PAUSE FOR EFFECT] consistency beats perfection. Every. Single. Time. 

[B-ROLL CUE: show examples or results]

When I started applying this to ${params.topic}, everything changed. Not overnight — but within weeks, I started seeing real, measurable results.

[SECTION 3 — The Action Step]
Here's your one action step for today. Just one — because overwhelm is the #1 reason people quit. Take 15 minutes right now and [describe specific action related to ${params.topic}]. Set a timer. Do it before you go to bed tonight.

[TRANSITION]
Now before I let you go, I want to share one more thing that most creators never talk about...

[CTA]
If this helped you, smash that like button — it genuinely helps this channel grow. Subscribe if you want more content like this, and drop a comment below telling me: what's YOUR biggest challenge with ${params.topic} right now? I read every single comment and I'll personally reply.

See you in the next one! 👊`,
        estimatedDuration: "5-7 minutes",
        keyPoints: [
          "Most people focus on the wrong fundamentals",
          "Consistency beats perfection every time",
          "One specific action step to implement today",
          "Community engagement drives long-term growth"
        ],
        thumbnailIdeas: [
          "Split image: 'WRONG vs RIGHT' approach to " + params.topic + " with shocked face expression",
          "You pointing at text: 'The #1 Mistake With " + params.topic + "' on dark background",
          "Before/after results graphic with your face in the corner showing surprise"
        ]
      };
    } else if (tool === "thumbnail") {
      mockResponse = {
        ctrScore: 78,
        analysis: "The title for \"" + params.title + "\" is strong but could use more urgency. " + (imageData ? "The visual contrast in the thumbnail is good, but the text is slightly hard to read on mobile." : "It has a clear value proposition but lacks a curiosity gap that drives clicks."),
        strengths: [
          "Clear and concise",
          "Includes relevant keywords",
          imageData ? "Good use of facial expression" : "Professional tone"
        ],
        improvements: [
          "Add a curiosity gap",
          "Use more emotional language",
          imageData ? "Increase brightness on the subject's face" : "Include a specific number or timeframe"
        ],
        betterTitles: [
          "I Tried " + params.title + " For 30 Days (Unexpected Results)",
          "The Secret To " + params.title + " That Nobody Tells You",
          "Stop Doing " + params.title + " Until You Watch This"
        ]
      };
    }

    // Deduct credit for mock response
    if (user) {
      user.aiCredits -= 1;
      await user.save();
    }

    return NextResponse.json({ data: mockResponse });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
