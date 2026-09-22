"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// pengabdian & kekayaan-intelektual naik ke form terstruktur (judul/tahun/dana_*) sejak API
// UDI kirim object per 21 Sep 2026 -- riwayat-pendidikan/riwayat-karir tetap 1 textarea bebas.
const STRUCTURED_TYPES: KeteranganType[] = ["pengabdian", "kekayaan-intelektual"];

// Data asli dari API UDI selalu cuma isi 1 dari 3 sumber dana per kegiatan (yang lain 0/null)
// -- gak pernah kombinasi. Form ngikutin pola itu: pilih 1 sumber, isi 1 jumlah, bukan 3 input.
type DanaSumber = "dana_dikti" | "dana_perguruan_tinggi" | "dana_institusi_lain";

const DANA_SUMBER_LABEL: Record<DanaSumber, string> = {
  dana_dikti: "DIKTI",
  dana_perguruan_tinggi: "Internal",
  dana_institusi_lain: "Institusi Lain",
};

function detectDanaSumber(initialValue?: KeteranganInitialValue): DanaSumber | "" {
  if (initialValue?.dana_dikti) return "dana_dikti";
  if (initialValue?.dana_perguruan_tinggi) return "dana_perguruan_tinggi";
  if (initialValue?.dana_institusi_lain) return "dana_institusi_lain";
  return "";
}

function detectDanaJumlah(initialValue?: KeteranganInitialValue): string {
  const jumlah = initialValue?.dana_dikti || initialValue?.dana_perguruan_tinggi || initialValue?.dana_institusi_lain;
  return jumlah ? jumlah.toString() : "";
}

export interface KeteranganInitialValue {
  keterangan?: string;
  judul?: string | null;
  tahun?: number | null;
  dana_dikti?: number | null;
  dana_perguruan_tinggi?: number | null;
  dana_institusi_lain?: number | null;
}

interface DialogKeteranganFormProps {
  open: boolean;
  dosenId: number;
  type: KeteranganType;
  title: string;
  itemId?: number;
  initialValue?: KeteranganInitialValue;
  onClose: () => void;
  onSuccess: () => void;
}

export function DialogKeteranganForm({
  open,
  dosenId,
  type,
  title,
  itemId,
  initialValue,
  onClose,
  onSuccess,
}: DialogKeteranganFormProps) {
  const isStructured = STRUCTURED_TYPES.includes(type);

  const [keterangan, setKeterangan] = useState(initialValue?.keterangan ?? "");
  const [judul, setJudul] = useState(initialValue?.judul ?? "");
  const [tahun, setTahun] = useState(initialValue?.tahun?.toString() ?? "");
  const [danaSumber, setDanaSumber] = useState<DanaSumber | "">(detectDanaSumber(initialValue));
  const [danaJumlah, setDanaJumlah] = useState(detectDanaJumlah(initialValue));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setKeterangan(initialValue?.keterangan ?? "");
      setJudul(initialValue?.judul ?? "");
      setTahun(initialValue?.tahun?.toString() ?? "");
      setDanaSumber(detectDanaSumber(initialValue));
      setDanaJumlah(detectDanaJumlah(initialValue));
    }
  }, [open, initialValue]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    let payload: Record<string, unknown>;

    if (isStructured) {
      if (!judul.trim()) {
        handleToastResponse({ success: false, message: "Judul wajib diisi." });
        return;
      }
      payload = {
        judul,
        tahun: tahun ? Number(tahun) : null,
        ...(type === "pengabdian" && {
          dana_dikti: danaSumber === "dana_dikti" && danaJumlah ? Number(danaJumlah) : null,
          dana_perguruan_tinggi: danaSumber === "dana_perguruan_tinggi" && danaJumlah ? Number(danaJumlah) : null,
          dana_institusi_lain: danaSumber === "dana_institusi_lain" && danaJumlah ? Number(danaJumlah) : null,
        }),
      };
    } else {
      if (!keterangan.trim()) {
        handleToastResponse({ success: false, message: "Keterangan wajib diisi." });
        return;
      }
      payload = { keterangan };
    }

    setLoading(true);
    try {
      const res = itemId
        ? await DosenFakultasService.updateKeterangan(dosenId, type, itemId, payload)
        : await DosenFakultasService.createKeterangan(dosenId, type, payload);
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

        {isStructured ? (
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="judul">Judul</Label>
              <Textarea
                id="judul"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Judul kegiatan/karya"
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tahun">Tahun</Label>
              <Input
                id="tahun"
                type="number"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                placeholder="mis. 2025"
              />
            </div>
            {type === "pengabdian" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="dana_sumber">Sumber Dana</Label>
                  <Select value={danaSumber || undefined} onValueChange={(v) => setDanaSumber(v as DanaSumber)}>
                    <SelectTrigger id="dana_sumber" className="w-full">
                      <SelectValue placeholder="Tidak ada dana" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(DANA_SUMBER_LABEL) as DanaSumber[]).map((key) => (
                        <SelectItem key={key} value={key}>
                          {DANA_SUMBER_LABEL[key]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {danaSumber && (
                  <div className="space-y-1.5">
                    <Label htmlFor="dana_jumlah">Jumlah Dana ({DANA_SUMBER_LABEL[danaSumber]})</Label>
                    <Input
                      id="dana_jumlah"
                      type="number"
                      value={danaJumlah}
                      onChange={(e) => setDanaJumlah(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
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
        )}

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
