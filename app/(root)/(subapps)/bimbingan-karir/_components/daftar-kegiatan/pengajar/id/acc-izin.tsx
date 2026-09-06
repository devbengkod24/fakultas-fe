"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Check, X, FilePen, CheckCheck } from "lucide-react"
import { toast } from "sonner"
import { PresensiService } from "@/api/bimbingan-karir"
import { handleToastResponse } from "@/lib/toast-response"
import useSWR from "swr"
import { IzinPresensi } from "@/types/bimbingan-karir/koordinator/daftar-kegiatan/activity"
import DeleteDialog from "./delete"
import EmptyState from "@/components/empty-state"

const fetcher = (kegiatan_id: number) =>
  PresensiService.getMahasiswaIzin(kegiatan_id).then((res) => res);

const getCleanFileName = (url: string): string => {
  try {
    const urlObj = new URL(url)
    let fileName = decodeURIComponent(urlObj.pathname.split('/').pop() || '')
    fileName = fileName.replace(/^\d+_/, '')
    return fileName
  } catch {
    return url
  }
}

interface AccIzinProps {
  activityId: number
}

export default function AccIzin({ activityId }: AccIzinProps) {
  const [submittingId, setSubmittingId] = useState<number | null>(null)
  const [submittingAll, setSubmittingAll] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedIzinId, setSelectedIzinId] = useState<number | null>(null)

  const { data, error, isLoading, mutate } = useSWR(
    ["accIzin", activityId], 
    () => fetcher(activityId),
    {
      refreshInterval: 120000,
      revalidateOnFocus: true
    }
  );

  const izinList: IzinPresensi[] = data?.data || []

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      menunggu: { label: "Menunggu", variant: "secondary" as const },
      disetujui: { label: "Disetujui", variant: "success" as const },
      ditolak: { label: "Ditolak", variant: "destructiveOutline" as const }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.menunggu
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  const handleApprove = async (izinId: number) => {
    setSubmittingId(izinId)
    try {
      const formData = new FormData()
      formData.append("izin_id", izinId.toString())
      const response = await PresensiService.createMahasiswaIzin(formData)
      handleToastResponse(response)
      mutate()
    } catch (error) {
      toast.error("Gagal menyetujui izin")
      console.error(error)
    } finally {
      setSubmittingId(null)
    }
  }

  const handleApproveAll = async () => {
    setSubmittingAll(true)
    try {
      const formData = new FormData()
      formData.append("kegiatan_id", activityId.toString())
      const response = await PresensiService.createAllMahasiswaIzin(formData)
      handleToastResponse(response)
      mutate()
    } catch (error) {
      toast.error("Gagal menyetujui semua izin")
      console.error(error)
    } finally {
      setSubmittingAll(false)
    }
  }

  const openDeleteDialog = (izinId: number) => {
    setSelectedIzinId(izinId)
    setDeleteDialogOpen(true)
  }

  const handleRejectConfirm = async () => {
    if (!selectedIzinId) return

    setSubmittingId(selectedIzinId)
    try {
      const formData = new FormData()
      formData.append("izin_id", selectedIzinId.toString())
      
      const response = await PresensiService.createMahasiswaIzinTolak(formData)
      handleToastResponse(response)
      mutate()
      setDeleteDialogOpen(false)
      setSelectedIzinId(null)
    } catch (error) {
      toast.error("Gagal menolak izin")
      console.error(error)
    } finally {
      setSubmittingId(null)
    }
  }

  const pendingCount = izinList.filter(izin => izin.status === "menunggu").length

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <p>Gagal memuat data izin</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Izin Presensi
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {isLoading ? "Memuat..." : `${pendingCount} permohonan menunggu persetujuan`}
              </p>
            </div>
            {pendingCount > 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={handleApproveAll}
                disabled={submittingAll || isLoading}
              >
                <CheckCheck size={16} className="mr-2" />
                Setujui Semua
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Memuat data...</p>
            </div>
          ) : izinList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <EmptyState
                icon={FilePen}
                title="Belum ada izin presensi"
                subtitle="Mahasiswa belum mengajukan izin presensi untuk kegiatan ini."
              />
            </div>
          ) : (
            izinList.map((izin) => {
              const fileName = izin.bukti_izin ? getCleanFileName(izin.bukti_izin) : ""
              
              return (
                <div key={izin.id} className="border rounded-lg p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-base">{izin.nama}</h4>
                    {getStatusBadge(izin.status)}
                  </div>

                  {/* Alasan */}
                  <div>
                    <p className="text-sm">{izin.alasan}</p>
                  </div>

                  {/* PDF Button */}
                  {izin.bukti_izin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => window.open(izin.bukti_izin!, '_blank')}
                      title={fileName}
                    >
                      <FileText size={16} className="mr-2" />
                      <span className="truncate">{fileName}</span>
                    </Button>
                  )}

                  {/* Action Buttons */}
                  {izin.status === "menunggu" && (
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleApprove(izin.id)}
                        disabled={submittingId === izin.id || submittingAll}
                      >
                        <Check size={16} className="mr-2" />
                        Setuju
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => openDeleteDialog(izin.id)}
                        disabled={submittingId === izin.id || submittingAll}
                      >
                        <X size={16} className="mr-2" />
                        Tolak
                      </Button>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* Delete/Reject Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setSelectedIzinId(null)
        }}
        onConfirm={handleRejectConfirm}
      />
    </>
  )
}