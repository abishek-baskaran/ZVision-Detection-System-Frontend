"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import axios from "axios"
import { LoadingCard } from "@/components/ui/loading-spinner"
import { AnimatePresence, motion } from "framer-motion"

interface DailyData {
  date: string
  count: number
}

export default function DailyMetrics({ timeRange }: { timeRange: string }) {
  const [data, setData] = useState<DailyData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Try to fetch from API
        try {
          const response = await axios.get(`/api/metrics/daily?timeRange=${timeRange}`)
          if (response.data && Array.isArray(response.data)) {
            setData(response.data)
            return
          }
        } catch (error) {
          console.error("API error:", error)
        }

        // Fallback to mock data
        const mockData: DailyData[] = [
          { date: "2023-04-01", count: 145 },
          { date: "2023-04-02", count: 132 },
          { date: "2023-04-03", count: 164 },
          { date: "2023-04-04", count: 187 },
          { date: "2023-04-05", count: 212 },
          { date: "2023-04-06", count: 198 },
          { date: "2023-04-07", count: 210 },
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
          <BarChart
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
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getMonth() + 1}/${date.getDate()}`
              }}
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
              labelFormatter={(label) => {
                const date = new Date(label)
                return date.toLocaleDateString()
              }}
            />
            <Bar dataKey="count" fill="currentColor" className="fill-primary/70" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </AnimatePresence>
  )
}

