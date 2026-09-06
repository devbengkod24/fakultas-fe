"use client"

import { useState, useEffect } from "react"
import { Activity } from "@/types/bimbingan-karir/koordinator/daftar-kegiatan/activity"
import { CustomSolidTabs } from "@/components/custom-solid-tabs"
import ActivityCard from "../_components/daftar-kegiatan/koordinator/activity-card"
import EditAddDialog from "../_components/daftar-kegiatan/koordinator/edit-add-dialog"
import DeleteDialog from "../_components/daftar-kegiatan/koordinator/delete-dialog"
import { Button } from "@/components/ui/button"
import { Plus, ListFilter, PlayCircle, CalendarClock, CheckCircle, ClipboardList } from "lucide-react"
import { DaftarKegiatanService } from "@/api/bimbingan-karir"
import useSWR from "swr"
import { toast } from "sonner"
import { handleToastResponse } from "@/lib/toast-response";
import { SkeletonKegiatan } from "../_components/daftar-kegiatan/skeleton"
import { activityAppend, activityUpdate } from "@/lib/bimbingan-karir/data-utils"
import { useRouter, useSearchParams } from "next/navigation"
import SyncLmsDialog from "../_components/daftar-kegiatan/koordinator/lms"
import { useProfile } from "@/context/profileUseContext";
import { getActiveProdiId } from "@/api/bimbingan-karir/helpers/prodiFetcher";

const fetcherDaftarKegiatan = (activeProdiId: number | null, status: string) =>
  DaftarKegiatanService.getAllDaftarKegiatan(activeProdiId ?? getActiveProdiId(), status).then((res) => res);

export default function KoordinatorListKegiatan() {
  const { activeProdiId } = useProfile();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("semua")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [selectedEditing, setSelectedEditing] = useState<Activity | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [activityToDelete, setActivityToDelete] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [syncLmsOpen, setSyncLmsOpen] = useState(false) // State untuk LMS dialog
  const now = new Date()

  // Keyboard shortcut untuk Sync LMS (Ctrl+L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        setSyncLmsOpen(true);
        toast.info("Shortcut: Ctrl+L untuk Sync LMS");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { data, error, isLoading, mutate } = useSWR(
    ["daftar-kegiatan", activeProdiId, activeTab],
    () => fetcherDaftarKegiatan(activeProdiId, activeTab),
    { revalidateOnFocus: false, dedupingInterval: 0 }
  )

  useEffect(() => {
    if (mutate) {
      mutate();
    }
  }, [activeProdiId, mutate]);

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
    mahasiswas: a.mahasiswas,
    link_grup_wa: a.link_grup_wa,
    file_pdf: a.file_pdf || [],
    poster: a.poster || undefined
  }));

  const tabs = [
    { status: "semua", label: "Semua", icon: ListFilter },
    { status: "sedang_berlangsung", label: "Sedang Berlangsung", icon: PlayCircle },
    { status: "akan_berlangsung", label: "Akan Berlangsung", icon: CalendarClock },
    { status: "selesai", label: "Selesai", icon: CheckCircle },
  ];

  const handleAddKegiatan = async (newKegiatan: Activity) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      activityAppend(formData, newKegiatan, activeProdiId);

      const res = await DaftarKegiatanService.createDaftarKegiatan(formData);
      handleToastResponse(res);
      mutate();

      if (res.success === true) {
        setDialogOpen(false);
      }

    } catch (error) {
      console.error("Error Add Kegiatan", error)
      toast.error("Gagal menambahkan kegiatan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditKegiatan = async (updateKegiatan: Activity, deletedPdfIndices: number[]) => {
    setIsSubmitting(true);
    try {
      const updateData = activityUpdate(updateKegiatan, deletedPdfIndices, activeProdiId);
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

  const handleDeleteKegiatan = async (id: number) => {
    try {
      const res = await DaftarKegiatanService.deleteDaftarKegiatan(id);
      handleToastResponse(res);
      mutate();
    } catch (error) {
      console.error("Gagal menghapus kegiatan:", error);
      toast.error("Gagal menghapus kegiatan");
    }
  };

  const handleAddButtonClick = () => {
    setDialogMode("add");
    setSelectedEditing(null);
    setDialogOpen(true);
  };

  const handleEditButtonClick = (editKegiatan: Activity) => {
    setSelectedEditing(editKegiatan)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setActivityToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleTabChange = (status: string) => {
    setActiveTab(status);
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    router.push(`?${params.toString()}`);
  };


  if (error) return <div>Gagal memuat data kegiatan</div>;

  return (
    <div>
      <div className="flex justify-between items-center">
        <CustomSolidTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        <Button onClick={handleAddButtonClick} size="sm">
          <Plus size={16} /> Tambah Kegiatan
        </Button>
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
                  onEdit={handleEditButtonClick}
                  onDelete={handleDelete}
                  now={now}
                />
              ))}
            </div>
          )}
        </>
      )}

      <EditAddDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={selectedEditing ?? undefined}
        isLoading={isSubmitting}
        onClose={() => {
          if (!isSubmitting) {
            setDialogOpen(false)
            setSelectedEditing(null)
          }
        }}
        onSubmit={async (activity, deletedPdfIndices) => {
          if (dialogMode === "edit") {
            await handleEditKegiatan(activity, deletedPdfIndices);
          } else {
            await handleAddKegiatan(activity);
          }
        }}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setActivityToDelete(null)
        }}
        onConfirm={async () => {
          if (activityToDelete !== null) {
            await handleDeleteKegiatan(activityToDelete);
            setDeleteDialogOpen(false);
            setActivityToDelete(null);
          }
        }}
      />

      {/* Sync LMS Dialog */}
      <SyncLmsDialog
        open={syncLmsOpen}
        onOpenChange={setSyncLmsOpen}
      />
    </div>
  )
}
