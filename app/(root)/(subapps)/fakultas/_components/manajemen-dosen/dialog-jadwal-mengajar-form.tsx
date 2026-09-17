"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DosenFakultasService } from "@/api";
import { handleToastResponse } from "@/lib/toast-response";

const HARI_OPTIONS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

// Data sync nyimpen hari UPPERCASE ("SENIN") sementara form ini title-case
// ("Senin") -- samakan biar Select gak kosong pas buka data hasil sync.
function normalizeHari(hari: string): string {
  const match = HARI_OPTIONS.find((h) => h.toLowerCase() === hari.toLowerCase());
  return match ?? hari;
}

export interface JadwalMengajarFormValue {
  hari: string;
  jam: string;
  kelas: string;
  matkul: string;
  ruang: string;
}

interface DialogJadwalMengajarFormProps {
  open: boolean;
  dosenId: number;
  itemId?: number;
  initialValue?: JadwalMengajarFormValue;
  canDelete?: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onDelete?: () => void | Promise<void>;
}

const EMPTY_FORM: JadwalMengajarFormValue = { hari: "Senin", jam: "", kelas: "", matkul: "", ruang: "" };

export function DialogJadwalMengajarForm({
  open,
  dosenId,
  itemId,
  initialValue,
  canDelete = false,
  onClose,
  onSuccess,
  onDelete,
}: DialogJadwalMengajarFormProps) {
  const [form, setForm] = useState<JadwalMengajarFormValue>(initialValue ?? EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialValue ? { ...initialValue, hari: normalizeHari(initialValue.hari) } : EMPTY_FORM);
    }
  }, [open, initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.jam || !form.kelas || !form.matkul || !form.ruang) {
      handleToastResponse({ success: false, message: "Semua field wajib diisi." });
      return;
    }
    setLoading(true);
    try {
      const res = itemId
        ? await DosenFakultasService.updateJadwalMengajar(dosenId, itemId, form)
        : await DosenFakultasService.createJadwalMengajar(dosenId, form);
      handleToastResponse(res);
      if (res?.success) {
        handleClose();
        onSuccess();
      }
    } catch {
      handleToastResponse({ success: false, message: "Gagal menyimpan jadwal mengajar." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setLoading(true);
    try {
      await onDelete();
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{itemId ? "Edit Jadwal Mengajar" : "Tambah Jadwal Mengajar"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Hari</Label>
              <Select value={form.hari} onValueChange={(v) => setForm((prev) => ({ ...prev, hari: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hari" />
                </SelectTrigger>
                <SelectContent>
                  {HARI_OPTIONS.map((hari) => (
                    <SelectItem key={hari} value={hari}>{hari}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jam">Jam</Label>
              <Input id="jam" name="jam" value={form.jam} onChange={handleChange} placeholder="07.00 - 09.30" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="matkul">Mata Kuliah</Label>
            <Input id="matkul" name="matkul" value={form.matkul} onChange={handleChange} placeholder="KECERDASAN BUATAN" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="kelas">Kelas</Label>
              <Input id="kelas" name="kelas" value={form.kelas} onChange={handleChange} placeholder="A11.4402" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ruang">Ruang</Label>
              <Input id="ruang" name="ruang" value={form.ruang} onChange={handleChange} placeholder="H.4.2" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {itemId && canDelete && onDelete ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" disabled={loading}>
                  Hapus
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Jadwal Mengajar</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin akan menghapus jadwal &quot;{form.matkul}&quot;?
                    Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
