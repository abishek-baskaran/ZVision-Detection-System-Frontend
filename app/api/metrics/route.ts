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
  // let url = `${process.env.BACKEND_URL}/api/metrics?`
  // if (hours) url += `hours=${hours}`
  // if (days) url += `days=${days}`
  // const response = await fetch(url)
  // return response

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data based on time range
  const data = {
    total: 1248,
    change: 12.5,
    hourlyData: [
      { hour: "00:00", count: 12 },
      { hour: "01:00", count: 8 },
      { hour: "02:00", count: 5 },
      { hour: "03:00", count: 3 },
      { hour: "04:00", count: 2 },
      { hour: "05:00", count: 4 },
      { hour: "06:00", count: 10 },
      { hour: "07:00", count: 25 },
      { hour: "08:00", count: 45 },
      { hour: "09:00", count: 60 },
      { hour: "10:00", count: 68 },
      { hour: "11:00", count: 72 },
      { hour: "12:00", count: 78 },
      { hour: "13:00", count: 74 },
      { hour: "14:00", count: 70 },
      { hour: "15:00", count: 68 },
      { hour: "16:00", count: 65 },
      { hour: "17:00", count: 60 },
      { hour: "18:00", count: 55 },
      { hour: "19:00", count: 45 },
      { hour: "20:00", count: 32 },
      { hour: "21:00", count: 25 },
      { hour: "22:00", count: 18 },
      { hour: "23:00", count: 15 },
    ],
    directions: {
      ltr: 742,
      rtl: 506,
      ltrPercentage: 59.5,
      rtlPercentage: 40.5,
      change: 5.2,
    },
  }

  return NextResponse.json(data)
}

