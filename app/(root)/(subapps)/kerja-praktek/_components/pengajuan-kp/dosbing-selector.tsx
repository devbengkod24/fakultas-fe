"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface Dosbing {
  id: number
  value: string
  label: string
}

interface DosbingSelectorProps {
  supervisors: Dosbing[]
  selectedSupervisor: string
  onSupervisorChange: (value: string) => void
  disabled: boolean
}

export const DosbingSelector = ({ 
  supervisors, 
  selectedSupervisor, 
  onSupervisorChange, 
  disabled 
}: DosbingSelectorProps) => {
  const [open, setOpen] = useState(false)

  const selectedSupervisorLabel = supervisors.find(
    (supervisor) => supervisor.value === selectedSupervisor
  )?.label

  return (
    <div className="col-span-12">
      <Label htmlFor="dosenPembimbing" className="text-base font-medium mb-2 block">
        Dosen Pembimbing
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between h-14 text-left font-normal border-2 hover:border-blue-300 focus:border-blue-500 transition-colors",
              disabled && "bg-gray-50 cursor-not-allowed opacity-50",
            )}
          >
            <span className={cn("truncate", selectedSupervisorLabel ? "text-gray-900" : "text-gray-500")}>
              {selectedSupervisorLabel || "Pilih Dosen Pembimbing..."}
            </span>
            <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 border-2"
          align="start"
          sideOffset={5}
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <Command className="w-full">
            <div className="flex items-center border-b px-3">
              <CommandInput placeholder="Cari dosen pembimbing..." className="h-12" />
            </div>
            <CommandList>
              <CommandEmpty className="py-6 text-center text-gray-500">
                Dosen pembimbing tidak ditemukan.
              </CommandEmpty>
              <CommandGroup className="max-h-60 overflow-auto">
                {supervisors.map((supervisor) => (
                  <CommandItem
                    key={supervisor.id}
                    value={supervisor.label}
                    onSelect={() => {
                      onSupervisorChange(supervisor.value === selectedSupervisor ? "" : supervisor.value)
                      setOpen(false)
                    }}
                    className="py-3 px-4 hover:bg-blue-50 cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-3 h-5 w-5 text-blue-600",
                        selectedSupervisor === supervisor.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="font-medium">{supervisor.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}