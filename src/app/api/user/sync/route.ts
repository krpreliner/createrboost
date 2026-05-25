import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uid, email, displayName, photoURL } = body;

    if (!uid || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await connectToDatabase();
    
    // If MongoDB is not configured, just return success to not block the frontend flow
    if (!db) {
      console.log("Mock DB sync for user:", email);
      return NextResponse.json({ message: "Mock synced successfully", isNewUser: true });
    }

    // Check if user exists
    let user = await User.findOne({ firebaseUid: uid });
    let isNewUser = false;

    if (!user) {
      // Create new user
      isNewUser = true;
      user = await User.create({
        firebaseUid: uid,
        email,
        displayName: displayName || email.split("@")[0],
        photoURL: photoURL || "",
        plan: "Starter",
        aiCredits: 50,
      });
      console.log("Created new MongoDB user:", email);
    } else {
      console.log("Found existing MongoDB user:", email);
      // Optional: Update display name/photo if they changed on Firebase
    }

    return NextResponse.json({ 
      message: "User synced successfully", 
      isNewUser,
      user: {
        plan: user.plan,
        aiCredits: user.aiCredits,
      }
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
