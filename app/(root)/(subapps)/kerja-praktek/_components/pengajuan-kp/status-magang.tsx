"use client"

import { Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AnimatePresence, motion } from "framer-motion"

interface StatusMagangProps {
  isAlreadyInternship: boolean
  onInternshipStatusChange: (checked: boolean) => void
  posisi: string
  onPositionChange: (value: string) => void
  disabled: boolean
  isLoading: boolean
}

export const StatusMagang = ({
  isAlreadyInternship,
  onInternshipStatusChange,
  posisi,
  onPositionChange,
  disabled,
  isLoading
}: StatusMagangProps) => {
  return (
    <div
      className={cn(
        "p-6 rounded-xl border-2",
        disabled ? "bg-gray-50 border-gray-200" : "bg-gray-50 border-gray-100",
        isLoading && "opacity-50"
      )}
    >
      <div className="flex items-center space-x-4">
        <Checkbox
          id="isAlreadyInternship"
          checked={isAlreadyInternship}
          onCheckedChange={onInternshipStatusChange}
          disabled={disabled || isLoading}
          className="w-5 h-5 rounded-md border-2 border-gray-300 "
        />
        <div className="space-y-1">
          <Label
            htmlFor="isAlreadyInternship"
            className={cn(
              "text-base font-medium cursor-pointer",
              disabled || isLoading ? "text-gray-500" : "text-gray-900",
            )}
          >
            Apakah Anda sudah magang?
          </Label>
          <p className="text-sm text-gray-600">
            Centang jika Anda sudah memiliki tempat magang dan ingin melaporkannya
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isAlreadyInternship && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mt-6 space-y-3"
          >
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <Label
                htmlFor="posisi"
                className={cn("text-base font-medium", disabled || isLoading ? "text-gray-500" : "text-gray-900")}
              >
                Posisi Magang
              </Label>
            </div>
            <Input
              id="posisi"
              name="posisi"
              placeholder="Contoh: Data Science, Frontend Developer, Marketing Intern"
              value={posisi}
              onChange={(e) => onPositionChange(e.target.value)}
              disabled={disabled || isLoading}
              className={cn(
                "h-11 text-base border-2 focus:border-blue-500 transition-colors",
                (disabled || isLoading) && "bg-gray-50 cursor-not-allowed opacity-50",
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}