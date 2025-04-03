"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ChevronRight, ChevronLeft, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DirectionCompassProps {
  initialDirection?: string // format: "x,y"
  onDirectionChange: (direction: string) => void
}

export default function DirectionCompass({ 
  initialDirection = "1,0", 
  onDirectionChange 
}: DirectionCompassProps) {
  // Parse initial direction into angle
  const getInitialAngle = () => {
    try {
      const [x, y] = initialDirection.split(',').map(parseFloat)
      return Math.atan2(y, x) * (180 / Math.PI)
    } catch (e) {
      return 0 // Default to rightward (0 degrees)
    }
  }

  const [angle, setAngle] = useState<number>(getInitialAngle())
  const [isDragging, setIsDragging] = useState(false)
  const compassRef = useRef<HTMLDivElement>(null)

  // Calculate normalized vector from angle
  const calculateVector = (angleDeg: number) => {
    const angleRad = angleDeg * (Math.PI / 180)
    const x = Math.cos(angleRad)
    const y = Math.sin(angleRad)
    // Don't need to normalize since sin and cos already return normalized values
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }

  // Update direction vector when angle changes
  useEffect(() => {
    const directionVector = calculateVector(angle)
    onDirectionChange(directionVector)
  }, [angle, onDirectionChange])

  // Handle mouse/touch events for rotation
  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !compassRef.current) return

    // Get pointer position
    let clientX, clientY
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    // Calculate center of compass
    const rect = compassRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate angle based on pointer position relative to center
    const dx = clientX - centerX
    const dy = clientY - centerY
    const newAngle = Math.atan2(dy, dx) * (180 / Math.PI)
    setAngle(newAngle)
  }

  // Preset direction buttons
  const presetDirections = [
    { name: "Right", angle: 0, icon: <ChevronRight className="h-4 w-4" /> },
    { name: "Down", angle: 90, icon: <ChevronDown className="h-4 w-4" /> },
    { name: "Left", angle: 180, icon: <ChevronLeft className="h-4 w-4" /> },
    { name: "Up", angle: -90, icon: <ChevronUp className="h-4 w-4" /> },
  ]

  // For display purposes, show both the angle and the vector
  const directionVector = calculateVector(angle)
  const [x, y] = directionVector.split(',').map(parseFloat)

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-sm text-muted-foreground text-center mb-2">
        Entry Direction Vector: {directionVector}
      </div>
      
      {/* Compass */}
      <div 
        ref={compassRef}
        className="relative w-32 h-32 rounded-full border-2 border-muted bg-background/50 cursor-pointer select-none"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleMouseMove}
      >
        {/* Compass markings */}
        <div className="absolute top-0 left-1/2 -ml-0.5 h-2 w-1 bg-muted"></div>
        <div className="absolute bottom-0 left-1/2 -ml-0.5 h-2 w-1 bg-muted"></div>
        <div className="absolute top-1/2 left-0 -mt-0.5 h-1 w-2 bg-muted"></div>
        <div className="absolute top-1/2 right-0 -mt-0.5 h-1 w-2 bg-muted"></div>
        
        {/* Direction arrow */}
        <motion.div 
          className="absolute top-1/2 left-1/2 w-full h-0.5 bg-primary origin-left"
          style={{ 
            rotate: angle,
            width: '50%'
          }}
        >
          <div className="absolute right-0 top-1/2 -mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
        </motion.div>
        
        {/* Entry arrow visualization */}
        <motion.div
          className="absolute top-1/2 left-1/2 flex items-center justify-center -ml-6 -mt-6 h-12 w-12 text-green-500"
          style={{ rotate: angle }}
        >
          <ArrowRight className="h-8 w-8" />
        </motion.div>
      </div>
      
      {/* Preset direction buttons */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {presetDirections.map((preset) => (
          <Button
            key={preset.name}
            size="sm"
            variant="outline"
            className={cn(
              "flex items-center justify-center p-2",
              Math.abs(((angle % 360) + 360) % 360 - ((preset.angle % 360) + 360) % 360) < 10 && 
              "border-primary"
            )}
            onClick={() => setAngle(preset.angle)}
            title={preset.name}
          >
            {preset.icon}
          </Button>
        ))}
      </div>
      
      {/* Explanation */}
      <div className="text-xs text-muted-foreground p-2 bg-muted/20 rounded mt-2">
        <p>Rotate to set the entry direction. People moving in this direction will be counted as entering.</p>
      </div>
    </div>
  )
} 