import { NextResponse } from "next/server"
import { analyticsService } from "@/lib/services"

export async function GET(request: Request) {
  try {
    // Get time range from query params
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "7d"
    
    // Use the service to get the data
    const data = await analyticsService.getCompare(timeRange)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching analytics comparison:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics comparison" },
      { status: 500 }
    )
  }
}

