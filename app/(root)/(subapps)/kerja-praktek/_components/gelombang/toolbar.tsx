"use client"

import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import SearchControl from "@/components/search-control"

interface ToolbarProps {
  onModalClick: () => void
}

export function GelombangToolbar({ onModalClick }: ToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-stretch sm:items-center justify-between mb-3">
      {/* Mobile: Stack vertically, Desktop: Horizontal layout */}

      {/* Row 1 on mobile: Search Control */}
      <div className="w-1/4">
        <SearchControl
          placeholder="Cari Gelombang..."
          className="w-full"
        />
      </div>

      {/* Row 2 on mobile: Add Button */}
      <div className="w-full sm:w-auto sm:ml-auto">
        <Button
          onClick={onModalClick}
          className="w-full sm:w-auto h-10"
          size="default"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <span className="sm:inline">Tambah Gelombang</span>
        </Button>
      </div>
    </div>
  )
}
