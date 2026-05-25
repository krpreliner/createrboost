import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json(
        { error: "Prediction ID is required" },
        { status: 400 }
      );
    }

    const replicateApiToken = process.env.REPLICATE_API_TOKEN;

    // Use mock data if no valid API key is provided
    if (id.startsWith("mock-video-prediction-")) {
      const startTime = parseInt(id.replace("mock-video-prediction-", ""));
      const elapsed = Date.now() - startTime;
      
      // Simulate taking 5 seconds to generate
      if (elapsed < 5000) {
        return NextResponse.json({
          id,
          status: "processing",
        });
      } else {
        return NextResponse.json({
          id,
          status: "succeeded",
          // Free stock video for mock purposes
          output: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        });
      }
    }

    if (!replicateApiToken || replicateApiToken === "your_replicate_api_token_here") {
       return NextResponse.json(
        { error: "Replicate API Token is missing" },
        { status: 500 }
      );
    }

    const replicate = new Replicate({
      auth: replicateApiToken,
    });

    const prediction = await replicate.predictions.get(id);

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status,
      output: prediction.output, // This will be the URL to the video when succeeded
      error: prediction.error,
    });
  } catch (error: any) {
    console.error("Failed to get video status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get video status" },
      { status: 500 }
    );
  }
}
