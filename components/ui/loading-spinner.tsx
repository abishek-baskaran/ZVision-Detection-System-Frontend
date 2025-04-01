"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  text?: string
  size?: "sm" | "md" | "lg"
  className?: string
  iconClassName?: string
}

export function LoadingSpinner({ text = "Loading...", size = "md", className, iconClassName }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size], iconClassName)} />
      </motion.div>

      {text && (
        <motion.p
          className={cn("mt-2 text-muted-foreground", textSizeClasses[size])}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1 items-center justify-center", className)}>
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="h-2 w-2 rounded-full bg-primary"
          initial={{ opacity: 0.4, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: dot * 0.2,
          }}
        />
      ))}
    </div>
  )
}

export function LoadingCard({
  className,
  height = "h-64",
}: {
  className?: string
  height?: string
}) {
  return (
    <div className={cn("glass-card flex items-center justify-center", height, className)}>
      <LoadingSpinner />
    </div>
  )
}

export function LoadingOverlay({
  className,
  text = "Loading...",
}: {
  className?: string
  text?: string
}) {
  return (
    <motion.div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-50",
        className,
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <LoadingSpinner text={text} />
    </motion.div>
  )
}

