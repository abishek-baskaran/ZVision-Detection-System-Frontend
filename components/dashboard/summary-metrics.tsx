"use client"

import { useEffect, useState } from "react"
import { BarChart2 } from "lucide-react"
import MetricsCard from "./metrics-card"
import axios from "axios"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface SummaryData {
  totalDetections: number
  avgPerDay: number
  peakHour: string
  peakCount: number
  change: number
}

export default function SummaryMetrics({ timeRange }: { timeRange: string }) {
  const [data, setData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Try to fetch from API
        try {
          const response = await axios.get(`/api/metrics/summary?timeRange=${timeRange}`)
          if (response.data && typeof response.data === "object") {
            setData(response.data)
            return
          }
        } catch (error) {
          console.error("API error:", error)
        }

        // Fallback to mock data
        const mockData: SummaryData = {
          totalDetections: 1248,
          avgPerDay: 178,
          peakHour: "12:00 - 13:00",
          peakCount: 78,
          change: 8.3,
        }
        setData(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  if (loading || !data) {
    return (
      <MetricsCard
        title="Summary"
        value={<LoadingSpinner text="" size="sm" className="py-2" />}
        icon={<BarChart2 className="h-6 w-6" />}
      />
    )
  }

  return (
    <MetricsCard
      title="Summary"
      value={data.totalDetections.toLocaleString()}
      change={{ value: data.change, positive: data.change > 0 }}
      icon={<BarChart2 className="h-6 w-6" />}
    >
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <p className="text-xs text-muted-foreground">Daily Average</p>
          <p className="text-lg font-semibold">{data.avgPerDay}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Peak Hour</p>
          <p className="text-lg font-semibold">{data.peakHour}</p>
          <p className="text-xs text-muted-foreground">{data.peakCount} detections</p>
        </div>
      </div>
    </MetricsCard>
  )
}

