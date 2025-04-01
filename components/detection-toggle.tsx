"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DetectionToggleProps {
  initialState?: boolean
  size?: "default" | "sm" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function DetectionToggle({ initialState = false, size = "default", variant = "default" }: DetectionToggleProps) {
  const [isDetectionActive, setIsDetectionActive] = useState(initialState)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const toggleDetection = async () => {
    setIsLoading(true)
    try {
      const endpoint = isDetectionActive ? "/api/detection/stop" : "/api/detection/start"

      await axios.post(endpoint)

      // Toggle the state if successful
      setIsDetectionActive(!isDetectionActive)

      // Show success notification
      toast({
        title: isDetectionActive ? "Detection Stopped" : "Detection Started",
        description: isDetectionActive ? "Global detection has been disabled." : "Global detection is now active.",
        className: "detection-toast",
      })
    } catch (error) {
      console.error("Error toggling detection:", error)

      // Show error notification
      toast({
        title: "Error",
        description: `Failed to ${isDetectionActive ? "stop" : "start"} detection. Please try again.`,
        variant: "destructive",
        className: "detection-toast",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleDetection}
            disabled={isLoading}
            size={size}
            variant={variant}
            className="relative glass transition-all duration-300"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing
              </span>
            ) : isDetectionActive ? (
              <>
                <Eye className="h-4 w-4 mr-2" />
                <span>Detection Active</span>
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                <span>Detection Inactive</span>
              </>
            )}
            {isDetectionActive && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle global detection for all cameras</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function CameraDetectionToggle({
  cameraId,
  initialState = false,
}: {
  cameraId: string
  initialState?: boolean
}) {
  const [isDetectionEnabled, setIsDetectionEnabled] = useState(initialState)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const toggleCameraDetection = async () => {
    setIsLoading(true)
    try {
      // Update camera detection state
      await axios.put(`/api/cameras/${cameraId}`, {
        detection_enabled: !isDetectionEnabled,
      })

      // Toggle the state if successful
      setIsDetectionEnabled(!isDetectionEnabled)

      // Show success notification
      toast({
        title: isDetectionEnabled ? "Detection Disabled" : "Detection Enabled",
        description: `Detection for this camera has been ${isDetectionEnabled ? "disabled" : "enabled"}.`,
        className: "detection-toast",
      })
    } catch (error) {
      console.error("Error toggling camera detection:", error)

      // Show error notification
      toast({
        title: "Error",
        description: `Failed to ${isDetectionEnabled ? "disable" : "enable"} detection for this camera.`,
        variant: "destructive",
        className: "detection-toast",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={toggleCameraDetection}
      disabled={isLoading}
      size="sm"
      variant="outline"
      className={`
        glass transition-all duration-300 flex items-center gap-2
        ${isDetectionEnabled ? "border-green-500/50" : "border-muted/50"}
      `}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : isDetectionEnabled ? (
        <Eye className="h-4 w-4" />
      ) : (
        <EyeOff className="h-4 w-4" />
      )}
      <span>{isDetectionEnabled ? "Detection On" : "Detection Off"}</span>
      {isDetectionEnabled && <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>}
    </Button>
  )
}

