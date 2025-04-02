"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cameraService } from "@/lib/services"
import { Camera } from "@/lib/services/camera-service"
import { CameraIcon } from "lucide-react"

interface CameraSelectorProps {
  value: string | null
  onChange: (value: string | null) => void
}

export default function CameraSelector({ value, onChange }: CameraSelectorProps) {
  const [cameras, setCameras] = useState<Camera[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const result = await cameraService.getCameras()
        setCameras(result)
        setLoading(false)
        
        // Don't automatically select the first camera on initial load
        // This allows the "All Cameras" option to be the default
      } catch (error) {
        console.error("Failed to fetch cameras:", error)
        setLoading(false)
      }
    }
    
    fetchCameras()
  }, [])  // Remove value and onChange from the dependency array

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center text-sm text-muted-foreground">
        <CameraIcon className="h-3.5 w-3.5 mr-1" />
        <span>Camera:</span>
      </div>
      <Select 
        value={value || ""} 
        onValueChange={(val) => onChange(val === "all" ? null : val)}
        disabled={loading || cameras.length === 0}
      >
        <SelectTrigger className="w-[180px] glass border-primary/20 bg-card/50 focus:ring-primary/30">
          <SelectValue placeholder={loading ? "Loading..." : "Select camera"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cameras</SelectItem>
          {cameras.map((camera) => (
            <SelectItem key={camera.id} value={camera.id}>
              {camera.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 