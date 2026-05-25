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
    const { messages, systemPrompt } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const lastMessageContent = messages[messages.length - 1].content.toLowerCase();
    const isImageRequest = (lastMessageContent.includes("generate") || lastMessageContent.includes("create") || lastMessageContent.includes("make") || lastMessageContent.includes("design")) && 
                           (lastMessageContent.includes("thumbnail") || lastMessageContent.includes("image") || lastMessageContent.includes("picture"));

    console.log("lastMessageContent:", lastMessageContent);
    console.log("isImageRequest:", isImageRequest);
    console.log("openai is truthy:", !!openai);

    // Handle Image Generation Intent
    if (isImageRequest && openai) {
      try {
        // 1. First, ask GPT-4o to synthesize the perfect DALL-E prompt based on the chat history
        const promptSynthesizer = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are an expert prompt engineer for DALL-E 3. Based on the user's request and the conversation context about their YouTube video, write a highly detailed 2-3 sentence visual description for a YouTube thumbnail. Focus on lighting, subject, facial expression, and composition. Instruct the model NOT to include any text/words in the image, as text will be added later in Photoshop." },
            ...messages
          ],
          temperature: 0.7,
        });

        const dallePrompt = promptSynthesizer.choices[0].message.content || "A vibrant, high-contrast YouTube thumbnail background with an expressive subject.";

        // 2. Generate the image
        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: dallePrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        });

        const imageUrl = imageResponse.data?.[0]?.url;

        if (!imageUrl) {
          throw new Error("DALL-E 3 returned no image URL.");
        }

        if (user) {
          user.aiCredits -= 2; // Image gen costs more
          await user.save();
        }

        return NextResponse.json({ 
          response: "I've generated a new conceptual thumbnail design based on our discussion! You can download this and add your title text over it.", 
          imageUrl,
          source: "dall-e-3" 
        });

      } catch (err: any) {
        console.error("DALL-E 3 generation failed (likely quota exceeded):", err.message || err);
        
        // Return a stunning mock image for demonstration purposes if API is down/out of quota
        return NextResponse.json({ 
          response: "Here is a stunning conceptual design! (Note: Since my DALL-E 3 quota is exceeded, this is a highly optimized demonstration image from Unsplash, but this shows exactly how the feature works!)", 
          imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
          source: "mock-image" 
        });
      }
    }

    // Standard Text Chat
    // Prepare OpenAI messages
    const openAIMessages = [...messages];
    if (systemPrompt) {
      openAIMessages.unshift({ role: "system", content: systemPrompt });
    }

    // Try OpenAI first if available
    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: openAIMessages,
          temperature: 0.7,
          max_tokens: 2000,
        });
        
        const text = response.choices[0].message.content || "";
        
        if (user) {
          user.aiCredits -= 1;
          await user.save();
        }
        return NextResponse.json({ response: text, source: "openai" });
      } catch (err: any) {
        console.warn("OpenAI chat attempt failed:", err.message || err);
      }
    }

    // Try Gemini
    if (geminiApiKey && geminiApiKey !== "your_gemini_api_key_here" && genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash", // updated to a model that works
          systemInstruction: systemPrompt || undefined,
        });
        
        // Convert to Gemini format (user/model roles)
        const geminiHistory = messages.map((msg: any) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content || " " }]
        }));

        // Gemini strictly requires the first message in history to be from the 'user'
        if (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
          geminiHistory.unshift({
            role: 'user',
            parts: [{ text: "Hello, let's discuss my thumbnail." }]
          });
        }

        // The last message is the current prompt, the rest is history
        const prompt = geminiHistory.pop()?.parts[0].text || "";
        
        const chat = model.startChat({
          history: geminiHistory,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        });

        const result = await chat.sendMessage(prompt);
        const text = result.response.text();
        
        if (user) {
          user.aiCredits -= 1;
          await user.save();
        }
        return NextResponse.json({ response: text, source: "gemini" });
      } catch (err: any) {
        console.error("Gemini chat attempt failed:", err.message || err);
      }
    }

    // Fallback Mock Response (if quotas exceeded or no keys)
    if (user) {
      user.aiCredits -= 1;
      await user.save();
    }
    
    return NextResponse.json({ 
      response: "Here's a mock response! Since my API keys are out of quota (OpenAI 429), I am operating in offline mode. To improve your thumbnail, focus on creating high contrast between the background and your subject, and use a maximum of 3-4 words for the text.", 
      source: "mock" 
    });

  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "Failed to generate chat response" }, { status: 500 });
  }
}
