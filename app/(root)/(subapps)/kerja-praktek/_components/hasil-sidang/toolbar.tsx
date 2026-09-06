"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GelombangSelector } from "../gelombang-selector"
import SearchControl from "@/components/search-control"
import { Eye, Plus, Download, FileSpreadsheet, FileText, ChevronRight, ChevronDown } from "lucide-react"
import { Role } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MonitoringSidangToolbarProps {
  onPreviewTtd?: () => void;
  onAddTtd?: () => void;
  onDownloadExcel?: () => void;
  onDownloadAllPDF?: () => void;
  isDownloadingPDF?: boolean;
  gelombangId?: string | null;
  hideSearchBar?: boolean;
}

const MonitoringSidangToolbar = ({
  onPreviewTtd,
  onAddTtd,
  onDownloadExcel,
  onDownloadAllPDF,
  isDownloadingPDF = false,
  gelombangId,
  hideSearchBar = false,
}: MonitoringSidangToolbarProps) => {

  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getTtdText = () => {
    switch (role) {
      case "koordinator":
        return "TTD Koor";
      case "dosen":
        return "TTD Dosen";
      default:
        return "TTD";
    }
  };

  // Skip render kalau tidak ada konten sama sekali — kalau dipanggil dengan
  // hideSearchBar=true DAN tanpa handler download/TTD (kasus dosen), outer
  // wrapper yang kosong masih menambah height + margin, sehingga muncul gap
  // tak perlu di antara tabs dan tabel.
  const hasContent =
    !hideSearchBar ||
    onDownloadExcel ||
    onDownloadAllPDF ||
    onPreviewTtd ||
    onAddTtd;
  if (!hasContent) return null;

  return (
    <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
      {!hideSearchBar && (
        <SearchControl placeholder="Cari mahasiswa..." className="w-1/4" />
      )}

      <div className="flex items-center gap-2 ml-auto flex-wrap">
        {!hideSearchBar && (
          <div className="w-[200px] flex-shrink-0">
            <GelombangSelector />
          </div>
        )}

        {/* Dropdown Download Button - Tampil untuk koordinator/admin/super_fakultas
            (handler onDownloadExcel/onDownloadAllPDF hanya di-pass dari koordinator.tsx). */}
        {(onDownloadExcel || onDownloadAllPDF) && (
          <DropdownMenu modal={false} open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="h-9 gap-2"
                disabled={isDownloadingPDF}
              >
                <Download className="h-4 w-4" />
                <span>{isDownloadingPDF ? "Downloading..." : "Download"}</span>
                {isDropdownOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 z-[9999]">
              {onDownloadExcel && (
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-accent"
                  onSelect={() => {
                    if (onDownloadExcel) {
                      onDownloadExcel();
                    }
                  }}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  <span>Export Excel</span>
                </DropdownMenuItem>
              )}

              {onDownloadAllPDF && (
                <DropdownMenuItem
                  disabled={isDownloadingPDF}
                  className="cursor-pointer hover:bg-accent"
                  onSelect={() => {
                    if (!isDownloadingPDF && onDownloadAllPDF) {
                      onDownloadAllPDF();
                    }
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span>{isDownloadingPDF ? "Downloading..." : "Download All PDF"}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {onPreviewTtd && (
          <Button
            className="gap-2"
            onClick={onPreviewTtd}
          >
            <Eye className="h-4 w-4" />
            <span>Preview {getTtdText()}</span>
          </Button>
        )}
        {onAddTtd && (
          <Button
            className="gap-2"
            onClick={onAddTtd}
          >
            <Plus className="h-4 w-4" />
            <span>Tambah {getTtdText()}</span>
          </Button>
        )}
      </div>
    </div>
  )
}

export default MonitoringSidangToolbar