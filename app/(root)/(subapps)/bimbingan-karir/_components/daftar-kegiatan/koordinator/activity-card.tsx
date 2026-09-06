"use client"

import { Calendar, Clock, MapPin, Tag, Edit, UserCheck, Trash2, MessageCircle, Download, ImageOff, ImageIcon, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Activity } from "@/types/bimbingan-karir/koordinator/daftar-kegiatan/activity"
import Image from "next/image"
import EmptyState from "@/components/empty-state"
import { extractFileNameFromUrl, stripHtml, truncateFileNameMiddle } from "@/lib/bimbingan-karir/kegiatan"
import { formatDate } from "@/lib/utils"

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)

type Props = {
  activity: Activity
  onEdit: (activity: Activity) => void
  onDelete: (id: number) => void
  now: Date
}

export default function ActivityCard({ activity, onEdit, onDelete, now }: Props) {
  const today = new Date(now.toDateString());
  const startDate = new Date(activity.tanggal_mulai.toDateString());
  const endDate = new Date(activity.tanggal_selesai.toDateString());

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
                  className="object-cover w-full h-full transition-transform group-hover:scale-105 rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-white" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogTitle className="mb-4 font-semibold text-lg">
                Poster {activity.nama_kegiatan}
              </DialogTitle>
              <div className="relative w-full max-h-[80vh] overflow-auto">
                <Image
                  src={posterSrc}
                  alt={`Poster ${activity.nama_kegiatan}`}
                  width={800}
                  height={1200}
                  className="w-full h-auto object-contain rounded-lg"
                  unoptimized
                />
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="flex items-center justify-center h-full">
            <EmptyState
              icon={ImageOff}
              title="Poster tidak tersedia"
              subtitle={`Silahkan tambahkan poster untuk kegiatan "${activity.nama_kegiatan}"`}
              className="h-full border-none shadow-none"
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
              {formatTime(activity.tanggal_mulai)} - {formatTime(activity.tanggal_selesai)}
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
              <span className="text-sm">{activity.pengajar.name}</span>
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
        <div className="flex gap-2 ml-auto">
          <Button
            variant="default"
            size="sm"
            onClick={() => onEdit(activity)}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Link href={`/bimbingan-karir/daftar-kegiatan/${activity.id}`}>
            <Button variant="default" size="sm">
              <UserCheck className="h-4 w-4 mr-1" /> Presensi
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(activity.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Hapus
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
