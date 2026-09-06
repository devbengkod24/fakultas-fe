"use client"

import { Edit, Trash2, CheckCircle, Clock, AlertCircle, FileText, Loader2, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface StatusBannerProps {
  status: string
  isEditing: boolean
  isAccepted: boolean
  isRejected: boolean
  isLoading: boolean
  onEdit: () => void
  onDelete: () => void
  onResubmit?: () => void
  rejectionReason?: string
}

export const StatusBanner = ({ 
  status, 
  isEditing, 
  isAccepted, 
  isRejected,
  isLoading, 
  onEdit, 
  onDelete,
  onResubmit,
  rejectionReason
}: StatusBannerProps) => {
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          icon: Clock,
          color: "bg-gray-50 border-gray-200",
          textColor: "",
          badgeVariant: "secondary" as const,
          iconColor: "text-gray-600",
        }
      case "accepted":
        return {
          icon: CheckCircle,
          color: "bg-gray-50 border-gray-200",
          textColor: "",
          badgeVariant: "success" as const,
          iconColor: "text-gray-600",
        }
      case "rejected":
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

  const statusConfig = getStatusConfig(status)
  const StatusIcon = statusConfig.icon

  const getStatusTitle = () => {
    if (isAccepted) return "Pengajuan Sudah Diterima"
    if (isRejected) return "Pengajuan Ditolak"
    return "Pengajuan Sudah Tersimpan"
  }

  return (
    <motion.div
      className="col-span-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={cn("relative overflow-hidden rounded-lg border shadow-sm bg-card", statusConfig.color)}>
      <div className="relative p-6">
        <div className="flex justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-lg bg-gray-200/70"
          )}
          >
          <StatusIcon className={cn("w-6 h-6", statusConfig.iconColor)} />
          </div>

          <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className={cn("text-xl font-semibold", statusConfig.textColor)}>
            {getStatusTitle()}
            </h3>
            <Badge
            variant={statusConfig.badgeVariant}
            className="text-xs font-semibold px-3 py-1"
            >
            {status?.toUpperCase() || "SUBMITTED"}
            </Badge>
          </div>
          </div>
        </div>

        {!isEditing && (
          <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          >
          {status?.toLowerCase() === "pending" && (
            <>
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? (
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
              disabled={isLoading}
            >
              {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
              <Trash2 className="w-4 h-4 mr-2" />
              )}
              Hapus
            </Button>
            </>
          )}

          {isRejected && onResubmit && (
            <Button
            onClick={onResubmit}
            variant="outline"
            size="sm"
            disabled={isLoading}
            >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4 mr-2" />
            )}
            Ajukan Ulang
            </Button>
          )}
          </motion.div>
        )}
        </div>

        {isRejected && rejectionReason && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-semibold text-black">
          Alasan Penolakan: <span className="font-normal">{rejectionReason}</span>
          </p>
        </div>
        )}
      </div>
      </div>
    </motion.div>
  )
}