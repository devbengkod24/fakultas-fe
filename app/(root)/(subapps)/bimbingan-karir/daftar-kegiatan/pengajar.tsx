"use client"

import { useState } from "react"
import { Activity } from "@/types/bimbingan-karir/koordinator/daftar-kegiatan/activity"
import { CustomSolidTabs } from "@/components/custom-solid-tabs"
import ActivityCard from "@/app/(root)/(subapps)/bimbingan-karir/_components/daftar-kegiatan/pengajar/activity-card"
import { ListFilter, PlayCircle, CalendarClock, CheckCircle, ClipboardList } from "lucide-react"
import { DaftarKegiatanService } from "@/api/bimbingan-karir"
import useSWR from "swr"
import { SkeletonKegiatan } from "../_components/daftar-kegiatan/skeleton"
import { useRouter, useSearchParams } from "next/navigation"
import EditAddDialog from "../_components/daftar-kegiatan/koordinator/edit-add-dialog"
import { toast } from "sonner"
import { handleToastResponse } from "@/lib/toast-response"
import { activityUpdate } from "@/lib/bimbingan-karir/data-utils"
import { getActiveProdiId } from "@/api/bimbingan-karir/helpers/prodiFetcher";
import { useProfile } from "@/context/profileUseContext";

const fetcherDaftarKegiatan = (activeProdiId: number | null, status: string) =>
  DaftarKegiatanService.getAllDaftarKegiatan(activeProdiId ?? getActiveProdiId(), status).then((res) => res);

export default function PengajarListKegiatan() {
  const { activeProdiId } = useProfile();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("semua")
  const now = new Date()

  const { data, error, isLoading, mutate } = useSWR(
    ["daftar-kegiatan-pengajar", activeProdiId, activeTab],
    () => fetcherDaftarKegiatan(activeProdiId, activeTab),
    { revalidateOnFocus: false }
  )

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEditing, setSelectedEditing] = useState<Activity | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    batas_waktu_izin: a.batas_waktu_izin ? new Date(a.batas_waktu_izin) : undefined,
    lokasi: a.lokasi,
    kategori: a.kategori,
    pengajar_id: a.pengajar_id,
    pengajar: a.pengajar,
    link_grup_wa: a.link_grup_wa,
    file_pdf: a.file_pdf || [],
    poster: a.poster || undefined,
    mahasiswa_ids: a.mahasiswas?.map((m: any) => m.id) || [],
    mahasiswas: a.mahasiswas,
  }));

  const tabs = [
    { status: "semua", label: "Semua", icon: ListFilter },
    { status: "sedang_berlangsung", label: "Sedang Berlangsung", icon: PlayCircle },
    { status: "akan_berlangsung", label: "Akan Berlangsung", icon: CalendarClock },
    { status: "selesai", label: "Selesai", icon: CheckCircle },
  ];

  const handleTabChange = (status: string) => {
    setActiveTab(status);
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    router.push(`?${params.toString()}`);
  };

  const handleEditButtonClick = (editKegiatan: Activity) => {
    setSelectedEditing(editKegiatan)
    setDialogOpen(true)
  }

  const handleEditKegiatan = async (updateKegiatan: Activity, deletedPdfIndices: number[]) => {
    setIsSubmitting(true);
    try {
      const updateData = activityUpdate(updateKegiatan, deletedPdfIndices);
      const res = await DaftarKegiatanService.updateDaftarKegiatan(updateKegiatan.id, updateData);

      handleToastResponse(res);
      mutate();

      if (res.success === true) {
        setDialogOpen(false);
      }

    } catch (error) {
      console.error("Gagal memperbarui kegiatan:", error);
      toast.error("Gagal memperbarui kegiatan");
    } finally {
      setIsSubmitting(false);
    }
  }


  if (error) return <div>Gagal memuat data kegiatan</div>;

  return (
    <div>
      <div className="flex justify-between items-center">
        <CustomSolidTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {isLoading ? (
        <SkeletonKegiatan />
      ) : (
        <>
          {mappedActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <ClipboardList className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Belum ada kegiatan</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Belum ada kegiatan. Silahkan klik tambah kegiatan untuk membuat kegiatan baru!
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {mappedActivities.map((activity: Activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  now={now}
                  onEdit={handleEditButtonClick}
                />
              ))}
            </div>
          )}
        </>
      )}

      <EditAddDialog
        open={dialogOpen}
        mode="edit"
        initialData={selectedEditing ?? undefined}
        isLoading={isSubmitting}
        isPengajar={true}
        onClose={() => {
          if (!isSubmitting) {
            setDialogOpen(false)
            setSelectedEditing(null)
          }
        }}
        onSubmit={async (activity, deletedPdfIndices) => {
          await handleEditKegiatan(activity, deletedPdfIndices);
        }}
      />
    </div>
  )
}
