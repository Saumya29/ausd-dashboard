import { NextResponse } from "next/server";
import { fetchAllSupply } from "@/lib/supply";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchAllSupply();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Supply API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch supply data" },
      { status: 500 }
    );
  }
}
