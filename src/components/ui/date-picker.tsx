import { ChevronDownIcon } from "lucide-react"
import { useState, useCallback } from "react";

import { buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"


interface DatePickerProps {
  className?: string
  id?: string
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  value?: Date
}

const COLLISION_AVOIDANCE = { side: "flip" } as const;

export function DatePicker({
  value,
  onValueChange,
  id,
  placeholder = "Select date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = useCallback(
    (date: Date | undefined) => {
      onValueChange?.(date)
      setOpen(false)
    },
    [onValueChange]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-between border-border font-normal",
          className
        )}
      >
        {value ? value.toLocaleDateString() : placeholder}
        <ChevronDownIcon className="text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0"
        align="start"
        side="top"
        collisionAvoidance={COLLISION_AVOIDANCE}
      >
        <Calendar
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  )
}
