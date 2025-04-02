import { NextResponse } from "next/server"
import { cameraService } from "@/lib/services"

// Mock data - in a real app, this would be stored in a database
export const cameras = [
  {
    id: "cam-001",
    name: "Front Door",
    source: "rtsp://192.168.1.100:554/stream1",
    active: true,
    detection_enabled: true,
    roi: {
      x: 50,
      y: 100,
      width: 200,
      height: 150,
    },
    entry_direction: "LTR",
  },
  {
    id: "cam-002",
    name: "Backyard",
    source: "rtsp://192.168.1.101:554/stream1",
    active: false,
    detection_enabled: false,
  },
  {
    id: "cam-003",
    name: "Garage",
    source: "rtsp://192.168.1.102:554/stream1",
    active: true,
    detection_enabled: true,
    roi: {
      x: 100,
      y: 150,
      width: 300,
      height: 200,
    },
    entry_direction: "RTL",
  },
  {
    id: "cam-004",
    name: "Side Entrance",
    source: "rtsp://192.168.1.103:554/stream1",
    active: true,
    detection_enabled: false,
  },
  {
    id: "cam-005",
    name: "Driveway",
    source: "rtsp://192.168.1.104:554/stream1",
    active: true,
    detection_enabled: true,
  },
]

export async function GET() {
  try {
    // Use our service module to get all cameras
    const cameras = await cameraService.getCameras()
    return NextResponse.json(cameras)
  } catch (error) {
    console.error("Error fetching cameras:", error)
    return NextResponse.json(
      { error: "Failed to fetch cameras" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.id || !body.name || !body.source) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new camera with our service
    const newCamera = await cameraService.updateCamera(body.id, body)
    return NextResponse.json(newCamera, { status: 201 })
  } catch (error) {
    console.error("Error creating camera:", error)
    return NextResponse.json(
      { error: "Failed to create camera" },
      { status: 500 }
    )
  }
}

