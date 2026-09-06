"use client"

import React from "react"
import { Calendar, Clock, MapPin, MessageSquareText, ScanQrCode, Tag, MessageCircle, Download, UserCheck, ImageOff, ImageIcon, FilePen, FileSearch, CheckCircle2, ClockIcon, FileCheck, XCircle, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "@/types/bimbingan-karir/mahasiswa/activity"
import { extractFileNameFromUrl, formatTimeString, stripHtml, truncateFileNameMiddle } from "@/lib/bimbingan-karir/kegiatan"
import { formatDate } from "@/lib/utils"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import EmptyState from "@/components/empty-state"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Props = {
  activity: Activity
  onScanClick: () => void
  onFeedbackClick: () => void
  onIzinClick: () => void
  now: Date
}

export default function ActivityCard({ activity, now, onScanClick, onFeedbackClick, onIzinClick }: Props) {
  const router = useRouter()

  const today = new Date(now.toDateString());
  const startDate = new Date(new Date(activity.tanggal_mulai).toDateString());
  const endDate = new Date(new Date(activity.tanggal_selesai).toDateString());

  const isCompleted = endDate < today;
  const isOngoing = startDate <= today && endDate >= today;

  let status = "Akan Berlangsung"
  let badgeVariant: "primary" | "success" | "secondary" = "primary"
  if (isOngoing) {
    status = "Sedang Berlangsung"
    badgeVariant = "secondary"
  } else if (isCompleted) {
    status = "Selesai"
    badgeVariant = "success"
  }

  const statusIzin = activity.status_izin;
  const isFeedbackDisabled = activity.is_feedback === true || activity.is_presensi === false || statusIzin === "menunggu" || statusIzin === "disetujui";
  const isScanDisabled = !isOngoing || activity.is_presensi === true || statusIzin === "menunggu";
  const isIzinDisabled = statusIzin === "menunggu" || statusIzin === "disetujui" || statusIzin === "ditolak" || (activity.batas_waktu_izin ? new Date(activity.batas_waktu_izin) < today : false) || activity.is_presensi === true;

  const handleDownloadPdf = (pdfUrl: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getPosterSrc = () => {
    if (!activity.poster) return null;

    if (typeof activity.poster === "string") {
      return activity.poster;
    }

    if (activity.poster instanceof File) {
      return URL.createObjectURL(activity.poster);
    }

    return null;
  };

  const posterSrc = getPosterSrc();

  return (
    <Card className="shadow-none flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-muted overflow-hidden">
        {posterSrc ? (
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative h-48 cursor-pointer group">
                <Image
                  src={posterSrc}
                  alt={`Poster ${activity.nama_kegiatan}`}
                  fill
                  className="object-cover w-full h-full transition-transform group-hover:scale-105 rounded-t-xl"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-white" />
                  <span className="text-white font-medium">Klik untuk memperbesar</span>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[95vw] sm:w-full p-0 rounded-lg">
              <DialogTitle className="px-6 pt-6 pb-4 font-semibold text-lg">
                Poster {activity.nama_kegiatan}
              </DialogTitle>
              <div className="relative w-full max-h-[calc(90vh-80px)] overflow-auto px-6 pb-6">
                <Image
                  src={posterSrc}
                  alt={`Poster ${activity.nama_kegiatan}`}
                  width={1200}
                  height={1600}
                  className="w-full h-auto object-contain rounded-lg"
                  unoptimized
                  priority
                />
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="flex items-center justify-center h-full">
            <EmptyState
              icon={ImageOff}
              title="Poster tidak tersedia"
              subtitle={`Tidak ada poster yang tersedia pada kegiatan "${activity.nama_kegiatan}"`}
              className="h-full border-none shadow-none px-2"
            />
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-xl line-clamp-2 flex-1 min-w-0">{activity.nama_kegiatan}</CardTitle>
          <Badge variant={badgeVariant} className="whitespace-nowrap flex-shrink-0">{status}</Badge>
        </div>
        <CardDescription className="truncate">{stripHtml(activity.deskripsi)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {formatDate(activity.tanggal_mulai)} - {formatDate(activity.tanggal_selesai)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {formatTimeString(activity.waktu_mulai)} - {formatTimeString(activity.waktu_selesai)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{activity.lokasi}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm capitalize">{activity.kategori}</span>
          </div>
          {activity.pengajar && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm capitalize">{activity.pengajar.name}</span>
            </div>
          )}

          {/* Link Grup WhatsApp */}
          {activity.link_grup_wa && (
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <a
                href={activity.link_grup_wa}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline truncate"
              >
                Grup WhatsApp
              </a>
            </div>
          )}

          {/* PDF Files - Download Buttons */}
          {activity.file_pdf && Array.isArray(activity.file_pdf) && activity.file_pdf.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Materi :</span>
              <div className="flex flex-wrap gap-2">
                {activity.file_pdf.map((file, index) => {
                  const isFileObject = file instanceof File;

                  let originalName: string;
                  let fileUrl: string;

                  if (isFileObject) {
                    originalName = file.name;
                    fileUrl = URL.createObjectURL(file);
                  } else {
                    const urlStr = file as string;
                    originalName = extractFileNameFromUrl(urlStr);
                    fileUrl = urlStr;
                  }

                  const displayName = truncateFileNameMiddle(originalName);

                  return (
                    <Button
                      key={index}
                      variant="primaryOutline"
                      size="sm"
                      className="h-auto py-1.5 px-3"
                      title={originalName}
                      onClick={() => handleDownloadPdf(fileUrl as string, originalName)}
                    >
                      <Download className="h-3 w-3 mr-1.5" />
                      <span className="text-xs truncate max-w-[150px]">
                        {displayName}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </CardContent>
      <CardFooter className="pt-0 p-4 bg-muted/50 mt-auto">
        {/* Mobile & Tablet (sm) - Icon Only, Vertical Stack */}
        <div className="flex lg:hidden flex-col w-full gap-2">
          <Link href={`/bimbingan-karir/daftar-kegiatan/${activity.id}`} className="w-full">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => router.push(`/bimbingan-karir/daftar-kegiatan/${activity.id}`)}
            >
              <FileSearch className="size-4 text-primary" />
              <span className="text-primary ml-1">Detail</span>
            </Button>
          </Link>
          <div className="flex gap-2 w-full">
            <Button
              variant={"default"}
              size="sm"
              onClick={onIzinClick}  // Panggil tanpa parameter
              disabled={isIzinDisabled}
              className="flex-1"
            >
              {statusIzin === "menunggu" ? (
                <ClockIcon className="h-4 w-4" />
              ) : statusIzin === "disetujui" ? (
                <FileCheck className="h-4 w-4" />
              ) : statusIzin === "ditolak" ? (
                <XCircle className="h-4 w-4" />
              ) : (
                <FilePen className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant={"default"}
              size="sm"
              onClick={onFeedbackClick}
              disabled={isFeedbackDisabled}
              className="flex-1"
            >
              {activity.is_feedback ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <MessageSquareText className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant={"default"}
              size="sm"
              onClick={onScanClick}
              disabled={isScanDisabled}
              className="flex-1"
            >
              {activity.is_presensi ? (
                <UserCheck className="h-4 w-4" />
              ) : (
                <ScanQrCode className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Desktop (lg) - Icon + Text, Horizontal */}
        <div className="hidden lg:flex flex-row justify-between items-center w-full gap-2">
          <Link href={`/bimbingan-karir/daftar-kegiatan/${activity.id}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/bimbingan-karir/daftar-kegiatan/${activity.id}`)}
            >
              <FileSearch className="size-4 text-primary mr-1" />
              <span className="text-primary">Detail</span>
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button
              variant={"default"}
              size="sm"
              onClick={onIzinClick}
              disabled={isIzinDisabled}
            >
              {statusIzin === "menunggu" ? (
                <>
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Menunggu
                </>
              ) : statusIzin === "disetujui" ? (
                <>
                  <FileCheck className="h-4 w-4 mr-1" />
                  Disetujui
                </>
              ) : statusIzin === "ditolak" ? (
                <>
                  <XCircle className="h-4 w-4 mr-1" />
                  Ditolak
                </>
              ) : (
                <>
                  <FilePen className="h-4 w-4 mr-1" />
                  Izin
                </>
              )}
            </Button>
            <Button
              variant={"default"}
              size="sm"
              onClick={onFeedbackClick}
              disabled={isFeedbackDisabled}
            >
              {activity.is_feedback ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Diterima
                </>
              ) : (
                <>
                  <MessageSquareText className="h-4 w-4 mr-1" />
                  Feedback
                </>
              )}
            </Button>
            <Button
              variant={"default"}
              size="sm"
              onClick={onScanClick}
              disabled={isScanDisabled}
            >
              {activity.is_presensi ? (
                <>
                  <UserCheck className="h-4 w-4 mr-1" />
                  Hadir
                </>
              ) : (
                <>
                  <ScanQrCode className="h-4 w-4 mr-1" />
                  Scan
                </>
              )}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
