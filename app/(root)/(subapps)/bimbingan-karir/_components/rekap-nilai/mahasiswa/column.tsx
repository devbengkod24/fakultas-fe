"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Activity } from "@/types/bimbingan-karir/mahasiswa/activity";
import { RekapNilaiMahasiswaService } from "@/api/bimbingan-karir";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, MessageSquareText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }
  ).format(date)

export const createColumnsMahasiswa = (
  onFeedbackClick: (kegiatanId: number, kegiatanNama: string) => void,
  onDownloadClick: (eventId: number, namaKegiatan: string) => Promise<void>,
  downloadingId?: number
): ColumnDef<Activity>[] => [
    {
      id: "no",
      header: "No",
      cell: ({ row }) => <div className="flex items-center gap-1">{row.index + 1}.</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "kegiatan_dan_tanggal",
      header: "Kegiatan",
      cell: ({ row }) => {
        const nama = row.original.nama_kegiatan;
        const mulai = row.original.tanggal_mulai;
        const selesai = row.original.tanggal_selesai;
        return (
          <div className="flex flex-col">
            <span className="font-semibold">{nama}</span>
            {mulai && selesai ? `${formatDate(new Date(mulai))} - ${formatDate(new Date(selesai))}` : "-"}
          </div>
        );
      }
    },
    {
      id: "status_kehadiran",
      header: "Status Kehadiran",
      cell: ({ row }) => {
        const status = row.original.status_kehadiran;
        const variant = status?.toLowerCase() === "hadir" ? "success" : status?.toLowerCase() === "izin" ? "secondary" : "destructiveOutline";

        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    // {
    //   accessorKey: "nilai",
    //   header: "Nilai Konversi",
    // },
    {
      id: "feedback",
      header: "Feedback",
      cell: ({ row }) => {
        const activity = row.original;
        const status = row.original.status_kehadiran;
        const isFeedbackDisabled = activity.is_feedback === true || activity.is_presensi !== true || status?.toLowerCase() !== "hadir";

        if (activity.is_feedback) {
          return (
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              disabled
            >
              <CheckCircle2 className="h-4 w-4" />
              Diterima
            </Button>
          );
        }

        return (
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            disabled={isFeedbackDisabled}
            onClick={() => !isFeedbackDisabled && onFeedbackClick(activity.id, activity.nama_kegiatan)}
          >
            <MessageSquareText className="h-4 w-4" />
            Feedback
          </Button>
        );
      },
    },
    {
      id: "status_sertifikat",
      header: "Sertifikat",
      cell: ({ row }) => {
        const activity = row.original;
        const statusSertifikat = activity.status_sertifikat?.toLowerCase();
        const isDownloading = downloadingId === activity.id;

        // Jika tidak ada status_sertifikat field
        if (!activity.status_sertifikat) {
          return (
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              disabled
            >
              Tidak Ada Sertifikat
            </Button>
          );
        }

        const isDisabled = statusSertifikat === "belum dirilis" || activity.is_feedback !== true || statusSertifikat === "tidak memenuhi";

        // Tentukan text button
        let buttonText = "Belum Dirilis";
        if (statusSertifikat === "dirilis") {
          buttonText = activity.is_feedback === true ? "Unduh Sertifikat" : "Isi Feedback Dulu";
        } else if (statusSertifikat === "tidak memenuhi") {
          buttonText = "Belum Memenuhi Syarat";
        }

        return (
          <Button
            variant={"default"}
            size="sm"
            className="gap-2"
            disabled={isDisabled || isDownloading}
            onClick={() => !isDisabled && !isDownloading && onDownloadClick(activity.id, activity.nama_kegiatan)}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {buttonText}
          </Button>
        );
      },
    }
  ];

export const handleDownloadSertifikat = async (
  eventId: number,
  namaKegiatan: string
): Promise<void> => {
  try {
    const blob = await RekapNilaiMahasiswaService.getSertifikat(eventId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sertifikat_${namaKegiatan.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Sertifikat berhasil diunduh");
  } catch (error) {
    console.error("Error downloading sertifikat:", error);
    toast.error("Gagal mengunduh sertifikat. Silakan coba lagi.");
  }
};