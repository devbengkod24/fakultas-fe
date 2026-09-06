"use client";

import { useState } from "react";
import { Dosen } from "@/types/fakultas/penelitian/penelitian";
import { DosenFakultasService } from "@/api";
import { handleToastResponse } from "@/lib/toast-response";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DialogEditDosenProps {
  dosen: Dosen;
  onSuccess?: () => void;
}

export function DialogEditDosen({ dosen, onSuccess }: DialogEditDosenProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: dosen.nama || "",
    bidang_kajian: dosen.peminatan || "",
    scholar_link: "",
    telepon: dosen.telepon || "",
    email_alternatif: dosen.email_alternatif || "",
    jabatan_fungsional: dosen.jabatan || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!dosen.dosen_id) return;
    setLoading(true);
    try {
      const res = await DosenFakultasService.update(dosen.dosen_id, form);
      if (res?.success) {
        handleToastResponse({ success: true, message: "Profil dosen berhasil diupdate." });
        setOpen(false);
        onSuccess?.();
      } else {
        handleToastResponse({ success: false, message: res?.message || "Gagal mengupdate profil dosen." });
      }
    } catch (error) {
      handleToastResponse({ success: false, message: "Gagal mengupdate profil dosen." });
    } finally {
      setLoading(false);
    }
  };

  const status = dosen.status || "Aktif";

  return (
    <>
      {/* Trigger button dengan status badge */}
      <div className="flex items-center gap-2">
        <Badge
          variant={status === "Aktif" ? "default" : "secondary"}
          className={status === "Aktif" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
        >
          {status}
        </Badge>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profil Dosen</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="jabatan_fungsional">Jabatan</Label>
              <Input id="jabatan_fungsional" name="jabatan_fungsional" value={form.jabatan_fungsional} onChange={handleChange} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="bidang_kajian">Bidang Kajian</Label>
              <Input id="bidang_kajian" name="bidang_kajian" value={form.bidang_kajian} onChange={handleChange} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="telepon">Telepon</Label>
              <Input id="telepon" name="telepon" value={form.telepon} onChange={handleChange} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email_alternatif">Email Alternatif</Label>
              <Input id="email_alternatif" name="email_alternatif" value={form.email_alternatif} onChange={handleChange} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="scholar_link">Google Scholar Link</Label>
              <Input id="scholar_link" name="scholar_link" value={form.scholar_link} onChange={handleChange} placeholder="https://scholar.google.com/..." />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}