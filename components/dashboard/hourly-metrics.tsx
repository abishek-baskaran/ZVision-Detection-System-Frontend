"use client"

import { useEffect, useState, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import axios from "axios"
import { LoadingCard } from "@/components/ui/loading-spinner"
import { AnimatePresence, motion } from "framer-motion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export interface HourlyData {
  hour: string
  date: string
  count: number
}

export default function HourlyMetrics({ timeRange, cameraId }: { timeRange: string, cameraId: string | null }) {
  const [data, setData] = useState<HourlyData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Add cameraId to the API request if available
        const cameraParam = cameraId ? `&cam_id=${cameraId}` : ''
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/metrics?timeRange=${timeRange}${cameraParam}`)
        if (response.data && response.data.hourlyData && Array.isArray(response.data.hourlyData)) {
          setData(response.data.hourlyData)
        } else {
          setError("Invalid data format received from API")
        }
      } catch (error) {
        console.error("API error:", error)
        setError("Failed to load metrics data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange, cameraId])

  // Process the data for better display
  const processedData = useMemo(() => {
    // Group by date
    const groupedByDate = data.reduce<Record<string, HourlyData[]>>((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {});

    // Get the most recent dates (up to 3)
    const dates = Object.keys(groupedByDate).sort().slice(-3);
    
    // For each date, get the hourly data
    const result = dates.flatMap(date => {
      return groupedByDate[date].map(item => ({
        ...item,
        // Create a formatted label with date and hour
        formattedTime: `${formatDate(new Date(item.date))} ${item.hour}`
      }));
    });

    return result;
  }, [data]);

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
        <AlertDescription>No hourly metrics data available for the selected time range.</AlertDescription>
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
          <LineChart
            data={processedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 20, // Increased bottom margin for labels
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis
              dataKey="formattedTime"
              tick={{ fontSize: 10 }}
              interval={Math.ceil(processedData.length / 10)} // Show fewer ticks
              angle={-45} // Angle the labels
              textAnchor="end" // Align text end
              height={50} // More height for angled labels
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

// Helper function to format date for display
function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

