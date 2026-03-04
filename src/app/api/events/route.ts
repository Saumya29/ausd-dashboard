import { NextResponse } from "next/server";
import { fetchRecentEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchRecentEvents();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Events API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
