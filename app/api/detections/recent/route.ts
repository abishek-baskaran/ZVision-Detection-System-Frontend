import { NextResponse } from "next/server"

// Mock data - in a real app, this would be stored in a database
const detections = [
  {
    id: "det-001",
    timestamp: "2023-04-07T08:30:15Z",
    camera_id: "cam-001",
    direction: "LTR",
    confidence: 0.92,
    snapshot_path: "/snapshots/det-001.jpg",
  },
  {
    id: "det-002",
    timestamp: "2023-04-07T09:12:33Z",
    camera_id: "cam-003",
    direction: "RTL",
    confidence: 0.87,
    snapshot_path: "/snapshots/det-002.jpg",
  },
  {
    id: "det-003",
    timestamp: "2023-04-07T10:05:22Z",
    camera_id: "cam-001",
    direction: "LTR",
    confidence: 0.95,
    snapshot_path: "/snapshots/det-003.jpg",
  },
  {
    id: "det-004",
    timestamp: "2023-04-07T11:45:10Z",
    camera_id: "cam-005",
    direction: "RTL",
    confidence: 0.89,
    snapshot_path: "/snapshots/det-004.jpg",
  },
  {
    id: "det-005",
    timestamp: "2023-04-07T12:33:45Z",
    camera_id: "cam-003",
    direction: "LTR",
    confidence: 0.91,
    snapshot_path: "/snapshots/det-005.jpg",
  },
  {
    id: "det-006",
    timestamp: "2023-04-07T13:20:18Z",
    camera_id: "cam-001",
    direction: "RTL",
    confidence: 0.88,
    snapshot_path: "/snapshots/det-006.jpg",
  },
  {
    id: "det-007",
    timestamp: "2023-04-07T14:15:33Z",
    camera_id: "cam-005",
    direction: "LTR",
    confidence: 0.93,
    snapshot_path: "/snapshots/det-007.jpg",
  },
  {
    id: "det-008",
    timestamp: "2023-04-07T15:40:22Z",
    camera_id: "cam-003",
    direction: "LTR",
    confidence: 0.9,
    snapshot_path: "/snapshots/det-008.jpg",
  },
  {
    id: "det-009",
    timestamp: "2023-04-07T16:25:11Z",
    camera_id: "cam-001",
    direction: "RTL",
    confidence: 0.86,
    snapshot_path: "/snapshots/det-009.jpg",
  },
  {
    id: "det-010",
    timestamp: "2023-04-07T17:10:45Z",
    camera_id: "cam-005",
    direction: "LTR",
    confidence: 0.94,
    snapshot_path: "/snapshots/det-010.jpg",
  },
]

export async function GET(request: Request) {
  // Get query parameters
  const { searchParams } = new URL(request.url)
  const fromDate = searchParams.get("from")
  const toDate = searchParams.get("to")

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Adapt frontend params (from/to dates) to backend params (count)
  // Convert date range to an appropriate count (if dates provided)
  let count = 10 // Default count

  if (fromDate && toDate) {
    // Calculate a reasonable count based on date range
    const from = new Date(fromDate)
    const to = new Date(toDate)
    const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 3600 * 24))
    // Estimate ~5 detections per day (adjust as needed)
    count = Math.max(10, daysDiff * 5)
  }

  // In actual implementation, call the backend with count parameter
  // const response = await fetch(`${process.env.BACKEND_URL}/api/detections/recent?count=${count}`)
  // return response

  // For this mock implementation, filter and return appropriate number of detections
  let filteredDetections = [...detections]

  // Sort by timestamp (newest first)
  filteredDetections.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  
  // Limit to count
  filteredDetections = filteredDetections.slice(0, count)

  return NextResponse.json(filteredDetections)
}

