import { NextResponse } from "next/server"
import { metricsService } from "@/lib/services"

export async function GET(request: Request) {
  try {
    // Get time range from query params
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "7d"
    const camId = searchParams.get("cam_id") || null
    
    // Use our service module to get summary metrics
    const summaryData = await metricsService.getSummary(timeRange, camId)
    return NextResponse.json(summaryData)
  } catch (error) {
    console.error("Error fetching metrics summary:", error)
    return NextResponse.json(
      { error: "Failed to fetch metrics summary" },
      { status: 500 }
    )
  }
}

