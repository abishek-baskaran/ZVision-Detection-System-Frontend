"use client"

import { useEffect, useState } from "react"
import { AlertCircle, BarChart2 } from "lucide-react"
import MetricsCard from "./metrics-card"
import axios from "axios"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SummaryData {
  totalDetections: number
  avgPerDay: number
  peakHour: string
  peakCount: number
  change: number
}

export default function SummaryMetrics({ timeRange, cameraId }: { timeRange: string, cameraId: string | null }) {
  const [data, setData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Try to fetch from API
        try {
          // Add cameraId to the API request if available
          const cameraParam = cameraId ? `&cam_id=${cameraId}` : ''
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/metrics/summary?timeRange=${timeRange}${cameraParam}`)
          if (response.data && 
              typeof response.data === "object" && 
              typeof response.data.totalDetections === "number") {
            setData(response.data)
            return
          } else {
            setError("Invalid data format received from API")
          }
        } catch (error) {
          console.error("API error:", error)
          setError("Failed to load metrics data")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange, cameraId])

  if (loading) {
    return (
      <MetricsCard
        title="Summary"
        value="Loading..."
        icon={<BarChart2 className="h-6 w-6" />}
      />
    )
  }

  if (error || !data) {
    return (
      <MetricsCard
        title="Summary"
        value="Error"
        icon={<BarChart2 className="h-6 w-6" />}
      >
        <div className="mt-2 text-sm text-destructive">
          {error || "No data available"}
        </div>
      </MetricsCard>
    )
  }

  // Safely format the total detections
  const formattedTotal = data.totalDetections !== undefined && data.totalDetections !== null
    ? data.totalDetections.toLocaleString()
    : "N/A";

  return (
    <MetricsCard
      title="Summary"
      value={formattedTotal}
      change={data.change !== undefined ? { value: data.change, positive: data.change > 0 } : undefined}
      icon={<BarChart2 className="h-6 w-6" />}
      tooltip="Summary statistics of detection activity during the selected time period"
    >
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="bg-muted/30 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground font-medium">Daily Average</p>
          <p className="text-lg font-semibold">{data.avgPerDay.toLocaleString() || "N/A"}</p>
        </div>
        <div className="bg-muted/30 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground font-medium">Peak Hour</p>
          <p className="text-lg font-semibold">{data.peakHour || "N/A"}</p>
          <p className="text-xs text-muted-foreground">{data.peakCount !== undefined ? `${data.peakCount.toLocaleString()} detections` : "N/A"}</p>
        </div>
      </div>
    </MetricsCard>
  )
}

