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

interface MetricsData {
  directions: {
    ltr: number
    rtl: number
    ltrPercentage: number
    rtlPercentage: number
    change: number
  }
  hourlyData: {
    hour: string
    date: string  // Add date field
    count: number
  }[]
}

export default function DirectionMetrics({ timeRange, cameraId }: { timeRange: string, cameraId: string | null }) {
  const [data, setData] = useState<DirectionData | null>(null)
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
          const response = await axios.get(`/api/metrics?timeRange=${timeRange}${cameraParam}`)
          if (response.data && 
              typeof response.data === "object" && 
              response.data.directions &&
              typeof response.data.directions.ltr === 'number' &&
              typeof response.data.directions.rtl === 'number') {
            setData(response.data.directions)
            return
          } else {
            setError("Invalid direction data format received from API")
          }
        } catch (error) {
          console.error("API error:", error)
          setError("Failed to load direction metrics. Please try again later.")
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
        title="Direction Analysis"
        value="Loading..."
        icon={<ArrowLeftRight className="h-6 w-6" />}
      />
    )
  }

  if (error || !data) {
    return (
      <MetricsCard
        title="Direction Analysis"
        value="Error"
        icon={<ArrowLeftRight className="h-6 w-6" />}
      >
        <div className="mt-2 text-sm text-destructive">
          {error || "No data available"}
        </div>
      </MetricsCard>
    )
  }

  // Safe data formatting
  const ltrPercentage = data.ltrPercentage !== undefined ? data.ltrPercentage : 0;
  const rtlPercentage = data.rtlPercentage !== undefined ? data.rtlPercentage : 0;
  
  const chartData = [
    { name: "Left to Right", value: data.ltr || 0 },
    { name: "Right to Left", value: data.rtl || 0 },
  ]

  const COLORS = ["#4f46e5", "#8b5cf6"]

  return (
    <MetricsCard
      title="Direction Analysis"
      value={`${ltrPercentage}% / ${rtlPercentage}%`}
      change={data.change !== undefined ? { value: data.change, positive: data.change > 0 } : undefined}
      icon={<ArrowLeftRight className="h-6 w-6" />}
      tooltip="Analysis of traffic direction: Left-to-Right vs Right-to-Left percentages"
    >
      <div className="h-[100px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={chartData} 
              cx="50%" 
              cy="50%" 
              innerRadius={25} 
              outerRadius={40} 
              paddingAngle={2} 
              dataKey="value"
              animationBegin={300}
              animationDuration={1000}
            >
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
              formatter={(value) => [`${value.toLocaleString()} people`, "Count"]}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center" 
              wrapperStyle={{ fontSize: "10px" }} 
              iconSize={8}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </MetricsCard>
  )
}

