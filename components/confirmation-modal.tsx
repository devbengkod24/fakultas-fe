"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ConfirmationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  type?: "accept" | "reject" | "delete" | "default";
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  placeholder?: string;
  reason?: string;
  setReason?: (reason: string) => void;
  children?: React.ReactNode;
}

export function ConfirmationModal({
  open,
  setOpen,
  onConfirm,
  type = "default",
  title,
  description,
  confirmText,
  cancelText = "Batal",
  placeholder,
  reason,
  setReason,
  children,
}: ConfirmationModalProps) {
  const defaultTitles = {
    default: "Konfirmasi",
    accept: "Konfirmasi Penerimaan",
    reject: "Alasan Penolakan",
    delete: "Konfirmasi Penghapusan",
  };

  const defaultDescriptions = {
    default: "Apakah Anda yakin untuk menyimpan perubahan?",
    accept:
      "Apakah Anda yakin ingin menerima pengajuan mahasiswa ini? Tindakan ini tidak dapat diubah setelah dikonfirmasi.",
    reject: "Berikan alasan mengapa pengajuan mahasiswa ini ditolak.",
    delete:
      "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat diurungkan.",
  };

  const defaultConfirmTexts = {
    default: "Simpan Perubahan",
    accept: "Ya, Terima",
    reject: "Tolak Pengajuan",
    delete: "Hapus",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title || defaultTitles[type]}</DialogTitle>
          <DialogDescription>
            {description || defaultDescriptions[type]}
          </DialogDescription>
        </DialogHeader>

        {type === "reject" && setReason && (
          <div className="space-y-4">
            <Textarea
              placeholder={placeholder || "Masukkan alasan penolakan..."}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px] "
            />
          </div>
        )}

        {children}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {cancelText}
          </Button>
          <Button
            variant={
              type === "reject" || type === "delete" ? "destructive" : "default"
            }
            onClick={onConfirm}
          >
            {confirmText || defaultConfirmTexts[type]}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
