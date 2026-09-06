"use client"

import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Eye, Plus } from "lucide-react"
import { MonitoringSidangService } from "@/api/kerja-praktek"
import { handleToastResponse } from "@/lib/toast-response"
import { toast } from "sonner"
import { TambahTtdKoor } from "./tambah-ttd"
import { PreviewTtdKoor } from "./preview-ttd"

export default function TtdDosenActions() {
  const [isAddTtdOpen, setIsAddTtdOpen] = useState(false);
  const [isPreviewTtdOpen, setIsPreviewTtdOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data: ttdDosenData, mutate: mutateTtdDosen } = useSWR(
    "ttd-dosen",
    () => MonitoringSidangService.getTtdDosen().then((res) => res),
    { revalidateOnFocus: false }
  );

  const ttdDosenUrl = ttdDosenData?.data || null;

  const handleUploadTtdDosen = async (file: File) => {
    try {
      setIsUploading(true);
      const res = await MonitoringSidangService.storeTtdDosen(file);
      handleToastResponse(res);
      mutateTtdDosen();
    } catch (error) {
      console.error("Error upload TTD Dosen:", error);
      toast.error("Gagal mengunggah tanda tangan");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button className="gap-2" onClick={() => setIsPreviewTtdOpen(true)}>
        <Eye className="h-4 w-4" />
        <span>Preview TTD Dosen</span>
      </Button>
      <Button className="gap-2" onClick={() => setIsAddTtdOpen(true)}>
        <Plus className="h-4 w-4" />
        <span>Tambah TTD Dosen</span>
      </Button>

      {/* TTD Dosen Upload Dialog */}
      <TambahTtdKoor
        isOpen={isAddTtdOpen}
        onClose={() => setIsAddTtdOpen(false)}
        onUpload={handleUploadTtdDosen}
        isUploading={isUploading}
      />

      {/* Preview TTD Dosen Dialog */}
      <PreviewTtdKoor
        isOpen={isPreviewTtdOpen}
        onClose={() => setIsPreviewTtdOpen(false)}
        signatureUrl={ttdDosenUrl}
      />
    </>
  );
}