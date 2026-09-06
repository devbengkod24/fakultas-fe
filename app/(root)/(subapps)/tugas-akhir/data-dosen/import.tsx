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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { useState } from "react";
import { DosenService } from "@/api/tugas-akhir";
import { toast } from "sonner";
import { mutate } from "swr";

interface ImportStatsDosenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mutateKey: unknown[];
}

export default function ImportStatsDosenModal({
  open,
  onOpenChange,
  mutateKey,
}: ImportStatsDosenModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = async () => {
    const toastId = toast.loading("Menyiapkan template...");
    try {
      const blob = await DosenService.downloadStatsTemplate();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "template-stats-dosen.xlsx";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast.success("Template berhasil diunduh", { id: toastId });
    } catch {
      toast.error("Gagal mengunduh template", { id: toastId });
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Mengimpor data dosen...");
    try {
      const result = await DosenService.importStats(file);
      if (result.success) {
        const { updated, not_found } = result.data;
        toast.success(`Import berhasil: ${updated} dosen diperbarui.`, {
          id: toastId,
          description: not_found?.length
            ? `NPP tidak ditemukan: ${not_found.join(", ")}`
            : undefined,
        });
        mutate(mutateKey);
        onOpenChange(false);
        setFile(null);
      } else {
        toast.error(result.message ?? "Import gagal", { id: toastId });
      }
    } catch {
      toast.error("Gagal mengimpor data dosen", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Stats Dosen</DialogTitle>
          <DialogDescription>
            Unggah berkas Excel (.xlsx, .xls) berisi data statistik dosen.
            Download template terlebih dahulu, isi kolom statistik, lalu
            unggah.
          </DialogDescription>

          <Button
            variant="primaryOutline"
            onClick={handleDownloadTemplate}
            className="w-fit my-2"
            size={"sm"}
          >
            <Download className="size-4" />
            Download Template
          </Button>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="file">File Excel</Label>
            <Input
              id="file"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button onClick={handleImport} disabled={!file || isSubmitting}>
            {isSubmitting ? "Mengimport..." : "Import Sekarang"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
