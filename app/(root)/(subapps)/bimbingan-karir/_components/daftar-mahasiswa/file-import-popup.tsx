"use client"

import type React from "react"
import { useState, useRef } from "react"
import { X, FileText, Check, Loader2, ArrowRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImportMahasiswaService } from "@/api/bimbingan-karir"
import { handleToastResponse } from "@/lib/toast-response"
import { ScanHeaderService } from "@/api/bimbingan-karir"
import { toast } from "sonner"

type FileImportPopupProps = {
  mutate: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type FieldMapping = {
  nim: string
  email: string
  nama: string
}

export default function FileImportPopup({ mutate, open: externalOpen, onOpenChange }: FileImportPopupProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"upload" | "mapping">("upload")
  const [excelHeaders, setExcelHeaders] = useState<string[]>([])
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({
    nim: "",
    email: "",
    nama: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const truncateFileName = (fileName: string, maxLength = 20): string => {
    if (fileName.length <= maxLength) return fileName
    const extension = fileName.split(".").pop() || ""
    const nameWithoutExtension = fileName.substring(0, fileName.length - extension.length - 1)

    if (nameWithoutExtension.length <= maxLength - 3) return fileName
    return `${nameWithoutExtension.substring(0, maxLength - 3)}...${extension ? `.${extension}` : ""}`
  }

  const isValidFileType = (file: File | null): boolean => {
    if (!file) return false
    const fileName = file.name || ""
    const fileExt = fileName.split(".").pop()?.toLowerCase()
    return fileExt === "csv" || fileExt === "xlsx" || fileExt === "xls"
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    if (!isValidFileType(selectedFile)) {
      toast.error("Format file salah")
      e.target.value = ""
      return
    }

    setFile(selectedFile)
  }

  const clearFile = () => {
    setFile(null)
    setStep("upload")
    setExcelHeaders([])
    setFieldMapping({
      nim: "",
      email: "",
      nama: "",
    })
  }

  const handleScanHeader = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append("file", file)
    setIsLoading(true)
    try {
      const res = await ScanHeaderService.scanHeaderImportMhs(formData)

      if (res.success && res.data?.headers) {
        const filteredHeaders = res.data.headers.filter((header: string) => header && header.trim() !== "")
        setExcelHeaders(filteredHeaders)
        setStep("mapping")
      } else {
        toast.error("Gagal membaca header file")
      }
    } catch (error) {
      console.error(error)
      toast.error("Terjadi kesalahan saat membaca file")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = async () => {
    if (!file) return
    const emptyFields = Object.entries(fieldMapping).filter(([, value]) => !value)
    if (emptyFields.length > 0) {
      toast.error("Harap lengkapi semua mapping field")
      return
    }
    const formData = new FormData()
    formData.append("file", file)
    const nimIndex = excelHeaders.indexOf(fieldMapping.nim)
    const emailIndex = excelHeaders.indexOf(fieldMapping.email)
    const namaIndex = excelHeaders.indexOf(fieldMapping.nama)

    formData.append("mapping[nim]", nimIndex.toString())
    formData.append("mapping[name]", namaIndex.toString())
    formData.append("mapping[email]", emailIndex.toString())

    setIsLoading(true)

    try {
      const res = await ImportMahasiswaService.createImportMhs(formData)
      setOpen(false)
      clearFile()
      mutate()
      handleToastResponse(res)
    } catch (error) {
      console.error(error)
      toast.error("Gagal mengimport data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setStep("upload")
    setExcelHeaders([])
    setFieldMapping({
      nim: "",
      email: "",
      nama: "",
    })
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      clearFile()
    }, 200)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        {step === "upload" ? (
          <>
            <DialogHeader>
              <DialogTitle>Upload File Excel</DialogTitle>
              <DialogDescription>Pilih file Excel (.xlsx, .xls) yang berisi data mahasiswa</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <input
                type="file"
                accept=".xlsx,.xls"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Download className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium">Klik untuk upload atau drag & drop</p>
                <p className="text-xs text-muted-foreground mt-1">Excel files (.xlsx, .xls)</p>
              </div>

              {file && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium mb-2">File Terpilih</h4>
                  <div className="rounded-md border p-3 text-sm bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 flex-shrink-0 text-green-600" />
                        <div>
                          <p className="font-medium" title={file.name}>
                            {truncateFileName(file.name, 30)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex items-center justify-between sm:justify-between">
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                Batal
              </Button>
              <Button onClick={handleScanHeader} disabled={!file || isLoading} className="gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin size-4" />
                    Memindai...
                  </>
                ) : (
                  <>
                    Lanjut
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Mapping Field</DialogTitle>
              <DialogDescription>
                Petakan field sistem dengan kolom di Excel Anda
              </DialogDescription>
            </DialogHeader>

            <div>
              {/* Display Excel Headers */}
              <div className="mb-4 bg-muted/30 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-2">Header Excel yang ditemukan:</p>
                <div className="flex flex-wrap gap-2">
                  {excelHeaders.map((header, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-background border rounded">
                      {header}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {/* NIM Mapping */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium">NIM (Nomor Induk Mahasiswa)</label>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <Select value={fieldMapping.nim} onValueChange={(val) => setFieldMapping({ ...fieldMapping, nim: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kolom" />
                      </SelectTrigger>
                      <SelectContent>
                        {excelHeaders.map((header, idx) => (
                          <SelectItem key={idx} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Nama Lengkap Mapping */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Nama Lengkap</label>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <Select value={fieldMapping.nama} onValueChange={(val) => setFieldMapping({ ...fieldMapping, nama: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kolom" />
                      </SelectTrigger>
                      <SelectContent>
                        {excelHeaders.map((header, idx) => (
                          <SelectItem key={idx} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Email Mapping */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Email</label>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <Select value={fieldMapping.email} onValueChange={(val) => setFieldMapping({ ...fieldMapping, email: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kolom" />
                      </SelectTrigger>
                      <SelectContent>
                        {excelHeaders.map((header, idx) => (
                          <SelectItem key={idx} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between sm:justify-between">
              <Button variant="outline" onClick={handleBack} disabled={isLoading}>
                Kembali
              </Button>
              <Button onClick={handleImport} disabled={isLoading} className="gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin size-4" />
                    Mengimpor...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Import Data
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
