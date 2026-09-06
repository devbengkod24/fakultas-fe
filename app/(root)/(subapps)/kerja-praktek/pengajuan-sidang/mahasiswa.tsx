"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { SidangService } from "@/api/kerja-praktek"
import { Button } from "@/components/ui/button"
import { DeleteDialog } from "../_components/pengajuan-kp/delete-dialog"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { 
  Loader2, 
  AlertCircle,
  BookOpen,
  CheckCircle2
} from "lucide-react"
import EmptyState from "@/components/empty-state"
import { StatusBanner } from "../_components/pengajuan-sidang/status-banner"
import { InformasiKerjaPraktek } from "../_components/pengajuan-sidang/informasi-kp"
import { InformasiPenyelia } from "../_components/pengajuan-sidang/informasi-penyelia"
import { DokumenPendukung } from "../_components/pengajuan-sidang/dokumen-pendukung"
import { 
  PengajuanSidangSkeleton, 
  PengajuanSidangErrorSkeleton 
} from "../_components/pengajuan-sidang/skeleton"

import type { PengajuanSidangForm } from "@/types/kerja-praktek/sidang"
import { handleToastResponse } from "@/lib/toast-response"

const fetcher = () => SidangService.getPengajuanSidang().then((res) => res)

const PengajuanSidangMahasiswa = () => {
  const {
    data: pengajuanData,
    mutate: mutatePengajuan,
    isLoading: isPengajuanLoading,
    error: pengajuanError,
  } = useSWR(["pengajuan-sidang"], () => fetcher(), { 
    revalidateOnFocus: false,
    errorRetryCount: 3,
    errorRetryInterval: 1000,
  })

  const [formData, setFormData] = useState<PengajuanSidangForm>({
    judul: "",
    nama_perusahaan: "",
    posisi_magang: "",
    tanggal_awal_magang: "",
    tanggal_akhir_magang: "",
    link_surat_diterima_magang: "",
    nama_penyelia: "",
    penyelia_nama_perusahaan: "",
    alamat_perusahaan: "",
    posisi_penyelia: "",
    nomor_telepon_penyelia: "",
    link_laporan_akhir: "",
    link_dokumen_penyelia: "",
    nilai_penyelia: 0,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [hasExistingPengajuan, setHasExistingPengajuan] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (pengajuanData?.success && pengajuanData?.data) {
      const sidangData = pengajuanData.data.pengajuanSidang
      const kerjaPraktekData = pengajuanData.data.kerjaPraktek
      const penyeliaData = pengajuanData.data.penyelia

      if (sidangData && Object.keys(sidangData).length > 0) {
        setHasExistingPengajuan(true)
        setFormData({
          judul: kerjaPraktekData?.judul || "",
          nama_perusahaan: kerjaPraktekData?.perusahaan || "",
          posisi_magang: kerjaPraktekData?.posisi || "",
          tanggal_awal_magang: kerjaPraktekData?.tgl_awal || "",
          tanggal_akhir_magang: kerjaPraktekData?.tgl_akhir || "",
          link_surat_diterima_magang: kerjaPraktekData?.link_surat_diterima_magang || "",
          nama_penyelia: penyeliaData?.nama || "",
          penyelia_nama_perusahaan: penyeliaData?.perusahaan || "",
          alamat_perusahaan: penyeliaData?.alamat || "",
          posisi_penyelia: penyeliaData?.posisi || "",
          nomor_telepon_penyelia: penyeliaData?.telepon || "",
          link_laporan_akhir: sidangData.link_laporan_akhir || "",
          link_dokumen_penyelia: sidangData.link_dokumen_penyelia || "",
          nilai_penyelia: sidangData.sidang?.nilai_penyelia ? Number(sidangData.sidang.nilai_penyelia) : 0,
        })
      } else if (kerjaPraktekData && penyeliaData) {
        setHasExistingPengajuan(false)
        setFormData({
          judul: kerjaPraktekData.judul || "",
          nama_perusahaan: kerjaPraktekData.perusahaan || "",
          posisi_magang: kerjaPraktekData.posisi || "",
          tanggal_awal_magang: kerjaPraktekData.tgl_awal || "",
          tanggal_akhir_magang: kerjaPraktekData.tgl_akhir || "",
          link_surat_diterima_magang: kerjaPraktekData.link_surat_diterima_magang || "",
          nama_penyelia: penyeliaData.nama || "",
          penyelia_nama_perusahaan: penyeliaData.perusahaan || "",
          alamat_perusahaan: penyeliaData.alamat || "",
          posisi_penyelia: penyeliaData.posisi || "",
          nomor_telepon_penyelia: penyeliaData.telepon || "",
          link_laporan_akhir: "",
          link_dokumen_penyelia: "",
          nilai_penyelia: 0,
        })
      } else {
        setHasExistingPengajuan(false)
        setFormData({
          judul: "",
          nama_perusahaan: "",
          posisi_magang: "",
          tanggal_awal_magang: "",
          tanggal_akhir_magang: "",
          link_surat_diterima_magang: "",
          nama_penyelia: "",
          penyelia_nama_perusahaan: "",
          alamat_perusahaan: "",
          posisi_penyelia: "",
          nomor_telepon_penyelia: "",
          link_laporan_akhir: "",
          link_dokumen_penyelia: "",
          nilai_penyelia: 0,
        })
      }
    } else {
      setHasExistingPengajuan(false)
    }
  }, [pengajuanData])

  const handleInputChange = (field: keyof PengajuanSidangForm, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = () => {
    const requiredFields = [
      "judul",
      "nama_perusahaan", 
      "posisi_magang",
      "tanggal_awal_magang",
      "tanggal_akhir_magang",
      "link_surat_diterima_magang",
      "nama_penyelia",
      "penyelia_nama_perusahaan",
      "alamat_perusahaan",
      "posisi_penyelia",
      "nomor_telepon_penyelia",
      "link_laporan_akhir",
      "link_dokumen_penyelia",
      "nilai_penyelia",
    ]

    for (const field of requiredFields) {
      if (
        !formData[field as keyof PengajuanSidangForm] ||
        String(formData[field as keyof PengajuanSidangForm]).trim() === ""
      ) {
        return false
      }
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Semua field harus diisi dengan benar")
      return
    }

    setIsLoading(true)

    const loadingToast = toast.loading(
      hasExistingPengajuan && isEditing ? "Mengupdate pengajuan sidang..." : "Menyimpan pengajuan sidang...",
    )

    try {
      const dataToSubmit = {
        ...formData,
        nilai_penyelia: Number(
          typeof formData.nilai_penyelia === "string"
            ? (formData.nilai_penyelia as string).replace(",", ".")
            : formData.nilai_penyelia
        ) || 0
      }

      let response
      if (hasExistingPengajuan && isEditing) {
        response = await SidangService.updatePengajuanSidang(dataToSubmit)
      } else {
        response = await SidangService.addPengajuanSidang(dataToSubmit)
      }

      toast.dismiss(loadingToast)

      if (response.success) {
        handleToastResponse(response)
        setIsEditing(false)
        mutatePengajuan()
      } else {
        handleToastResponse(response)
      }
    } catch (error) {
      console.error("Error submitting pengajuan sidang:", error)
      toast.dismiss(loadingToast)
      toast.error("Terjadi kesalahan saat menyimpan pengajuan sidang")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (pengajuanData?.data?.pengajuanSidang) {
      const sidangData = pengajuanData.data.pengajuanSidang
      const kerjaPraktekData = pengajuanData.data.kerjaPraktek
      const penyeliaData = pengajuanData.data.penyelia
      
      setFormData({
        judul: kerjaPraktekData?.judul || "",
        nama_perusahaan: kerjaPraktekData?.perusahaan || "",
        posisi_magang: kerjaPraktekData?.posisi || "",
        tanggal_awal_magang: kerjaPraktekData?.tgl_awal || "",
        tanggal_akhir_magang: kerjaPraktekData?.tgl_akhir || "",
        link_surat_diterima_magang: kerjaPraktekData?.link_surat_diterima_magang || "",
        nama_penyelia: penyeliaData?.nama || "",
        penyelia_nama_perusahaan: penyeliaData?.perusahaan || "",
        alamat_perusahaan: penyeliaData?.alamat || "",
        posisi_penyelia: penyeliaData?.posisi || "",
        nomor_telepon_penyelia: penyeliaData?.telepon || "",
        link_laporan_akhir: sidangData.link_laporan_akhir || "",
        link_dokumen_penyelia: sidangData.link_dokumen_penyelia || "",
        nilai_penyelia: sidangData.sidang?.nilai_penyelia ? Number(sidangData.sidang.nilai_penyelia) : 0,
      })
    }
    toast.info("Perubahan dibatalkan")
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    setIsLoading(true)

    const loadingToast = toast.loading("Menghapus pengajuan sidang...")

    try {
      const response = await SidangService.deletePengajuanSidang()

      toast.dismiss(loadingToast)

      if (response.success) {
        handleToastResponse(response)
        setHasExistingPengajuan(false)
        setIsEditing(false)
        setShowDeleteDialog(false)
        mutatePengajuan()
      } else {
        handleToastResponse(response)
      }
    } catch (error) {
      console.error("Error deleting pengajuan sidang:", error)
      toast.dismiss(loadingToast)
      toast.error("Terjadi kesalahan saat menghapus pengajuan sidang")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    mutatePengajuan()
  }

  if (isPengajuanLoading) {
    return <PengajuanSidangSkeleton />
  }

  if (pengajuanError) {
    return <PengajuanSidangErrorSkeleton />
  }

  if (pengajuanData && !pengajuanData.success) {
    const errorMessage = pengajuanData.message || ""
    
    const isLogbookRequiredError = errorMessage.includes("harus memiliki logbook Bab 5 yang diterima") ||
                                  errorMessage.includes("logbook Bab 5")
    
    const isNoKPError = errorMessage.includes("belum memiliki pengajuan KP") ||
                       errorMessage.includes("ajukan kerja praktek terlebih dahulu")

    const isKPCompleteError = errorMessage.includes("Anda tidak memiliki project KP yang aktif") ||
                             errorMessage.includes("Silakan hubungi koordinator untuk proses pendaftaran KP")

    const isNoActiveWaveError = errorMessage.includes("Tidak ada gelombang sidang KP yang aktif saat ini") ||
                               errorMessage.includes("gelombang sidang")

    const isAlreadyGradedError = errorMessage.includes("sudah memiliki pengajuan sidang yang dinilai") ||
                                errorMessage.includes("dinilai pada periode ini")

    if (isAlreadyGradedError) {
      return (
        <EmptyState
          icon={CheckCircle2}
          title="Pengajuan Sidang Sudah Dinilai"
          subtitle="Anda sudah memiliki pengajuan sidang yang telah dinilai pada periode ini. Terima kasih telah menyelesaikan proses sidang KP."
          button={
            <div className="flex gap-3">
              <Button
                onClick={() => window.location.href = "/kerja-praktek"}
                className="px-6 py-2.5"
              >
                Kembali ke Dashboard
              </Button>
            </div>
          }
          className="py-20 max-w-md mx-auto"
        />
      )
    }
    
    if (isKPCompleteError) {
      return (
        <EmptyState
          icon={CheckCircle2}
          title="Sidang KP Anda Telah Selesai"
          subtitle="Proses kerja praktek dan sidang Anda telah selesai. Terima kasih telah menyelesaikan program kerja praktek."
          button={
            <div className="flex gap-3">
              <Button
                onClick={() => window.location.href = "/kerja-praktek"}
                className="px-6 py-2.5"
              >
                Kembali ke Dashboard
              </Button>
            </div>
          }
          className="py-20 max-w-md mx-auto"
        />
      )
    }

    if (isLogbookRequiredError) {
      return (
        <EmptyState
          icon={BookOpen}
          title="Logbook Bab 5 Diperlukan"
          subtitle={errorMessage}
          button={
            <div className="flex gap-3">
              <Button
                onClick={() => window.location.href = "/kerja-praktek/logbook-bimbingan"}
                className="px-6 py-2"
              >
                Buka Logbook
              </Button>
            </div>
          }
          className="py-20 max-w-md mx-auto"
        />
      )
    }

    if (isNoActiveWaveError) {
      return (
        <EmptyState
          icon={AlertCircle}
          title="Gelombang Sidang Tidak Aktif"
          subtitle="Tidak ada gelombang sidang KP yang aktif saat ini. Silakan hubungi koordinator untuk informasi lebih lanjut."
          button={
            <div className="flex gap-3">
              <Button onClick={() => window.history.back()} variant="outline" className="px-6 py-2">
                Kembali
              </Button>
              <Button
                onClick={handleRetry}
                variant="default"
                className="px-6 py-2"
                disabled={isPengajuanLoading}
              >
                {isPengajuanLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memuat...
                  </div>
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>
          }
          className="py-20 max-w-md mx-auto"
        />
      )
    }

    if (isNoKPError) {
      return (
        <EmptyState
          icon={AlertCircle}
          title="Belum Ada Pengajuan KP"
          subtitle="Mahasiswa belum memiliki pengajuan KP. Silakan ajukan kerja praktek terlebih dahulu sebelum mengajukan sidang."
          button={
            <div className="flex gap-3">
              <Button onClick={() => window.history.back()} variant="outline" className="px-6 py-2">
                Kembali
              </Button>
              <Button
                onClick={handleRetry}
                variant="default"
                className="px-6 py-2"
                disabled={isPengajuanLoading}
              >
                {isPengajuanLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memuat...
                  </div>
                ) : (
                  "Refresh"
                )}
              </Button>
            </div>
          }
          className="py-20 max-w-md mx-auto"
        />
      )
    }

    return (
      <EmptyState
        icon={AlertCircle}
        title="KP Belum Disetujui"
        subtitle={errorMessage || "Terjadi kesalahan yang tidak diketahui"}
        button={
          <div className="flex gap-3">
            <Button onClick={() => window.history.back()} variant="outline" className="px-6 py-2">
              Kembali
            </Button>
            <Button
              onClick={handleRetry}
              variant="default"
              className="px-6 py-2"
              disabled={isPengajuanLoading}
            >
              {isPengajuanLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memuat...
                </div>
              ) : (
                "Refresh"
              )}
            </Button>
          </div>
        }
        className="py-20 max-w-md mx-auto"
      />
    )
  }

  const currentPengajuan = pengajuanData?.data?.pengajuanSidang

  const isScheduled = !!(currentPengajuan?.sidang?.tgl_sidang && currentPengajuan?.sidang?.jam_sidang)
  const isFormDisabled = hasExistingPengajuan && !isEditing
  const isAccepted = currentPengajuan?.sidang?.status?.toLowerCase() === "selesai" || 
                     currentPengajuan?.sidang?.status?.toLowerCase() === "lulus" ||
                     isScheduled

  return (
    <>
      <div className="">
        <div className="grid grid-cols-12 gap-6">
          {hasExistingPengajuan && currentPengajuan && (
            <StatusBanner
              currentPengajuan={currentPengajuan}
              isEditing={isEditing}
              isAccepted={isAccepted}
              isLoading={isLoading}
              isPengajuanLoading={isPengajuanLoading}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          )}

          {/* Form Content */}
          <div className="col-span-12">
            <div className={cn("relative", isPengajuanLoading && "pointer-events-none opacity-50")}>
              {isPengajuanLoading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-600" />
                    <p className="text-sm text-gray-600 font-medium">Memperbarui data...</p>
                  </div>
                </div>
              )}

              <form className="space-y-8">
                <InformasiKerjaPraktek
                  formData={formData}
                  onInputChange={handleInputChange}
                  isDisabled={isFormDisabled || isLoading || isAccepted || isScheduled}
                  hasExistingData={hasExistingPengajuan}
                />

                <InformasiPenyelia
                  formData={formData}
                  onInputChange={handleInputChange}
                  isDisabled={isFormDisabled || isLoading || isAccepted || isScheduled}
                  hasExistingData={hasExistingPengajuan}
                />

                <DokumenPendukung
                  formData={formData}
                  onInputChange={handleInputChange}
                  isDisabled={isFormDisabled || isLoading || isAccepted || isScheduled}
                  hasExistingData={hasExistingPengajuan}
                />

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-3 pt-6 border-t"
                >
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        className="px-6 py-2.5"
                        onClick={handleSubmit}
                        disabled={isLoading || isPengajuanLoading}
                      >
                        {isLoading || isPengajuanLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {isPengajuanLoading ? "Memuat..." : "Menyimpan..."}
                          </div>
                        ) : (
                          "Update Pengajuan"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="px-6 py-2.5"
                        onClick={handleCancelEdit}
                        disabled={isLoading || isPengajuanLoading}
                      >
                        Batal
                      </Button>
                    </>
                  ) : (
                    !hasExistingPengajuan && (
                      <Button
                        type="button"
                        className="px-6 py-2.5"
                        onClick={handleSubmit}
                        disabled={isLoading || isPengajuanLoading}
                      >
                        {isLoading || isPengajuanLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {isPengajuanLoading ? "Memuat..." : "Menyimpan..."}
                          </div>
                        ) : (
                          "Simpan Pengajuan Sidang"
                        )}
                      </Button>
                    )
                  )}
                </motion.div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Hapus Pengajuan Sidang"
        description="Apakah Anda yakin ingin menghapus pengajuan sidang ini? Data yang dihapus tidak dapat dikembalikan."
        isLoading={isLoading}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}

export default PengajuanSidangMahasiswa
