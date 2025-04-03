"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { Camera, Eye, EyeOff, Settings, SplitSquareVertical } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import VideoFeed from "@/components/live/video-feed"
import StatusPanel from "@/components/live/status-panel"
import DetectionIndicator from "@/components/live/detection-indicator"
import WebSocketClient from "@/components/live/websocket-client"
import { LoadingOverlay } from "@/components/ui/loading-spinner"
import { AnimatePresence, motion } from "framer-motion"

interface CameraInterface {
  id: string
  name: string
  source: string
  active: boolean
  status?: string
  detection_enabled: boolean
}

interface Status {
  detection_active: boolean
  person_detected: boolean
  last_detection_time?: string
  camera_id?: string
  direction?: "LTR" | "RTL"
}

export default function LivePage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const initialCameraId = searchParams.get("camera") || "cam-001"

  const [cameras, setCameras] = useState<CameraInterface[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>(initialCameraId)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<Status>({
    detection_active: false,
    person_detected: false,
  })
  const [showSettings, setShowSettings] = useState(false)
  const [useWebSocket, setUseWebSocket] = useState(false)
  const [wsConnected, setWsConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<any>(null)
  const [splitView, setSplitView] = useState(false)
  const [showSplitViewHint, setShowSplitViewHint] = useState(true);
  const [showSingleViewHint, setShowSingleViewHint] = useState(true);

  const statusPollRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchCameras()

    // Start polling for status
    startStatusPolling()

    return () => {
      // Clean up on unmount
      if (statusPollRef.current) {
        clearInterval(statusPollRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // When selected camera changes, reset status and start polling again
    if (statusPollRef.current) {
      clearInterval(statusPollRef.current)
    }
    setStatus({
      detection_active: false,
      person_detected: false,
    })
    startStatusPolling()
  }, [selectedCamera])

  // Hide hints after a delay
  useEffect(() => {
    const splitViewTimer = setTimeout(() => {
      setShowSplitViewHint(false);
    }, 5000);
    
    const singleViewTimer = setTimeout(() => {
      setShowSingleViewHint(false);
    }, 5000);
    
    return () => {
      clearTimeout(splitViewTimer);
      clearTimeout(singleViewTimer);
    };
  }, [splitView]);
  
  // Reset hint visibility when view mode changes
  useEffect(() => {
    setShowSplitViewHint(true);
    setShowSingleViewHint(true);
  }, [splitView]);

  const fetchCameras = async () => {
    try {
      setLoading(true)

      try {
        const response = await axios.get("/api/cameras")
        if (Array.isArray(response.data)) {
          // Map the response data to include 'active' status based on 'status' field
          const camerasWithActiveStatus = response.data.map(camera => ({
            ...camera,
            // Set active to true if status is 'active', otherwise false
            active: camera.status === 'active'
          }));
          setCameras(camerasWithActiveStatus)
          
          // If URL doesn't specify a camera or the specified camera isn't active,
          // select the first active camera
          if (!searchParams.get("camera") || 
              !camerasWithActiveStatus.some(cam => cam.id === initialCameraId && cam.active)) {
            const firstActiveCamera = camerasWithActiveStatus.find(cam => cam.active)
            if (firstActiveCamera) {
              setSelectedCamera(firstActiveCamera.id)
            }
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
          source: "rtsp://192.168.1.100:554/stream1",
          active: true,
          detection_enabled: true,
        },
        {
          id: "cam-002",
          name: "Backyard",
          source: "rtsp://192.168.1.101:554/stream1",
          active: false,
          detection_enabled: false,
        },
        {
          id: "cam-003",
          name: "Garage",
          source: "rtsp://192.168.1.102:554/stream1",
          active: true,
          detection_enabled: true,
        },
        {
          id: "cam-004",
          name: "Side Entrance",
          source: "rtsp://192.168.1.103:554/stream1",
          active: true,
          detection_enabled: false,
        },
        {
          id: "cam-005",
          name: "Driveway",
          source: "rtsp://192.168.1.104:554/stream1",
          active: true,
          detection_enabled: true,
        },
      ]
      setCameras(mockCameras)
      
      // For mock data, select first active camera if URL parameter is not provided
      // or the specified camera isn't active
      if (!searchParams.get("camera") || 
          !mockCameras.some(cam => cam.id === initialCameraId && cam.active)) {
        const firstActiveCamera = mockCameras.find(cam => cam.active)
        if (firstActiveCamera) {
          setSelectedCamera(firstActiveCamera.id)
        }
      }
    } catch (error) {
      console.error("Error fetching cameras:", error)
      toast({
        title: "Error",
        description: "Failed to load cameras. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startStatusPolling = () => {
    // Poll every 2 seconds
    fetchStatus() // Initial fetch
    statusPollRef.current = setInterval(fetchStatus, 2000)
  }

  const fetchStatus = async () => {
    try {
      try {
        const response = await axios.get(`/api/status?camera_id=${selectedCamera}`)
        if (response.data && typeof response.data === "object") {
          setStatus(response.data)
          return
        }
      } catch (error) {
        console.error("API error:", error)
      }

      // Fallback mock data - randomly change detection status for demo
      const mockStatus: Status = {
        detection_active: Math.random() > 0.3, // 70% chance of being active
        person_detected: Math.random() > 0.7, // 30% chance of person detected
      }

      if (mockStatus.person_detected) {
        mockStatus.last_detection_time = new Date().toISOString()
        mockStatus.camera_id = selectedCamera
        mockStatus.direction = Math.random() > 0.5 ? "LTR" : "RTL"
      }

      setStatus(mockStatus)
    } catch (error) {
      console.error("Error fetching status:", error)
    }
  }

  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId)
  }

  const handleDetectionToggle = async (cameraId: string, enabled: boolean) => {
    try {
      await axios.put(`/api/cameras/${cameraId}`, {
        detection_enabled: enabled,
      })

      // Update local state
      setCameras(cameras.map((cam) => (cam.id === cameraId ? { ...cam, detection_enabled: enabled } : cam)))

      toast({
        title: enabled ? "Detection Enabled" : "Detection Disabled",
        description: `Detection for ${cameras.find((c) => c.id === cameraId)?.name} has been ${enabled ? "enabled" : "disabled"}.`,
      })
    } catch (error) {
      console.error("Error toggling detection:", error)
      toast({
        title: "Error",
        description: "Failed to update detection settings.",
        variant: "destructive",
      })
    }
  }

  const handleWebSocketMessage = (event: any) => {
    try {
      const data = JSON.parse(event.data)
      setLastEvent(data)

      // If it's a detection event for the current camera, update status
      if (data.type === "detection" && data.camera_id === selectedCamera) {
        setStatus({
          detection_active: true,
          person_detected: true,
          last_detection_time: data.timestamp,
          camera_id: data.camera_id,
          direction: data.direction,
        })
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error)
    }
  }

  const selectedCameraData = cameras.find((cam) => cam.id === selectedCamera)

  // Add handlers for single and double clicks
  const handleCameraSingleClick = (cameraId: string) => {
    // Only select the camera, don't change the view mode
    setSelectedCamera(cameraId);
  };

  const handleCameraDoubleClick = (cameraId: string) => {
    // If in split view, switch to single view with the double-clicked camera
    if (splitView) {
      setSelectedCamera(cameraId);
      setSplitView(false);
    } else {
      // If in single view, switch to split view
      setSplitView(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Live Camera View</h1>
        <div className="flex items-center space-x-2">
          <Select value={selectedCamera} onValueChange={handleCameraChange}>
            <SelectTrigger className="w-[200px] glass">
              <SelectValue placeholder="Select camera" />
            </SelectTrigger>
            <SelectContent>
              {cameras.map((camera) => (
                <SelectItem key={camera.id} value={camera.id} disabled={!camera.active}>
                  {camera.name} {!camera.active && "(Inactive)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="glass" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="relative">
            {/* Layered glass panel behind video feed */}
            <div className="absolute inset-0 glass rounded-xl transform translate-y-2 translate-x-2 -z-10 opacity-50"></div>
            <div className="absolute inset-0 glass rounded-xl transform translate-y-1 translate-x-1 -z-5 opacity-70"></div>

            <Card className="glass-card overflow-hidden rounded-xl shadow-lg">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center h-[500px]"
                  >
                    <LoadingOverlay text="Loading camera feed..." />
                  </motion.div>
                ) : splitView ? (
                  // Split view mode - show all cameras in a grid
                  <motion.div
                    key="split-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid gap-3 p-2 auto-rows-auto"
                    style={{ 
                      gridTemplateColumns: `repeat(${
                        cameras.filter(c => c.active).length <= 1 
                          ? 1 
                          : cameras.filter(c => c.active).length <= 4 
                            ? Math.min(2, cameras.filter(c => c.active).length)
                            : Math.min(3, cameras.filter(c => c.active).length)
                      }, minmax(0, 1fr))`,
                      height: 'auto'
                    }}
                  >
                    {/* Helper tooltip for split view */}
                    {showSplitViewHint && (
                      <motion.div 
                        className="absolute top-4 right-4 glass px-3 py-1 rounded-md text-xs opacity-80 z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <p>Double-click a camera to focus</p>
                      </motion.div>
                    )}
                    
                    {cameras.filter(camera => camera.active).length === 0 ? (
                      <div className="col-span-full flex justify-center items-center h-[500px] bg-black/10 rounded-lg">
                        <div className="text-center">
                          <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                          <h3 className="text-xl font-medium mb-2">No Active Cameras</h3>
                          <p className="text-muted-foreground">There are no active cameras to display.</p>
                        </div>
                      </div>
                    ) : (
                      cameras.filter(camera => camera.active).map(camera => {
                        // Calculate if we should use compact mode based on number of cameras
                        const activeCameras = cameras.filter(c => c.active).length;
                        const useCompactMode = activeCameras > 2;
                        
                        return (
                          <div 
                            key={camera.id} 
                            className={`relative rounded-lg overflow-hidden transition-all duration-200 
                              ${camera.id === selectedCamera ? 'ring-2 ring-primary shadow-lg' : 'hover:ring-1 hover:ring-primary/50'}
                              ${useCompactMode ? 'aspect-video' : 'aspect-video'}
                              cursor-pointer
                            `}
                            onClick={() => handleCameraSingleClick(camera.id)}
                            onDoubleClick={() => handleCameraDoubleClick(camera.id)}
                          >
                            <VideoFeed 
                              cameraId={camera.id} 
                              isCompact={useCompactMode}
                            />
                            
                            {/* Camera name overlay */}
                            <div className="absolute top-2 left-2 glass px-2 py-1 rounded-md text-xs flex items-center">
                              <Camera className="h-3 w-3 mr-1" />
                              <span>{camera.name}</span>
                            </div>
                            
                            {/* Detection status indicator */}
                            <div className="absolute top-2 right-2 glass px-2 py-1 rounded-md text-xs flex items-center">
                              {camera.detection_enabled ? (
                                <>
                                  <Eye className="h-3 w-3 mr-1 text-green-500" />
                                  <span>Detection On</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3 w-3 mr-1 text-muted-foreground" />
                                  <span>Detection Off</span>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </motion.div>
                ) : !selectedCameraData?.active ? (
                  <motion.div
                    key="inactive"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center items-center h-[500px] bg-black/10"
                  >
                    <div className="text-center">
                      <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-xl font-medium mb-2">Camera Inactive</h3>
                      <p className="text-muted-foreground">This camera is currently offline or disabled.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative cursor-pointer w-full aspect-video"
                    onDoubleClick={() => handleCameraDoubleClick(selectedCamera)}
                  >
                    <VideoFeed cameraId={selectedCamera} />

                    {/* Detection indicator overlay */}
                    {status.person_detected && (
                      <DetectionIndicator direction={status.direction} timestamp={status.last_detection_time} />
                    )}

                    {/* Helper tooltip for single view */}
                    {showSingleViewHint && (
                      <motion.div 
                        className="absolute bottom-4 right-4 glass px-3 py-1 rounded-md text-xs opacity-80 z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <p>Double-click to see all cameras</p>
                      </motion.div>
                    )}
                    
                    {/* Camera info overlay */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute top-4 left-4 glass px-3 py-1 rounded-md text-sm flex items-center"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      <span>{selectedCameraData?.name}</span>
                    </motion.div>

                    {/* Detection status indicator */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute top-4 right-4 glass px-3 py-1 rounded-md text-sm flex items-center"
                    >
                      {selectedCameraData?.detection_enabled ? (
                        <>
                          <Eye className="h-4 w-4 mr-2 text-green-500" />
                          <span>Detection Active</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Detection Inactive</span>
                        </>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-1">
          <StatusPanel camera={selectedCameraData} status={status} onDetectionToggle={handleDetectionToggle} />

          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-card p-4 mt-6">
                  <h3 className="text-lg font-medium mb-4">Settings</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="websocket">WebSocket Updates</Label>
                        <p className="text-xs text-muted-foreground">Enable real-time updates via WebSocket</p>
                      </div>
                      <Switch id="websocket" checked={useWebSocket} onCheckedChange={setUseWebSocket} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Split View</Label>
                        <p className="text-xs text-muted-foreground">Show multiple cameras at once</p>
                      </div>
                      <Button variant="outline" size="sm" className={`glass hover-lift ${splitView ? 'bg-primary/10' : ''}`} onClick={() => setSplitView(!splitView)}>
                        <SplitSquareVertical className="h-4 w-4 mr-2" />
                        {splitView ? "Single View" : "Multi-Camera"}
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Video Quality</Label>
                        <p className="text-xs text-muted-foreground">Adjust streaming quality</p>
                      </div>
                      <Select defaultValue="medium">
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {useWebSocket && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="glass-card p-4 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">WebSocket</h3>
                    <Badge variant={wsConnected ? "default" : "outline"}>
                      {wsConnected ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>

                  <WebSocketClient onMessage={handleWebSocketMessage} onConnectionChange={setWsConnected} />

                  {lastEvent && (
                    <motion.div
                      className="mt-4 p-3 bg-background/50 rounded-md text-sm"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="font-medium mb-1">Last Event:</p>
                      <pre className="text-xs overflow-auto">{JSON.stringify(lastEvent, null, 2)}</pre>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

