"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
  XCircle,
  AlertTriangle,
  Link2,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  downloadImportTemplate,
  type ImportType,
} from "@/lib/publikasi-excel";
import { ImportPublikasiSuperAdminService } from "@/api/superadmin";

type Step = "upload" | "result";

interface ImportPublikasiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: ImportType;
  onSuccess?: () => void;
}

interface ImportResultData {
  total_rows?: number;
  inserted?: number;
  updated?: number;
  skipped?: number;
  warnings?: Array<{ row?: number; issue?: string }>;
  auto_link?: {
    attempted?: number;
    linked?: number;
    unlinked?: number;
  };
}

interface ImportResult {
  success: boolean;
  message: string;
  data: ImportResultData | null;
}

// Dibatasi 2 MB mengikuti client_max_body_size nginx. Batas lama 10 MB lolos di
// browser lalu ditolak proxy sebelum sampai ke API, jadi importnya gagal tanpa
// pesan yang bisa dibaca. Kalau nginx dinaikkan, naikkan juga yang ini.
const MAX_FILE_SIZE = 2 * 1024 * 1024;

function truncateFileName(name: string, maxLength = 28): string {
  if (name.length <= maxLength) return name;
  const ext = name.split(".").pop() ?? "";
  const base = name.substring(0, name.length - ext.length - 1);
  return `${base.substring(0, maxLength - 3)}...${ext ? `.${ext}` : ""}`;
}

