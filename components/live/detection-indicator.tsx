"use client"

import { useEffect, useState } from "react"
import { ArrowLeftRight, PersonStanding } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface DetectionIndicatorProps {
  direction?: "LTR" | "RTL"
  timestamp?: string
}

export default function DetectionIndicator({ direction, timestamp }: DetectionIndicatorProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Show the indicator for 5 seconds
    setVisible(true)
    const timer = setTimeout(() => {
      setVisible(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [timestamp])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 glass px-4 py-2 rounded-lg flex items-center space-x-2 text-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <PersonStanding className="h-5 w-5" />
          </motion.div>
          <span className="font-medium">Person Detected</span>
          {direction && (
            <>
              <span className="text-muted-foreground">|</span>
              <motion.div initial={{ x: -5, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <ArrowLeftRight className="h-5 w-5" />
              </motion.div>
              <motion.span initial={{ x: -5, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                {direction}
              </motion.span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

