"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClockIcon } from "lucide-react"

interface TimeRangeSelectorProps {
  value: string
  onChange: (value: string) => void
}

export default function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center text-sm text-muted-foreground">
        <ClockIcon className="h-3.5 w-3.5 mr-1" />
        <span>Time Range:</span>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px] glass border-primary/20 bg-card/50 focus:ring-primary/30">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="24h">Last 24 Hours</SelectItem>
          <SelectItem value="7d">Last 7 Days</SelectItem>
          <SelectItem value="30d">Last 30 Days</SelectItem>
          <SelectItem value="90d">Last 90 Days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

