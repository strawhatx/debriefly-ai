"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { useDateStore } from "@/store/date"

export const SessionPicker = () => {
  const { date, setDate } = useDateStore()
  const { toast } = useToast();

  const handleDateChange = (date: Date) => {
    if (!date) {
      toast({
        title: "Invalid date",
        description: "Please select a valid date.",
        variant: "destructive",
      })
      return
    }

    setDate(date)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className={
            `w-[240px] pl-3 text-left text-gray-400 font-normal border-gray-600 ${!date && ("text-muted-foreground")}`
          }>
          {date ? (
            format(date, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          className="bg-gray-900 border-gray-400 text-white rounded-lg shadow-lg"
          selected={date}
          onSelect={handleDateChange}
          disabled={(date) => date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
