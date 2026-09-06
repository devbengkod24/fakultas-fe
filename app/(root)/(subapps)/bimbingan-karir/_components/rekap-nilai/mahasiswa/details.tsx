"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RekapNilaiMahasiswaService } from "@/api/bimbingan-karir"
import useSWR from "swr"
import { EventDetailSkeleton } from "../skeleton"

const formatDate = (input: string | Date) => {
  const date = new Date(input);
  return isNaN(date.getTime()) ? "-" : new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatTime = (time: string, date: string = "1970-01-01") => {
  const dateTime = new Date(`${date}T${time}`);
  return isNaN(dateTime.getTime())
    ? "-"
    : new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(dateTime);
};

interface EventDetailActionProps {
  eventId: number;
  customTrigger?: React.ReactNode;
}

const fetcherRekapNilaiDetail = (id: number) =>
  RekapNilaiMahasiswaService.getAllRekapNilaiDetail(id).then((res) => res);

export function EventDetailAction({ eventId, customTrigger }: EventDetailActionProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const { data, error, isLoading } = useSWR(
    isDetailsOpen ? [eventId] : null, 
    fetcherRekapNilaiDetail, 
  )

  const eventData = data?.data ?? {}
  
  if (error) return <div>Gagal memuat data rekap nilai</div>;
  
  return (
    <>
      {customTrigger ? (
        <span onClick={() => setIsDetailsOpen(true)}>{customTrigger}</span>
      ) : (
        <Button  
          onClick={() => setIsDetailsOpen(true)}
          variant="ghost"
          size="icon"
          disabled={isLoading}
          >
          {isLoading ? (
            <Loader2 className="animate-spin size-4" />
            ) : (
              <Eye size={16} />
            )
          }
        </Button>
      )}

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="mb-4">
            <DialogTitle>Detail Kegiatan</DialogTitle>
            <p className="text-sm text-muted-foreground">Lihat informasi lengkap mengenai salah satu kegiatan.</p>
          </DialogHeader>

          {isLoading ? (
            <EventDetailSkeleton />
          ) : (
            
            <div className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-4">
              <span className="font-medium">Nama Kegiatan</span>
              <span className="break-words whitespace-pre-wrap max-w-[300px]">
                : {eventData.nama_kegiatan}
              </span>

              <span className="font-medium">Deskripsi</span>
              <span className="break-words whitespace-pre-wrap max-w-[300px]">
                : {eventData.deskripsi}
              </span>

              <span className="font-medium">Tanggal</span>
              <span>: {formatDate(eventData.tanggal_mulai)} - {formatDate(eventData.tanggal_selesai)}</span>

              <span className="font-medium">Waktu</span>
              <span>: {formatTime(eventData.waktu_mulai, eventData.tanggal_mulai)} - {formatTime(eventData.waktu_selesai, eventData.tanggal_mulai)}</span>

              <span className="font-medium">Lokasi</span>
              <span className="break-words whitespace-pre-wrap max-w-[300px]">
                : {eventData.lokasi}
              </span>

              <span className="font-medium">Mentor</span>
              <span className="break-words whitespace-pre-wrap max-w-[300px]">
                : {eventData.mentor}
              </span>

              <span className="font-medium">Kategori</span>
              <span>: {eventData.kategori}</span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
