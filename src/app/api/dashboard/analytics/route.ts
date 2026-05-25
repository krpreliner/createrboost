import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectToDatabase from "@/lib/mongodb";
import { Content } from "@/models/Content";

export async function GET(request: Request) {
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
    const url = new URL(request.url);
    const daysParam = url.searchParams.get('days') || '30';
    const days = parseInt(daysParam, 10);

    // Calculate start date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch content within the date range
    const userContent = await Content.find({ 
      userId: email,
      createdAt: { $gte: startDate }
    });

    // Calculate total stats
    const totalIdeas = userContent.filter(c => c.type === "idea").length;
    const totalHooks = userContent.filter(c => c.type === "hook").length;
    const totalScripts = userContent.filter(c => c.type === "script").length;
    const totalThumbnails = userContent.filter(c => c.type === "thumbnail").length;

    // Generate chart data for the timeline
    const timelineData = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const dayContent = userContent.filter(c => {
        const contentDate = new Date(c.createdAt);
        return contentDate >= d && contentDate < nextD;
      });

      timelineData.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ideas: dayContent.filter(c => c.type === "idea").length,
        hooks: dayContent.filter(c => c.type === "hook").length,
        scripts: dayContent.filter(c => c.type === "script").length,
        thumbnails: dayContent.filter(c => c.type === "thumbnail").length,
      });
    }

    const distributionData = [
      { name: 'Ideas', count: totalIdeas, fill: '#8b5cf6' },
      { name: 'Hooks', count: totalHooks, fill: '#3b82f6' },
      { name: 'Scripts', count: totalScripts, fill: '#10b981' },
      { name: 'Thumbnails', count: totalThumbnails, fill: '#f59e0b' },
    ];

    return NextResponse.json({
      stats: {
        totalIdeas,
        totalHooks,
        totalScripts,
        totalThumbnails,
      },
      timelineData,
      distributionData,
    });

  } catch (error: any) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json({ error: "Failed to load analytics data" }, { status: 500 });
  }
}
