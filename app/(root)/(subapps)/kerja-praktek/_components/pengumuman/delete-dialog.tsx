"use client";

import type React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pengumuman } from "@/types/kerja-praktek/pengumuman";

interface DeletePengumumanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPengumuman: Pengumuman | null;
  onDelete: () => Promise<void>;
}

export default function DeletePengumumanDialog({
  open,
  onOpenChange,
  selectedPengumuman,
  onDelete,
}: DeletePengumumanDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="mx-4 sm:mx-0 max-w-md sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg sm:text-xl">
            Hapus Pengumuman
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base leading-relaxed">
            Apakah Anda yakin ingin menghapus pengumuman &quot;
            <span className="font-medium">{selectedPengumuman?.judul}</span>&quot;?{" "}
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3">
          <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1">
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="w-full sm:w-auto order-1 sm:order-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
