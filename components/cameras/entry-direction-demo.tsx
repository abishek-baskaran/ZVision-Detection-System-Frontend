"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, ArrowRight, ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import DirectionCompass from "@/components/cameras/direction-compass"
import Link from "next/link"

export default function EntryDirectionDemo() {
  const [direction, setDirection] = useState("1,0") // Default: right
  const [animation, setAnimation] = useState<"entry" | "exit" | null>(null)
  const [dotPosition, setDotPosition] = useState({ x: 50, y: 50 })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Parse the direction vector
  const [dirX, dirY] = direction.split(',').map(parseFloat)
  
  // Calculate the animation parameters
  const getAnimationParams = () => {
    // Start slightly off-center
    const centerX = 150
    const centerY = 100
    const distance = 80
    
    // Calculate start and end positions based on direction vector
    // For entry, we start opposite the vector and move toward it
    // For exit, we start at the vector and move away from it
    const isEntry = animation === "entry"
    const multiplier = isEntry ? -1 : 1
    
    const startX = centerX - (dirX * distance * multiplier)
    const startY = centerY - (dirY * distance * multiplier)
    const endX = centerX + (dirX * distance * multiplier)
    const endY = centerY + (dirY * distance * multiplier)
    
    return { startX, startY, endX, endY }
  }
  
  // Run animation
  useEffect(() => {
    if (!animation || !canvasRef.current) return
    
    const { startX, startY, endX, endY } = getAnimationParams()
    setDotPosition({ x: startX, y: startY })
    
    const steps = 60
    let step = 0
    
    const interval = setInterval(() => {
      step++
      if (step >= steps) {
        clearInterval(interval)
        setAnimation(null)
        return
      }
      
      const progress = step / steps
      const newX = startX + (endX - startX) * progress
      const newY = startY + (endY - startY) * progress
      
      setDotPosition({ x: newX, y: newY })
    }, 16) // ~60fps
    
    return () => clearInterval(interval)
  }, [animation])
  
  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw ROI box
    ctx.strokeStyle = '#888'
    ctx.lineWidth = 2
    ctx.strokeRect(50, 50, 200, 100)
    
    // Draw center point
    ctx.fillStyle = '#888'
    ctx.beginPath()
    ctx.arc(150, 100, 3, 0, Math.PI * 2)
    ctx.fill()
    
    // Draw direction arrow
    const centerX = 150
    const centerY = 100
    const arrowLength = 40
    
    ctx.strokeStyle = 'green'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + dirX * arrowLength, centerY + dirY * arrowLength)
    ctx.stroke()
    
    // Draw arrow head
    const headLen = 10
    const angle = Math.atan2(dirY, dirX)
    
    ctx.beginPath()
    ctx.moveTo(centerX + dirX * arrowLength, centerY + dirY * arrowLength)
    ctx.lineTo(
      centerX + dirX * arrowLength - headLen * Math.cos(angle - Math.PI / 6),
      centerY + dirY * arrowLength - headLen * Math.sin(angle - Math.PI / 6)
    )
    ctx.lineTo(
      centerX + dirX * arrowLength - headLen * Math.cos(angle + Math.PI / 6),
      centerY + dirY * arrowLength - headLen * Math.sin(angle + Math.PI / 6)
    )
    ctx.closePath()
    ctx.fillStyle = 'green'
    ctx.fill()
    
    // Draw the moving dot for animation
    ctx.fillStyle = animation === "entry" ? "blue" : "red"
    ctx.beginPath()
    ctx.arc(dotPosition.x, dotPosition.y, 8, 0, Math.PI * 2)
    ctx.fill()
    
    // Add label
    ctx.fillStyle = '#000'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Green arrow shows entry direction', 150, 180)
    
  }, [direction, dotPosition, animation, dirX, dirY])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cameras" className="flex items-center text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cameras
      </Link>
      
      <div className="glass p-6 rounded-xl mb-8">
        <h1 className="text-2xl font-bold mb-4">Entry Direction Explanation</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold mb-4">How It Works</h2>
            <p className="mb-4">
              The entry direction is represented as a vector in the format "x,y". 
              This vector determines which way a person must be moving to be counted as "entering".
            </p>
            <p className="mb-4">
              <strong>Examples:</strong>
            </p>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Right: "1,0" - A person moving right is entering</li>
              <li>Left: "-1,0" - A person moving left is entering</li>
              <li>Down: "0,1" - A person moving down is entering</li>
              <li>Up: "0,-1" - A person moving up is entering</li>
              <li>Diagonal: "0.71,0.71" - A person moving southeast is entering</li>
            </ul>
            
            <div className="flex space-x-4 mt-6">
              <Button 
                onClick={() => setAnimation("entry")} 
                disabled={!!animation}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <ArrowRight className="mr-2 h-4 w-4" /> 
                Simulate Entry
              </Button>
              
              <Button 
                onClick={() => setAnimation("exit")} 
                disabled={!!animation}
                className="bg-red-500 hover:bg-red-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> 
                Simulate Exit
              </Button>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Interactive Demo</h2>
            <canvas 
              ref={canvasRef} 
              width={300} 
              height={200}
              className="bg-white rounded-md shadow-md mb-6"
            />
            
            <DirectionCompass 
              initialDirection={direction} 
              onDirectionChange={setDirection} 
            />
          </div>
        </div>
      </div>
    </div>
  )
} 