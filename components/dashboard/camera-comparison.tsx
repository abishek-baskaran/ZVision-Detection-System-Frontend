"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios"
import { LoadingCard } from "@/components/ui/loading-spinner"
import { AnimatePresence, motion } from "framer-motion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

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
  const [error, setError] = useState<string | null>(null)
  const [metric, setMetric] = useState<string>("count")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Try to fetch from API
        try {
          const response = await axios.get(`/api/analytics/compare?timeRange=${timeRange}`)
          if (response.data && 
              response.data.cameras && 
              Array.isArray(response.data.cameras) &&
              response.data.cameras.length > 0) {
            setData(response.data.cameras)
            return
          } else {
            setError("Invalid data format received from API")
          }
        } catch (error) {
          console.error("API error:", error)
          setError("Failed to load camera comparison data. Please try again later.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  if (loading) {
    return <LoadingCard height="h-[400px]" />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="h-[400px] flex flex-col justify-center">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!data.length) {
    return (
      <Alert className="h-[400px] flex flex-col justify-center">
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No camera comparison data available for the selected time range.</AlertDescription>
      </Alert>
    )
  }

  // Ensure all required data fields exist and have valid values
  const validatedData = data.map(camera => ({
    name: camera.name || 'Unknown',
    count: typeof camera.count === 'number' ? camera.count : 0,
    ltr: typeof camera.ltr === 'number' ? camera.ltr : 0,
    rtl: typeof camera.rtl === 'number' ? camera.rtl : 0
  }));

  const chartData =
    metric === "direction"
      ? validatedData.map((camera) => ({ name: camera.name, ltr: camera.ltr, rtl: camera.rtl }))
      : validatedData.map((camera) => ({ name: camera.name, count: camera.count }));

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

