"use client"

import { motion } from "framer-motion"
import { Edit, Trash2, Loader2, CheckCircle, Clock, AlertCircle, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CurrentPengajuan {
  id?: number
  status?: string
  link_laporan_akhir?: string
  link_dokumen_penyelia?: string
  created_at?: string
  updated_at?: string
  sidang?: {
    id?: number
    status?: string
    nilai_penyelia?: string | number
    tgl_sidang?: string
    jam_sidang?: string
    created_at?: string
    updated_at?: string
  }
}

interface StatusBannerProps {
  currentPengajuan: CurrentPengajuan
  isEditing: boolean
  isAccepted: boolean
  isLoading: boolean
  isPengajuanLoading: boolean
  onEdit: () => void
  onDelete: () => void
}

export function StatusBanner({ 
  currentPengajuan,
  isEditing,
  isAccepted,
  isLoading,
  isPengajuanLoading,
  onEdit,
  onDelete
}: StatusBannerProps) {
  const isScheduled = !!(currentPengajuan?.sidang?.tgl_sidang && currentPengajuan?.sidang?.jam_sidang)
  
  const getStatusConfig = (status?: string) => {
    if (isScheduled) {
      return {
        icon: Calendar,
        color: "bg-gray-50 border-gray-200",
        textColor: "",
        badgeVariant: "success" as const,
        iconColor: "text-gray-600",
      }
    }

    switch (status?.toLowerCase()) {
      case "pending":
      case "belum_selesai":
        return {
          icon: Clock,
          color: "bg-gray-50 border-gray-200",
          textColor: "",
          badgeVariant: "secondary" as const,
          iconColor: "text-gray-600",
        }
      case "accepted":
      case "selesai":
      case "lulus":
        return {
          icon: CheckCircle,
          color: "bg-gray-50 border-gray-200",
          textColor: "",
          badgeVariant: "success" as const,
          iconColor: "text-gray-600",
        }
      case "rejected":
      case "ditolak":
        return {
          icon: AlertCircle,
          color: "bg-gray-50 border-gray-200",
          textColor: "",
          badgeVariant: "destructiveOutline" as const,
          iconColor: "text-gray-600",
        }
      default:
        return {
          icon: FileText,
          color: "bg-gray-50 border-gray-200",
          textColor: "",
          badgeVariant: "secondary" as const,
          iconColor: "text-gray-600",
        }
    }
  }

  const statusConfig = getStatusConfig(currentPengajuan?.sidang?.status)
  const StatusIcon = statusConfig.icon

  const getStatusText = () => {
    if (isScheduled) {
      return "Pengajuan Sidang Sudah Terjadwal"
    }

    if (isAccepted) return "Pengajuan Sidang Sudah Diterima"
    
    const status = currentPengajuan?.sidang?.status?.toLowerCase()
    switch (status) {
      case "pending":
      case "belum_selesai":
        return "Pengajuan Sidang Sudah Tersimpan"
      case "accepted":
      case "selesai":
      case "lulus":
        return "Pengajuan Sidang Sudah Diterima"
      case "rejected":
      case "ditolak":
        return "Pengajuan Sidang Ditolak"
      default:
        return "Pengajuan Sidang Sudah Tersimpan"
    }
  }

  const getBadgeText = () => {
    if (isScheduled) {
      return "Sudah Terjadwal"
    }

    const status = currentPengajuan?.sidang?.status || currentPengajuan?.status
    
    if (status?.toLowerCase() === "belum_selesai") {
      return "Menunggu Jadwal Terbit"
    }
    
    return status?.toUpperCase() || "SUBMITTED"
  }

  return (
    <motion.div
      className="col-span-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={cn("relative overflow-hidden rounded-2xl border-2", statusConfig.color)}>
        <div className="relative p-6">
          <div className="flex justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* 👈 UPDATED: Use dynamic icon background color */}
              <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl bg-gray-200/70"
              )}>
                <StatusIcon className={cn("w-6 h-6", statusConfig.iconColor)} />
              </div>

              <div className="">
                <div className="flex items-center gap-3">
                  <h3 className={cn("text-lg font-bold", statusConfig.textColor)}>
                    {getStatusText()}
                  </h3>
                  <Badge 
                    variant={statusConfig.badgeVariant}
                    className="text-xs font-semibold px-3 py-1"
                  >
                    {getBadgeText()}
                  </Badge>
                </div>
              </div>
            </div>
            
            {!isEditing && !isAccepted && !isScheduled && (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  onClick={onEdit}
                  variant="outline"
                  size="sm"
                  disabled={isLoading || isPengajuanLoading}
                >
                  {isLoading || isPengajuanLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Edit className="w-4 h-4 mr-2" />
                  )}
                  Edit
                </Button>
                <Button
                  onClick={onDelete}
                  variant="outline"
                  size="sm"
                  disabled={isLoading || isPengajuanLoading}
                >
                  {isLoading || isPengajuanLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Hapus
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}