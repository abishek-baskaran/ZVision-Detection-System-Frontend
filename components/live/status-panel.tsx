"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ArrowLeftRight, Camera, Clock, Eye, EyeOff, PersonStanding, Shield } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface StatusPanelProps {
  camera:
    | {
        id: string
        name: string
        source: string
        active: boolean
        detection_enabled: boolean
      }
    | undefined
  status: {
    detection_active: boolean
    person_detected: boolean
    last_detection_time?: string
    camera_id?: string
    direction?: "LTR" | "RTL"
  }
  onDetectionToggle: (cameraId: string, enabled: boolean) => void
}

export default function StatusPanel({ camera, status, onDetectionToggle }: StatusPanelProps) {
  const [isToggling, setIsToggling] = useState(false)

  if (!camera) {
    return (
      <Card className="glass-card p-4">
        <div className="text-center py-8 text-muted-foreground">
          <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No camera selected</p>
        </div>
      </Card>
    )
  }

  const handleToggleDetection = async () => {
    setIsToggling(true)
    try {
      await onDetectionToggle(camera.id, !camera.detection_enabled)
    } finally {
      setIsToggling(false)
    }
  }

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "N/A"
    try {
      return format(new Date(timestamp), "MMM d, yyyy h:mm:ss a")
    } catch (e) {
      return timestamp
    }
  }

  return (
    <Card className="glass-layered p-4 rounded-xl">
      <motion.h3
        className="text-lg font-medium mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Camera Status
      </motion.h3>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <p className="text-sm text-muted-foreground mb-1">Camera:</p>
          <div className="flex items-center">
            <Camera className="h-4 w-4 mr-2" />
            <span className="font-medium">{camera.name}</span>
          </div>
          <Badge variant={camera.active ? "default" : "outline"} className="mt-2">
            {camera.active ? "Active" : "Inactive"}
          </Badge>
        </motion.div>

        <Separator />

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <p className="text-sm text-muted-foreground mb-1">Detection Status:</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {camera.detection_enabled ? (
                <Eye className="h-4 w-4 mr-2 text-green-500" />
              ) : (
                <EyeOff className="h-4 w-4 mr-2 text-muted-foreground" />
              )}
              <span>Detection {camera.detection_enabled ? "Enabled" : "Disabled"}</span>
            </div>
            <Switch
              checked={camera.detection_enabled}
              onCheckedChange={() => handleToggleDetection()}
              disabled={isToggling || !camera.active}
            />
          </div>
        </motion.div>

        <Separator />

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground mb-1">Current Status:</p>
          <div className="space-y-2">
            <div className="flex items-center">
              <Shield
                className={`h-4 w-4 mr-2 ${status.detection_active ? "text-green-500" : "text-muted-foreground"}`}
              />
              <span>System {status.detection_active ? "Active" : "Inactive"}</span>
            </div>

            <div className="flex items-center">
              <PersonStanding
                className={`h-4 w-4 mr-2 ${status.person_detected ? "text-primary" : "text-muted-foreground"}`}
              />
              <span>Person {status.person_detected ? "Detected" : "Not Detected"}</span>
            </div>

            {status.direction && status.person_detected && (
              <div className="flex items-center">
                <ArrowLeftRight className="h-4 w-4 mr-2 text-primary" />
                <span>Direction: {status.direction}</span>
              </div>
            )}
          </div>
        </motion.div>

        {status.last_detection_time && (
          <>
            <Separator />

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <p className="text-sm text-muted-foreground mb-1">Last Detection:</p>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{formatTimestamp(status.last_detection_time)}</span>
              </div>
            </motion.div>
          </>
        )}

        <Separator />

        <motion.div
          className="pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Button variant="outline" className="w-full glass hover-lift" disabled={!camera.active}>
            <Shield className="h-4 w-4 mr-2" />
            View Detection History
          </Button>
        </motion.div>
      </div>
    </Card>
  )
}

