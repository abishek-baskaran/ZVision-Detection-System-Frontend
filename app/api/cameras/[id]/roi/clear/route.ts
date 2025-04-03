import { NextResponse } from "next/server"
import { cameraService } from "@/lib/services"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // Force params to be awaited
    const resolvedParams = await Promise.resolve(params)
    const cameraId = resolvedParams.id
    
    // Update the ROI with an empty object to clear it
    const result = await cameraService.updateROI(cameraId, {
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      entry_direction: '1,0' // Default right direction
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error clearing camera ROI:", error)
    return NextResponse.json(
      { error: "Failed to clear camera ROI" },
      { status: 500 }
    )
  }
}

