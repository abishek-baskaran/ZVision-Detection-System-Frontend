"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import VideoFeed from "@/components/live/video-feed"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ROI {
  x1: number
  y1: number
  x2: number
  y2: number
}

interface ROISelectorProps {
  initialRoi?: ROI | null
  onRoiChange: (roi: ROI | null) => void
  cameraId: string
}

export default function ROISelector({ initialRoi, onRoiChange, cameraId }: ROISelectorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentRoi, setCurrentRoi] = useState<ROI | null>(initialRoi || null)
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 360 })
  const [refreshKey, setRefreshKey] = useState(0)

  // Initialize canvas and load image
  useEffect(() => {
    const canvas = canvasRef.current
    const container = videoContainerRef.current
    if (!canvas || !container) return

    // Set canvas size based on container
    const updateCanvasSize = () => {
      const width = container.clientWidth
      const height = Math.floor(width * 9/16) // 16:9 aspect ratio for video
      setCanvasSize({ width, height })
      canvas.width = width
      canvas.height = height
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [])

  // Draw ROI overlay on the live video feed
  const drawRoiOverlayOnVideo = () => {
    if (!currentRoi) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas (transparent background)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw the ROI overlay
    const { x1, y1, x2, y2 } = currentRoi
    const width = x2 - x1
    const height = y2 - y1
    
    ctx.fillStyle = "rgba(0, 123, 255, 0.3)"
    ctx.fillRect(x1, y1, width, height)

    // Draw border
    ctx.strokeStyle = "rgba(0, 123, 255, 0.8)"
    ctx.lineWidth = 2
    ctx.strokeRect(x1, y1, width, height)

    // Draw handles at corners
    const handleSize = 8
    ctx.fillStyle = "white"
    ctx.strokeStyle = "rgba(0, 123, 255, 1)"

    // Top-left
    ctx.beginPath()
    ctx.rect(x1 - handleSize / 2, y1 - handleSize / 2, handleSize, handleSize)
    ctx.fill()
    ctx.stroke()

    // Top-right
    ctx.beginPath()
    ctx.rect(
      x2 - handleSize / 2,
      y1 - handleSize / 2,
      handleSize,
      handleSize,
    )
    ctx.fill()
    ctx.stroke()

    // Bottom-left
    ctx.beginPath()
    ctx.rect(
      x1 - handleSize / 2,
      y2 - handleSize / 2,
      handleSize,
      handleSize,
    )
    ctx.fill()
    ctx.stroke()

    // Bottom-right
    ctx.beginPath()
    ctx.rect(
      x2 - handleSize / 2,
      y2 - handleSize / 2,
      handleSize,
      handleSize,
    )
    ctx.fill()
    ctx.stroke()
    
    // Request animation frame for continuous drawing
    requestAnimationFrame(drawRoiOverlayOnVideo)
  }
  
  // Start drawing ROI overlay
  useEffect(() => {
    drawRoiOverlayOnVideo()
    
    // Clean up animation frame on unmount
    return () => {
      cancelAnimationFrame(0); // Just to make sure no leftover frames
    };
  }, [currentRoi])

  // Handle mouse events for drawing ROI
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setStartPos({ x, y })
    setDrawing(true)
    setCurrentRoi(null)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate corners for top-left and bottom-right coordinates
    const x1 = Math.min(startPos.x, x)
    const y1 = Math.min(startPos.y, y)
    const x2 = Math.max(startPos.x, x)
    const y2 = Math.max(startPos.y, y)

    const roi = { x1, y1, x2, y2 }
    setCurrentRoi(roi)
  }

  const handleMouseUp = () => {
    setDrawing(false)

    if (currentRoi && (currentRoi.x2 - currentRoi.x1) > 10 && (currentRoi.y2 - currentRoi.y1) > 10) {
      onRoiChange(currentRoi)
    }
  }
  
  // Refresh the live video feed
  const handleRefreshLiveView = () => {
    setRefreshKey(prevKey => prevKey + 1)
  }

  return (
    <Card className="p-4 overflow-hidden perspective-1000 transform transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-end mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefreshLiveView}
          className="text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh Feed
        </Button>
      </div>
      
      <div ref={videoContainerRef} className="relative w-full">
        {/* Live video layer */}
        <div className="relative z-0">
          <VideoFeed 
            key={`live-feed-${refreshKey}`}
            cameraId={cameraId} 
            width={canvasSize.width} 
            height={canvasSize.height}
          />
        </div>
        
        {/* Canvas overlay for ROI selection */}
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-auto cursor-crosshair absolute top-0 left-0 z-10"
          style={{ backgroundColor: 'transparent' }}
        />
        
        <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm p-2 rounded text-xs z-20">
          Draw a rectangle to select the Region of Interest
        </div>
      </div>
    </Card>
  )
}

