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
import { cn } from "@/lib/utils";
import { Gelombang } from "@/types/kerja-praktek/gelombang";
import useSWR from "swr";
import { PeriodeService } from "@/api/kerja-praktek";

interface Periode {
  id: number;
  kode_periode: number;
  tahun_ajaran: string;
  status: number;
}

const periodeFetcher = () => 
  PeriodeService.getAllPeriode().then(res => res);

export interface GelombangFormData {
  nama_gelombang: string;
  kode_periode: string;
  tgl_awal: string;  // ISO date string (yyyy-mm-dd)
  tgl_akhir: string; // ISO date string (yyyy-mm-dd)
}

export interface GelombangFormProps {
  onClose: () => void;
  onSave?: (formData: Gelombang) => void;
  editData?: Gelombang | null;
}

export function GelombangForm({ onClose, onSave, editData }: GelombangFormProps) {
  const { data: periodeResponse, error: periodeError } = useSWR('periode', periodeFetcher);
  const periodeList = periodeResponse?.data ?? [];

  const [formData, setFormData] = useState<GelombangFormData>({
    nama_gelombang: "",
    kode_periode: "",
    tgl_awal: "",
    tgl_akhir: "",
  });
  
  useEffect(() => {
    if (editData) {
      setFormData({
        nama_gelombang: editData.nama_gelombang ?? "",
        kode_periode: editData.periode_id?.toString() ?? "",
        tgl_awal: editData.tgl_awal?.split("T")[0] ?? "",
        tgl_akhir: editData.tgl_akhir?.split("T")[0] ?? "",
      });
    }
  }, [editData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSave) {
      // Transform form data to the API expected format
      const apiData: Gelombang = {
        nama_gelombang: formData.nama_gelombang,
        tgl_awal: formData.tgl_awal,
        tgl_akhir: formData.tgl_akhir,
        periode_id: parseInt(formData.kode_periode, 10),
      };
      
      // If editing, include the ID
      if (editData?.id) {
        apiData.id = editData.id;
      }
      
      onSave(apiData);
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
          <DialogTitle>{editData ? "Edit Gelombang" : "Tambah Gelombang"}</DialogTitle>
          <DialogDescription>
            Masukkan informasi gelombang dan periode kerja praktek.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Gelombang */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nama_gelombang" className="text-right">
                Gelombang
              </Label>
              <div className="col-span-3">
                <Input
                  id="nama_gelombang"
                  value={formData.nama_gelombang}
                  onChange={(e) => handleChange("nama_gelombang", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Periode */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="kode_periode" className="text-right">
                Periode
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.kode_periode}
                  onValueChange={(value) => handleChange("kode_periode", value)}
                  required
                >
                  <SelectTrigger id="kode_periode">
                    <SelectValue placeholder="Pilih periode" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodeError ? (
                      <SelectItem value="error">Error loading periode</SelectItem>
                    ) : !periodeResponse ? (
                      <SelectItem value="loading">Loading...</SelectItem>
                    ) : periodeList.length === 0 ? (
                      <SelectItem value="none">No periode available</SelectItem>
                    ) : (
                      periodeList.map((periode: Periode) => (
                        <SelectItem 
                          key={periode.id} 
                          value={periode.id.toString()}
                        >
                          {periode.tahun_ajaran} ({periode.kode_periode})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tanggal Awal */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tgl_awal" className="text-right">
                Tanggal Awal
              </Label>
              <div className="col-span-3">
                <Input
                  id="tgl_awal"
                  type="date"
                  value={formData.tgl_awal}
                  onChange={(e) => handleChange("tgl_awal", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Tanggal Akhir */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tgl_akhir" className="text-right">
                Tanggal Akhir
              </Label>
              <div className="col-span-3">
                <Input
                  id="tgl_akhir"
                  type="date"
                  value={formData.tgl_akhir}
                  onChange={(e) => handleChange("tgl_akhir", e.target.value)}
                  required
                />
              </div>
            </div>
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