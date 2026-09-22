"use client"

import { LogbookService } from "@/api/kerja-praktek"
import useSWR from "swr"
import { FileText, AlertCircle, Plus, Clock, Search } from "lucide-react"
import { LogbookHeaderMhs } from "../logbook-mahasiswa/header-mhs"
import { LogbookTimeline } from "../logbook-mahasiswa/logbook-timeline"
import { AddEditLogbookDialog } from "../logbook-mahasiswa/add-logbook"
import { EditLinkFolderDialog } from "../logbook-mahasiswa/folderkp-dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useProfile } from "@/context/profileUseContext"
import { Role } from "@/types/role"
import { useState } from "react"
import { toast } from "sonner"
import EmptyState from "@/components/empty-state"
import { LogbookPageSkeleton, LogbookMinimalSkeleton } from "../logbook-mahasiswa/skeleton"

interface LogbookEntry {
  id: number
  bab: number
  uraian: string
  dokumen: string | null
  status: "accepted" | "revised" | "pending"
  tanggal: string
  created_at: string
  updated_at: string
}

const getLatestKPFetcher = () =>
  LogbookService.getLatestKP().then((res) => res)

const getLogbookByIdKPFetcher = (id: number) =>
  LogbookService.getLogbookByIdKP(id).then((res) => res)

