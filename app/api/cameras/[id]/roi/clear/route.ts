import { NextResponse } from "next/server"
import { cameras } from "../../../route"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Find the camera
  const cameraIndex = cameras.findIndex((camera) => camera.id === id)

  if (cameraIndex === -1) {
    return NextResponse.json({ error: "Camera not found" }, { status: 404 })
  }

  // Create a new camera object without the ROI
  const { roi, ...cameraWithoutRoi } = cameras[cameraIndex]

  // Update the camera
  cameras[cameraIndex] = cameraWithoutRoi

  return NextResponse.json(cameras[cameraIndex])
}

