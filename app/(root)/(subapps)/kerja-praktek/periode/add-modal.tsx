"use client";

import { useState } from "react";
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
import DateTimePickerForm from "../_components/ui/time-picker/time-picker-form";
import { cn } from "@/lib/utils";

export interface PeriodeFormData {
  namaPeriode: string;
  tanggalAwal: string;
  tanggalAkhir: string;
}

interface PeriodeFormProps {
  onClose: () => void;
  onSave: (formData: PeriodeFormData) => void;
}

export function PeriodeForm({ onClose, onSave }: PeriodeFormProps) {
  const [formData, setFormData] = useState<PeriodeFormData>({
    namaPeriode: "",
    tanggalAwal: "",
    tanggalAkhir: "",
  });

  const [errors, setErrors] = useState<Partial<PeriodeFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<PeriodeFormData> = {};

    if (!formData.namaPeriode.trim()) {
      newErrors.namaPeriode = "Nama Periode wajib diisi";
    }

    if (!formData.tanggalAwal.trim()) {
      newErrors.tanggalAwal = "Tanggal Awal wajib diisi";
    }

    if (!formData.tanggalAkhir.trim()) {
      newErrors.tanggalAkhir = "Tanggal Akhir wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose} modal={false}>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/80 dark:bg-black/60 transition-all duration-200",
          "data-[state=open]:animate-in data-[state=open]:fade-in",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out"
        )}
        data-state="open"
      />

      <DialogContent className="sm:max-w-[500px] z-50">
        <DialogHeader>
          <DialogTitle>Tambah Periode KP</DialogTitle>
          <DialogDescription>
            Masukkan informasi periode dan waktu pengajuan.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Nama Periode */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="namaPeriode" className="text-right">
                Nama Periode
              </Label>
              <div className="col-span-3">
                <Input
                  id="namaPeriode"
                  name="namaPeriode"
                  value={formData.namaPeriode}
                  onChange={handleChange}
                  className={errors.namaPeriode ? "border-destructive" : ""}
                />
                {errors.namaPeriode && (
                  <p className="text-destructive text-sm mt-1">{errors.namaPeriode}</p>
                )}
              </div>
            </div>

            {/* Tanggal Awal */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tanggalAwal" className="text-right">
                Tanggal Awal
              </Label>
              <div className="col-span-3">
                <DateTimePickerForm />
              </div>
            </div>

            {/* Tanggal Akhir */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tanggalAkhir" className="text-right">
                Tanggal Akhir
              </Label>
              <div className="col-span-3">
                <DateTimePickerForm />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Tambah Periode</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
