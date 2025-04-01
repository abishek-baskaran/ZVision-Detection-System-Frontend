import { NextResponse } from "next/server"

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
  // Get query parameters
  const { searchParams } = new URL(request.url)
  const fromDate = searchParams.get("from")
  const toDate = searchParams.get("to")
  const types = searchParams.getAll("types")
  
  // Extract limit parameter directly or calculate a reasonable default
  let limit = 10 // Default limit
  const limitParam = searchParams.get("limit")
  
  if (limitParam) {
    limit = parseInt(limitParam, 10)
  } else if (fromDate && toDate) {
    // If date range is specified but no limit, calculate a reasonable limit
    const from = new Date(fromDate)
    const to = new Date(toDate)
    const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 3600 * 24))
    // Estimate ~3 events per day (adjust as needed)
    limit = Math.max(10, daysDiff * 3)
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In actual implementation, we would call the backend with the limit parameter
  // const response = await fetch(`${process.env.BACKEND_URL}/api/events?limit=${limit}`)
  // return response

  // For this mock implementation, sort and limit the events
  let filteredEvents = [...events]

  // Sort by timestamp (newest first)
  filteredEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  
  // Apply limit
  filteredEvents = filteredEvents.slice(0, limit)

  return NextResponse.json(filteredEvents)
}