export function ImportPublikasiDialog({
  open,
  onOpenChange,
  type,
  onSuccess,
}: ImportPublikasiDialogProps) {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importService = ImportPublikasiSuperAdminService;

  const title = useMemo(
    () => (type === "artikel" ? "Import Data Artikel" : "Import Data Penelitian"),
    [type],
  );
  const description = useMemo(
    () =>
      type === "artikel"
        ? "Unggah data publikasi artikel ilmiah melalui file Excel (.xlsx atau .xls)."
        : "Unggah data penelitian melalui file Excel (.xlsx atau .xls).",
    [type],
  );

  const resetState = useCallback(() => {
    setStep("upload");
    setFile(null);
    setResult(null);
    setIsSubmitting(false);
    setIsDragOver(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        resetState();
      }
      onOpenChange(next);
    },
    [onOpenChange, resetState],
  );

  const handleFileSelected = useCallback((selected: File | null | undefined) => {
    if (!selected) return;
    const ext = selected.name.split(".").pop()?.toLowerCase();
    if (ext !== "xlsx" && ext !== "xls") {
      toast.error("Format file harus .xlsx atau .xls");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      toast.error("Ukuran file maksimal 2 MB");
      return;
    }
    setFile(selected);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelected(e.target.files?.[0]);
    },
    [handleFileSelected],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files?.[0];
      handleFileSelected(dropped);
    },
    [handleFileSelected],
  );

  const handleDownloadServerTemplate = useCallback(async () => {
    const toastId = toast.loading("Mengunduh template dari server...");
    try {
      if (type === "artikel") {
        await importService.getArticlesTemplate();
      } else {
        await importService.getResearchesTemplate();
      }
      toast.success("Template berhasil diunduh", { id: toastId });
    } catch (error) {
      console.warn("Server template gagal, fallback ke template FE:", error);
      try {
        await downloadImportTemplate(type);
        toast.success("Template (lokal) berhasil diunduh", { id: toastId });
      } catch (fallbackErr) {
        console.error(fallbackErr);
        toast.error("Gagal mengunduh template", { id: toastId });
      }
    }
  }, [importService, type]);

  const handleImport = useCallback(async () => {
    if (!file) return;
    setIsSubmitting(true);
    const toastId = toast.loading(`Mengimpor data ${type}...`);
    try {
      const res =
        type === "artikel"
          ? await importService.uploadArticles(file)
          : await importService.uploadResearches(file);

      const data = (res.data as ImportResultData) ?? null;
      setResult({
        success: res.success,
        message: res.message,
        data,
      });
      setStep("result");

      if (res.success) {
        const summary = data
          ? `${data.inserted ?? 0} baru, ${data.updated ?? 0} update, ${data.skipped ?? 0} skip`
          : "";
        toast.success(`Import selesai${summary ? `: ${summary}` : ""}`, { id: toastId });
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.message || "Gagal import data", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Gagal import data",
        { id: toastId },
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [file, type, importService, onSuccess]);

  const summary = result?.data;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        {step === "upload" ? (
          <>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="primaryOutline"
                  onClick={handleDownloadServerTemplate}
                  className="gap-2"
                  size="sm"
                  disabled={isSubmitting}
                >
                  <Download className="size-4" />
                  Download Template
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:bg-muted/40",
                )}
              >
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Klik untuk upload atau drag &amp; drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  File Excel (.xlsx, .xls) maksimal 2MB
                </p>
              </div>

              {file && (
                <div className="rounded-md border p-3 bg-muted/30">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileSpreadsheet className="h-5 w-5 shrink-0 text-green-600" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" title={file.name}>
                          {truncateFileName(file.name, 30)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setFile(null)}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="rounded-md border border-blue-200 bg-blue-50/50 p-3 text-xs text-blue-900 space-y-1">
                <p className="font-medium">Aturan Import:</p>
                <ul className="list-disc pl-5 space-y-0.5">
                  <li>Gunakan template resmi agar kolom terdeteksi dengan benar.</li>
                  <li>Pisahkan penulis pendamping dengan tanda <code>|</code> (contoh: <code>12345|67890</code>).</li>
                  <li>
                    Kolom <code>judul</code> wajib diisi. Tanpa{" "}
                    <code>primary_sinta_id</code> baris tetap masuk, hanya saja
                    tidak punya relasi penulis.
                  </li>
                  <li>
                    Baris hasil import tidak dikunci, supaya sinkronisasi
                    berikutnya masih bisa memperbaruinya.
                  </li>
                </ul>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between sm:justify-between">
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                onClick={handleImport}
                disabled={!file || isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mengimpor...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload &amp; Import
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Hasil Import</DialogTitle>
              <DialogDescription>
                {result?.success
                  ? "Import berhasil. Berikut ringkasan hasilnya."
                  : "Import gagal. Silakan periksa pesan error di bawah ini."}
              </DialogDescription>
            </DialogHeader>

            {result && (
              <div className="space-y-4">
                {result.success && summary && (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <SummaryCard
                        label="Total"
                        value={summary.total_rows ?? 0}
                        variant="default"
                      />
                      <SummaryCard
                        label="Baru"
                        value={summary.inserted ?? 0}
                        variant="success"
                      />
                      <SummaryCard
                        label="Update"
                        value={summary.updated ?? 0}
                        variant="primary"
                      />
                      <SummaryCard
                        label="Skip"
                        value={summary.skipped ?? 0}
                        variant="muted"
                      />
                    </div>

                    {summary.auto_link && (
                      <div className="rounded-md border border-green-200 bg-green-50/50 p-3 flex items-start gap-2 text-sm">
                        <Link2 className="size-4 mt-0.5 text-green-600 shrink-0" />
                        <div>
                          <p className="font-medium text-green-800">
                            {summary.auto_link.linked ?? 0} dari{" "}
                            {summary.auto_link.attempted ?? 0} penulis tertaut ke
                            data dosen
                          </p>
                          {(summary.auto_link.unlinked ?? 0) > 0 && (
                            <p className="text-xs text-green-700">
                              {summary.auto_link.unlinked} penulis belum tertaut —
                              publikasinya tetap tersimpan dan tampil. Umumnya
                              karena dosen tersebut belum terdaftar di sistem
                              akademik; Re-link baru berguna setelah datanya ada.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {summary.warnings && summary.warnings.length > 0 && (
                      <div className="rounded-md border border-yellow-200 bg-yellow-50/40 p-3">
                        <p className="text-sm font-medium text-yellow-800 flex items-center gap-2 mb-2">
                          <AlertTriangle className="size-4" />
                          {summary.warnings.length} catatan — import tetap berhasil
                          {summary.warnings.length > 50
                            ? ` (menampilkan 50 pertama)`
                            : ""}
                        </p>
                        <ul className="text-xs text-yellow-800 space-y-1 max-h-[180px] overflow-y-auto">
                          {summary.warnings.slice(0, 50).map((w, idx) => (
                            <li key={idx} className="flex gap-2">
                              {w.row ? (
                                <span className="shrink-0">Baris {w.row}</span>
                              ) : null}
                              <span>{w.issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {!result.success && (
                  <div className="rounded-md border border-red-200 bg-red-50/50 p-3 text-sm text-red-800 flex items-start gap-2">
                    <XCircle className="size-4 mt-0.5 shrink-0" />
                    <span>{result.message}</span>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="flex items-center justify-between sm:justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("upload");
                  setResult(null);
                }}
                disabled={isSubmitting}
              >
                Import Lagi
              </Button>
              <Button
                onClick={() => handleOpenChange(false)}
                className="gap-2"
              >
                {result?.success ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Selesai
                  </>
                ) : (
                  "Tutup"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  variant: "default" | "success" | "primary" | "muted";
}

function SummaryCard({ label, value, variant }: SummaryCardProps) {
  const variantClass = {
    default: "bg-muted/40 border-border text-foreground",
    success: "bg-green-50 border-green-200 text-green-700",
    primary: "bg-blue-50 border-blue-200 text-blue-700",
    muted: "bg-gray-50 border-gray-200 text-gray-700",
  }[variant];

  return (
    <div className={cn("rounded-md border p-3 text-center", variantClass)}>
      <p className="text-xs font-medium">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}