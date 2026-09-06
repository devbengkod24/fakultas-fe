"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, Download, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { MonitoringSidangService, DosenService } from "@/api/kerja-praktek"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

type ModeUndangan = "personal" | "pilih" | "sesi"

interface DosenLite {
  id: number
  nama?: string
  nama_lengkap?: string
  user?: { name: string }
  gelar_depan?: string
  gelar_belakang?: string
}

interface DownloadUndanganModalProps {
  isOpen: boolean
  onClose: () => void
  prodiId?: number
}

export function DownloadUndanganModal({ isOpen, onClose, prodiId }: DownloadUndanganModalProps) {
  const searchParams = useSearchParams();
  const gelombangId = searchParams.get("gelombang_id")
  const [mode, setMode] = useState<ModeUndangan>("personal")
  const [selectedDosenId, setSelectedDosenId] = useState<string>("")
  const [dosenList, setDosenList] = useState<DosenLite[]>([])
  const [isLoadingDosen, setIsLoadingDosen] = useState(false)
  const [kodeUndangan, setKodeUndangan] = useState("")
  const [tanggalUndangan, setTanggalUndangan] = useState<Date | undefined>(undefined)
  const [isDownloading, setIsDownloading] = useState(false)

  // Fetch dosen list when modal opens & user selects mode 'pilih'
  useEffect(() => {
    if (!isOpen || mode !== "pilih") return
    let cancelled = false
    setIsLoadingDosen(true)
    DosenService
      .getDosenByPeriode(undefined, 1000, undefined, prodiId)
      .then((res: any) => {
        if (cancelled) return
        const data = Array.isArray(res) ? res : (res?.data ?? [])
        setDosenList(data)
      })
      .catch((err) => {
        if (cancelled) return
        console.error("Error fetching dosen:", err)
        toast.error("Gagal memuat daftar dosen")
      })
      .finally(() => {
        if (!cancelled) setIsLoadingDosen(false)
      })
    return () => {
      cancelled = true
    }
  }, [isOpen, mode, prodiId])

  const handleDownload = async () => {
    if (!gelombangId) {
      toast.error("Pilih gelombang terlebih dahulu")
      return
    }
    if (!kodeUndangan.trim()) {
      toast.error("Kode undangan harus diisi")
      return
    }
    if (!tanggalUndangan) {
      toast.error("Tanggal undangan harus diisi")
      return
    }
    if (mode === "pilih" && !selectedDosenId) {
      toast.error("Pilih dosen terlebih dahulu")
      return
    }

    setIsDownloading(true)

    try {
      const formattedDate = format(tanggalUndangan, "dd-MM-yyyy")
      let blob: Blob
      let zipName: string

      if (mode === "sesi") {
        // Mode 3: Urut sesuai tanggal (1 PDF gabungan semua sesi, surat di halaman 1)
        blob = await MonitoringSidangService.downloadUndanganSesi(
          Number(gelombangId),
          kodeUndangan.trim(),
          formattedDate,
          prodiId
        )
        const ext = blob.type?.includes("zip") ? "zip" : "pdf"
        zipName = `undangan-sesi-${kodeUndangan.trim().replace(/\//g, "-")}.${ext}`
      } else {
        // Mode 1 atau 2: Personal per-penguji.
        // Mode 1 (semua): backend balas ZIP → ext .zip
        // Mode 2 (pilih 1 dosen): backend balas PDF langsung → ext .pdf
        blob = await MonitoringSidangService.downloadUndanganPersonal(
          Number(gelombangId),
          kodeUndangan.trim(),
          formattedDate,
          mode === "pilih" ? Number(selectedDosenId) : undefined,
          prodiId
        )
        const isPickDosen = mode === "pilih" && !!selectedDosenId
        const slug = isPickDosen ? `-dosen${selectedDosenId}` : ""
        const ext = isPickDosen ? "pdf" : "zip"
        zipName = `undangan-personal${slug}-${kodeUndangan.trim().replace(/\//g, "-")}.${ext}`
      }

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = zipName
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Undangan berhasil didownload")

      setKodeUndangan("")
      setTanggalUndangan(undefined)
      setSelectedDosenId("")
      onClose()
    } catch (error) {
      console.error("Error downloading undangan:", error)
      if (error instanceof Error && error.message) {
        try {
          const parsed = JSON.parse(error.message)
          if (parsed && typeof parsed === "object" && "message" in parsed) {
            toast.error(parsed.message as string)
            return
          }
        } catch {
          // not JSON
        }
        toast.error(error.message)
      } else {
        toast.error("Gagal mendownload undangan")
      }
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCancel = () => {
    setKodeUndangan("")
    setTanggalUndangan(undefined)
    setSelectedDosenId("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Undangan Sidang
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Mode selector */}
          <div className="grid gap-2">
            <Label className="font-medium">Mode Download</Label>
            <RadioGroup
              value={mode}
              onValueChange={(v) => setMode(v as ModeUndangan)}
              className="grid gap-2"
              disabled={isDownloading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personal" id="mode-personal" />
                <Label htmlFor="mode-personal" className="font-normal cursor-pointer">
                  Personal (semua penguji di gelombang)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pilih" id="mode-pilih" />
                <Label htmlFor="mode-pilih" className="font-normal cursor-pointer">
                  Pilih penguji tertentu
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sesi" id="mode-sesi" />
                <Label htmlFor="mode-sesi" className="font-normal cursor-pointer">
                  Urut sesuai tanggal
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Dosen picker — only when mode=pilih */}
          {mode === "pilih" && (
            <div className="grid gap-2">
              <Label htmlFor="dosen-picker" className="font-medium">
                Pilih Dosen <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedDosenId} onValueChange={setSelectedDosenId} disabled={isDownloading || isLoadingDosen}>
                <SelectTrigger id="dosen-picker">
                  <SelectValue placeholder={isLoadingDosen ? "Memuat dosen..." : "Pilih dosen penguji"} />
                </SelectTrigger>
                <SelectContent>
                  {dosenList.length === 0 && !isLoadingDosen && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">Tidak ada dosen</div>
                  )}
                  {dosenList.map((d) => {
                    const nama = d.nama_lengkap
                      || d.nama
                      || d.user?.name
                      || [d.gelar_depan, d.gelar_belakang].filter(Boolean).join(" ")
                    return (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {nama || `Dosen #${d.id}`}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Kode Undangan */}
          <div className="grid gap-2">
            <Label htmlFor="kode-undangan" className="font-medium">
              Kode Undangan <span className="text-red-500">*</span>
            </Label>
            <Input
              id="kode-undangan"
              type="text"
              placeholder="Contoh: 0448/B.22/UDN-02/VI/2090"
              value={kodeUndangan}
              onChange={(e) => setKodeUndangan(e.target.value)}
              disabled={isDownloading}
              className="font-mono text-sm"
            />
          </div>

          {/* Tanggal Undangan */}
          <div className="grid gap-2">
            <Label className="font-medium">
              Tanggal Undangan <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !tanggalUndangan && "text-muted-foreground"
                  )}
                  disabled={isDownloading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {tanggalUndangan ? (
                    format(tanggalUndangan, "dd MMMM yyyy", { locale: id })
                  ) : (
                    "Pilih tanggal undangan"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={tanggalUndangan}
                  onSelect={setTanggalUndangan}
                  initialFocus
                  locale={id}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDownloading}
          >
            Batal
          </Button>
          <Button
            onClick={handleDownload}
            disabled={
              isDownloading ||
              !kodeUndangan.trim() ||
              !tanggalUndangan ||
              (mode === "pilih" && !selectedDosenId)
            }
            className="gap-2"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download Undangan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}