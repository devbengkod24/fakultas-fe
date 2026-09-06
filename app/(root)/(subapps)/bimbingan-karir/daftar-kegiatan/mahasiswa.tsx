"use client"

import { useState } from "react"
import { Activity } from "@/types/bimbingan-karir/mahasiswa/activity"
import { CustomSolidTabs } from "@/components/custom-solid-tabs"
import ActivityCard from "../_components/daftar-kegiatan/mahasiswa/activity-card"
import { ListFilter, PlayCircle, CalendarClock, CheckCircle, ClipboardList, LayoutGrid, Table } from "lucide-react"
import { DaftarKegiatanMahasiswaService } from "@/api/bimbingan-karir/"
import useSWR from "swr"
import { SkeletonKegiatanMahasiswa } from "../_components/daftar-kegiatan/skeleton"
import { QrScannerDialog } from "../_components/daftar-kegiatan/mahasiswa/qr-code"
import FeedbackDialog from "../_components/daftar-kegiatan/mahasiswa/feedback"
import IzinDialog from "../_components/daftar-kegiatan/mahasiswa/izin"
import { handleToastResponse } from "@/lib/toast-response"
import { useRouter, useSearchParams } from "next/navigation"
import { FeedbackFormData, IzinFormData } from "../_components/daftar-kegiatan/mahasiswa/schema"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Columns } from "../_components/daftar-kegiatan/mahasiswa/column"
import { getActiveProdiId } from "@/api/bimbingan-karir/helpers/prodiFetcher";
import { useProfile } from "@/context/profileUseContext";

const fetcherDaftarKegiatanMahasiswa = (activeProdiId: number | null, status: string) =>
  DaftarKegiatanMahasiswaService.getAllDaftarKegiatanMhs(activeProdiId ?? getActiveProdiId(), status).then((res) => res);

