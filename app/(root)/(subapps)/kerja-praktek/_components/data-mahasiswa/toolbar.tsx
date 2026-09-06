"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { MahasiswaService } from "@/api/kerja-praktek"
import { useProfile } from "@/context/profileUseContext"
import { Download, FileSpreadsheet, Import, Plus } from "lucide-react"
import SearchControl from "@/components/search-control"
import { SortSelector } from "../sort-selector"
import { toast } from "sonner"

interface DaftarMahasiswaToolbarProps {
  onImported?: () => void
}

export function DaftarMahasiswaToolbar({ onImported }: DaftarMahasiswaToolbarProps) {
  const { activeProdiId } = useProfile()
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  const handleDownloadTemplate = async () => {
    try {
      const blob = await MahasiswaService.downloadTemplate()
      downloadBlob(blob, "template_mahasiswa_kp.xlsx")
      toast.success("Berhasil download template mahasiswa")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal download template mahasiswa")
    }
  }

  const handleDownloadExcel = async () => {
    try {
      const blob = await MahasiswaService.downloadExcel()
      downloadBlob(blob, "mahasiswa_kp.xlsx")
      toast.success("Berhasil download data mahasiswa")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal download data mahasiswa")
    }
  }

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Pilih file Excel terlebih dahulu")
      return
    }

    setIsImporting(true)
    try {
      await MahasiswaService.importMahasiswa(selectedFile, undefined, activeProdiId ?? undefined)
      toast.success("Berhasil import data mahasiswa")
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      setIsImportOpen(false)
      onImported?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal import data mahasiswa")
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-3">
        <SearchControl placeholder="Cari Mahasiswa..." className="w-1/4" />

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <div className="w-[160px] flex-shrink-0">
            <SortSelector />
          </div>

          <Button onClick={handleDownloadExcel} variant="default" className="h-9 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Excel
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-9 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Tambah Mahasiswa
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={handleDownloadTemplate}>
                <FileSpreadsheet className="h-4 w-4" />
                Download Template
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setIsImportOpen(true)}>
                <Import className="h-4 w-4" />
                Import Mahasiswa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Mahasiswa</DialogTitle>
            <DialogDescription>
              Gunakan template dengan kolom NIM dan nama. Data akan masuk ke prodi aktif.
            </DialogDescription>
          </DialogHeader>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.csv"
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportOpen(false)} disabled={isImporting}>
              Batal
            </Button>
            <Button onClick={handleImport} disabled={!selectedFile || isImporting}>
              {isImporting ? "Mengimpor..." : "Import Mahasiswa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}