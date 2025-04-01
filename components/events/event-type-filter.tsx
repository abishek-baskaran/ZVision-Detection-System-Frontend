"use client"
import { Badge } from "@/components/ui/badge"

interface EventTypeFilterProps {
  selectedTypes: string[]
  onTypeChange: (types: string[]) => void
}

const eventTypes = [
  { value: "detection", label: "Detection" },
  { value: "system", label: "System" },
  { value: "error", label: "Error" },
  { value: "config", label: "Configuration" },
]

export default function EventTypeFilter({ selectedTypes, onTypeChange }: EventTypeFilterProps) {
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter((t) => t !== type))
    } else {
      onTypeChange([...selectedTypes, type])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">Event Types</p>
      <div className="flex flex-wrap gap-2">
        {eventTypes.map((type) => (
          <Badge
            key={type.value}
            variant={selectedTypes.includes(type.value) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleType(type.value)}
          >
            {type.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}

