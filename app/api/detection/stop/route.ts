import { NextResponse } from "next/server"
import { detectionService } from "@/lib/services"

// This would typically interact with your detection system
export async function POST() {
  try {
    const result = await detectionService.stopDetection()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error stopping detection:", error)
    return NextResponse.json({ error: "Failed to stop detection" }, { status: 500 })
  }
}

