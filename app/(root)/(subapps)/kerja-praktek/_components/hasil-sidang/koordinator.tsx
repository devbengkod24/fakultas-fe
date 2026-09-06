"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table"
import { MonitoringSidangService } from "@/api/kerja-praktek"
import useSWR from "swr"
import { useSearchParams } from "next/navigation"
import { Columns } from "./columns"
import { TambahTtdKoor } from "./tambah-ttd"
import { PreviewTtdKoor } from "./preview-ttd"
import { toast } from "sonner"
import MonitoringSidangToolbar from "./toolbar"
import { handleToastResponse } from "@/lib/toast-response"
import type { MonitoringSidang } from "@/types/kerja-praktek/monitoring-sidang"
import EmptyState from "@/components/empty-state"
import { CalendarCheck } from "lucide-react"
import { useProfile } from "@/context/profileUseContext"

const fetchAllMonitoringSidang = async (gelombang_id?: number, search?: string, prodi_id?: number) => {
  const pageSize = 100;
  const firstResponse = await MonitoringSidangService.getAllMonitoringSidang(gelombang_id, search, 1, pageSize, prodi_id);
  const firstPageData: MonitoringSidang[] = firstResponse?.data ?? [];
  const lastPage: number = firstResponse?.meta?.pagination?.last_page ?? 1;

  let merged = [...firstPageData];

  if (lastPage > 1) {
    const pagePromises: Promise<any>[] = [];
    for (let page = 2; page <= lastPage; page += 1) {
      pagePromises.push(MonitoringSidangService.getAllMonitoringSidang(gelombang_id, search, page, pageSize, prodi_id));
    }

    const otherPages = await Promise.all(pagePromises);
    const otherData = otherPages.flatMap((res) => res?.data ?? []);
    merged = [...merged, ...otherData];
  }

  // Backend now handles filtering for jadwal, no need for client-side filter
  return merged;
};

