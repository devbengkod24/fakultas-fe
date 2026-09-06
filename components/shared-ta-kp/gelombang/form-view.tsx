"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import type { PeriodeOption, TipeOption } from "./toolbar-view";
import type { Gelombang } from "@/types/kerja-praktek/gelombang";

export interface GelombangFormData {
  id?: number;
  nama_gelombang: string;
  tipe: string;
  periode_id: number;
  tgl_awal: string;
  tgl_akhir: string;
}

interface FormState {
  nama_gelombang: string;
  tipe: string;
  periode_id: string;
  tgl_awal: string;
  tgl_akhir: string;
}

interface GelombangFormViewProps {
  periodeList: PeriodeOption[];
  tipeOptions: TipeOption[];
  onClose: () => void;
  onSave: (data: GelombangFormData) => void;
  editData?: Gelombang | GelombangFormData | null;
  formTitle?: string;
  formDescription?: string;
}

export function GelombangFormView({
  periodeList,
  tipeOptions,
  onClose,
  onSave,
  editData,
  formTitle = "Tambah Gelombang",
  formDescription = "Isi informasi gelombang.",
}: GelombangFormViewProps) {
  const [form, setForm] = useState<FormState>({
    nama_gelombang: "",
    tipe: "",
    periode_id: "",
    tgl_awal: "",
    tgl_akhir: "",
  });

  const [error, setError] = useState<string | null>(null);

  // Gelombang baru selalu di periode aktif — periode dikunci, tidak bisa dipilih.
  const activePeriode = periodeList.find((p) => p.status === 1);

  const isTA = tipeOptions.length > 0;
  const selectedPeriode = periodeList.find((p) => p.id.toString() === form.periode_id);

  let startYear = new Date().getFullYear();
  let endYear = startYear + 1;

  if (selectedPeriode) {
    const tglAwal = isTA ? (selectedPeriode.tgl_awal_ta || selectedPeriode.tgl_awal) : selectedPeriode.tgl_awal;
    const tglAkhir = isTA ? (selectedPeriode.tgl_akhir_ta || selectedPeriode.tgl_akhir) : selectedPeriode.tgl_akhir;

    if (tglAwal) startYear = new Date(tglAwal).getFullYear();
    if (tglAkhir) endYear = new Date(tglAkhir).getFullYear();
  }

  const minDate = `${startYear}-01-01`;
  const maxDate = `${endYear}-12-31`;

  const pStart = new Date(minDate);
  const pEnd = new Date(maxDate);
  pStart.setHours(0, 0, 0, 0);
  pEnd.setHours(23, 59, 59, 999);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "Pilih tanggal";
    const [year, month, day] = dateStr.split("T")[0].split(" ")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  const formatDateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseStringToDate = (dateStr: string) => {
    if (!dateStr) return undefined;
    const [year, month, day] = dateStr.split("T")[0].split(" ")[0].split("-");
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  };

  useEffect(() => {
    if (editData) {
      const pId = editData.periode_id ?? (editData as any).periode?.id;
      setForm({
        nama_gelombang: editData.nama_gelombang ?? "",
        tipe: editData.tipe ?? "",
        periode_id: pId?.toString() ?? "",
        tgl_awal: editData.tgl_awal?.split("T")[0] ?? "",
        tgl_akhir: editData.tgl_akhir?.split("T")[0] ?? "",
      });
    }
  }, [editData]);

  useEffect(() => {
    if (!editData?.id && activePeriode) {
      setForm((prev) =>
        prev.periode_id ? prev : { ...prev, periode_id: activePeriode.id.toString() },
      );
    }
  }, [editData, activePeriode]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.tgl_akhir <= form.tgl_awal) {
      setError("Tanggal akhir harus setelah tanggal awal.");
      return;
    }

    const gStart = new Date(form.tgl_awal);
    const gEnd = new Date(form.tgl_akhir);
    gStart.setHours(0, 0, 0, 0);
    gEnd.setHours(0, 0, 0, 0);

    const formatDateSimple = (dateStr: string) => {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    };

    if (gStart < pStart || gStart > pEnd) {
      setError(`Tanggal awal harus berada di dalam rentang periode (${formatDateSimple(minDate)} - ${formatDateSimple(maxDate)})`);
      return;
    }

    if (gEnd < pStart || gEnd > pEnd) {
      setError(`Tanggal akhir harus berada di dalam rentang periode (${formatDateSimple(minDate)} - ${formatDateSimple(maxDate)})`);
      return;
    }

    const payload: GelombangFormData = {
      nama_gelombang: form.nama_gelombang,
      tipe: form.tipe,
      periode_id: parseInt(form.periode_id, 10),
      tgl_awal: form.tgl_awal,
      tgl_akhir: form.tgl_akhir,
    };

    if (editData?.id) payload.id = editData.id;

    onSave(payload);
  };

  const isEdit = !!editData?.id;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Edit ${formTitle}` : formTitle}
          </DialogTitle>
          <DialogDescription>{formDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nama_gelombang" className="text-right">
                Nama
              </Label>
              <div className="col-span-3">
                <Input
                  id="nama_gelombang"
                  value={form.nama_gelombang}
                  onChange={(e) =>
                    handleChange("nama_gelombang", e.target.value)
                  }
                  placeholder="cth. Gelombang 1"
                  required
                />
              </div>
            </div>

            {tipeOptions.length > 0 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tipe" className="text-right">
                  Tipe
                </Label>
                <div className="col-span-3">
                  <Select
                    value={form.tipe}
                    onValueChange={(v) => handleChange("tipe", v)}
                    required
                    disabled={isEdit}
                  >
                    <SelectTrigger id="tipe">
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isEdit && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Tipe tidak dapat diubah setelah dibuat.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="periode_id" className="text-right">
                Periode
              </Label>
              <div className="col-span-3">
                <Select
                  value={form.periode_id}
                  onValueChange={(v) => handleChange("periode_id", v)}
                  required
                  disabled={isEdit || !!activePeriode}
                >
                  <SelectTrigger id="periode_id">
                    <SelectValue placeholder="Pilih periode" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodeList.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.tahun_ajaran}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!isEdit && activePeriode && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Gelombang dibuat di periode aktif.
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tgl_awal" className="text-right">
                Tgl Awal
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="tgl_awal"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {form.tgl_awal ? formatDisplayDate(form.tgl_awal) : <span className="text-muted-foreground">Pilih tanggal awal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseStringToDate(form.tgl_awal)}
                      onSelect={(date) => {
                        if (date) {
                          handleChange("tgl_awal", formatDateToString(date));
                        }
                      }}
                      disabled={(date) => {
                        const checkDate = new Date(date);
                        checkDate.setHours(0, 0, 0, 0);
                        return checkDate < pStart || checkDate > pEnd;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tgl_akhir" className="text-right">
                Tgl Akhir
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="tgl_akhir"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {form.tgl_akhir ? formatDisplayDate(form.tgl_akhir) : <span className="text-muted-foreground">Pilih tanggal akhir</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parseStringToDate(form.tgl_akhir)}
                      onSelect={(date) => {
                        if (date) {
                          handleChange("tgl_akhir", formatDateToString(date));
                        }
                      }}
                      disabled={(date) => {
                        const checkDate = new Date(date);
                        checkDate.setHours(0, 0, 0, 0);
                        if (checkDate < pStart || checkDate > pEnd) return true;
                        if (form.tgl_awal) {
                          const limitStart = parseStringToDate(form.tgl_awal);
                          if (limitStart && checkDate < limitStart) return true;
                        }
                        return false;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {error && (
              <p className="col-span-4 text-sm text-destructive text-center">
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
