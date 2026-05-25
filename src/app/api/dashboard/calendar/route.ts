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

    // Fetch all content for this user
    const userContent = await Content.find({ userId: email }).sort({ createdAt: -1 });

    // Map content to Calendar item format
    const items = userContent.map(item => {
      // Safely try to get a title from the dynamic content object
      let title = "Generated Content";
      if (item.type === "idea" && item.content.idea) title = item.content.idea;
      else if (item.type === "script" && item.content.title) title = item.content.title;
      else if (item.type === "hook" && item.content.hook) title = item.content.hook;
      else if (item.type === "thumbnail" && item.content.prompt) title = item.content.prompt.substring(0, 30) + "...";

      // Limit title length for display
      if (title.length > 40) title = title.substring(0, 40) + "...";

      return {
        id: item._id.toString(),
        title,
        type: item.type,
        day: item.scheduledDay || "Unscheduled"
      };
    });

    return NextResponse.json({ items });

  } catch (error: any) {
    console.error("Error fetching calendar data:", error);
    return NextResponse.json({ error: "Failed to load calendar data" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, day } = await request.json();

    if (!id || !day) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const email = session.user.email;

    // Verify ownership and update
    const content = await Content.findOneAndUpdate(
      { _id: id, userId: email },
      { scheduledDay: day },
      { new: true }
    );

    if (!content) {
      return NextResponse.json({ error: "Content not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: content });
  } catch (error: any) {
    console.error("Error updating calendar data:", error);
    return NextResponse.json({ error: "Failed to update calendar data" }, { status: 500 });
  }
}
