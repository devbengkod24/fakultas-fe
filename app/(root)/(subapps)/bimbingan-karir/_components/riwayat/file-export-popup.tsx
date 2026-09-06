"use client"

import { useState } from "react"
import { Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RiwayatService } from "@/api/bimbingan-karir"

interface FileExportPopupProps {
  periode: number;
}

export default function FileExportPopup({ periode }: FileExportPopupProps) {
  const [exporting, setExporting] = useState(false)
  const fileName = "daftar-mahasiswa.xlsx"

  const handleExport = async () => {
    setExporting(true)

    try {
      const response = await RiwayatService.getExportRiwayat(periode)

      // Asumsikan response berupa string CSV
      const blob = new Blob([response], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", fileName)
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
    <Button
      size="sm"
      variant="default"
      className="h-full gap-1"
      onClick={handleExport}
      disabled={exporting}
    >
      {exporting ? <><Loader2 className="animate-spin size-4 " /> Export</> : <><Upload size={16} /> Export</>}
    </Button>
  )
}
