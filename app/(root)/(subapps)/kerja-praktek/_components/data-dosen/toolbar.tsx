"use client"
import { Button } from "@/components/ui/button"
import { SortSelectorDosen } from "../sort-selector"
import { RefreshCcw, ListChecks } from "lucide-react"
import SearchControl from "@/components/search-control"

interface DosenToolbarProps {
  onSyncClick: () => void
  onSync: boolean
  onBulkClick?: () => void
}

export const DaftarDosenToolbar = ({
  onSyncClick,
  onSync,
  onBulkClick,
}: DosenToolbarProps) => {
  return (
    <div className="flex gap-2 items-center justify-between mb-3">
      <SearchControl placeholder="Cari Dosen..." className="w-1/4"/>
      <div className="flex items-center gap-2 ml-auto flex-wrap">
        <SortSelectorDosen className="w-[180px]" />
        <Button onClick={onBulkClick} className="h-10 px-5 text-sm font-medium flex items-center gap-2">
          <ListChecks className="h-5 w-5" />
          Pilih Banyak
        </Button>
        <Button onClick={onSyncClick} disabled={onSync} className="flex items-center gap-2">
          <RefreshCcw className={`h-4 w-4 ${onSync ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </div>
  )
}