"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Award, ExternalLink, Eye, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RekapNilaiService } from "@/api/bimbingan-karir"
import useSWR from "swr"
import { Badge } from "@/components/ui/badge"
import { getCookie } from "cookies-next"
import { API_URL, SITE_COOKIES } from "@/lib/constant"

interface StudentDetailActionProps {
  studentId: string
}

interface Sertifikat {
  nama_kegiatan: string | null
  kategori: string | null
  mahasiswa_id: number | null
  kegiatan_id: number | null
  has_template: boolean
}

const fetcherRekapNilaiDetail = (id: number) =>
  RekapNilaiService.getAllRekapNilaiDetail(id).then((res) => res);

async function openSertifikat(mahasiswaId: number, kegiatanId: number) {
  const token = getCookie(SITE_COOKIES.TOKEN)
  const url = `${API_URL}/bk/rekap-nilai/sertifikat-mahasiswa?mahasiswa_id=${mahasiswaId}&kegiatan_id=${kegiatanId}`

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/pdf",
    },
  })

  if (!res.ok) {
    alert("Gagal membuka sertifikat. Pastikan sertifikat sudah dirilis.")
    return
  }

  const blob = await res.blob()
  const blobUrl = URL.createObjectURL(blob)
  window.open(blobUrl, "_blank")
}

export function StudentDetailAction({ studentId }: StudentDetailActionProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [loadingSertifikatIdx, setLoadingSertifikatIdx] = useState<number | null>(null)

  const { data, error, isLoading, mutate } = useSWR(studentId, fetcherRekapNilaiDetail, {
    revalidateOnMount: false,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  const studentData = data?.data ?? {}

  if (error) return <div>Gagal memuat data rekap nilai</div>;

  return (
    <>
      <Button
        onClick={async () => {
          const result = await mutate();
          if (result?.data) {
            setIsDetailsOpen(true);
          }
        }}
        size="icon"
        variant={"ghost"}
        disabled={isLoading}
        className="text-primary hover:text-primary hover:bg-primary/10"
      >
        {isLoading ? (
          <Loader2 className="animate-spin size-4 text-primary" />
        ) : (
          <Eye size={16} />
        )
        }
      </Button>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detail Mahasiswa</DialogTitle>
            <p className="text-sm text-muted-foreground">Informasi lengkap tentang mahasiswa</p>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-[60px_1fr] gap-2">
              <span className="font-medium text-muted-foreground">NIM :</span>
              <span>{studentData.nim}</span>
            </div>

            <div className="grid grid-cols-[60px_1fr] gap-2">
              <span className="font-medium text-muted-foreground">Nama :</span>
              <span>{studentData.nama}</span>
            </div>

            <div className="grid grid-cols-[60px_1fr] gap-2">
              <span className="font-medium text-muted-foreground">Minat :</span>
              <span>{studentData.minat}</span>
            </div>

            {studentData.kegiatans?.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Acara beserta nilai mentahnya:</h4>
                <ul className="pl-5 list-disc text-sm space-y-1.5">
                  {studentData.kegiatans.map((item: { nama_kegiatan: string; kategori: string; hasil_mentah: string },
                    idx: number) => (
                    <li key={idx} className="text-muted-foreground">
                      {item.nama_kegiatan} ({item.kategori}) - {item.hasil_mentah}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sertifikat section */}
            {studentData.sertifikats?.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2 flex items-center gap-1.5">
                  <Award size={16} className="text-yellow-500" />
                  Sertifikat Diterima
                </h4>
                <ul className="space-y-2">
                  {studentData.sertifikats.map((sert: Sertifikat, idx: number) => (
                    <li key={idx} className="flex items-center justify-between text-sm bg-muted/50 rounded-md px-3 py-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{sert.nama_kegiatan ?? '-'}</span>
                        <Badge variant="outline" className="w-fit text-xs capitalize">{sert.kategori}</Badge>
                      </div>
                      {sert.has_template && sert.mahasiswa_id && sert.kegiatan_id ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={loadingSertifikatIdx === idx}
                          className="text-primary hover:text-primary hover:bg-primary/10 text-xs h-7 px-2 shrink-0 ml-2"
                          onClick={async () => {
                            setLoadingSertifikatIdx(idx)
                            await openSertifikat(sert.mahasiswa_id!, sert.kegiatan_id!)
                            setLoadingSertifikatIdx(null)
                          }}
                        >
                          {loadingSertifikatIdx === idx ? (
                            <Loader2 size={12} className="animate-spin mr-1" />
                          ) : (
                            <ExternalLink size={12} className="mr-1" />
                          )}
                          Lihat
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground ml-2">Template tidak tersedia</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {studentData.sertifikats?.length === 0 && (
              <div className="border-t pt-4 text-sm text-muted-foreground italic">
                Belum ada sertifikat yang dirilis untuk mahasiswa ini.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

