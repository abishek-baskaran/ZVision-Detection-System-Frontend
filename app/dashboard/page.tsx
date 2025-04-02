"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FootfallMetrics from "@/components/dashboard/footfall-metrics"
import DirectionMetrics from "@/components/dashboard/direction-metrics"
import HourlyMetrics from "@/components/dashboard/hourly-metrics"
import DailyMetrics from "@/components/dashboard/daily-metrics"
import SummaryMetrics from "@/components/dashboard/summary-metrics"
import CameraComparison from "@/components/dashboard/camera-comparison"
import TimeRangeSelector from "@/components/dashboard/time-range-selector"
import CameraSelector from "@/components/dashboard/camera-selector"

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<string>("7d")
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Analytics Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <CameraSelector value={selectedCamera} onChange={setSelectedCamera} />
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <FootfallMetrics timeRange={timeRange} cameraId={selectedCamera} />
        <DirectionMetrics timeRange={timeRange} cameraId={selectedCamera} />
        <SummaryMetrics timeRange={timeRange} cameraId={selectedCamera} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="glass p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Hourly Traffic</h2>
          <HourlyMetrics timeRange={timeRange} cameraId={selectedCamera} />
        </Card>

        <Card className="glass p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Daily Traffic</h2>
          <DailyMetrics timeRange={timeRange} cameraId={selectedCamera} />
        </Card>
      </div>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="glass mb-6">
          <TabsTrigger value="comparison">Camera Comparison</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="mt-0">
          <Card className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Camera Comparison</h2>
            <CameraComparison timeRange={timeRange} />
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-0">
          <Card className="glass p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Trend Analysis</h2>
            <p className="text-muted-foreground">
              Analyze traffic trends over time to identify patterns and anomalies.
            </p>
            {/* Trend analysis content would go here */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

