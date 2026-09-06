"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Info, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { RekapNilaiMahasiswaService } from "@/api/bimbingan-karir"
import useSWR from "swr"

interface AturanNilai {
  id: number
  kategori: string
  aturan_nilai: {
    mapping?: Record<string, number>
    ranges?: Array<{
      min: number
      max: number
      nilai: number
    }>
  }
}

const fetcherInformasi = () =>
  RekapNilaiMahasiswaService.getInformasi().then((res) => res)

const Informasi = () => {
  const { data, error, isLoading } = useSWR('informasi', fetcherInformasi)

  const aturanNilaiList: AturanNilai[] = data?.data || []

  // Ambil data LSP dan TOEFL
  const lspData = aturanNilaiList.find((item) => item.kategori === "lsp")
  const toeflData = aturanNilaiList.find((item) => item.kategori === "toefl")

  // Fungsi untuk format range TOEFL
  const formatToeflRange = (range: { min: number; max: number; nilai: number }, index: number, ranges: Array<{ min: number; max: number; nilai: number }>) => {
    // Jika min dan max sama-sama 0
    if (range.min === 0 && range.max === 0) {
      return `Tidak Hadir → ${range.nilai}`
    }
    
    // Jika ini adalah range terakhir (index terakhir)
    if (index === ranges.length - 1) {
      return `Skor ≥ ${range.min} → ${range.nilai}`
    }
    
    // Jika min sama dengan max
    if (range.min === range.max) {
      return `Skor ${range.min} → ${range.nilai}`
    }
    
    // Range biasa
    return `Skor ${range.min} - ${range.max} → ${range.nilai}`
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Info className="h-4 w-4" />
          Informasi
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] rounded-lg sm:w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-start">Informasi</DialogTitle>
          <DialogDescription className="text-start">
            Berikut adalah Informasi seputar Konversi Nilai dan Aturan mengunduh sertifikat
          </DialogDescription>
        </DialogHeader>

        <Separator />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Memuat informasi...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-destructive">Gagal memuat informasi</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Konversi Nilai Section */}
            <div>
              <h2 className="font-semibold text-base mb-3">Konversi Nilai</h2>

              {/* LSP */}
              {lspData && lspData.aturan_nilai.mapping && (
                <div className="mb-3">
                  <h3 className="font-semibold text-sm mb-2">LSP</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    {Object.entries(lspData.aturan_nilai.mapping).map(([key, value]) => {
                      const label = key === "TH" ? "TH (Tidak Hadir)" : 
                                    key === "K" ? "K (Kompeten)" : 
                                    key === "BK" ? "BK (Belum Kompeten)" : key
                      return (
                        <li key={key}>• {label} → {value}</li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {/* TOEFL */}
              {toeflData && toeflData.aturan_nilai.ranges && (
                <div className="mb-3">
                  <h3 className="font-semibold text-sm mb-2">TOEFL</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                    {toeflData.aturan_nilai.ranges.map((range, index) => (
                      <li key={index}>• {formatToeflRange(range, index, toeflData.aturan_nilai.ranges!)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Workshop */}
              <div className="mb-3">
                <h3 className="font-semibold text-sm mb-2">Workshop</h3>
                <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                  <li>• Lulus → 100</li>
                  <li>• Butuh Bimbingan → 70</li>
                  <li>• Tidak Lulus → 0</li>
                </ul>
              </div>

              {/* Soft Skill */}
              <div className="mb-3">
                <h3 className="font-semibold text-sm mb-2">Softskill</h3>
                <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                  <li>• Nilai × 10 (Maksimal 100)</li>
                </ul>
              </div>

              {/* Seminar */}
              <div>
                <h3 className="font-semibold text-sm mb-2">Seminar</h3>
                <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                  <li>• Hadir → 100</li>
                  <li>• Izin → 0</li>
                  <li>• Tidak Hadir → 0</li>
                </ul>
              </div>
            </div>

            <Separator />

            {/* Aturan Unduh Sertifikat Section */}
            <div>
              <h2 className="font-semibold text-base mb-3">Aturan Mengunduh Sertifikat</h2>
              <ol className="space-y-2 text-sm text-muted-foreground ml-4 list-decimal">
                <li>Sertifikat hanya tersedia bila kategori kegiatan adalah <strong>Seminar</strong> dan <strong>Workshop</strong>.</li>
                <li>Mahasiswa dapat mengunduh sertifikat apabila mahasiswa <strong>Hadir</strong> pada kegiatan Seminar atau konversi nilai <strong>lebih dari 70</strong> pada kegiatan Workshop serta <strong>telah mengisi feedback</strong></li> 
              </ol>
            </div>  

            {/* Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                <strong>Catatan:</strong> Ketentuan konversi nilai dapat berubah
                sewaktu-waktu sesuai dengan kebijakan dari pihak Koordinator.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default Informasi