export default function MonitoringSidangKoordinator() {
  const searchParams = useSearchParams();
  const { activeProdiId } = useProfile();
  const [isAddTtdOpen, setIsAddTtdOpen] = useState(false);
  const [isPreviewTtdOpen, setIsPreviewTtdOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const gelombang_id = Number(searchParams.get("gelombang_id")) || undefined;
  const gelombangIdString = searchParams.get("gelombang_id");
  const searchTerm = searchParams.get("search") || "";

  const { data: hasilSidang, isLoading, mutate } = useSWR(
    ["hasil-sidang", gelombang_id, searchTerm, activeProdiId ?? undefined],
    () => fetchAllMonitoringSidang(gelombang_id, searchTerm, activeProdiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const { data: ttdKoorData, mutate: mutateTtdKoor } = useSWR(
    "ttd-koor",
    () => MonitoringSidangService.getTtdKoor().then((res) => res),
    { revalidateOnFocus: false }
  );

  const ttdKoorUrl = ttdKoorData?.data || null;
  const totalData = hasilSidang?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalData / limit));
  const currentPage = Math.min(page, totalPages);
  const perPage = limit;
  const startIndex = (currentPage - 1) * limit;
  const paginatedSidang = (hasilSidang ?? []).slice(startIndex, startIndex + limit);

  const handleDownloadPdf = async (sidangId: number) => {
    try {
        const blob = await MonitoringSidangService.downloadPDF(sidangId);
        
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `berita-acara-sidang-${sidangId}.pdf`);
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
        
        toast.success("PDF berhasil diunduh");
    } catch (error) {
        console.error("Error downloading PDF:", error);
        toast.error("Gagal mengunduh PDF");
    }
  };

  const handleUpdateNilaiPenyelia = async (id: number, nilai: number) => {
    try {
      const res = await MonitoringSidangService.updateNilaiPenyelia(id, nilai);
      handleToastResponse(res);
      mutate();
    } catch (error) {
      console.error("Error update nilai pembimbing:", error);
      toast.error("Gagal mengupdate nilai pembimbing");
    }
  };

  const handleUpdateNilaiPembimbing = async (id: number, nilai: number) => {
    try {
      const res = await MonitoringSidangService.updateNilaiPembimbing(id, nilai);
      handleToastResponse(res);
      mutate();
    } catch (error) {
      console.error("Error update nilai pembimbing:", error);
      toast.error("Gagal mengupdate nilai pembimbing");
    }
  };

  const handleUpdateNilaiPenguji1 = async (id: number, nilai: number) => {
    try {
      const res = await MonitoringSidangService.updateNilaiPenguji1(id, nilai);
      handleToastResponse(res);
      mutate();
    } catch (error) {
      console.error("Error update nilai penguji 1:", error);
      toast.error("Gagal mengupdate nilai penguji 1");
    }
  };

  const handleUpdateNilaiPenguji2 = async (id: number, nilai: number) => {
    try {
      const res = await MonitoringSidangService.updateNilaiPenguji2(id, nilai);
      handleToastResponse(res);
      mutate();
    } catch (error) {
      console.error("Error update nilai penguji 2:", error);
      toast.error("Gagal mengupdate nilai penguji 2");
    }
  };

  const handleUpdateNilaiPenguji3 = async (id: number, nilai: number) => {
    try {
      const res = await MonitoringSidangService.updateNilaiPenguji3(id, nilai);
      handleToastResponse(res);
      mutate();
    } catch (error) {
      console.error("Error update nilai penguji 3:", error);
      toast.error("Gagal mengupdate nilai penguji 3");
    }
  };

  const handleUploadTtdKoor = async (file: File) => {
    try {
      setIsUploading(true);
      const res = await MonitoringSidangService.storeTtdKoor(file);
      handleToastResponse(res);
      mutateTtdKoor();
    } catch (error) {
      console.error("Error upload TTD Koor:", error);
      toast.error("Gagal mengunggah tanda tangan");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreviewTtd = () => {
    setIsPreviewTtdOpen(true);
  };

  const handleAddTtd = () => {
    setIsAddTtdOpen(true);
  };

  const handleDownloadExcel = async () => {
    try {
      toast.loading("Mengunduh file Excel...");
      
      const blob = await MonitoringSidangService.downloadExcel(gelombang_id, activeProdiId ?? undefined);
      
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = gelombang_id 
        ? `monitoring-sidang-kp-gelombang-${gelombang_id}.xlsx`
        : `monitoring-sidang-kp-all.xlsx`;
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast.dismiss();
      toast.success("File Excel berhasil diunduh");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      toast.dismiss();
      toast.error("Gagal mengunduh file Excel");
    }
  };

  const handleDownloadAllPDF = async () => {
    setIsDownloadingPDF(true);
    
    try {
      const blob = await MonitoringSidangService.downloadAllPDF(gelombang_id, activeProdiId ?? undefined);
      
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = gelombang_id 
        ? `monitoring-sidang-gelombang-${gelombang_id}.zip`
        : `monitoring-sidang-all.zip`;
        
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("File ZIP berhasil didownload");
    } catch (error: any) {
      console.error('Error downloading ZIP:', error);
      const errorMessage = error.message || "Gagal mendownload file ZIP";
      toast.error(errorMessage);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <MonitoringSidangToolbar
        onPreviewTtd={handlePreviewTtd}
        onAddTtd={handleAddTtd}
        onDownloadExcel={handleDownloadExcel}
        onDownloadAllPDF={handleDownloadAllPDF}
        isDownloadingPDF={isDownloadingPDF}
        gelombangId={gelombangIdString}
      />

      {!isLoading && paginatedSidang.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="Belum Ada Hasil Sidang"
          subtitle="Data sidang akan muncul setelah jadwal dipasang di menu Plotting Jadwal."
        />
      ) : (
        <DataTable
          columns={Columns(
            currentPage,
            perPage,
            false, // isDosen = false untuk koor
            handleUpdateNilaiPenyelia,
            handleUpdateNilaiPembimbing,
            handleUpdateNilaiPenguji1,
            handleUpdateNilaiPenguji2,
            handleUpdateNilaiPenguji3
          )}
          data={paginatedSidang}
          loading={isLoading}
          pagination={{
            currentPage,
            lastPage: totalPages,
            limit,
            total: totalData,
          }}
        />
      )}

      {/* TTD Koor Upload Dialog */}
      <TambahTtdKoor 
        isOpen={isAddTtdOpen}
        onClose={() => setIsAddTtdOpen(false)}
        onUpload={handleUploadTtdKoor}
        isUploading={isUploading}
      />

      {/* Preview TTD Koor Dialog */}
      <PreviewTtdKoor
        isOpen={isPreviewTtdOpen}
        onClose={() => setIsPreviewTtdOpen(false)}
        signatureUrl={ttdKoorUrl}
      />
    </div>
  )
}