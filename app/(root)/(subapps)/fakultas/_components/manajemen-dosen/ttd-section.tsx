"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSignature, Loader2, Eye, X } from "lucide-react";
import { DosenFakultasService } from "@/api";
import { handleToastResponse } from "@/lib/toast-response";
import { toast } from "sonner";

interface TtdSectionProps {
  dosenId: number;
  readOnly?: boolean;
  isSelf?: boolean;
}

export function TtdSection({ dosenId, readOnly = false, isSelf = true }: TtdSectionProps) {
  const [ttdUrl, setTtdUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch TTD saat mount
  useEffect(() => {
    if (readOnly) {
      setIsLoading(false);
      return;
    }
    DosenFakultasService.getTtd(dosenId)
      .then((res) => {
        if (res?.success && res?.data?.url) {
          setTtdUrl(res.data.url);
        }
      })
      .catch(() => {}) // Network error = belum ada TTD, tidak perlu error
      .finally(() => setIsLoading(false));
  }, [dosenId, readOnly]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran max 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    // Validasi tipe file
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format file harus PNG, JPG, atau PDF");
      return;
    }

    setPreviewFile(file);
    if (file.type !== "application/pdf") {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null); // PDF tidak preview
    }
  };

  const handleUpload = async () => {
    if (!previewFile) return;
    try {
      setIsUploading(true);
      const res = await DosenFakultasService.uploadTtd(dosenId, previewFile, isSelf);
      handleToastResponse(res);
      if (res?.success) {
        // Refresh TTD URL
        const ttdRes = await DosenFakultasService.getTtd(dosenId);
        if (ttdRes?.success && ttdRes?.data?.url) {
          setTtdUrl(ttdRes.data.url);
        }
        setPreviewFile(null);
        setPreviewUrl(null);
      }
    } catch (err) {
      toast.error("Gagal mengupload TTD");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileSignature className="h-5 w-5" />
          Tanda Tangan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* TTD sudah ada */}
        {!isLoading && ttdUrl && !previewFile && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">TTD saat ini:</p>
            <div className="border rounded-lg p-3 bg-gray-50 flex justify-center">
              <img
                src={ttdUrl}
                alt="Tanda Tangan Dosen"
                className="max-h-32 object-contain"
              />
            </div>
          </div>
        )}

        {/* Belum ada TTD */}
        {!isLoading && !ttdUrl && !previewFile && (
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
            <FileSignature className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Belum ada tanda tangan</p>
          </div>
        )}

        {/* Preview file yang dipilih */}
        {previewFile && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Preview:</p>
            {previewUrl ? (
              <div className="border rounded-lg p-3 bg-gray-50 flex justify-center">
                <img
                  src={previewUrl}
                  alt="Preview TTD"
                  className="max-h-32 object-contain"
                />
              </div>
            ) : (
              <div className="border rounded-lg p-3 bg-gray-50 text-center text-sm text-muted-foreground">
                📄 {previewFile.name}
              </div>
            )}
          </div>
        )}

        {/* Tombol aksi */}
        {!readOnly && (
          <div className="flex gap-2 flex-wrap">
            {!previewFile ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  {ttdUrl ? "Ganti TTD" : "Upload TTD"}
                </Button>
                {ttdUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(ttdUrl, "_blank")}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Lihat TTD
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-1" />
                  )}
                  {isUploading ? "Mengupload..." : "Simpan TTD"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Batal
                </Button>
              </>
            )}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {!readOnly && (
          <p className="text-xs text-muted-foreground">
            Format: PNG, JPG, PDF. Maksimal 5MB.
          </p>
        )}
      </CardContent>
    </Card>
  );
}