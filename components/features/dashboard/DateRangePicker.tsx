"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
}

function DatePicker({ date, setDate, placeholder }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[140px] justify-start text-left font-normal bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-colors",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMM dd, y") : <span>{placeholder || "Pick a date"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export function CalendarDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const fromParam = searchParams.get("from")
  const toParam = searchParams.get("to")
  
  const [fromDate, setFromDate] = React.useState<Date | undefined>(
    fromParam ? new Date(fromParam) : undefined
  )
  const [toDate, setToDate] = React.useState<Date | undefined>(
    toParam ? new Date(toParam) : undefined
  )

  // Function to update URL
  const updateUrl = (newFrom: Date | undefined, newTo: Date | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (newFrom) params.set("from", newFrom.toISOString())
    else params.delete("from")
    
    if (newTo) params.set("to", newTo.toISOString())
    else params.delete("to")

    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handleFromChange = (date: Date | undefined) => {
    setFromDate(date)
    updateUrl(date, toDate)
  }

  const handleToChange = (date: Date | undefined) => {
    setToDate(date)
    updateUrl(fromDate, date)
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500">From</span>
        <DatePicker date={fromDate} setDate={handleFromChange} placeholder="Start date" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500">To</span>
        <DatePicker date={toDate} setDate={handleToChange} placeholder="End date" />
      </div>
    </div>
  )
}