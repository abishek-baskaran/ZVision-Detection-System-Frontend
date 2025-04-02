import { NextResponse } from "next/server"
import { snapshotService } from "@/lib/services"

export async function GET(request: Request, { params }: { params: { path: string } }) {
  try {
    const path = params.path
    
    // Parse the path to extract camera_id and filename
    if (path.includes('/')) {
      // Format: "camera_id/filename"
      const [cameraId, filename] = path.split('/')
      const snapshotData = await snapshotService.getSnapshot(cameraId, filename)
      return NextResponse.json(snapshotData)
    } else {
      // Just a camera ID, get the latest snapshot
      const cameraId = path
      const snapshotData = await snapshotService.getLatestSnapshot(cameraId)
      return NextResponse.json(snapshotData)
    }
  } catch (error) {
    console.error("Error fetching snapshot:", error)
    return NextResponse.json(
      { error: "Failed to fetch snapshot" },
      { status: 500 }
    )
  }
}

