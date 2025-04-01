"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface VideoFeedProps {
  cameraId: string
  width?: number
  height?: number
}

export default function VideoFeed({ cameraId, width = 1280, height = 720 }: VideoFeedProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  // In a real application, this would be the URL to the MJPEG stream
  // For this demo, we'll use a placeholder image
  const videoUrl = `/placeholder.svg?height=${height}&width=${width}`

  useEffect(() => {
    // Reset states when camera changes
    setLoading(true)
    setError(null)

    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [cameraId])

  // In a real application, you would handle the MJPEG stream differently
  // This is a simplified version for demonstration purposes
  const handleImageLoad = () => {
    setLoading(false)
  }

  const handleImageError = () => {
    setLoading(false)
    setError("Failed to load video feed")
  }

  return (
    <div className="relative w-full aspect-video bg-black/20 overflow-hidden rounded-lg">
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/10 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm">Loading video feed...</p>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/10 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center text-destructive">
            <p>{error}</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: loading ? 0.3 : 1,
          scale: loading ? 0.95 : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        <Image
          ref={imgRef}
          src={videoUrl || "/placeholder.svg"}
          alt={`Camera feed from ${cameraId}`}
          width={width}
          height={height}
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
          priority
        />
      </motion.div>
    </div>
  )
}

