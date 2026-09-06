"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Dosen } from "@/types/kerja-praktek/dosen"

interface DaftarDosenDeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  dosen: Dosen | null
  onConfirm: () => void
  onCancel: () => void
}

export const DaftarDosenDeleteDialog = ({
  isOpen,
  onOpenChange,
  dosen,
  onConfirm,
  onCancel,
}: DaftarDosenDeleteDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hapus Dosen</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus dosen {dosen?.nama}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}