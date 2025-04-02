import { NextResponse } from "next/server"
import { cameraService } from "@/lib/services"
import type { CameraROI } from "@/lib/services/camera-service"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Transform the ROI format from frontend (if it's using old format)
    let roiData: CameraROI
    
    if (body.roi) {
      // Convert from old format (x, y, width, height) to new format (x1, y1, x2, y2)
      roiData = {
        x1: body.roi.x,
        y1: body.roi.y,
        x2: body.roi.x + body.roi.width,
        y2: body.roi.y + body.roi.height,
        entry_direction: body.entry_direction || 'LTR'
      }
    } else {
      // Already in the correct format
      roiData = {
        x1: body.x1,
        y1: body.y1,
        x2: body.x2,
        y2: body.y2,
        entry_direction: body.entry_direction || 'LTR'
      }
    }
    
    // Validate ROI data
    if (
      typeof roiData.x1 !== "number" ||
      typeof roiData.y1 !== "number" ||
      typeof roiData.x2 !== "number" ||
      typeof roiData.y2 !== "number"
    ) {
      return NextResponse.json({ error: "Invalid ROI data" }, { status: 400 })
    }

    // Validate entry direction
    if (roiData.entry_direction !== "LTR" && roiData.entry_direction !== "RTL") {
      return NextResponse.json({ error: "Invalid entry direction" }, { status: 400 })
    }

    // Use our service module to update ROI
    const result = await cameraService.updateROI(id, roiData)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error updating ROI for camera ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update ROI" }, { status: 500 })
  }
}

