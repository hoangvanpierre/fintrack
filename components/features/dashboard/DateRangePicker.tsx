"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X, ChevronDown, RefreshCw } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function CalendarDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const fromParam = searchParams.get("from")
  const toParam = searchParams.get("to")
  
  const fromDate = fromParam ? new Date(fromParam) : undefined
  const toDate = toParam ? new Date(toParam) : undefined

  const updateUrl = (newFrom: Date | undefined, newTo: Date | undefined) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("date") // Clean up single date param

    if (newFrom) params.set("from", format(newFrom, "yyyy-MM-dd"))
    else params.delete("from")
    
    if (newTo) params.set("to", format(newTo, "yyyy-MM-dd"))
    else params.delete("to")

    router.push(`?${params.toString()}`, { scroll: false })
  }

  const dateDisplay = React.useMemo(() => {
    if (fromDate && toDate) {
      return `${format(fromDate, "MMM dd, yyyy")} - ${format(toDate, "MMM dd, yyyy")}`
    }
    if (fromDate) {
      return `From ${format(fromDate, "MMM dd, yyyy")}`
    }
    if (toDate) {
      return `Until ${format(toDate, "MMM dd, yyyy")}`
    }
    return "Select date range"
  }, [fromDate, toDate])

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={() => router.refresh()}
        className="p-2 hover:bg-white/10 rounded-full text-muted-foreground hover:text-foreground transition-all hover:rotate-180 duration-500"
        title="Refresh Dashboard"
      >
        <RefreshCw className="h-4 w-4" />
      </button>

      <Popover>
        <PopoverTrigger asChild>
          <button 
            className={cn(
              "flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 shadow-sm hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm font-medium text-foreground min-w-[200px] justify-between",
              className
            )}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground/70" />
              <span>{dateDisplay}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground/50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            selected={{ from: fromDate, to: toDate }}
            onSelect={(range) => {
              updateUrl(range?.from, range?.to)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {(fromParam || toParam) && (
        <button 
          onClick={() => updateUrl(undefined, undefined)}
          className="p-2 hover:bg-white/10 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          title="Clear Filters"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}