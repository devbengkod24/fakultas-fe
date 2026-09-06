"use client";

import { useState } from "react";
import { Download, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ImportPublikasiDialog } from "./import-publikasi-dialog";
import type { ImportType } from "@/lib/publikasi-excel";
import {
  ExportPublikasiSuperAdminService,
  type ExportArtikelParams,
  type ExportPenelitianParams,
} from "@/api/superadmin";

interface ImportExportButtonsProps {
  type: ImportType;
  isSuperFakultas: boolean;
  exportParams?: ExportArtikelParams | ExportPenelitianParams;
  onImportSuccess?: () => void;
  isLoading?: boolean;
}

export function ImportExportButtons({
  type,
  isSuperFakultas,
  exportParams = {},
  onImportSuccess,
  isLoading,
}: ImportExportButtonsProps) {
  const [importOpen, setImportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    const toastId = toast.loading("Menyiapkan file Excel...");
    try {
      if (type === "artikel") {
        await ExportPublikasiSuperAdminService.exportArticles(
          exportParams as ExportArtikelParams,
        );
      } else {
        await ExportPublikasiSuperAdminService.exportResearches(
          exportParams as ExportPenelitianParams,
        );
      }
      toast.success("Export berhasil", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengekspor data",
        { id: toastId },
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="ml-auto flex items-center gap-2 border-l border-border pl-3">
      <Button
        type="button"
        variant="primaryOutline"
        size="sm"
        onClick={handleExport}
        disabled={isExporting || isLoading}
        className="gap-2"
      >
        {isExporting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Download className="size-4" />
        )}
        Export
      </Button>

      {isSuperFakultas && (
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={() => setImportOpen(true)}
          disabled={isLoading}
          className="gap-2"
        >
          <Upload className="size-4" />
          Import
        </Button>
      )}

      {isSuperFakultas && (
        <ImportPublikasiDialog
          open={importOpen}
          onOpenChange={setImportOpen}
          type={type}
          onSuccess={onImportSuccess}
        />
      )}
    </div>
  );
}