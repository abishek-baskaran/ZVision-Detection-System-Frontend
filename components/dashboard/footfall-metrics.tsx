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
  hourly: {
    hour: string
    count: number
  }[]
}

export default function FootfallMetrics({ timeRange }: { timeRange: string }) {
  const [data, setData] = useState<FootfallData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Try to fetch from API
        try {
          const response = await axios.get(`/api/metrics?timeRange=${timeRange}`)
          if (response.data && typeof response.data === "object") {
            setData(response.data)
            return
          }
        } catch (error) {
          console.error("API error:", error)
        }

        // Fallback to mock data
        const mockData: FootfallData = {
          total: 1248,
          change: 12.5,
          hourly: [
            { hour: "00:00", count: 12 },
            { hour: "04:00", count: 8 },
            { hour: "08:00", count: 45 },
            { hour: "12:00", count: 78 },
            { hour: "16:00", count: 65 },
            { hour: "20:00", count: 32 },
          ],
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
        title="Total Footfall"
        value={<LoadingSpinner text="" size="sm" className="py-2" />}
        icon={<Users className="h-6 w-6" />}
      />
    )
  }

  return (
    <MetricsCard
      title="Total Footfall"
      value={data.total.toLocaleString()}
      change={{ value: data.change, positive: data.change > 0 }}
      icon={<Users className="h-6 w-6" />}
    >
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={data.hourly}>
          <XAxis dataKey="hour" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "rgba(255, 255, 255, 0.8)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value) => [`${value} people`, "Count"]}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Bar dataKey="count" fill="currentColor" className="fill-primary/70" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </MetricsCard>
  )
}

