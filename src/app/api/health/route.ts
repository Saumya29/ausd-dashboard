import { NextResponse } from "next/server";
import { checkHealth } from "@/lib/health";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await checkHealth();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Health API error:", error);
    return NextResponse.json(
      { error: "Failed to check health" },
      { status: 500 }
    );
  }
}
