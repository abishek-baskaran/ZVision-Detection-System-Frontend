import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Get camera ID from query params
  const { searchParams } = new URL(request.url)
  const cameraId = searchParams.get("camera_id")

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // If cameraId is provided, route to the appropriate backend endpoint
  if (cameraId) {
    // In actual implementation, this would be a call to backend
    // Example: const response = await fetch(`${process.env.BACKEND_URL}/api/cameras/${cameraId}/status`);
    
    // Mock implementation for current endpoint structure
    const personDetected = Math.random() > 0.7 // 30% chance of detection

    type StatusType = {
      detection_active: boolean;
      person_detected: boolean;
      last_detection_time?: string;
      camera_id?: string;
      direction?: string;
    }

    const status: StatusType = {
      detection_active: true,
      person_detected: personDetected,
    }

    if (personDetected) {
      status.last_detection_time = new Date().toISOString()
      status.camera_id = cameraId
      status.direction = Math.random() > 0.5 ? "LTR" : "RTL"
    }

    return NextResponse.json(status)
  } else {
    // General system status
    return NextResponse.json({
      system_status: "operational",
      uptime: "3d 14h 22m",
      active_cameras: 4
    })
  }
}

