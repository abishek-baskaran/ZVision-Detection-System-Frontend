"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Camera, ArrowLeftRight, AlertTriangle, Settings, Info } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import SnapshotPreview from "@/components/events/snapshot-preview"
import { motion, AnimatePresence } from "framer-motion"

interface EventsListProps {
  events: any[]
  type: "all" | "detections" | "system"
}

export default function EventsList({ events, type }: EventsListProps) {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)

  if (!events.length) {
    return (
      <Card className="glass-card p-6 text-center">
        <p className="text-muted-foreground">No events found for the selected filters.</p>
      </Card>
    )
  }

  const getEventIcon = (event: any) => {
    if (event.direction) {
      // It's a detection event
      return <ArrowLeftRight className="h-5 w-5 text-primary" />
    }

    switch (event.event_type) {
      case "error":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "config":
        return <Settings className="h-5 w-5 text-primary" />
      case "system":
        return <Info className="h-5 w-5 text-primary" />
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getEventTypeColor = (event: any) => {
    if (event.direction) return "bg-primary/10 text-primary border-primary/20"

    switch (event.event_type) {
      case "error":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "config":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "system":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMM d, yyyy h:mm:ss a")
    } catch (e) {
      return timestamp
    }
  }

  const toggleExpand = (id: string) => {
    if (expandedEvent === id) {
      setExpandedEvent(null)
    } else {
      setExpandedEvent(id)
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card
              className={cn(
                "glass-card p-4 transition-all duration-300 cursor-pointer",
                expandedEvent === event.id ? "ring-2 ring-primary/50" : "",
              )}
              onClick={() => toggleExpand(event.id)}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getEventIcon(event)}</div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                      <p className="font-medium">
                        {event.direction
                          ? `Detection on camera ${event.camera_id}`
                          : event.message || `${event.event_type} event`}
                      </p>
                      <Badge variant="outline" className={cn("md:ml-2", getEventTypeColor(event))}>
                        {event.direction ? "Detection" : event.event_type}
                      </Badge>
                      {event.direction && (
                        <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                          {event.direction}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{formatTimestamp(event.timestamp)}</p>
                    {event.camera_id && !event.direction && (
                      <div className="flex items-center mt-1 text-sm">
                        <Camera className="h-3 w-3 mr-1" />
                        <span>{event.camera_id}</span>
                      </div>
                    )}
                  </div>
                </div>

                {event.snapshot_path && (
                  <div className="flex-shrink-0">
                    <SnapshotPreview path={event.snapshot_path} />
                  </div>
                )}
              </div>

              <AnimatePresence>
                {expandedEvent === event.id && event.direction && (
                  <motion.div
                    className="mt-4 pt-4 border-t border-border/50"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Details:</p>
                        <div className="text-sm">
                          <p>
                            <span className="font-medium">Camera:</span> {event.camera_id}
                          </p>
                          <p>
                            <span className="font-medium">Direction:</span> {event.direction}
                          </p>
                          {event.confidence && (
                            <p>
                              <span className="font-medium">Confidence:</span> {(event.confidence * 100).toFixed(1)}%
                            </p>
                          )}
                          <p>
                            <span className="font-medium">Time:</span> {formatTimestamp(event.timestamp)}
                          </p>
                        </div>
                      </div>
                      {event.snapshot_path && (
                        <div className="flex justify-center md:justify-end">
                          <SnapshotPreview path={event.snapshot_path} expanded />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

