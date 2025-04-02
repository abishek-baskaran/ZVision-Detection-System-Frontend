"use client"

import { useEffect, useState } from "react"
import { Users } from "lucide-react"
import MetricsCard from "./metrics-card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import axios from "axios"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface FootfallData {
  total: number
  change: number
  hourlyData: {
    hour: string
    date: string
    count: number
  }[]
}

export default function FootfallMetrics({ timeRange, cameraId }: { timeRange: string, cameraId: string | null }) {
  const [data, setData] = useState<FootfallData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Add cameraId to the API request if available
        const cameraParam = cameraId ? `&cam_id=${cameraId}` : ''
        const response = await axios.get(`/api/metrics?timeRange=${timeRange}${cameraParam}`)
        if (response.data && 
            typeof response.data.total === 'number' && 
            typeof response.data.change === 'number' && 
            Array.isArray(response.data.hourlyData)) {
          setData({
            total: response.data.total,
            change: response.data.change,
            hourlyData: response.data.hourlyData
          })
        } else {
          setError("Invalid data format received from API")
        }
      } catch (error) {
        console.error("API error:", error)
        setError("Failed to load footfall metrics. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange, cameraId])

  if (loading) {
    return (
      <MetricsCard
        title="Total Footfall"
        value="Loading..."
        icon={<Users className="h-6 w-6" />}
      />
    )
  }

  if (error) {
    return (
      <MetricsCard
        title="Total Footfall"
        value="Error"
        className="border-red-200"
        icon={<Users className="h-6 w-6" />}
      >
        <div className="text-red-500 text-sm">{error}</div>
      </MetricsCard>
    )
  }

  if (!data) {
    return (
      <MetricsCard
        title="Total Footfall"
        value="No data available"
        icon={<Users className="h-6 w-6" />}
      />
    )
  }

  // Extract a subset of hourly data for the chart
  const chartData = data.hourlyData
    // Group by date
    .reduce((groups: Record<string, any[]>, item) => {
      if (!groups[item.date]) {
        groups[item.date] = []
      }
      groups[item.date].push(item)
      return groups
    }, {})
  
  // Get the most recent dates based on the time range
  const numberOfDatesToShow = timeRange.endsWith('d') 
    ? Math.min(parseInt(timeRange.slice(0, -1), 10), 7) // Show at most 7 days
    : timeRange.endsWith('h') ? 1 : 7 // Default to 1 day for hours, 7 days otherwise
  
  const sortedDates = Object.keys(chartData).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  ).slice(0, numberOfDatesToShow)
  
  // Create a simplified dataset with date + hour combined
  const simplifiedData = sortedDates.flatMap(date => {
    // Take a few hours from each day
    return chartData[date]
      .filter((_, index) => index % 4 === 0) // Take every 4th hour
      .map(item => ({
        timeLabel: `${formatDate(new Date(item.date))} ${item.hour}`,
        count: item.count
      }))
  })
  
  // Limit to a reasonable number of data points
  const displayData = simplifiedData.slice(0, 10)

  return (
    <MetricsCard
      title="Total Footfall"
      value={data.total.toLocaleString()}
      change={{ value: data.change, positive: data.change > 0 }}
      icon={<Users className="h-6 w-6" />}
      tooltip="Total number of people detected during the selected time period"
    >
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={displayData}>
          <XAxis 
            dataKey="timeLabel" 
            tick={{ fontSize: 9 }} 
            tickLine={false} 
            axisLine={false}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={40}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "rgba(255, 255, 255, 0.8)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value) => [`${value.toLocaleString()} people`, "Count"]}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Bar 
            dataKey="count" 
            fill="currentColor" 
            className="fill-primary/70" 
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationBegin={200}
          />
        </BarChart>
      </ResponsiveContainer>
    </MetricsCard>
  )
}

// Helper function to format date for display
function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

