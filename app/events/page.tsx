"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import EventsList from "@/components/events/events-list"
import DateRangePicker from "@/components/events/date-range-picker"
import EventTypeFilter from "@/components/events/event-type-filter"
import { LoadingCard } from "@/components/ui/loading-spinner"
import { AnimatePresence, motion } from "framer-motion"

export default function EventsPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [events, setEvents] = useState<any[]>([])
  const [detections, setDetections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [eventTypes, setEventTypes] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchEvents()
    fetchDetections()
  }, [dateRange])

  const fetchEvents = async () => {
    try {
      setLoading(true)

      // Build query params
      const queryParams = new URLSearchParams()
      if (dateRange.from) {
        queryParams.append("from", dateRange.from.toISOString())
      }
      if (dateRange.to) {
        queryParams.append("to", dateRange.to.toISOString())
      }
      if (eventTypes.length > 0) {
        eventTypes.forEach((type) => {
          queryParams.append("types", type)
        })
      }

      try {
        const response = await axios.get(`/api/events?${queryParams.toString()}`)
        if (Array.isArray(response.data)) {
          setEvents(response.data)
          return
        }
      } catch (error) {
        console.error("API error:", error)
      }

      // Fallback mock data
      const mockEvents = [
        {
          id: "evt-001",
          timestamp: "2023-04-07T08:23:15Z",
          event_type: "system",
          message: "System started",
          camera_id: null,
        },
        {
          id: "evt-002",
          timestamp: "2023-04-07T09:15:22Z",
          event_type: "error",
          message: "Connection lost to camera cam-002",
          camera_id: "cam-002",
        },
        {
          id: "evt-003",
          timestamp: "2023-04-07T10:45:11Z",
          event_type: "config",
          message: "ROI updated for camera cam-001",
          camera_id: "cam-001",
        },
        {
          id: "evt-004",
          timestamp: "2023-04-07T12:30:45Z",
          event_type: "system",
          message: "Detection system paused",
          camera_id: null,
        },
        {
          id: "evt-005",
          timestamp: "2023-04-07T13:05:33Z",
          event_type: "config",
          message: "New camera added: Side Gate",
          camera_id: "cam-006",
        },
      ]
      setEvents(mockEvents)
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchDetections = async () => {
    try {
      setLoading(true)

      // Build query params
      const queryParams = new URLSearchParams()
      if (dateRange.from) {
        queryParams.append("from", dateRange.from.toISOString())
      }
      if (dateRange.to) {
        queryParams.append("to", dateRange.to.toISOString())
      }

      try {
        const response = await axios.get(`/api/detections/recent?${queryParams.toString()}`)
        if (Array.isArray(response.data)) {
          setDetections(response.data)
          return
        }
      } catch (error) {
        console.error("API error:", error)
      }

      // Fallback mock data
      const mockDetections = [
        {
          id: "det-001",
          timestamp: "2023-04-07T08:30:15Z",
          camera_id: "cam-001",
          direction: "LTR",
          confidence: 0.92,
          snapshot_path: "/snapshots/det-001.jpg",
        },
        {
          id: "det-002",
          timestamp: "2023-04-07T09:12:33Z",
          camera_id: "cam-003",
          direction: "RTL",
          confidence: 0.87,
          snapshot_path: "/snapshots/det-002.jpg",
        },
        {
          id: "det-003",
          timestamp: "2023-04-07T10:05:22Z",
          camera_id: "cam-001",
          direction: "LTR",
          confidence: 0.95,
          snapshot_path: "/snapshots/det-003.jpg",
        },
        {
          id: "det-004",
          timestamp: "2023-04-07T11:45:10Z",
          camera_id: "cam-005",
          direction: "RTL",
          confidence: 0.89,
          snapshot_path: "/snapshots/det-004.jpg",
        },
        {
          id: "det-005",
          timestamp: "2023-04-07T12:33:45Z",
          camera_id: "cam-003",
          direction: "LTR",
          confidence: 0.91,
          snapshot_path: "/snapshots/det-005.jpg",
        },
      ]
      setDetections(mockDetections)
    } catch (error) {
      console.error("Error fetching detections:", error)
      toast({
        title: "Error",
        description: "Failed to load detection events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range)
  }

  const handleEventTypeChange = (types: string[]) => {
    setEventTypes(types)
    fetchEvents()
  }

  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined })
    setEventTypes([])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Events & Logs</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="glass" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <DateRangePicker dateRange={dateRange} onDateRangeChange={handleDateRangeChange} />
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card p-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <EventTypeFilter selectedTypes={eventTypes} onTypeChange={handleEventTypeChange} />
                <Button variant="ghost" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="glass mb-6">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="detections">Detections</TabsTrigger>
          <TabsTrigger value="system">System Events</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {loading ? <LoadingCard height="h-64" /> : <EventsList events={[...detections, ...events]} type="all" />}
        </TabsContent>

        <TabsContent value="detections" className="mt-0">
          {loading ? <LoadingCard height="h-64" /> : <EventsList events={detections} type="detections" />}
        </TabsContent>

        <TabsContent value="system" className="mt-0">
          {loading ? <LoadingCard height="h-64" /> : <EventsList events={events} type="system" />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

