import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MailIcon, PhoneIcon, UserCheck, ChevronsUpDown, Loader2 } from "lucide-react"
import { Dosen } from "@/types/kerja-praktek/mahasiswa"
import EmptyState from "@/components/empty-state"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandInput, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import { DosenService, MahasiswaService } from "@/api/kerja-praktek"
import { useState } from "react"
import { toast } from "sonner"
import { useSWRConfig } from "swr"

interface DosenPembimbingCardProps {
  dosen?: Dosen | null
  projectId?: number | null
  mahasiswaId?: number | null
}

const DosenPembimbingCard = ({ dosen, projectId, mahasiswaId }: DosenPembimbingCardProps) => {
  const { mutate } = useSWRConfig();
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedDosenId, setSelectedDosenId] = useState<number | null>(null)
  const { data: dosenData, isLoading: dosenLoading } = useSWR(
    "dosen-update-dospem",
    () => DosenService.getDosenUpdateDospem().then((r) => r.data ?? []),
    { revalidateOnFocus: false }
  )

  const filtered = (dosenData ?? []).filter((d: any) => {
    if (!search) return true
    return d.nama.toLowerCase().includes(search.toLowerCase())
  })

  const handleAssign = async () => {
    if (!projectId) return toast.error("Project ID tidak ditemukan")
    if (!selectedDosenId) return toast.error("Pilih dosen terlebih dahulu")
    try {
      const res = await MahasiswaService.updateDospem([projectId], selectedDosenId, false)
      if (res.success) {
        toast.success("Dosen pembimbing diupdate")
        mutate(["detail-mahasiswa", String(mahasiswaId)])
        setOpen(false)

        // Dispatch event untuk invalidate cache di halaman lain (Kuota Dosen)
        window.dispatchEvent(new CustomEvent('kp-dospem-updated'));
      } else {
        toast.error(res.message || "Gagal update dosen")
      }
    } catch (e) {
      console.error(e)
      toast.error("Gagal update dosen")
    }
  }

  const handleReset = async () => {
    if (!projectId) return toast.error("Project ID tidak ditemukan")
    if (!confirm("Batalkan/hapus dosen pembimbing untuk mahasiswa ini?")) return
    try {
      const res = await MahasiswaService.updateDospem([projectId], null, false)
      if (res.success) {
        toast.success("Dosen pembimbing dibatalkan")
        mutate(["detail-mahasiswa", String(mahasiswaId)])

        // Dispatch event untuk invalidate cache di halaman lain (Kuota Dosen)
        window.dispatchEvent(new CustomEvent('kp-dospem-updated'));
      } else {
        toast.error(res.message || "Gagal membatalkan dosen")
      }
    } catch (e) {
      console.error(e)
      toast.error("Gagal membatalkan dosen")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Dosen Pembimbing</CardTitle>
      </CardHeader>
      <CardContent className="mt-3">
        {dosen ? (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-24 w-24 border">
                <AvatarImage src={""} alt={dosen.nama} />
                <AvatarFallback className="text-2xl">
                  {(dosen.nama ?? "")
                    .split(" ")
                    .map((nama: string) => nama[0])
                    .join("")
                    .substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h1 className="text-xl font-semibold capitalize">
                    {dosen.nama?.toLowerCase() ?? "Nama tidak diketahui"}
                  </h1>
                  <p className="text-gray-500 font-normal">
                    {dosen.npp ?? "NPP tidak diketahui"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button size="sm" variant="outline">Ubah Dosen</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <div className="p-2">
                        <input
                          placeholder="Cari dosen..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full border p-2 rounded mb-2"
                        />
                        <div className="max-h-40 overflow-y-auto">
                          {dosenLoading ? (
                            <div className="flex items-center gap-2 p-2">
                              <Loader2 className="h-4 w-4 animate-spin" /> Memuat dosen...
                            </div>
                          ) : (
                            filtered.map((d: any) => (
                              <div key={d.id} className={`p-2 rounded hover:bg-muted/50 cursor-pointer ${selectedDosenId === d.id ? 'bg-muted/50' : ''}`} onClick={() => setSelectedDosenId(d.id)}>
                                {d.gelar_depan ? d.gelar_depan + ' ' : ''}{d.nama}{d.gelar_belakang ? ', ' + d.gelar_belakang : ''}
                              </div>
                            ))
                          )}
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                          <Button size="sm" onClick={handleAssign} disabled={!selectedDosenId}>Simpan</Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button size="sm" variant="destructive" onClick={handleReset}>Batalkan ACC</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MailIcon className="size-4" />
                    <span>
                      Email: <strong>{dosen.email ?? "-"}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="size-4" />
                    <span className="text-sm">
                      Telepon: <strong>{dosen.telepon ?? "-"}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={UserCheck}
            title="Belum Ada Dosen Pembimbing"
            subtitle="Mahasiswa ini belum memiliki dosen pembimbing yang ditugaskan untuk membimbing kerja praktek."
            className="h-[200px]"
          />
        )}
      </CardContent>
    </Card>
  )
}

export default DosenPembimbingCard