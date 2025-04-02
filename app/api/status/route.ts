import { NextResponse } from "next/server"
import { detectionService } from "@/lib/services"

export async function GET(request: Request) {
  // Get camera ID from query params
  const { searchParams } = new URL(request.url)
  const cameraId = searchParams.get("camera_id")

  try {
    // Use our service module to get the status
    const statusData = await detectionService.getStatus(cameraId || undefined)
    return NextResponse.json(statusData)
  } catch (error) {
    console.error("Error fetching status:", error)
    return NextResponse.json(
      { error: "Failed to fetch status information" },
      { status: 500 }
    )
  }
}

