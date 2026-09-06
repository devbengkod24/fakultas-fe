"use client"

import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ActionButtonsProps {
  isEditing: boolean
  hasExistingPengajuan: boolean
  isLoading: boolean
  onSubmit: () => void
  onCancel: () => void
}

export const ActionButtons = ({ 
  isEditing, 
  hasExistingPengajuan, 
  isLoading, 
  onSubmit, 
  onCancel 
}: ActionButtonsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="flex gap-3"
    >
      {isEditing ? (
        <>
          <Button
            className="px-8 py-2.5"
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </div>
            ) : (
              "Update Pengajuan"
            )}
          </Button>
          <Button
            variant="outline"
            className="px-8 py-2.5"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </Button>
        </>
      ) : (
        !hasExistingPengajuan && (
          <Button
            className="px-8 py-2.5"
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </div>
            ) : (
              "Simpan Pengajuan"
            )}
          </Button>
        )
      )}
    </motion.div>
  )
}