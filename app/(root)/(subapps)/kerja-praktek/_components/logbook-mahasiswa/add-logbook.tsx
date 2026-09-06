"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Loader2, Plus, Edit } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import type { LogbookForm } from "@/types/kerja-praktek/logbook"
import { LogbookService } from "@/api/kerja-praktek"
import { toast } from "sonner"
import { handleToastResponse } from "@/lib/toast-response"

interface LogbookEntry {
  id: number
  bab: number
  uraian: string
  dokumen: string | null
  status: "accepted" | "revised" | "pending"
  tanggal: string
  created_at: string
  updated_at: string
}

interface AddEditLogbookDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kpId: number
  logbookEntry?: LogbookEntry | null
  onSuccess: () => void
}

export function AddEditLogbookDialog({ 
  open, 
  onOpenChange, 
  kpId, 
  logbookEntry = null,
  onSuccess 
}: AddEditLogbookDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [formData, setFormData] = useState<Omit<LogbookForm, 'tanggal'>>({
    bab: 1,
    uraian: "",
    dokumen: "",
  })

  const isEditMode = !!logbookEntry
  const dialogTitle = isEditMode ? "Edit Logbook Bimbingan" : "Tambah Logbook Bimbingan"
  const dialogDescription = isEditMode 
    ? "Perbarui informasi logbook bimbingan Anda" 
    : "Tambahkan catatan bimbingan baru"
  const submitButtonText = isEditMode ? "Perbarui Logbook" : "Tambah Logbook"
  const loadingText = isEditMode ? "Memperbarui logbook..." : "Menambahkan logbook..."

  useEffect(() => {
    if (open) {
      if (isEditMode && logbookEntry) {
        const existingDate = new Date(logbookEntry.tanggal)
        
        setSelectedDate(existingDate)
        setFormData({
          bab: logbookEntry.bab,
          uraian: logbookEntry.uraian,
          dokumen: logbookEntry.dokumen || "",
        })
      } else {
        setSelectedDate(undefined)
        setFormData({
          bab: 1,
          uraian: "",
          dokumen: "",
        })
      }
    }
  }, [open, isEditMode, logbookEntry])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setIsCalendarOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !formData.uraian || !formData.dokumen) {
      toast.error("Semua field harus diisi")
      return
    }

    setIsLoading(true)

    const loadingToast = toast.loading(loadingText)

    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd")
      
      const submitData: LogbookForm = {
        tanggal: formattedDate,
        ...formData
      }

      let response

      if (isEditMode && logbookEntry) {
        response = await LogbookService.updateLogbook(logbookEntry.id, submitData)
      } else {
        response = await LogbookService.addLogbook(submitData, kpId)
      }

      toast.dismiss(loadingToast)

      if (response.success) {
        handleToastResponse(response)
        onOpenChange(false)
        onSuccess()
        
        setSelectedDate(undefined)
        setFormData({
          bab: 1,
          uraian: "",
          dokumen: "",
        })
      } else {
        handleToastResponse(response)
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} logbook:`, error)
      toast.dismiss(loadingToast)
      toast.error(`Terjadi kesalahan saat ${isEditMode ? 'memperbarui' : 'menambahkan'} logbook`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (isEditMode && logbookEntry) {
      const existingDate = new Date(logbookEntry.tanggal)
      setSelectedDate(existingDate)
      setFormData({
        bab: logbookEntry.bab,
        uraian: logbookEntry.uraian,
        dokumen: logbookEntry.dokumen || "",
      })
    } else {
      setSelectedDate(undefined)
      setFormData({
        bab: 1,
        uraian: "",
        dokumen: "",
      })
    }
    setIsCalendarOpen(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {dialogTitle}
          </DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="tanggal" className="flex items-center gap-2 font-medium">
              Tanggal Bimbingan <span className="text-red-500">*</span>
            </Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen} modal={true}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "dd MMMM yyyy", { locale: id })
                  ) : (
                    "Pilih tanggal bimbingan"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0" 
                align="start"
                side="bottom"
                sideOffset={4}
                avoidCollisions={true}
                collisionPadding={8}
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bab" className="font-medium">
              Bab <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.bab.toString()}
              onValueChange={(value) => setFormData({ ...formData, bab: Number.parseInt(value) })}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih bab" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Bab 1</SelectItem>
                <SelectItem value="2">Bab 2</SelectItem>
                <SelectItem value="3">Bab 3</SelectItem>
                <SelectItem value="4">Bab 4</SelectItem>
                <SelectItem value="5">Bab 5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="uraian" className="font-medium">
              Uraian Bimbingan <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="uraian"
              placeholder="Jelaskan detail kegiatan bimbingan yang dilakukan..."
              value={formData.uraian}
              onChange={(e) => setFormData({ ...formData, uraian: e.target.value })}
              disabled={isLoading}
              className="min-h-[120px] resize-none"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dokumen" className="font-medium">
              Link Dokumen <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dokumen"
              type="url"
              placeholder="https://drive.google.com/file/d/..."
              value={formData.dokumen}
              onChange={(e) => setFormData({ ...formData, dokumen: e.target.value })}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">
              Masukkan link Google Drive atau platform lainnya
            </p>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel} 
              disabled={isLoading} 
              className="px-4"
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="px-4">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEditMode ? "Menyimpan..." : "Menambah..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isEditMode ? (
                    <Edit className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {submitButtonText}
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}