"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

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
  tooltip?: string
}

export default function MetricsCard({ 
  title, 
  value, 
  change, 
  icon, 
  className, 
  children,
  tooltip
}: MetricsCardProps) {
  // Ensure value is always a safe displayable value
  const displayValue = value === undefined || value === null ? "N/A" : value;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className={cn("glass-card p-6 rounded-xl h-full flex flex-col", className)}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-3.5 w-3.5 ml-1.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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

        <motion.div
          className="text-3xl font-bold"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {displayValue}
        </motion.div>

        {change && typeof change.value === 'number' && change.value !== 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
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

        {children && (
          <motion.div 
            className="mt-4 flex-grow" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            {children}
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}

