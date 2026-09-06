"use client"

import { CertificateButton } from "./certificate"
import SearchControl from "@/components/search-control"
import { RefreshCw, MoreVertical, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Import from "./import"
import { useState } from "react"
import { PresensiService } from "@/api/bimbingan-karir"

interface FilterAllRekapProps {
  acaraId: number
  category: string
  totalHadir: number
  onRefresh?: () => void
  isRefreshing?: boolean
  onImportSuccess?: () => void
}

export function FilterAllPresensi({
  acaraId,
  category,
  totalHadir,
  onRefresh,
  isRefreshing = false,
  onImportSuccess
}: FilterAllRekapProps) {
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    setExporting(true)

    try {
      const response = await PresensiService.getExportPresensiMahasiswa(acaraId)
      const blob = new Blob([response], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", "daftar-presensi-mahasiswa.xlsx")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setExporting(false)
    } catch (error) {
      console.error("Export failed:", error)
      setExporting(false)
    }
  }

  return (
    <>
      <div className="flex md:flex-row">
        <div className="flex gap-2 w-full items-center">
          <SearchControl placeholder="Cari pengumuman..." className="w-full" />
          
          {(category === "seminar" || category === "workshop") && (
            <CertificateButton kegiatan_id={acaraId} totalHadir={totalHadir} />
          )}
          
          {onRefresh && (
            <Button
              onClick={onRefresh}
              disabled={isRefreshing}
              variant="default"
              className="h-10 px-3 py-2"
              title="Refresh data presensi"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refresh' : 'Refresh'}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 px-3 py-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsImportOpen(true)}>
                <Download className="mr-2 h-4 w-4" />
                Import
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport} disabled={exporting}>
                <Upload className="mr-2 h-4 w-4" />
                {exporting ? 'Mengekspor...' : 'Export'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Import Dialog - controlled from dropdown */}
      <Import 
        kegiatan_id={acaraId} 
        mutate={onImportSuccess || (() => {})} 
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
      />
    </>
  )
}