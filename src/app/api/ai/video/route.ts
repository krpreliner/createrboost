import { NextResponse } from "next/server";
import Replicate from "replicate";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectToDatabase();
    
    // MOCK MODE: If DB is down or it's a mock user, skip credit checks
    let user = null;
    if (db && session.user.id !== "mock_user_123") {
      user = await User.findById(session.user.id);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Video generation is expensive, costs 10 credits
      if (user.aiCredits < 10) {
        return NextResponse.json(
          { error: "Insufficient AI credits. Please upgrade your plan." },
          { status: 403 }
        );
      }
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const replicateApiToken = process.env.REPLICATE_API_TOKEN;

    // Use mock data if no valid API key is provided
    if (!replicateApiToken || replicateApiToken === "your_replicate_api_token_here") {
      console.log("Using mock video generation (no Replicate API key found)");
      return NextResponse.json({
        id: "mock-video-prediction-" + Date.now(),
        status: "starting",
      });
    }

    const replicate = new Replicate({
      auth: replicateApiToken,
    });

    // We'll use Luma's Ray model as default (or Minimax, etc.)
    // For demonstration, let's use minimax/video-01 which is very capable for text-to-video
    const prediction = await replicate.predictions.create({
      model: "minimax/video-01",
      input: {
        prompt: prompt,
        prompt_optimizer: true,
      },
    });

    // Deduct credits
    if (user) {
      user.aiCredits -= 10;
      await user.save();
    }

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
    });
  } catch (error: any) {
    console.error("Failed to start video generation:", error);
    return NextResponse.json(
      { error: error.message || "Failed to start video generation" },
      { status: 500 }
    );
  }
}
