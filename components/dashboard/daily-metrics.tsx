"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import axios from "axios"
import { LoadingCard } from "@/components/ui/loading-spinner"
import { AnimatePresence, motion } from "framer-motion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface DailyData {
  date: string
  count: number
}

export default function DailyMetrics({ timeRange, cameraId }: { timeRange: string, cameraId: string | null }) {
  const [data, setData] = useState<DailyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const cameraParam = cameraId ? `&cam_id=${cameraId}` : ''
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/metrics/daily?timeRange=${timeRange}${cameraParam}`)
        if (response.data && Array.isArray(response.data)) {
          setData(response.data)
        } else {
          setError("Invalid data format received from API")
        }
      } catch (error) {
        console.error("API error:", error)
        setError("Failed to load daily metrics data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange, cameraId])

  if (loading) {
    return <LoadingCard height="h-[300px]" />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="h-[300px] flex flex-col justify-center">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!data.length) {
    return (
      <Alert className="h-[300px] flex flex-col justify-center">
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No daily metrics data available for the selected time range.</AlertDescription>
      </Alert>
    )
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

