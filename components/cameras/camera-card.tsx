"use client"

import { useState } from "react"
import { Camera, Trash2, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { CameraDetectionToggle } from "@/components/detection-toggle"

interface CameraProps {
  camera: {
    id: string
    name: string
    source: string
    active: boolean
    detection_enabled?: boolean
  }
  onRemove: (id: string) => void
}

export default function CameraCard({ camera, onRemove }: CameraProps) {
  const [isActive, setIsActive] = useState(camera.active)

  const handleStatusChange = (checked: boolean) => {
    setIsActive(checked)
    // In a real app, you would update the camera status via API here
  }

  return (
    <div className="relative group perspective-1000">
      <div
        className={cn(
          "glass p-6 rounded-xl transform transition-all duration-300 ease-in-out",
          "hover:translate-y-[-5px] hover:shadow-lg",
          "bg-gradient-to-br",
          isActive
            ? "from-green-100/30 to-blue-100/30 dark:from-green-900/20 dark:to-blue-900/20"
            : "from-red-100/30 to-orange-100/30 dark:from-red-900/20 dark:to-orange-900/20",
        )}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Camera className={cn("h-5 w-5 mr-2", isActive ? "text-green-500" : "text-red-500")} />
            <h3 className="font-semibold text-lg">{camera.name}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">{isActive ? "Active" : "Inactive"}</span>
            <Switch
              checked={isActive}
              onCheckedChange={handleStatusChange}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">Source:</p>
          <p className="text-sm font-mono bg-background/50 p-2 rounded overflow-x-auto">{camera.source}</p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">ID: {camera.id}</p>

          <div className="flex space-x-2 items-center">
            <CameraDetectionToggle cameraId={camera.id} initialState={camera.detection_enabled} />

            <Link href={`/cameras/${camera.id}`}>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Camera</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove "{camera.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onRemove(camera.id)}>Remove</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  )
}

