"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Filter, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import EventsList from "@/components/events/events-list"
import DateRangePicker from "@/components/events/date-range-picker"
import EventTypeFilter from "@/components/events/event-type-filter"
import { LoadingCard } from "@/components/ui/loading-spinner"
import { AnimatePresence, motion } from "framer-motion"
import apiClient from "@/lib/api-client"

export default function EventsPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [events, setEvents] = useState<any[]>([])
  const [detections, setDetections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cameras, setCameras] = useState<any[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>("")
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
    fetchCameras()
  }, [])

  useEffect(() => {
    fetchEvents()
    if (selectedCamera) {
      fetchDetections()
    }
  }, [dateRange, selectedCamera])

  const fetchCameras = async () => {
    try {
      try {
        const response = await apiClient.get("/cameras")
        if (Array.isArray(response.data)) {
          const activeCameras = response.data.filter(camera => camera.status === 'active')
          setCameras(activeCameras)
          if (activeCameras.length > 0 && !selectedCamera) {
            setSelectedCamera(activeCameras[0].id)
          }
          return
        }
      } catch (error) {
        console.error("API error:", error)
      }

      // Fallback mock data
      const mockCameras = [
        {
          id: "cam-001",
          name: "Front Door",
          status: "active",
        },
        {
          id: "cam-003",
          name: "Garage",
          status: "active",
        },
        {
          id: "cam-005",
          name: "Driveway",
          status: "active",
        },
      ]
      setCameras(mockCameras)
      if (mockCameras.length > 0 && !selectedCamera) {
        setSelectedCamera(mockCameras[0].id)
      }
    } catch (error) {
      console.error("Error fetching cameras:", error)
      toast({
        title: "Error",
        description: "Failed to load cameras. Please try again.",
        variant: "destructive",
      })
    }
  }

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
        const response = await apiClient.get(`/events?${queryParams.toString()}`)
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

      if (!selectedCamera) {
        setDetections([])
        return
      }

      // Build query params for date filters
      const queryParams = new URLSearchParams()
      if (dateRange.from) {
        queryParams.append("from", dateRange.from.toISOString())
      }
      if (dateRange.to) {
        queryParams.append("to", dateRange.to.toISOString())
      }

      try {
        // Use the snapshots API endpoint with apiClient
        const response = await apiClient.get(`/snapshots/${selectedCamera}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`)
        if (response.data && response.data.snapshots) {
          // Map snapshots to the expected format for EventsList
          const mappedDetections = response.data.snapshots.map((snapshot: any) => ({
            id: snapshot.id.toString(),
            timestamp: snapshot.timestamp,
            camera_id: response.data.camera_id,
            event_type: snapshot.event_type || "detection",
            direction: snapshot.direction,
            snapshot_path: snapshot.url, // Use the url property for the path
            url: snapshot.url // Store original url for constructing full URL in SnapshotPreview
          }))
          setDetections(mappedDetections)
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

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined } | { from: Date | undefined; to?: Date | undefined }) => {
    setDateRange({
      from: range.from,
      to: range.to || undefined
    })
  }

  const handleEventTypeChange = (types: string[]) => {
    setEventTypes(types)
    fetchEvents()
  }

  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId)
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
          
          <Select value={selectedCamera} onValueChange={handleCameraChange}>
            <SelectTrigger className="w-[200px] glass">
              <Camera className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select camera" />
            </SelectTrigger>
            <SelectContent>
              {cameras.map((camera) => (
                <SelectItem key={camera.id} value={camera.id}>
                  {camera.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
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
          {loading ? (
            <LoadingCard height="h-64" />
          ) : detections.length === 0 && selectedCamera ? (
            <Card className="glass-card p-6 text-center">
              <p className="text-muted-foreground">No detection events found for the selected camera.</p>
            </Card>
          ) : (
            <EventsList events={detections} type="detections" />
          )}
        </TabsContent>

        <TabsContent value="system" className="mt-0">
          {loading ? <LoadingCard height="h-64" /> : <EventsList events={events} type="system" />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

