"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import { LoadingCard } from "@/components/ui/loading-spinner"
import { AnimatePresence, motion } from "framer-motion"

interface CameraData {
  name: string
  id: string
  count: number
  ltr: number
  rtl: number
}

interface ComparisonData {
  cameras: CameraData[]
}

export default function CameraComparison({ timeRange }: { timeRange: string }) {
  const [data, setData] = useState<CameraData[]>([])
  const [loading, setLoading] = useState(true)
  const [metric, setMetric] = useState<string>("count")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Try to fetch from API
        try {
          const response = await axios.get(`/api/analytics/compare?timeRange=${timeRange}`)
          if (response.data && response.data.cameras && Array.isArray(response.data.cameras)) {
            setData(response.data.cameras)
            return
          }
        } catch (error) {
          console.error("API error:", error)
        }

        // Fallback to mock data
        const mockData: CameraData[] = [
          { name: "Front Door", id: "cam-001", count: 425, ltr: 245, rtl: 180 },
          { name: "Backyard", id: "cam-002", count: 132, ltr: 85, rtl: 47 },
          { name: "Garage", id: "cam-003", count: 318, ltr: 190, rtl: 128 },
          { name: "Side Entrance", id: "cam-004", count: 215, ltr: 120, rtl: 95 },
          { name: "Driveway", id: "cam-005", count: 158, ltr: 102, rtl: 56 },
        ]
        setData(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  if (loading) {
    return <LoadingCard height="h-[400px]" />
  }

  const chartData =
    metric === "count"
      ? data.map((camera) => ({ name: camera.name, count: camera.count }))
      : data.map((camera) => ({ name: camera.name, ltr: camera.ltr, rtl: camera.rtl }))

  return (
    <AnimatePresence mode="wait">
      <div>
        <div className="flex justify-end mb-4">
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-[180px] glass">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="count">Total Count</SelectItem>
              <SelectItem value="direction">Direction Breakdown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <motion.div
          className="h-[400px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value) => [`${value} people`, ""]}
              />
              {metric === "count" ? (
                <Bar
                  dataKey="count"
                  fill="currentColor"
                  className="fill-primary/70"
                  radius={[4, 4, 0, 0]}
                  name="Total Count"
                />
              ) : (
                <>
                  <Legend />
                  <Bar dataKey="ltr" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Left to Right" />
                  <Bar dataKey="rtl" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Right to Left" />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

