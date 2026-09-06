"use client"

import { motion } from "framer-motion"
import { FileText, Building, User, Calendar, MapPin, LinkIcon, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { PengajuanSidangForm } from "@/types/kerja-praktek/sidang"
import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  disabledDays?: (date: Date) => boolean
}

function CustomDatePicker({
  date,
  onDateChange,
  placeholder = "Select date",
  disabled = false,
  className,
  disabledDays,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const formatDateWithDay = (date: Date): string => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between font-normal h-11 border-2 focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all duration-200 bg-white hover:bg-gray-50",
            !date && "text-muted-foreground",
            disabled && "bg-gray-100 cursor-not-allowed opacity-60 hover:bg-gray-100",
            className
          )}
          disabled={disabled}
        >
          <span className="truncate">
            {date ? formatDateWithDay(date) : placeholder}
          </span>
          <ChevronDownIcon className="h-4 w-4 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <CalendarComponent
          mode="single"
          selected={date}
          captionLayout="dropdown"
          disabled={disabledDays}
          onSelect={(selectedDate) => {
            onDateChange?.(selectedDate)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

interface InformasiKerjaPraktekProps {
  formData: PengajuanSidangForm
  onInputChange: (field: keyof PengajuanSidangForm, value: string | number) => void
  isDisabled: boolean
  hasExistingData?: boolean
}

export function InformasiKerjaPraktek({ 
  formData, 
  onInputChange, 
  isDisabled,
  hasExistingData = false
}: InformasiKerjaPraktekProps) {
  const stringToDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined
    const date = new Date(dateString + 'T00:00:00')
    return isNaN(date.getTime()) ? undefined : date
  }

  const dateToString = (date: Date | undefined): string => {
    if (!date) return ""
    // Gunakan getFullYear, getMonth, getDate untuk menghindari timezone issue
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const isEndDateDisabled = (date: Date): boolean => {
    if (!formData.tanggal_awal_magang) return false
    const startDate = stringToDate(formData.tanggal_awal_magang)
    if (!startDate) return false
    return date < startDate
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-xl">
            <FileText className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Informasi Kerja Praktek</h3>
            <p className="text-xs text-gray-600 mt-1">
              Detail lengkap mengenai kerja praktek yang telah dilaksanakan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Judul KP */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <Label htmlFor="judul" className="text-sm font-semibold mb-3 block text-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Judul Kerja Praktek <span className="text-red-500">*</span>
              </div>
            </Label>
            <Input
              id="judul"
              value={formData.judul}
              onChange={(e) => onInputChange("judul", e.target.value)}
              disabled={isDisabled}
              placeholder={hasExistingData ? "" : "Masukkan judul kerja praktek yang spesifik dan deskriptif"}
              className={cn(
                "h-11 text-sm border-2 focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all duration-200 bg-white focus:bg-white",
                isDisabled && "bg-gray-100 cursor-not-allowed opacity-60",
              )}
            />
          </div>

          {/* Company & Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <Label htmlFor="nama_perusahaan" className="text-sm font-semibold mb-3 block text-gray-800">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-primary-600" />
                  Nama Perusahaan <span className="text-red-500">*</span>
                </div>
              </Label>
              <Input
                id="nama_perusahaan"
                value={formData.nama_perusahaan}
                onChange={(e) => onInputChange("nama_perusahaan", e.target.value)}
                disabled={isDisabled}
                placeholder={hasExistingData ? "" : "PT. Nama Perusahaan"}
                className={cn(
                  "h-11 text-sm border-2 focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all duration-200 bg-white focus:bg-white",
                  isDisabled && "bg-gray-100 cursor-not-allowed opacity-60",
                )}
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <Label htmlFor="posisi_magang" className="text-sm font-semibold mb-3 block text-gray-800">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-600" />
                  Posisi Magang <span className="text-red-500">*</span>
                </div>
              </Label>
              <Input
                id="posisi_magang"
                value={formData.posisi_magang}
                onChange={(e) => onInputChange("posisi_magang", e.target.value)}
                disabled={isDisabled}
                placeholder={hasExistingData ? "" : "Frontend Developer, Data Analyst, dll"}
                className={cn(
                  "h-11 text-sm border-2 focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all duration-200 bg-white focus:bg-white",
                  isDisabled && "bg-gray-100 cursor-not-allowed opacity-60",
                )}
              />
            </div>
          </div>

          {/* Dates with CustomDatePicker */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-600" />
                Periode Magang
              </h4>
              <p className="text-xs text-gray-600 mt-1">
                Tentukan tanggal mulai dan berakhirnya periode magang
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="tanggal_awal_magang" className="text-sm font-medium text-gray-700">
                  Tanggal Mulai <span className="text-red-500">*</span>
                </Label>
                <CustomDatePicker
                  date={stringToDate(formData.tanggal_awal_magang)}
                  onDateChange={(date) => onInputChange("tanggal_awal_magang", dateToString(date))}
                  placeholder="Pilih tanggal mulai magang"
                  disabled={isDisabled}
                  className={cn(
                    isDisabled && "bg-gray-100 cursor-not-allowed opacity-60",
                  )}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="tanggal_akhir_magang" className="text-sm font-medium text-gray-700">
                  Tanggal Selesai <span className="text-red-500">*</span>
                </Label>
                <CustomDatePicker
                  date={stringToDate(formData.tanggal_akhir_magang)}
                  onDateChange={(date) => onInputChange("tanggal_akhir_magang", dateToString(date))}
                  placeholder="Pilih tanggal selesai magang"
                  disabled={isDisabled}
                  disabledDays={isEndDateDisabled}
                  className={cn(
                    isDisabled && "bg-gray-100 cursor-not-allowed opacity-60",
                  )}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <Label htmlFor="alamat_perusahaan" className="text-sm font-semibold mb-3 block text-gray-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-600" />
                Alamat Perusahaan <span className="text-red-500">*</span>
              </div>
            </Label>
            <Textarea
              id="alamat_perusahaan"
              value={formData.alamat_perusahaan}
              onChange={(e) => onInputChange("alamat_perusahaan", e.target.value)}
              disabled={isDisabled}
              placeholder={hasExistingData ? "" : "Jl. Nama Jalan No. XX, Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos"}
              className={cn(
                "min-h-[80px] text-sm border-2 focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all duration-200 resize-none bg-white focus:bg-white",
                isDisabled && "bg-gray-100 cursor-not-allowed opacity-60",
              )}
            />
          </div>

          {/* Acceptance Letter */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <Label htmlFor="link_surat_diterima_magang" className="text-sm font-semibold mb-3 block text-gray-800">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-primary-600" />
                Link Surat Diterima Magang <span className="text-red-500">*</span>
              </div>
            </Label>
            <div className="space-y-2">
              <Input
                id="link_surat_diterima_magang"
                type="url"
                value={formData.link_surat_diterima_magang}
                onChange={(e) => onInputChange("link_surat_diterima_magang", e.target.value)}
                disabled={isDisabled}
                placeholder={hasExistingData ? "" : "https://drive.google.com/file/d/..."}
                className={cn(
                  "h-11 text-sm border-2 focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all duration-200 bg-white focus:bg-white",
                  isDisabled && "bg-gray-100 cursor-not-allowed opacity-60",
                )}
              />
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Pastikan link dapat diakses oleh dosen pembimbing
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}