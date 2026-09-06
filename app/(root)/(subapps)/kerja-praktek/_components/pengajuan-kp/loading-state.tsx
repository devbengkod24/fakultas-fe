"use client"

import { Loader2 } from "lucide-react"
import { PengajuanKPGridSkeleton } from "./skeleton"

interface LoadingStateProps {
  message?: string
  variant?: "spinner" | "skeleton"
}

export const LoadingState = ({ 
  message = "Memuat data pengajuan...", 
  variant = "skeleton" 
}: LoadingStateProps) => {
  if (variant === "skeleton") {
    return <PengajuanKPGridSkeleton />
  }

  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  )
}