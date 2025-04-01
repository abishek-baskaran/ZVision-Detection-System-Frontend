import { NextResponse } from "next/server"

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
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Make sure we're explicitly returning an array
  return NextResponse.json(cameras)
}

export async function POST(request: Request) {
  const body = await request.json()

  // Validate required fields
  if (!body.id || !body.name || !body.source) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Check if camera with this ID already exists
  if (cameras.some((camera) => camera.id === body.id)) {
    return NextResponse.json({ error: "Camera with this ID already exists" }, { status: 409 })
  }

  // Create new camera
  const newCamera = {
    id: body.id,
    name: body.name,
    source: body.source,
    active: true,
    detection_enabled: false,
  }

  // Add to our "database"
  cameras.push(newCamera)

  return NextResponse.json(newCamera, { status: 201 })
}

