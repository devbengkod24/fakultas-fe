"use client"

import { useState } from "react"
import { createColumnsMahasiswa, handleDownloadSertifikat } from "../_components/rekap-nilai/mahasiswa/column"
import useSWR from "swr"
import { DaftarKegiatanMahasiswaService, RekapNilaiMahasiswaService } from "@/api/bimbingan-karir"
import EmptyState from "@/components/empty-state"
import { Clipboard } from "lucide-react"
import { DataTableMhsBk } from "../_components/rekap-nilai/mahasiswa/table"
import FeedbackDialog from "../_components/daftar-kegiatan/mahasiswa/feedback"
import { FeedbackFormData } from "../_components/daftar-kegiatan/mahasiswa/schema"
import { handleToastResponse } from "@/lib/toast-response"
import Informasi from "../_components/rekap-nilai/mahasiswa/informasi"

const fetcher = () =>
  RekapNilaiMahasiswaService.getAllRekapNilai().then((res) => res);

export function MahasiswaRekapNilai() {
  const { data, isLoading, error, mutate } = useSWR("rekap-nilai-mahasiswa", fetcher, {
    revalidateOnFocus: false,
  })

  const [downloadingId, setDownloadingId] = useState<number | undefined>(undefined);

  const [feedbackDialog, setFeedbackDialog] = useState({
    open: false,
    kegiatanId: 0,
    kegiatanNama: "",
  });

  const handleOpenFeedback = (kegiatanId: number, kegiatanNama: string) => {
    setFeedbackDialog({
      open: true,
      kegiatanId,
      kegiatanNama,
    });
  };

  const handleSubmitFeedback = async (feedbackData: FeedbackFormData) => {
    try {
      const res = await DaftarKegiatanMahasiswaService.createFeedback(feedbackData)
      handleToastResponse(res);
      mutate()
    } catch (error) {
      handleToastResponse({
        success: false,
        message: error instanceof Error ? error.message : "Gagal mengirim feedback"
      });
    }
  }

  const handleDownload = async (eventId: number, namaKegiatan: string) => {
    setDownloadingId(eventId);
    try {
      await handleDownloadSertifikat(eventId, namaKegiatan);
    } finally {
      setDownloadingId(undefined);
    }
  };

  const daftarKegiatan = data?.data ?? [];
  const columns = createColumnsMahasiswa(handleOpenFeedback, handleDownload, downloadingId);

  if (error) {
    return (
      <div className="w-full">
        <EmptyState
          icon={Clipboard}
          title="Gagal memuat data"
          subtitle="Terjadi kesalahan saat memuat data rekap nilai. Silakan coba lagi."
        />
      </div>
    );
  }

  if (!isLoading && daftarKegiatan.length === 0) {
    return (
      <div className="w-full">
        <EmptyState
          icon={Clipboard}
          title="Tidak ada data"
          subtitle="Anda belum mengikuti kegiatan bimbingan karir. Silakan hubungi koordinator untuk informasi lebih lanjut."
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-start mb-2">
          <Informasi />
        </div>
        <DataTableMhsBk
          columns={columns}
          data={daftarKegiatan}
          loading={isLoading}
        />
      </div>

      <FeedbackDialog
        open={feedbackDialog.open}
        onOpenChange={(open) => setFeedbackDialog({ ...feedbackDialog, open })}
        kegiatanId={feedbackDialog.kegiatanId}
        kegiatanNama={feedbackDialog.kegiatanNama}
        onSubmit={handleSubmitFeedback}
      />
    </div>
  )
}
