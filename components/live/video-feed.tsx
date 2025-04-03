"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface VideoFeedProps {
  cameraId: string
  width?: number
  height?: number
  isCompact?: boolean
}

export default function VideoFeed({ cameraId, width = 1280, height = 720, isCompact = false }: VideoFeedProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const loadAttemptedRef = useRef(false)

  // Use the /video_feed/{camera_id} endpoint for streaming
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || ''
  const videoUrl = `${baseUrl}/video_feed/${cameraId}`
  
  // Fallback to placeholder if no backend URL is set
  const fallbackUrl = `/placeholder.svg?height=${height}&width=${width}`

  useEffect(() => {
    // Reset states when camera changes
    setLoading(true)
    setError(null)
    loadAttemptedRef.current = false

    // Simulate loading delay only if we're using the fallback
    if (!baseUrl) {
      const timer = setTimeout(() => {
        setLoading(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
    
    // For MJPEG streams, we need to handle the case where onLoad might not fire
    // This effect ensures we check if the image has loaded after a brief moment
    if (baseUrl) {
      const checkImageLoaded = () => {
        // If image ref exists and has a complete property set to true, the image has loaded
        if (imgRef.current && imgRef.current.complete && !loadAttemptedRef.current) {
          loadAttemptedRef.current = true;
          setLoading(false);
        }
      };
      
      // Initial check in case the image loads very quickly
      checkImageLoaded();
      
      // Add event listener to check when the image is loaded
      const img = imgRef.current;
      if (img) {
        img.addEventListener('load', handleImageLoad);
      }
      
      return () => {
        if (img) {
          img.removeEventListener('load', handleImageLoad);
        }
      };
    }
  }, [cameraId, baseUrl])

  // Handle the MJPEG stream
  const handleImageLoad = () => {
    loadAttemptedRef.current = true;
    setLoading(false);
  }

  const handleImageError = () => {
    loadAttemptedRef.current = true;
    setLoading(false);
    setError("Failed to load video feed");
  }

  // Adjust the aspect ratio class based on whether it's compact or not
  const aspectRatioClass = isCompact ? "aspect-[16/9]" : "aspect-video"

  return (
    <div className={`relative w-full ${aspectRatioClass} bg-black/20 overflow-hidden rounded-lg`}>
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/10 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center">
            <Loader2 className={`${isCompact ? 'h-6 w-6' : 'h-8 w-8'} animate-spin mx-auto mb-2 text-primary`} />
            <p className={`${isCompact ? 'text-xs' : 'text-sm'}`}>Loading video feed...</p>
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
            <p className={isCompact ? 'text-xs' : 'text-sm'}>{error}</p>
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
        className="h-full"
      >
        {baseUrl ? (
          // Use img tag for MJPEG streams instead of Next.js Image
          <img
            ref={imgRef}
            src={videoUrl}
            alt={`Camera feed from ${cameraId}`}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          // Fallback to Next.js Image with placeholder
          <Image
            ref={imgRef}
            src={fallbackUrl}
            alt={`Camera feed from ${cameraId}`}
            width={width}
            height={height}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority
          />
        )}
      </motion.div>
    </div>
  )
}

