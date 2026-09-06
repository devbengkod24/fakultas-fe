"use client"

import FileImportPopup from "./file-import-popup"
import { Percentase } from "./persentase"
import SearchControl from "@/components/search-control"
import { Button } from "@/components/ui/button"
import { Download, MoreVertical, Upload, } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { RekapNilaiService } from "@/api/bimbingan-karir"
import { AturanNilai } from "./aturan-nilai"


export function FilterAllRekap() {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);

    try {
      const response = await RekapNilaiService.getExportRekapNilai();
      const blob = new Blob([response], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "rekap-nilai.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExporting(false);
    } catch (error) {
      console.error("Export failed:", error);
      setExporting(false);
    }
  };

  return (
    <>
      <div className="flex md:flex-row">
        <div className="flex gap-2 w-full items-center">
          <SearchControl placeholder="Cari NIM atau Mahasiswa..." className="w-full" />
          <AturanNilai />
          <Percentase />
          
          {/* Import Dialog tetap ada, tapi trigger-nya dari dropdown */}
          <FileImportPopup open={showImportDialog} onOpenChange={setShowImportDialog} />
          
          {/* Dropdown untuk Import/Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowImportDialog(true)}>
                <Download className="mr-2 h-4 w-4" />
                Import Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport} disabled={exporting}>
                <Upload className="mr-2 h-4 w-4" />
                Export Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  )
}
