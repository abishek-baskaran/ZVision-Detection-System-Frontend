"use client"

import { useEffect, useState } from "react"
import { ArrowLeftRight } from "lucide-react"
import MetricsCard from "./metrics-card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import axios from "axios"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface DirectionData {
  ltr: number
  rtl: number
  ltrPercentage: number
  rtlPercentage: number
  change: number
}

export default function DirectionMetrics({ timeRange }: { timeRange: string }) {
  const [data, setData] = useState<DirectionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Try to fetch from API
        try {
          const response = await axios.get(`/api/metrics?timeRange=${timeRange}`)
          if (response.data && typeof response.data === "object" && response.data.directions) {
            setData(response.data.directions)
            return
          }
        } catch (error) {
          console.error("API error:", error)
        }

        // Fallback to mock data
        const mockData: DirectionData = {
          ltr: 742,
          rtl: 506,
          ltrPercentage: 59.5,
          rtlPercentage: 40.5,
          change: 5.2,
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
        title="Direction Analysis"
        value={<LoadingSpinner text="" size="sm" className="py-2" />}
        icon={<ArrowLeftRight className="h-6 w-6" />}
      />
    )
  }

  const chartData = [
    { name: "Left to Right", value: data.ltr },
    { name: "Right to Left", value: data.rtl },
  ]

  const COLORS = ["#4f46e5", "#8b5cf6"]

  return (
    <MetricsCard
      title="Direction Analysis"
      value={`${data.ltrPercentage}% / ${data.rtlPercentage}%`}
      change={{ value: data.change, positive: data.change > 0 }}
      icon={<ArrowLeftRight className="h-6 w-6" />}
    >
      <div className="h-[100px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={2} dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "rgba(255, 255, 255, 0.8)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value) => [`${value} people`, "Count"]}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "10px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </MetricsCard>
  )
}

