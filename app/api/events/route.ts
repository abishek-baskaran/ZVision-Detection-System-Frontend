import { NextResponse } from "next/server"
import { eventService } from "@/lib/services"

// Mock data - in a real app, this would be stored in a database
const events = [
  {
    id: "evt-001",
    timestamp: "2023-04-07T08:23:15Z",
    event_type: "system",
    message: "System started",
    camera_id: null,
  },
  {
    id: "evt-002",
    timestamp: "2023-04-07T09:15:22Z",
    event_type: "error",
    message: "Connection lost to camera cam-002",
    camera_id: "cam-002",
  },
  {
    id: "evt-003",
    timestamp: "2023-04-07T10:45:11Z",
    event_type: "config",
    message: "ROI updated for camera cam-001",
    camera_id: "cam-001",
  },
  {
    id: "evt-004",
    timestamp: "2023-04-07T12:30:45Z",
    event_type: "system",
    message: "Detection system paused",
    camera_id: null,
  },
  {
    id: "evt-005",
    timestamp: "2023-04-07T13:05:33Z",
    event_type: "config",
    message: "New camera added: Side Gate",
    camera_id: "cam-006",
  },
  {
    id: "evt-006",
    timestamp: "2023-04-07T14:22:18Z",
    event_type: "system",
    message: "Detection system resumed",
    camera_id: null,
  },
  {
    id: "evt-007",
    timestamp: "2023-04-07T15:40:09Z",
    event_type: "error",
    message: "Low disk space warning",
    camera_id: null,
  },
  {
    id: "evt-008",
    timestamp: "2023-04-07T16:55:27Z",
    event_type: "config",
    message: "Detection sensitivity increased for camera cam-003",
    camera_id: "cam-003",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const limit = searchParams.get('limit') 
      ? parseInt(searchParams.get('limit') as string) 
      : undefined
    
    const from = searchParams.get('from') || undefined
    const to = searchParams.get('to') || undefined
    
    // Extract event types if provided
    const types = searchParams.getAll('types')
    
    // Get events using the service with all parameters
    const events = await eventService.getEvents(limit, from, to, types.length > 0 ? types : undefined)
    
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    )
  }
}

