import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { Content } from "@/models/Content";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const email = session.user.email;

    // Fetch user details
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all content created by this user
    const userContent = await Content.find({ userId: email });

    // Calculate stats
    const totalContent = userContent.length;
    const scriptsWritten = userContent.filter(c => c.type === "script").length;
    const thumbnailsCreated = userContent.filter(c => c.type === "thumbnail").length;

    // Generate chart data for the last 7 days
    const chartData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0); // Start of day
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1); // Start of next day

      const count = userContent.filter(c => {
        const contentDate = new Date(c.createdAt);
        return contentDate >= d && contentDate < nextD;
      }).length;

      chartData.push({
        name: days[d.getDay()],
        generations: count,
      });
    }

    return NextResponse.json({
      stats: {
        aiCredits: user.aiCredits,
        totalContent,
        scriptsWritten,
        thumbnailsCreated,
      },
      chartData,
    });

  } catch (error: any) {
    console.error("Error fetching overview data:", error);
    return NextResponse.json({ error: "Failed to load overview data" }, { status: 500 });
  }
}
