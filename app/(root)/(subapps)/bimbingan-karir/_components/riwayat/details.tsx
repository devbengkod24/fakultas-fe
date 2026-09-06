"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RiwayatDetailService } from "@/api/bimbingan-karir"
import useSWR from "swr"

interface StudentDetailActionProps {
  studentId: string
}

const fetcherRiwayatDetail = (id: number) =>
  RiwayatDetailService.getAllRiwayatDetail(id).then((res) => res);

export function StudentDetailAction({ studentId }: StudentDetailActionProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const { data, error, isLoading, mutate } = useSWR(
    studentId, fetcherRiwayatDetail, {
      revalidateOnMount: false,
      revalidateOnFocus: false,
    }
  )

  const studentData = data?.data ?? {}


  if (error) return <div>Gagal memuat data riwayat</div>;

  return (
    <>
      <Button  
        onClick={async () => {
          const result = await mutate();
          if (result?.data) {
            setIsDetailsOpen(true);
          }
        }}
        variant="ghost" 
        size="icon"
        disabled={isLoading} 
        className="text-primary hover:text-primary hover:bg-primary/10"
        >
        {isLoading ? (
          <Loader2 className="animate-spin size-4 text-primary" />
          ) : (
            <Eye size={16} className="text-primary"/>
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
              <span className="font-medium  text-muted-foreground">Nama :</span>
              <span>{studentData.nama}</span>
            </div>

            <div className="grid grid-cols-[60px_1fr] gap-2">
              <span className="font-medium  text-muted-foreground">Minat :</span>
              <span>{studentData.minat}</span>
            </div>

            {/* Jika "acaras" tersedia dan ingin ditampilkan */}
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
