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
  // let url = `${process.env.BACKEND_URL}/api/metrics/summary?`
  // if (hours) url += `hours=${hours}`
  // if (days) url += `days=${days}`
  // const response = await fetch(url)
  // return response

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data based on time range
  const data = {
    totalDetections: 1248,
    avgPerDay: 178,
    peakHour: "12:00 - 13:00",
    peakCount: 78,
    change: 8.3,
  }

  return NextResponse.json(data)
}

