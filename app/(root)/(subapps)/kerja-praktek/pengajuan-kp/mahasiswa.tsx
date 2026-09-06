"use client"

import { useState, useEffect, useMemo } from "react"
import { PengajuanService } from "@/api/kerja-praktek"
import useSWR from "swr"
import { Dosen } from "@/types/kerja-praktek/dosen"
import { toast } from "sonner"
import { AlertTriangle } from "lucide-react"
import { DeleteDialog } from "../_components/pengajuan-kp/delete-dialog"
import { StatusBanner } from "../_components/pengajuan-kp/status-banner"
import { DosbingSelector } from "../_components/pengajuan-kp/dosbing-selector"
import { StatusMagang } from "../_components/pengajuan-kp/status-magang"
import { ActionButtons } from "../_components/pengajuan-kp/action-buttons"
import { LoadingState } from "../_components/pengajuan-kp/loading-state"
import { handleToastResponse } from "@/lib/toast-response"
import EmptyState from "@/components/empty-state"

const dosenFetcher = () => PengajuanService.getDosenList().then((res) => res)
const pengajuanFetcher = () => PengajuanService.showPengajuan().then((res) => res)

const PengajuanKPMahasiswa = () => {
  const { data: dosenData } = useSWR(["dosen-list"], () => dosenFetcher(), { revalidateOnFocus: false })
  const { data: pengajuanData, mutate: mutatePengajuan, isLoading: isPengajuanLoading, error: pengajuanError } = useSWR(
    ["pengajuan-show"], 
    () => pengajuanFetcher(), 
    { revalidateOnFocus: false }
  )

  const [selectedSupervisor, setSelectedSupervisor] = useState("")
  const [isAlreadyInternship, setIsAlreadyInternship] = useState(false)
  const [posisi, setPosisi] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [hasExistingPengajuan, setHasExistingPengajuan] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isResubmitting, setIsResubmitting] = useState(false)
  const [isNotRegistered, setIsNotRegistered] = useState(false)
  const [registrationErrorMessage, setRegistrationErrorMessage] = useState("")

  // Memoize supervisors list dengan penanganan dosen dari pengajuan
  const supervisors = useMemo(() => {
    // Buat list dari data dosen
    const dosenList = dosenData?.data?.map((dosen: Dosen) => ({
      id: dosen.id,
      value: dosen.id?.toString(),
      label: `${dosen.gelar_depan ? `${dosen.gelar_depan} ` : ""}${dosen.nama}${dosen.gelar_belakang ? `, ${dosen.gelar_belakang}` : ""}`.trim(),
    })) || []

    // Jika ada pengajuan dengan dosen, pastikan dosen tersebut ada dalam list
    if (pengajuanData?.data?.dosen) {
      const selectedDosen = pengajuanData.data.dosen
      const selectedDosenId = selectedDosen.id.toString()
      
      // Cek apakah dosen sudah ada dalam list
      const dosenExists = dosenList.some((dosen: { id: number; value: string; label: string }) => dosen.value === selectedDosenId)
      
      // Jika belum ada, tambahkan ke awal list dengan format yang benar
      if (!dosenExists) {
        dosenList.unshift({
          id: selectedDosen.id,
          value: selectedDosenId,
          label: `${selectedDosen.gelar_depan ? `${selectedDosen.gelar_depan} ` : ""}${selectedDosen.nama}${selectedDosen.gelar_belakang ? `, ${selectedDosen.gelar_belakang}` : ""}`.trim(),
        })
      }
    }

    return dosenList
  }, [dosenData, pengajuanData])

  useEffect(() => {
    if (pengajuanData?.data && Object.keys(pengajuanData.data).length > 0) {
      const data = pengajuanData.data
      setHasExistingPengajuan(true)
      
      const dosenId = data.dosen?.id?.toString()
      setSelectedSupervisor(dosenId)

      if (data.posisi) {
        setIsAlreadyInternship(true)
        setPosisi(data.posisi)
      } else {
        setIsAlreadyInternship(false)
        setPosisi("")
      }
      
      setIsResubmitting(false)
      setIsNotRegistered(false)
      setRegistrationErrorMessage("")
    } else {
      setHasExistingPengajuan(false)
      setIsResubmitting(false)
    }
  }, [pengajuanData])

  useEffect(() => {
    if (pengajuanError || (pengajuanData && !pengajuanData.success)) {
      const errorMessage = pengajuanError?.message || pengajuanData?.message || ""
      const isRegistrationError = errorMessage.includes("belum terdaftar pada periode ini") || 
                                 errorMessage.includes("proses pendaftaran KP")
      
      if (isRegistrationError) {
        setIsNotRegistered(true)
        setHasExistingPengajuan(false)
        setRegistrationErrorMessage(errorMessage)
      }
    } else {
      setIsNotRegistered(false)
      setRegistrationErrorMessage("")
    }
  }, [pengajuanError, pengajuanData])

  const handleSubmit = async () => {
    if (!selectedSupervisor) {
      toast.error("Pilih dosen pembimbing terlebih dahulu")
      return
    }

    if (isAlreadyInternship && !posisi.trim()) {
      toast.error("Masukkan posisi magang")
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(
      hasExistingPengajuan && isEditing ? "Mengupdate pengajuan..." :
      isResubmitting ? "Mengajukan ulang..." : "Menyimpan pengajuan..."
    )

    try {
      const submitData: { dosen_id: number; posisi?: string } = {
        dosen_id: Number.parseInt(selectedSupervisor),
      }
      if (isAlreadyInternship && posisi.trim()) {
        submitData.posisi = posisi
      }

      let response
      if (hasExistingPengajuan && isEditing) {
        response = await PengajuanService.updatePengajuan(submitData, pengajuanData.data.id)
      } else {
        response = await PengajuanService.postPengajuan(submitData)
      }

      toast.dismiss(loadingToast)

      if (response.success) {
        handleToastResponse(response)
        setIsEditing(false)
        setIsResubmitting(false)
        mutatePengajuan()
      } else {
        handleToastResponse(response)
        const errorMessage = response.message || ""
        if (errorMessage.includes("belum terdaftar pada periode ini")) {
          setIsNotRegistered(true)
          setRegistrationErrorMessage(errorMessage)
        }
      }
    } catch (error) {
      console.error("Error submitting pengajuan:", error)
      toast.dismiss(loadingToast)
      toast.error("Terjadi kesalahan saat menyimpan pengajuan")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setIsResubmitting(false)
    if (pengajuanData?.data) {
      const data = pengajuanData.data
      setSelectedSupervisor(data.dosen.id.toString())

      if (data.posisi) {
        setIsAlreadyInternship(true)
        setPosisi(data.posisi)
      } else {
        setIsAlreadyInternship(false)
        setPosisi("")
      }
    }
    toast.info("Perubahan dibatalkan")
  }

  const handleResubmit = () => {
    setIsResubmitting(true)
    setSelectedSupervisor("")
    setIsAlreadyInternship(false)
    setPosisi("")
    toast.info("Silakan isi formulir untuk pengajuan ulang")
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    setIsLoading(true)
    const loadingToast = toast.loading("Menghapus pengajuan...")

    try {
      const response = await PengajuanService.deletePengajuan(pengajuanData.data.id)
      toast.dismiss(loadingToast)

      if (response.success) {
        handleToastResponse(response)
        setSelectedSupervisor("")
        setIsAlreadyInternship(false)
        setPosisi("")
        setHasExistingPengajuan(false)
        setIsEditing(false)
        setIsResubmitting(false)
        setShowDeleteDialog(false)
        mutatePengajuan()
      } else {
        handleToastResponse(response)
      }
    } catch (error) {
      console.error("Error deleting pengajuan:", error)
      toast.dismiss(loadingToast)
      toast.error("Terjadi kesalahan saat menghapus pengajuan")
    } finally {
      setIsLoading(false)
    }
  }

  const isAccepted = pengajuanData?.data?.status?.toLowerCase() === "accepted"
  const isRejected = pengajuanData?.data?.status?.toLowerCase() === "rejected"
  
  const isFormDisabled = (hasExistingPengajuan && !isEditing && !isResubmitting) || isNotRegistered

  if (isPengajuanLoading) {
    return <LoadingState />
  }

  if (isNotRegistered) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Anda belum terdaftar di periode ini"
        subtitle={registrationErrorMessage || "Anda belum terdaftar pada periode Kerja Praktek ini. Silakan hubungi koordinator untuk proses pendaftaran KP."}
        className="h-[400px]"
      />
    )
  }

  return (
    <>
      <div className="">
        <div className="grid grid-cols-12 gap-6">
          {hasExistingPengajuan && !isResubmitting && (
            <StatusBanner
              status={pengajuanData?.data?.status}
              isEditing={isEditing}
              isAccepted={isAccepted}
              isRejected={isRejected}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onResubmit={handleResubmit}
              rejectionReason={pengajuanData?.data?.alasan}
            />
          )}

          {/* Supervisor Selector */}
          <DosbingSelector
            supervisors={supervisors}
            selectedSupervisor={selectedSupervisor}
            onSupervisorChange={setSelectedSupervisor}
            disabled={isFormDisabled || isLoading}
          />

          <div className="col-span-12 space-y-6">
            <StatusMagang
              isAlreadyInternship={isAlreadyInternship}
              onInternshipStatusChange={setIsAlreadyInternship}
              posisi={posisi}
              onPositionChange={setPosisi}
              disabled={isFormDisabled}
              isLoading={isLoading}
            />

            {!isFormDisabled && selectedSupervisor && (
              <ActionButtons
                isEditing={isEditing || isResubmitting}
                hasExistingPengajuan={hasExistingPengajuan && !isResubmitting}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onCancel={handleCancelEdit}
              />
            )}
          </div>
        </div>
      </div>

      <DeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Hapus Pengajuan"
        description="Apakah Anda yakin ingin menghapus pengajuan ini? Data yang dihapus tidak dapat dikembalikan."
        isLoading={isLoading}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}

export default PengajuanKPMahasiswa