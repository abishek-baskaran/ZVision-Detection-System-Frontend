"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"

interface ROI {
  x: number
  y: number
  width: number
  height: number
}

interface ROISelectorProps {
  initialRoi?: ROI | null
  onRoiChange: (roi: ROI | null) => void
  cameraId: string
}

export default function ROISelector({ initialRoi, onRoiChange, cameraId }: ROISelectorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentRoi, setCurrentRoi] = useState<ROI | null>(initialRoi || null)
  const [canvasSize, setCanvasSize] = useState({ width: 640, height: 480 })

  // Mock camera image - in a real app, this would be a stream or snapshot from the camera
  const mockImageUrl = `/placeholder.svg?height=${canvasSize.height}&width=${canvasSize.width}`

  // Initialize canvas and load image
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // Set canvas size based on container
    const updateCanvasSize = () => {
      const width = container.clientWidth
      const height = Math.floor(width * 0.75) // 4:3 aspect ratio
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

  // Draw the image and ROI overlay
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw mock camera image
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Draw ROI if exists
      if (currentRoi) {
        ctx.fillStyle = "rgba(0, 123, 255, 0.3)"
        ctx.fillRect(currentRoi.x, currentRoi.y, currentRoi.width, currentRoi.height)

        // Draw border
        ctx.strokeStyle = "rgba(0, 123, 255, 0.8)"
        ctx.lineWidth = 2
        ctx.strokeRect(currentRoi.x, currentRoi.y, currentRoi.width, currentRoi.height)

        // Draw handles at corners
        const handleSize = 8
        ctx.fillStyle = "white"
        ctx.strokeStyle = "rgba(0, 123, 255, 1)"

        // Top-left
        ctx.beginPath()
        ctx.rect(currentRoi.x - handleSize / 2, currentRoi.y - handleSize / 2, handleSize, handleSize)
        ctx.fill()
        ctx.stroke()

        // Top-right
        ctx.beginPath()
        ctx.rect(
          currentRoi.x + currentRoi.width - handleSize / 2,
          currentRoi.y - handleSize / 2,
          handleSize,
          handleSize,
        )
        ctx.fill()
        ctx.stroke()

        // Bottom-left
        ctx.beginPath()
        ctx.rect(
          currentRoi.x - handleSize / 2,
          currentRoi.y + currentRoi.height - handleSize / 2,
          handleSize,
          handleSize,
        )
        ctx.fill()
        ctx.stroke()

        // Bottom-right
        ctx.beginPath()
        ctx.rect(
          currentRoi.x + currentRoi.width - handleSize / 2,
          currentRoi.y + currentRoi.height - handleSize / 2,
          handleSize,
          handleSize,
        )
        ctx.fill()
        ctx.stroke()
      }
    }
    img.src = mockImageUrl
  }, [currentRoi, canvasSize.width, canvasSize.height, mockImageUrl])

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

    const width = x - startPos.x
    const height = y - startPos.y

    // Ensure positive width and height
    const roi = {
      x: width > 0 ? startPos.x : x,
      y: height > 0 ? startPos.y : y,
      width: Math.abs(width),
      height: Math.abs(height),
    }

    setCurrentRoi(roi)
  }

  const handleMouseUp = () => {
    setDrawing(false)

    if (currentRoi && currentRoi.width > 10 && currentRoi.height > 10) {
      onRoiChange(currentRoi)
    }
  }

  return (
    <Card className="p-1 overflow-hidden perspective-1000 transform transition-all duration-300 hover:shadow-lg">
      <div ref={containerRef} className="relative w-full">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-auto cursor-crosshair"
        />
        <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm p-2 rounded text-xs">
          Draw a rectangle to select the Region of Interest
        </div>
      </div>
    </Card>
  )
}

