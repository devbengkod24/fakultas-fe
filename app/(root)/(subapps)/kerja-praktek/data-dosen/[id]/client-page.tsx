"use client"

import { DaftarDosenCardHeader } from "../../_components/data-dosen/id/card-header";
import { DaftarDosenCardDosen } from "../../_components/data-dosen/id/card-dosen";
import { DaftarDosenCardTtd } from "../../_components/data-dosen/id/card-ttd";
import { DaftarDosenCardBimbingan } from "../../_components/data-dosen/id/card-bimbingan";
import { DosenDetailSkeleton } from "../../_components/data-dosen/id/skeleton";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DosenService } from "@/api/kerja-praktek"
import { DosenDetail } from "@/types/kerja-praktek/dosen"
import withAuth from "@/app/(root)/hoc/withAuth";
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const DosenDetailClientPage = () => {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [dosen, setDosen] = useState<DosenDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDosen = async () => {
      try {
        setLoading(true)
        const response = await DosenService.getDosenById(Number(id))

        if (response?.success && response?.data) {
          setDosen(response.data)
        } else {
          setError("Data dosen tidak ditemukan")
        }
      } catch (err) {
        console.error("Error fetching dosen:", err)
        setError("Gagal memuat data dosen")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchDosen()
    }
  }, [id])

  if (loading) {
    return (
      <div>
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center gap-2 hover:bg-transparent hover:text-primary"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Data Dosen
        </Button>
        <DosenDetailSkeleton />
      </div>
    )
  }

  if (error || !dosen) {
    return (
      <div>
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center gap-2 hover:bg-transparent hover:text-primary"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Data Dosen
        </Button>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-red-500">{error ?? "Data tidak ditemukan"}</p>
          </div>
        </div>
      </div>
    )
  }

  const dosenData = {
    id: dosen.id.toString(),
    name: dosen.name,
    npp: dosen.npp,
    email: dosen.email,
    telp: dosen.telepon || "-",
    currentStudents: dosen.kuota - dosen.sisa_kuota,
    quota: dosen.kuota,
  }

  const students = dosen.mahasiswa && dosen.mahasiswa.length > 0
    ? dosen.mahasiswa.map((mahasiswa, index) => ({
        No: index + 1,
        NIM: mahasiswa.nim ?? "-",
        Nama: mahasiswa.nama ?? "-",
        "Status KP": mahasiswa.tipe_kp?.toUpperCase() ?? "-",
        "Nomor Telepon": mahasiswa.telepon ?? "-"
      }))
    : [];

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-4 pl-0 flex items-center gap-2 hover:bg-transparent hover:text-primary"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Data Dosen
      </Button>

      <DaftarDosenCardHeader dosen={dosenData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DaftarDosenCardDosen dosen={dosenData} />
        <DaftarDosenCardTtd />
      </div>

      <div className="mt-6">
        <DaftarDosenCardBimbingan
          students={students.length > 0 ? students : []}
          emptyMessage={students.length === 0 ? "Belum ada mahasiswa bimbingan" : undefined}
        />
      </div>
    </div>
  )
}

export default withAuth(DosenDetailClientPage, "kerja-praktek", ["koordinator", "super_fakultas"]);