import { NextResponse } from "next/server"

// Helper function to convert timeRange to hours/days parameters
function timeRangeToParams(timeRange: string) {
  switch(timeRange) {
    case '24h': return { hours: 24 };
    case '7d': return { days: 7 };
    case '30d': return { days: 30 };
    case '90d': return { days: 90 };
    default: return { days: 7 }; // Default to 7 days
  }
}

export async function GET(request: Request) {
  // Get time range from query params
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get("timeRange") || "7d"

  // Transform timeRange to the hours/days parameters expected by backend
  const { hours, days } = timeRangeToParams(timeRange)
  
  // In actual implementation, call backend with appropriate parameters
  // let url = `${process.env.BACKEND_URL}/api/analytics/compare?`
  // if (hours) url += `hours=${hours}`
  // if (days) url += `days=${days}`
  // const response = await fetch(url)
  // return response

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data
  const data = {
    cameras: [
      { name: "Front Door", id: "cam-001", count: 425, ltr: 245, rtl: 180 },
      { name: "Backyard", id: "cam-002", count: 132, ltr: 85, rtl: 47 },
      { name: "Garage", id: "cam-003", count: 318, ltr: 190, rtl: 128 },
      { name: "Side Entrance", id: "cam-004", count: 215, ltr: 120, rtl: 95 },
      { name: "Driveway", id: "cam-005", count: 158, ltr: 102, rtl: 56 },
    ],
  }

  return NextResponse.json(data)
}

