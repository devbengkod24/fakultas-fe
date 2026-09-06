"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileUp } from "lucide-react";
import { useState } from "react";
import { MahasiswaService } from "@/api/tugas-akhir";
import { PeriodeFakultasService } from "@/api/fakultas";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

interface ImportMahasiswaButtonProps {
  openOverride?: boolean;
  onOpenChangeOverride?: (open: boolean) => void;
}

export default function ImportMahasiswaButton({ openOverride, onOpenChangeOverride }: ImportMahasiswaButtonProps) {
  const [mode, setMode] = useState<"aktif" | "lulus">("aktif");
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const [summary, setSummary] = useState<any | null>(null);

  const isOpen = openOverride !== undefined ? openOverride : internalOpen;
  const setIsOpen = onOpenChangeOverride !== undefined ? onOpenChangeOverride : setInternalOpen;

  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const type = searchParams.get("type") || "ta";
  const sort_by = searchParams.get("sort_by") || undefined;
  const sort_order = (searchParams.get("sort_order") as "asc" | "desc") || undefined;

  const { data: periodeResponse } = useSWR(
    mode === "lulus" && isOpen ? ["periode-list-all"] : null,
    () => PeriodeFakultasService.getAll(1, 100)
  );
  const periodes = periodeResponse?.data?.data ?? periodeResponse?.data ?? [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await MahasiswaService.downloadTemplate();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "template-import-mhs.xlsx";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error("Gagal mengunduh template", {
        description: error.message || "Terjadi kesalahan saat mengunduh berkas template.",
      });
    }
  };

  const handleImport = async () => {
    if (!file) return;
    if (mode === "lulus" && !selectedPeriodeId) {
      toast.error("Pilih periode kelulusan terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    setSummary(null);
    try {
      let response: any;
      if (mode === "aktif") {
        response = await MahasiswaService.import(file);
      } else {
        response = await MahasiswaService.importLulus(file, Number(selectedPeriodeId));
      }

      if (response.success) {
        toast.success(response.message);
        setSummary(response.data);
        mutate(["mahasiswa", page, limit, search, type, sort_by, sort_order]);
      } else {
        toast.error(response.message ?? "Import gagal");
      }
    } catch (error: any) {
      console.error("Import error:", error);
      toast.error("Gagal mengimport data mahasiswa", {
        description: error.message || "Terjadi kesalahan saat mengunggah berkas.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setFile(null);
      setSummary(null);
    }
    setIsOpen(open);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        {!openOverride && (
          <DialogTrigger asChild>
            <Button variant="outline" size={"sm"}>
              <FileUp className="size-4" />
              Import Mahasiswa
            </Button>
          </DialogTrigger>
        )}
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Data Mahasiswa</DialogTitle>
            <DialogDescription>
              Pilih tipe import dan unggah berkas Excel (.xlsx, .xls) sesuai format.
            </DialogDescription>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant={mode === "aktif" ? "default" : "outline"}
                size="sm"
                onClick={() => { setMode("aktif"); setSummary(null); }}
                disabled={isSubmitting}
              >
                TA Aktif (All New)
              </Button>
              <Button
                variant={mode === "lulus" ? "default" : "outline"}
                size="sm"
                onClick={() => { setMode("lulus"); setSummary(null); }}
                disabled={isSubmitting}
              >
                Data Lulusan
              </Button>
            </div>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {mode === "aktif" && (
              <Button
                variant="primaryOutline"
                onClick={handleDownloadTemplate}
                className="w-fit"
                size={"sm"}
              >
                <Download className="size-4" />
                Download Template
              </Button>
            )}

            {mode === "lulus" && (
              <div className="grid gap-2">
                <Label htmlFor="periode">Periode Kelulusan (Wajib)</Label>
                <Select
                  value={selectedPeriodeId}
                  onValueChange={setSelectedPeriodeId}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Periode Kelulusan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(periodes) && periodes.map((p: any) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.tahun_ajaran} ({p.kode_periode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

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

            {summary && (
              <div className="p-3 bg-muted/60 rounded-md text-xs space-y-1.5 border">
                <div className="font-semibold text-sm border-b pb-1">Hasil Import</div>
                {mode === "aktif" ? (
                  <>
                    <p>✓ Terimport: <strong>{summary.imported}</strong> | Dilewati: <strong>{summary.skipped}</strong></p>
                    <p>✓ Dosbim Set: <strong>{summary.dospem_set}</strong> | Dosbim Dilewati: <strong>{summary.dospem_skipped}</strong></p>
                  </>
                ) : (
                  <>
                    <p>✓ Ditandai Lulus: <strong>{summary.graduated}</strong> | Dilewati: <strong>{summary.skipped}</strong></p>
                    <p>✓ Dosbim Set: <strong>{summary.dospem_set}</strong> | Jalur Set: <strong>{summary.jalur_set}</strong></p>
                    {summary.not_found?.length > 0 && (
                      <p className="text-destructive">❌ NIM Tidak Ditemukan ({summary.not_found.length}): {summary.not_found.slice(0, 5).join(", ")}</p>
                    )}
                    {summary.no_project?.length > 0 && (
                      <p className="text-amber-600">⚠️ Tidak Punya Project Aktif ({summary.no_project.length}): {summary.no_project.slice(0, 5).join(", ")}</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleClose(false)} disabled={isSubmitting}>
              Tutup
            </Button>
            <Button onClick={handleImport} disabled={!file || isSubmitting}>
              {isSubmitting ? "Mengimport..." : "Import Sekarang"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
