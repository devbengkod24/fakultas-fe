"use client"

import { Student } from "@/types/bimbingan-karir/koordinator/daftar-kegiatan/student"
import SearchControl from "@/components/search-control"
import { RefreshCw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { PresensiService } from "@/api/bimbingan-karir"

interface FilterAllRekapProps {
  acaraId: number
  students: Student[]
  category: string
  onRefresh?: () => void
  isRefreshing?: boolean
  onImportSuccess?: () => void
}

export function FilterAllPresensi({
  acaraId,
  onRefresh,
  isRefreshing = false,
}: FilterAllRekapProps) {
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

          <Button
            onClick={handleExport}
            disabled={exporting}
            variant="default"
            className="h-10 px-3 py-2 gap-2"
            title="Export data presensi"
          >
            <Download className="h-4 w-4" />
            {exporting ? 'Mengekspor...' : 'Export'}
          </Button>
        </div>
      </div>
    </>
  )
}