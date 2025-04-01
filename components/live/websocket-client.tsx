"use client"

import { useEffect, useRef, useState } from "react"
import { AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { motion } from "framer-motion"

interface WebSocketClientProps {
  onMessage: (event: MessageEvent) => void
  onConnectionChange: (connected: boolean) => void
}

export default function WebSocketClient({ onMessage, onConnectionChange }: WebSocketClientProps) {
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected" | "error">("disconnected")
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const connectWebSocket = () => {
    // In a real application, this would be your WebSocket server URL
    // For this demo, we'll simulate the connection
    setStatus("connecting")
    setError(null)

    // Simulate connection delay
    setTimeout(() => {
      // Since we can't actually connect to a WebSocket server in this demo,
      // we'll simulate a successful connection
      setStatus("connected")
      onConnectionChange(true)

      // Simulate receiving messages periodically
      const interval = setInterval(() => {
        const mockEvent = {
          data: JSON.stringify({
            type: "detection",
            camera_id: Math.random() > 0.5 ? "cam-001" : "cam-003",
            timestamp: new Date().toISOString(),
            direction: Math.random() > 0.5 ? "LTR" : "RTL",
            confidence: 0.85 + Math.random() * 0.1,
          }),
        }
        onMessage(mockEvent as any)
      }, 5000)

      // Store the interval in the ref for cleanup
      wsRef.current = { close: () => clearInterval(interval) } as any
    }, 1500)
  }

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setStatus("disconnected")
    onConnectionChange(false)
  }

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return (
    <div className="space-y-3">
      <div className="flex items-center">
        {status === "connecting" && (
          <motion.div className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <LoadingSpinner size="sm" text="" className="mr-2" />
            <span className="text-sm">Connecting...</span>
          </motion.div>
        )}

        {status === "connected" && (
          <motion.div className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            <span className="text-sm">Connected to event stream</span>
          </motion.div>
        )}

        {status === "disconnected" && (
          <motion.div className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="text-sm">Not connected</span>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
            <span className="text-sm text-destructive">{error || "Connection error"}</span>
          </motion.div>
        )}
      </div>

      <div>
        {status === "disconnected" || status === "error" ? (
          <Button variant="outline" size="sm" className="w-full hover-lift" onClick={connectWebSocket}>
            Connect
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="w-full hover-lift" onClick={disconnectWebSocket}>
            Disconnect
          </Button>
        )}
      </div>
    </div>
  )
}

