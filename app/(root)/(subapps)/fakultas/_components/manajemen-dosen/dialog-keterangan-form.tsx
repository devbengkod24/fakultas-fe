"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DosenFakultasService } from "@/api";
import { handleToastResponse } from "@/lib/toast-response";

export type KeteranganType =
  | "riwayat-pendidikan"
  | "riwayat-karir"
  | "pengabdian"
  | "kekayaan-intelektual";

const PLACEHOLDER: Record<KeteranganType, string> = {
  "riwayat-karir": 'Tulis bebas, mis. "Lektor Kepala, Universitas XYZ (2020-Sekarang)"',
  "riwayat-pendidikan": 'Tulis bebas, mis. "S3 Ilmu Komputer, Universitas Gadjah Mada (2015)"',
  pengabdian: 'Tulis bebas, mis. "Pelatihan UMKM Digital Marketing, Desa Sukamaju (2024)"',
  "kekayaan-intelektual": 'Tulis bebas, mis. "Hak Cipta Aplikasi Presensi Digital, No. EC00202012345 (2023)"',
};

interface DialogKeteranganFormProps {
  open: boolean;
  dosenId: number;
  type: KeteranganType;
  title: string;
  itemId?: number;
  initialValue?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function DialogKeteranganForm({
  open,
  dosenId,
  type,
  title,
  itemId,
  initialValue = "",
  onClose,
  onSuccess,
}: DialogKeteranganFormProps) {
  const [keterangan, setKeterangan] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setKeterangan(initialValue);
  }, [open, initialValue]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!keterangan.trim()) {
      handleToastResponse({ success: false, message: "Keterangan wajib diisi." });
      return;
    }
    setLoading(true);
    try {
      const res = itemId
        ? await DosenFakultasService.updateKeterangan(dosenId, type, itemId, keterangan)
        : await DosenFakultasService.createKeterangan(dosenId, type, keterangan);
      handleToastResponse(res);
      if (res?.success) {
        handleClose();
        onSuccess();
      }
    } catch {
      handleToastResponse({ success: false, message: "Gagal menyimpan data." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-1.5 py-2">
          <Label htmlFor="keterangan">Keterangan</Label>
          <Textarea
            id="keterangan"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder={PLACEHOLDER[type]}
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