const LogbookBimbinganMahasiswa = () => {
  const router = useRouter()
  const { profile } = useProfile()
  const role: Role = profile?.roles as Role
  
  const [showLogbookDialog, setShowLogbookDialog] = useState(false)
  const [selectedLogbookEntry, setSelectedLogbookEntry] = useState<LogbookEntry | null>(null)
  const [showEditLinkDialog, setShowEditLinkDialog] = useState(false)

  const { 
    data: latestKPData, 
    error: latestKPError, 
    isLoading: isLatestKPLoading,
    mutate: mutateLatestKP
  } = useSWR(
    "latest-kp",
    getLatestKPFetcher
  )

  const kpId = latestKPData?.data?.id
  const { data: logbookData, error: logbookError, isLoading: isLogbookLoading, mutate } = useSWR(
    kpId ? [`logbook-by-kp-${kpId}`, kpId] : null,
    () => getLogbookByIdKPFetcher(kpId),
    { revalidateOnFocus: false }
  )

  const handleAcceptLogbook = async (logbookId: number) => {
    try {
      await LogbookService.acceptLogbookKoor(logbookId)
      mutate()
    } catch (err) {
      console.error("Failed to accept logbook", err)
    }
  }

  const handleAddLogbook = () => {
    setSelectedLogbookEntry(null)
    setShowLogbookDialog(true)
  }

  const handleEditLogbook = (logbookEntry: LogbookEntry) => {
    setSelectedLogbookEntry(logbookEntry)
    setShowLogbookDialog(true)
  }

  const handleLogbookDialogSuccess = () => {
    mutate()
    setSelectedLogbookEntry(null)
  }

  const handleEditLinkFolderSuccess = () => {
    mutateLatestKP()
  }

  const handleAddLogbookFromEmptyState = () => {
    if (!latestKPData?.data?.link_folder) {
      toast.error("Anda harus menambahkan folder KP terlebih dahulu sebelum dapat menambah logbook", {
        description: "Klik tombol 'Tambah Folder KP' di header untuk mengatur link folder Google Drive Anda."
      });
      return;
    }
    
    handleAddLogbook();
  };

  const handleRetry = () => {
    mutateLatestKP()
  }

  if (isLatestKPLoading) {
    return <LogbookMinimalSkeleton />
  }

  if (latestKPError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal Memuat Data"
        subtitle="Terjadi kesalahan saat memuat data kerja praktek"
        button={
          <Button
            onClick={handleRetry}
            className="px-4 py-2.5"
          >
            Coba Lagi
          </Button>
        }
        className="py-20"
      />
    )
  }

  if (!latestKPData?.success || !latestKPData?.data?.id) {
    const errorMessage = latestKPData?.message || ""
    
    const isNotApprovedError = errorMessage.includes("belum memiliki Kerja Praktek yang disetujui") ||
                              errorMessage.includes("mengajukan KP terlebih dahulu")
    
    const isNotFoundError = errorMessage.includes("Pengajuan KP tidak ditemukan") ||
                           errorMessage.includes("bukan milik mahasiswa ini")

    if (isNotApprovedError) {
      return (
        <EmptyState
          icon={Clock}
          title="KP Belum Disetujui"
          subtitle={errorMessage}
          button={
            <Button
              onClick={() => router.push("/kerja-praktek/pengajuan-kp")}
              className="px-6 py-2.5"
            >
              Lihat Status Pengajuan
            </Button>
          }
          className="py-20 max-w-md mx-auto"
        />
      )
    }

    if (isNotFoundError) {
      return (
        <EmptyState
          icon={Search}
          title="Pengajuan KP Tidak Ditemukan"
          subtitle={errorMessage}
          button={
            <div className="flex gap-3">
              <Button
                onClick={() => router.push("/kerja-praktek/pengajuan-kp")}
                className="px-6 py-2.5"
              >
                Ajukan KP
              </Button>
              <Button
                onClick={handleRetry}
                variant="outline"
                className="px-6 py-2.5"
              >
                Coba Lagi
              </Button>
            </div>
          }
          className="py-20 max-w-md mx-auto"
        />
      )
    }

    return (
      <EmptyState
        icon={FileText}
        title="Belum Ada Kerja Praktek"
        subtitle="Silahkan melakukan pengajuan dosen pembimbing terlebih dahulu untuk dapat mengakses logbook bimbingan"
        button={
          <Button
            onClick={() => router.push("/kerja-praktek/pengajuan-kp")}
            className="px-6 py-2.5"
          >
            Ajukan Dosen Pembimbing
          </Button>
        }
        className="py-20 max-w-md mx-auto"
      />
    )
  }

  if (isLogbookLoading) {
    return <LogbookPageSkeleton />
  }

  if (logbookError) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Gagal Memuat Logbook"
        subtitle="Terjadi kesalahan saat memuat data logbook"
        button={
          <Button
            onClick={() => mutate()}
            className="px-4 py-2.5"
          >
            Coba Lagi
          </Button>
        }
        className="py-20"
      />
    )
  }

  const student = {
    mahasiswa_id: logbookData?.data?.mahasiswa?.id,
    name: logbookData?.data?.mahasiswa?.name,
    nim: logbookData?.data?.mahasiswa?.nim,
    foto: logbookData?.data?.mahasiswa?.foto,
    dosen_name: logbookData?.data?.dosen_pembimbing?.name,
    totalLogbooks: logbookData?.data?.logbook?.total_bimbingan || 0,
    bab_terakhir: logbookData?.data?.logbook?.bab_terakhir || 0,
    progress: logbookData?.data?.logbook?.progress || "0%",
    link_folder: latestKPData?.data?.link_folder || null,
    status: latestKPData?.data?.status || null,
  }

  return (
    <div>
      {/* Header with student info */}
      <LogbookHeaderMhs 
        data={student} 
        userRole={role}
        onAddLogbook={handleAddLogbook}
        onEditLinkFolder={() => setShowEditLinkDialog(true)}
      />

      {/* Logbook timeline */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Riwayat Bimbingan</h2>
        </div>
        
        {logbookData?.data?.logbooks_by_bab && logbookData.data.logbooks_by_bab.length > 0 ? (
          <LogbookTimeline
            logbooksByBab={logbookData.data.logbooks_by_bab}
            onAccept={handleAcceptLogbook}
            onEdit={handleEditLogbook}
            userRole={role}
          />
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg">
            <EmptyState
              icon={FileText}
              title="Belum Ada Logbook"
              subtitle="Anda belum memiliki entri logbook bimbingan"
              button={
                role === "mahasiswa" ? (
                  <Button
                    onClick={handleAddLogbookFromEmptyState}
                    className="px-4 py-2.5"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Logbook Pertama
                  </Button>
                ) : null
              }
              className="py-12"
            />
          </div>
        )}
      </div>

      {/* Single dialog for both add and edit */}
      {kpId && (
        <AddEditLogbookDialog
          open={showLogbookDialog}
          onOpenChange={setShowLogbookDialog}
          kpId={kpId}
          logbookEntry={selectedLogbookEntry}
          onSuccess={handleLogbookDialogSuccess}
        />
      )}

      {/* Edit Link Folder Dialog */}
      {kpId && (
        <EditLinkFolderDialog
          open={showEditLinkDialog}
          onOpenChange={setShowEditLinkDialog}
          kpId={kpId}
          currentLink={latestKPData?.data?.link_folder || ""}
          onSuccess={handleEditLinkFolderSuccess}
        />
      )}
    </div>
  )
}

export default LogbookBimbinganMahasiswa