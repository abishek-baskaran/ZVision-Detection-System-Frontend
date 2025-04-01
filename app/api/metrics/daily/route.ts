import { NextResponse } from "next/server"

// Helper function to convert timeRange to hours/days parameters
function timeRangeToParams(timeRange: string): { hours?: number; days?: number } {
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
  // let url = `${process.env.BACKEND_URL}/api/metrics/daily?`
  // if (hours) url += `hours=${hours}`
  // if (days) url += `days=${days}`
  // const response = await fetch(url)
  // return response

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Generate dates for the past N days based on timeRange
  const daysToShow = days || (hours ? Math.ceil(hours / 24) : 7)
  const data = []
  const today = new Date()

  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(today.getDate() - i)

    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split("T")[0]

    // Generate random count between 100-250
    const count = Math.floor(Math.random() * 150) + 100

    data.push({
      date: formattedDate,
      count,
    })
  }

  return NextResponse.json(data)
}