export default function MahasiswaListKegiatan() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeProdiId } = useProfile();
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [activeTab, setActiveTab] = useState(searchParams.get("status") || "semua")
  const [qrDialogOpen, setQrDialogOpen] = useState(false)
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [izinDialogOpen, setIzinDialogOpen] = useState(false)
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null)
  const [selectedActivityName, setSelectedActivityName] = useState<string>("")
  const [selectedActivityBatasWaktu, setSelectedActivityBatasWaktu] = useState<string | null>(null)

  const now = new Date()

  const { data, error, isLoading, mutate } = useSWR(
    ["daftar-kegiatan", activeProdiId, activeTab],
    () => fetcherDaftarKegiatanMahasiswa(activeProdiId, activeTab),
    { revalidateOnFocus: false }
  )

  const processedActivities = (() => {
    if (activeTab === "semua") {
      return [
        ...(data?.data?.akan_berlangsung || []),
        ...(data?.data?.sedang_berlangsung || []),
        ...(data?.data?.selesai || []),
      ];
    } else {
      return data?.data || [];
    }
  })();

  const mappedActivities = processedActivities.map((a: Activity) => ({
    id: a.id,
    nama_kegiatan: a.nama_kegiatan,
    deskripsi: a.deskripsi,
    tanggal_mulai: a.tanggal_mulai ? new Date(`${a.tanggal_mulai}T${a.waktu_mulai || "00:00"}`) : new Date(a.tanggal_mulai),
    tanggal_selesai: a.tanggal_selesai ? new Date(`${a.tanggal_selesai}T${a.waktu_selesai || "00:00"}`) : new Date(a.tanggal_selesai),
    waktu_mulai: a.waktu_mulai,
    waktu_selesai: a.waktu_selesai,
    batas_waktu_izin: a.batas_waktu_izin ? new Date(a.batas_waktu_izin) : undefined,
    lokasi: a.lokasi,
    kategori: a.kategori,
    pengajar_id: a.pengajar_id,
    pengajar: a.pengajar,
    is_presensi: a.is_presensi,
    status_izin: a.status_izin,
    link_grup_wa: a.link_grup_wa,
    file_pdf: a.file_pdf,
    is_feedback: a.is_feedback,
    poster: a.poster,
  }));

  const tabs = [
    { status: "semua", label: "Semua", icon: ListFilter },
    { status: "sedang_berlangsung", label: "Sedang Berlangsung", icon: PlayCircle },
    { status: "akan_berlangsung", label: "Akan Berlangsung", icon: CalendarClock },
    { status: "selesai", label: "Selesai", icon: CheckCircle },
  ];

  const handleScanSuccess = async (code: string) => {
    if (!selectedActivityId) return

    try {
      const res = await DaftarKegiatanMahasiswaService.createPresensi({
        code,
        kegiatan_id: String(selectedActivityId)
      })
      handleToastResponse(res);
      setQrDialogOpen(false)
      mutate()
    } catch (error) {
      handleToastResponse({
        success: false,
        message: error instanceof Error ? error.message : "Gagal membuat presensi"
      });
    }
  }

  const handleFeedbackSubmit = async (feedbackData: FeedbackFormData) => {
    try {
      const res = await DaftarKegiatanMahasiswaService.createFeedback(feedbackData)
      handleToastResponse(res);
      mutate()
    } catch (error) {
      handleToastResponse({
        success: false,
        message: error instanceof Error ? error.message : "Gagal mengirim feedback"
      });
    }
  }

  const handleIzinSubmit = async (izinData: IzinFormData) => {
    try {
      const formData = new FormData();
      formData.append('kegiatan_id', izinData.kegiatan_id);
      formData.append('alasan', izinData.alasan);
      if (izinData.bukti_izin) {
        formData.append('bukti_izin', izinData.bukti_izin);
      }
      const res = await DaftarKegiatanMahasiswaService.createIzinKegiatan(formData);
      handleToastResponse(res);

      mutate()
    } catch (error) {
      handleToastResponse({
        success: false,
        message: error instanceof Error ? error.message : "Gagal mengajukan izin"
      });
    }
  }

  const handleTabChange = (status: string) => {
    setActiveTab(status);
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    router.push(`?${params.toString()}`);
  };

  const handleScanClick = (id: number) => {
    setSelectedActivityId(id)
    setQrDialogOpen(true)
  }

  const handleFeedbackClick = (id: number, name: string) => {
    setSelectedActivityId(id)
    setSelectedActivityName(name)
    setFeedbackDialogOpen(true)
  }

  const handleIzinClick = (id: number) => {
    const activity: Activity | undefined = mappedActivities.find((a: Activity) => a.id === id);
    setSelectedActivityId(id)

    // Convert Date to string if necessary
    const batasWaktu = activity?.batas_waktu_izin;
    if (batasWaktu instanceof Date) {
      setSelectedActivityBatasWaktu(batasWaktu.toISOString().split('T')[0]); // Format: YYYY-MM-DD
    } else {
      setSelectedActivityBatasWaktu(batasWaktu || null);
    }

    setIzinDialogOpen(true)
  }

  if (error) return <div className="text-center py-8 text-red-500">Gagal memuat data kegiatan</div>;

  return (
    <div>
      {/* Mobile: Scroll horizontal */}
      <div className="">
        <div className="sm:hidden w-full overflow-x-auto mb-6">
          <div className="flex items-center gap-2 min-w-max">
            <CustomSolidTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            <div className="flex gap-2 ml-2">
              <Button
                variant={viewMode === "card" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("card")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <Table className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: Justify between */}
      <div className="hidden lg:flex lg:justify-between lg:items-center gap-4 mb-6">
        <CustomSolidTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <div className="flex gap-2">
          <Button
            variant={viewMode === "card" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("card")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Card
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <Table className="h-4 w-4 mr-2" />
            Table
          </Button>
        </div>
      </div>

      {isLoading && viewMode === "card" && (
        <SkeletonKegiatanMahasiswa />
      )}

      {mappedActivities.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <ClipboardList className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Belum ada kegiatan</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Belum ada kegiatan. Silahkan menunggu Koordinator anda membuat kegiatan baru!
          </p>
        </div>
      ) : (
        <>
          {viewMode === "card" ? (
            <div className="space-y-4 sm:grid sm:gap-4 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 sm:space-y-0">
              {mappedActivities.map((activity: Activity) => (
                <div key={activity.id} className="w-full">
                  <ActivityCard
                    activity={activity}
                    now={now}
                    onScanClick={() => handleScanClick(activity.id)}
                    onFeedbackClick={() => handleFeedbackClick(activity.id, activity.nama_kegiatan)}
                    onIzinClick={() => handleIzinClick(activity.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <DataTable
              columns={Columns(1, mappedActivities.length, now, handleScanClick, handleFeedbackClick, handleIzinClick)}
              data={mappedActivities}
              loading={isLoading}
            />
          )}
        </>
      )}

      <QrScannerDialog
        open={qrDialogOpen}
        onOpenChange={setQrDialogOpen}
        onScanSuccess={handleScanSuccess}
      />

      {selectedActivityId && (
        <>
          <FeedbackDialog
            open={feedbackDialogOpen}
            onOpenChange={setFeedbackDialogOpen}
            kegiatanId={selectedActivityId}
            kegiatanNama={selectedActivityName}
            onSubmit={handleFeedbackSubmit}
          />

          <IzinDialog
            open={izinDialogOpen}
            onOpenChange={setIzinDialogOpen}
            kegiatanId={String(selectedActivityId)}
            batasWaktuIzin={selectedActivityBatasWaktu}
            onSubmit={handleIzinSubmit}
          />
        </>
      )}
    </div>
  )
}
