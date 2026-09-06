"use client"

import { Briefcase, Check, Info, Users, X, Loader2, Mail, Phone } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import type { Pengajuan } from "@/types/kerja-praktek/pengajuan"
import { toast } from "sonner"
import { PengajuanService } from "@/api/kerja-praktek"
import { useRouter } from "next/navigation"
import { Role } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";
import { ConfirmationModal } from "@/components/confirmation-modal"
import { handleToastResponse } from "@/lib/toast-response"

interface SubmissionCardProps {
  submission: Pengajuan
  onStatusChange?: () => void
}

export function SubmissionCard({ submission, onStatusChange }: SubmissionCardProps) {
  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;
  
  const [isAccepting, setIsAccepting] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showAcceptDialog, setShowAcceptDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const router = useRouter()

  const getInitials = (name?: string) => {
    if (!name) return "XX"
    return name
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  const [open, setOpen] = useState(false)

  const handleAcceptClick = () => {
    setShowAcceptDialog(true)
  }

  const handleAcceptSubmit = async () => {
    if (!submission.kerja_praktek_id) {
      toast.error("ID pengajuan tidak valid")
      return
    }

    try {
      setIsAccepting(true)
      
      const response = role === "dosen" 
        ? await PengajuanService.acceptPengajuanDosen(submission.kerja_praktek_id)
        : await PengajuanService.acceptPengajuanKoor(submission.kerja_praktek_id)

      if (response.success) {
        handleToastResponse(response)
        setShowAcceptDialog(false)
        if (onStatusChange) {
          onStatusChange()
        } else {
          router.refresh()
        }
      } else {
        handleToastResponse(response)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menerima pengajuan")
      console.error("Error accepting submission:", error)
    } finally {
      setIsAccepting(false)
    }
  }

  const handleRejectClick = () => {
    setRejectReason("")
    setShowRejectDialog(true)
  }

  const handleRejectSubmit = async () => {
    if (!submission.kerja_praktek_id) {
      toast.error("ID pengajuan tidak valid")
      return
    }

    const trimmedReason = rejectReason?.trim()
    if (!trimmedReason || trimmedReason.length === 0) {
      toast.error("Alasan penolakan harus diisi")
      return
    }

    if (trimmedReason.length < 10) {
      toast.error("Alasan penolakan minimal 10 karakter")
      return
    }

    try {
      setIsRejecting(true)

      const response = role === "dosen"
        ? await PengajuanService.rejectPengajuanDosen(submission.kerja_praktek_id, trimmedReason)
        : await PengajuanService.rejectPengajuanKoor(submission.kerja_praktek_id, trimmedReason)

      if (response.success) {
        handleToastResponse(response)
        setShowRejectDialog(false)
        setRejectReason("")
        if (onStatusChange) {
          onStatusChange()
        } else {
          router.refresh()
        }
      } else {
        handleToastResponse(response)
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menolak pengajuan")
      console.error("Error rejecting submission:", error)
    } finally {
      setIsRejecting(false)
    }
  }

  if (!submission || !submission.mahasiswa) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-6 text-center text-gray-500">Data mahasiswa tidak tersedia.</CardContent>
      </Card>
    )
  }

  const formatNamaDosen = (dosen?: { nama?: string; gelar_depan?: string; gelar_belakang?: string }) => {
    if (!dosen) return "-"
    const gelarDepan = dosen.gelar_depan ? `${dosen.gelar_depan} ` : ""
    const gelarBelakang = dosen.gelar_belakang ? `, ${dosen.gelar_belakang}` : ""
    return `${gelarDepan}${dosen.nama ?? ""}${gelarBelakang}`
  }

  const displayJobdesk = (jobdesk?: string | null) => {
    if (!jobdesk || jobdesk.trim() === "") {
      return "-"
    }
    return jobdesk
  }

  return (
    <>
      <Card className="overflow-hidden shadow-none">
        <CardHeader className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarImage alt={submission.mahasiswa.nama} />
                <AvatarFallback>{getInitials(submission.mahasiswa.nama)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold capitalize">{submission.mahasiswa.nama?.toLowerCase()}</h3>
                  <p className="text-sm text-muted-foreground">{submission.mahasiswa.nim}</p>
                </div>
              </div>
            </div>
            {role !== "dosen" && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 border border-blue-300 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg"
                  >
                    <Info className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto mx-0">
                  <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">Detail Informasi Mahasiswa</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4 pb-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border flex-shrink-0">
                        <AvatarImage src={""} alt={submission.mahasiswa.nama} />
                        <AvatarFallback className="text-lg sm:text-xl">{getInitials(submission.mahasiswa.nama)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold capitalize text-sm sm:text-base truncate">{submission.mahasiswa.nama?.toLowerCase()}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{submission.mahasiswa.nim}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">Email</p>
                        <p className="text-xs sm:text-sm break-all">{submission.mahasiswa.email}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-500">No. Telepon</p>
                        <p className="text-xs sm:text-sm">{submission.mahasiswa.telepon}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2 text-sm sm:text-base">Pengajuan Kerja Praktek</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-500">Jobdesk</p>
                          <p className="text-xs sm:text-sm break-words">{displayJobdesk(submission.jobdesk)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            <div>
              {role === "dosen" && (
                <div className="mb-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Mail className="h-4 w-4" />
                        Email
                      </div>
                      <p className="text-base">{submission.mahasiswa.email}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Phone className="h-4 w-4" />
                        No. Telepon
                      </div>
                      <p className="text-base">{submission.mahasiswa.telepon}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Briefcase className="h-4 w-4" />
                Jobdesk
              </div>
              <p className="text-base mb-3">{displayJobdesk(submission.jobdesk)}</p>

              {role !== "dosen" && (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    Dosen Pembimbing
                  </div>
                  <p className="text-base mb-3">{formatNamaDosen(submission.dosen)}</p>
                </>
              )}

              {submission.status?.toLowerCase() === "pending" && (
                <div className="grid grid-cols-5 gap-4 mt-4">
                  <div className="col-span-2"></div>
                  <div className="col-span-3 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[0.5px] bg-green-100/50 text-green-600 hover:text-green-600 hover:bg-green-100/70 border-green-600 w-full"
                      onClick={handleAcceptClick}
                      disabled={isAccepting || isRejecting}
                    >
                      {isAccepting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Memproses...
                        </div>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Terima
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[0.5px] bg-destructive/5 hover:text-red-500 hover:bg-destructive/10 text-destructive border-destructive w-full"
                      onClick={handleRejectClick}
                      disabled={isRejecting || isAccepting}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Tolak
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmationModal
        open={showAcceptDialog}
        setOpen={setShowAcceptDialog}
        onConfirm={handleAcceptSubmit}
        type="accept"
        title="Terima Pengajuan"
        description={`Apakah Anda yakin ingin menerima pengajuan kerja praktek dari ${submission.mahasiswa.nama}?`}
        confirmText={isAccepting ? "Memproses..." : "Ya, Terima"}
      />

      <ConfirmationModal
        open={showRejectDialog}
        setOpen={setShowRejectDialog}
        onConfirm={handleRejectSubmit}
        type="reject"
        title="Tolak Pengajuan"
        description={`Silakan berikan alasan penolakan untuk pengajuan kerja praktek dari ${submission.mahasiswa.nama}`}
        confirmText={isRejecting ? "Menolak..." : "Tolak Pengajuan"}
        placeholder="Berikan alasan yang jelas mengapa pengajuan ini ditolak... (minimal 10 karakter)"
        reason={rejectReason}
        setReason={setRejectReason}
      />
    </>
  )
}
