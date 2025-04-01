"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import axios from "axios"
import { LoadingCard } from "@/components/ui/loading-spinner"
import { AnimatePresence, motion } from "framer-motion"

interface HourlyData {
  hour: string
  count: number
}

export default function HourlyMetrics({ timeRange }: { timeRange: string }) {
  const [data, setData] = useState<HourlyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Try to fetch from API
        try {
          const response = await axios.get(`/api/metrics?timeRange=${timeRange}`)
          if (response.data && response.data.hourlyData && Array.isArray(response.data.hourlyData)) {
            setData(response.data.hourlyData)
            return
          }
        } catch (error) {
          console.error("API error:", error)
        }

        // Fallback to mock data
        const mockData: HourlyData[] = [
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
        ]
        setData(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  if (loading) {
    return <LoadingCard height="h-[300px]" />
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="h-[300px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.split(":")[0]}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} />
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
            <Line
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </AnimatePresence>
  )
}

