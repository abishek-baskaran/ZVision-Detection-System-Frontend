"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Expand, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface SnapshotPreviewProps {
  path: string
  expanded?: boolean
}

export default function SnapshotPreview({ path, expanded = false }: SnapshotPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("/placeholder.svg")
  
  useEffect(() => {
    // Get backend URL from environment variable with fallback
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
    
    // Construct proper URL based on path format
    if (path) {
      if (path.startsWith('/api/')) {
        setImageUrl(`${backendUrl}${path}`)
      } else {
        setImageUrl(path)
      }
    } else {
      setImageUrl("/placeholder.svg")
    }
  }, [path])

  const thumbnailSize = expanded ? 150 : 80

  return (
    <div className="relative group">
      <div
        className={cn(
          "overflow-hidden rounded-md border border-border/50 bg-background/50",
          expanded ? "w-[150px] h-[150px]" : "w-[80px] h-[80px]",
        )}
      >
        <Image
          src={imageUrl}
          alt="Event snapshot"
          width={thumbnailSize}
          height={thumbnailSize}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Expand className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 overflow-hidden">
              <div className="relative">
                <Image
                  src={imageUrl}
                  alt="Event snapshot"
                  width={800}
                  height={600}
                  className="object-contain"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

