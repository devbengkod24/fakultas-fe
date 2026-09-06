"use client"

import type React from "react"

import { useState } from "react"
import dayjs from "dayjs"
import "dayjs/locale/id"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { SearchInput } from "@/components/search-input"

dayjs.locale("id")

interface CalendarFilterProps {
  onSearch: (searchTerm: string) => void
  onDateSelect: (date: Date | null) => void
}

const CalendarFilter = ({ onSearch, onDateSelect }: CalendarFilterProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    onDateSelect(selectedDate || null)
    setOpen(false)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <div className="pb-2 bg-white rounded-lg w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus locale={id} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="relative w-full">
          <SearchInput 
            onChange={handleSearch}
            placeholder="Cari log aktivitas"
            value={searchTerm}
          />
        </div>
      </div>
    </div>
  )
}

export default CalendarFilter
