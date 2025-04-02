import { NextResponse } from "next/server"
import { metricsService } from "@/lib/services"

export async function GET(request: Request) {
  try {
    // Get time range from query params
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "7d"
    const camId = searchParams.get("cam_id") || null
    
    // Use our service module to get metrics
    const metricsData = await metricsService.getMetrics(timeRange, camId)
    return NextResponse.json(metricsData)
  } catch (error) {
    console.error("Error fetching metrics:", error)
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    )
  }
}

