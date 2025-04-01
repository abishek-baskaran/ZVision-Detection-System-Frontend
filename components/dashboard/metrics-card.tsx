"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface MetricsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    positive: boolean
  }
  icon?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export default function MetricsCard({ title, value, change, icon, className, children }: MetricsCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className={cn("glass-card p-6 rounded-xl", className)}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <motion.div
              className="text-3xl font-bold mt-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              {value}
            </motion.div>

            {change && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className={cn(
                  "text-xs font-medium mt-1 flex items-center",
                  change.positive ? "text-green-500" : "text-red-500",
                )}
              >
                <span>
                  {change.positive ? "↑" : "↓"} {Math.abs(change.value)}%
                </span>
                <span className="ml-1 text-muted-foreground">vs previous</span>
              </motion.div>
            )}
          </div>

          {icon && (
            <motion.div
              className="p-3 rounded-full bg-primary/10 text-primary"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              {icon}
            </motion.div>
          )}
        </div>

        {children && <div className="mt-4">{children}</div>}
      </Card>
    </motion.div>
  )
}

