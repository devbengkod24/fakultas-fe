"use client"

import { DaftarKegiatanMahasiswaService } from "@/api/bimbingan-karir";
import useSWR from "swr";
import { Calendar, ClockIcon, MapPin, User, ExternalLink, Download, Copy } from "lucide-react";
import dayjs from "dayjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { extractFileNameFromUrl, formatTimeString } from "@/lib/bimbingan-karir/kegiatan";
import DOMPurify from "isomorphic-dompurify";
import { toast } from "sonner";
import { SkeletonDetailKegiatanMahasiswa } from "../../_components/daftar-kegiatan/skeleton";

const fetcherDaftarKegiatanMhsDetail = (id: number) =>
  DaftarKegiatanMahasiswaService.getDaftarKegiatanMhsDetail(id).then((res) => res);

export default function MahasiswaDetailKegiatan({ id }: { id: string }) {
  const { data: kegiatans, isLoading, error } = useSWR(
    ["daftar-kegiatan-mahasiswa-detail", id],
    () => fetcherDaftarKegiatanMhsDetail(Number(id))
  );

  const handleDownloadPdf = (pdfUrl: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Link berhasil disalin ke clipboard")
  }

  const getDisplayName = (url: string) => {
    return url
  }

  if (isLoading) {
    return <SkeletonDetailKegiatanMahasiswa />;
  }

  if (error) {
    return <div className="p-6 text-red-500">Gagal memuat data kegiatan</div>;
  }

  const kegiatan = kegiatans?.data;

  if (!kegiatan) {
    return <div className="p-6">Data tidak ditemukan</div>;
  }

  return (
    <div>
      <h1 className="text-lg sm:text-xl font-medium">{kegiatan.nama_kegiatan}</h1>

      {/* Info - Mobile: Stack vertically, Desktop: Inline */}
      <div className="mt-2 space-y-1 sm:space-y-0">
        <div className="flex flex-wrap items-center text-xs sm:text-sm text-muted-foreground gap-x-2 gap-y-1">
          <div className="flex items-center">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="break-all">{kegiatan.lokasi}</span>
          </div>
          <span className="hidden sm:inline text-gray-300">|</span>
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{dayjs(kegiatan.tanggal_mulai).format("DD MMM YYYY")} - {dayjs(kegiatan.tanggal_selesai).format("DD MMM YYYY")}</span>
          </div>
          <span className="hidden sm:inline text-gray-300">|</span>
          <div className="flex items-center">
            <ClockIcon className="h-3.5 w-3.5 mr-1" />
            <span>{formatTimeString(kegiatan.waktu_mulai)} - {formatTimeString(kegiatan.waktu_selesai)}</span>
          </div>
          <span className="hidden sm:inline text-gray-300">|</span>
          <div className="flex items-center">
            <User className="h-3.5 w-3.5 mr-1" />
            <span className="break-all">{kegiatan.pengajar?.name}</span>
          </div>
        </div>
      </div>

      <div
        className="mt-4 font-normal text-sm whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(kegiatan.deskripsi) }}
      />

      {/* Link Grup WhatsApp */}
      {kegiatan.link_grup_wa && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Link Grup WhatsApp</h3>
          <div className="flex items-center gap-1 bg-muted border border-border rounded-lg overflow-hidden w-full sm:max-w-md">
            <input
              type="text"
              value={getDisplayName(kegiatan.link_grup_wa)}
              readOnly
              className="px-3 py-2 bg-transparent text-sm text-foreground outline-none flex-1 truncate"
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => handleCopy(kegiatan.link_grup_wa)}
            >
              <Copy className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="default"
              className="h-9 w-9 shrink-0 rounded-l-none "
              asChild
            >
              <a href={kegiatan.link_grup_wa} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* File PDF */}
      {kegiatan.file_pdf && kegiatan.file_pdf.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Materi :</h3>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
            {kegiatan.file_pdf.map((pdf: string, index: number) => {
              const fullFileName = extractFileNameFromUrl(pdf);

              return (
                <Button
                  key={index}
                  variant="default"
                  className="h-auto py-2 px-3 gap-2 text-sm font-normal w-full sm:w-auto justify-start"
                  onClick={() => handleDownloadPdf(pdf, fullFileName)}
                  title={fullFileName}
                >
                  <Download className="size-4 shrink-0" />
                  <span className="truncate">{fullFileName}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {kegiatan.poster && (
        <div className="mt-6">
          <Image
            src={kegiatan.poster}
            alt={kegiatan.nama_kegiatan}
            width={400}
            height={500}
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  );
}