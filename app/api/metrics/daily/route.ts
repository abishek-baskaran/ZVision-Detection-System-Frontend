import { NextResponse } from "next/server"
import { metricsService } from "@/lib/services"

export async function GET(request: Request) {
  try {
    // Get time range from query params
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "7d"
    const camId = searchParams.get("cam_id") || null
    
    // Use our service module to get daily metrics
    const dailyData = await metricsService.getDaily(timeRange, camId)
    return NextResponse.json(dailyData)
  } catch (error) {
    console.error("Error fetching daily metrics:", error)
    return NextResponse.json(
      { error: "Failed to fetch daily metrics" },
      { status: 500 }
    )
  }
}

