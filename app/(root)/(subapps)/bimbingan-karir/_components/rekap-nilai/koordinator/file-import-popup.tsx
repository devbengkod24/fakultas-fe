"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Download, X, FileText, Check, Loader2, ArrowRight } from "lucide-react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ImportNilaiService, ScanHeaderService } from "@/api/bimbingan-karir"
import { handleToastResponse } from "@/lib/toast-response"
import { toast } from "sonner"

// Define activity categories
const activityCategories = [
  { id: "workshop", label: "Workshop" },
  { id: "softskill", label: "Softskill" },
  { id: "lsp", label: "Sertifikasi LSP" },
  { id: "toefl", label: "TOEFL" },
]

type FileImportPopupProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type FieldMapping = {
  nim: string
  score: string
}

export default function FileImportPopup({ open: externalOpen, onOpenChange }: FileImportPopupProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"upload" | "category" | "mapping">("upload")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [excelHeaders, setExcelHeaders] = useState<string[]>([])
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({
    nim: "",
    score: "",
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
    setSelectedCategory("")
    setExcelHeaders([])
    setFieldMapping({
      nim: "",
      score: "",
    })
  }

  const handleNextToCategory = () => {
    if (!file) return
    setStep("category")
  }

  const handleScanHeader = async () => {
    if (!file || !selectedCategory) return
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
    if (!file || !selectedCategory) return
    const emptyFields = Object.entries(fieldMapping).filter(([, value]) => !value)
    if (emptyFields.length > 0) {
      toast.error("Harap lengkapi semua mapping field")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("category", selectedCategory)

    const nimIndex = excelHeaders.indexOf(fieldMapping.nim)
    const scoreIndex = excelHeaders.indexOf(fieldMapping.score)

    formData.append("mapping[nim]", nimIndex.toString())
    formData.append("mapping[score]", scoreIndex.toString())

    setIsLoading(true)

    try {
      const res = await ImportNilaiService.createImportNilai(formData)
      setOpen(false)
      clearFile()
      handleToastResponse(res)
    } catch (error) {
      console.error(error)
      toast.error("Gagal mengimport data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackFromCategory = () => {
    setStep("upload")
    setSelectedCategory("")
  }

  const handleBackFromMapping = () => {
    setStep("category")
    setExcelHeaders([])
    setFieldMapping({
      nim: "",
      score: "",
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
              <DialogDescription>Pilih file Excel (.xlsx, .xls) yang berisi data nilai mahasiswa</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
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
              <Button onClick={handleNextToCategory} disabled={!file || isLoading} className="gap-2">
                Lanjut
                <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        ) : step === "category" ? (
          <>
            <DialogHeader>
              <DialogTitle>Pilih Kategori</DialogTitle>
              <DialogDescription>
                Pilih kategori kegiatan untuk data nilai yang akan diimpor
              </DialogDescription>
            </DialogHeader>

            <div>
              <div className="bg-muted/30 rounded-md mb-4">
                 <div className="rounded-md border p-3 mb-4 text-sm bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 flex-shrink-0 text-green-600" />
                        <div>
                          {file && truncateFileName(file.name, 30)}
                        </div>
                      </div>
                    </div>
                  </div>
                <p className="text-xs text-muted-foreground">
                  Pilih kategori kegiatan untuk data yang akan diimpor
                </p>
              </div>

              <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                {activityCategories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50">
                    <RadioGroupItem value={category.id} id={category.id} />
                    <Label htmlFor={category.id} className="flex-1 cursor-pointer">
                      {category.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <DialogFooter className="flex items-center justify-between sm:justify-between">
              <Button variant="outline" onClick={handleBackFromCategory} disabled={isLoading}>
                Kembali
              </Button>
              <Button onClick={handleScanHeader} disabled={!selectedCategory || isLoading} className="gap-2">
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
              {/* Display Category and File Info */}
              <div className="mb-4 bg-muted/30 rounded-lg">
                 <div className="rounded-md border p-3 mb-4 text-sm bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 flex-shrink-0 text-green-600" />
                        <div>
                          <p>{file && truncateFileName(file.name, 30)}</p>
                          <p className="text-xs text-muted-foreground">Kategori: {activityCategories.find(c => c.id === selectedCategory)?.label}</p>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>

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
                    <p className="text-xs text-muted-foreground">Field: nim</p>
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

                {/* Score Mapping */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Nilai/Score</label>
                    <p className="text-xs text-muted-foreground">Field: score</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <Select value={fieldMapping.score} onValueChange={(val) => setFieldMapping({ ...fieldMapping, score: val })}>
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
              <Button variant="outline" onClick={handleBackFromMapping} disabled={isLoading}>
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
