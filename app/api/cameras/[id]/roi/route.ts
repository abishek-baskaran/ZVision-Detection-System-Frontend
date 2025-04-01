import { NextResponse } from "next/server"
import { cameras } from "../../route"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const body = await request.json()

  // Find the camera
  const cameraIndex = cameras.findIndex((camera) => camera.id === id)

  if (cameraIndex === -1) {
    return NextResponse.json({ error: "Camera not found" }, { status: 404 })
  }

  // Transform the ROI format from frontend (x/y/width/height) to backend (x1/y1/x2/y2)
  let transformedBody = { ...body }
  
  if (body.roi) {
    // Backend expects coordinates as x1/y1/x2/y2
    transformedBody = {
      x1: body.roi.x,
      y1: body.roi.y,
      x2: body.roi.x + body.roi.width,
      y2: body.roi.y + body.roi.height,
      entry_direction: body.entry_direction
    }
  }
  
  // In a real implementation, we would call the backend
  // const response = await fetch(`${process.env.BACKEND_URL}/api/cameras/${id}/roi`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(transformedBody)
  // })
  // return response
  
  // Mock implementation for demonstration
  
  // Validate ROI data (now using transformed format)
  if (
    typeof transformedBody.x1 !== "number" ||
    typeof transformedBody.y1 !== "number" ||
    typeof transformedBody.x2 !== "number" ||
    typeof transformedBody.y2 !== "number"
  ) {
    return NextResponse.json({ error: "Invalid ROI data" }, { status: 400 })
  }

  // Validate entry direction
  if (transformedBody.entry_direction && transformedBody.entry_direction !== "LTR" && transformedBody.entry_direction !== "RTL") {
    return NextResponse.json({ error: "Invalid entry direction" }, { status: 400 })
  }

  // Update the camera
  cameras[cameraIndex] = {
    ...cameras[cameraIndex],
    roi: {
      x: transformedBody.x1,
      y: transformedBody.y1,
      width: transformedBody.x2 - transformedBody.x1,
      height: transformedBody.y2 - transformedBody.y1
    },
    entry_direction: transformedBody.entry_direction || cameras[cameraIndex].entry_direction,
  }

  return NextResponse.json(cameras[cameraIndex])
}

