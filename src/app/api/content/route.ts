import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Content } from "@/models/Content";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectToDatabase();
    if (!db) {
       return NextResponse.json({ data: [] });
    }

    const items = await Content.find({ userId: uid }).sort({ createdAt: -1 });
    return NextResponse.json({ data: items });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { uid, type, content } = body;

    if (!uid || !type || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) {
       return NextResponse.json({ message: "Mock saved" });
    }

    const newItem = await Content.create({
      userId: uid,
      type,
      content,
    });

    return NextResponse.json({ data: newItem, message: "Saved successfully" });
  } catch (error) {
    console.error("Error saving content:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id, uid } = body;

    if (!id || !uid) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await connectToDatabase();
    if (!db) return NextResponse.json({ message: "Mock deleted" });

    const result = await Content.deleteOne({ _id: id, userId: uid });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Item not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
  }
}
