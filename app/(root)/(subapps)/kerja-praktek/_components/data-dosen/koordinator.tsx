"use client"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { Dosen } from "@/types/kerja-praktek/dosen"
import type { SortConfig } from "@/types/kerja-praktek/sortconfig"
import { DaftarDosenToolbar } from "./toolbar"
import { DaftarDosenForm } from "./form"
import { BulkActivateDosenModal } from "./bulk-activate-modal"
import { DosenService } from "@/api/kerja-praktek"
import useSWR from "swr"
import { DataTable } from "@/components/data-table"
import { useSearchParams } from "next/navigation"
import { Columns } from "./column"
import { toast } from "sonner"
import { handleToastResponse } from "@/lib/toast-response"
import PlotStudentsKP from "../plot-students-kp"
import { DaftarDosenTableSkeleton } from "./skeleton"
import { Button } from "@/components/ui/button"
import { Users, CheckCircle, XCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useProfile } from "@/context/profileUseContext";

const fetcher = (page: number, limit: number, search: string, periode_id?: number, sort?: SortConfig, prodi_id?: number) =>
  DosenService.getAllDosen(page, limit, search, periode_id, sort, prodi_id).then((res) => res);

const DaftarDosenKoordinator = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams();
  const { activeProdiId } = useProfile();
  const searchTerm = searchParams.get("search") ?? "";

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const periode_id = Number(searchParams.get("periode_id")) || undefined;

  const sortParam = searchParams.get("sort")
  const sortConfig: SortConfig | undefined = sortParam ? JSON.parse(decodeURIComponent(sortParam)) : undefined

  const { data, error, isLoading, mutate } = useSWR(
    ["dosen", page, limit, searchTerm, periode_id, sortConfig, activeProdiId ?? undefined],
    () => fetcher(page, limit, searchTerm, periode_id, sortConfig, activeProdiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const daftarDosen = data?.data ?? [];
  const totalPages = data?.meta?.pagination.last_page ?? 1;
  const totalData = data?.meta?.pagination.total ?? 0;
  const currentPage = data?.meta?.pagination.current_page ?? 1;
  const perPage = data?.meta?.pagination.per_page ?? limit;

  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedDosen, setSelectedDosen] = useState<Dosen | null>(null);
  const [showDosenForm, setShowDosenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);
  const [dosenToToggle, setDosenToToggle] = useState<Dosen | null>(null);
  const [isTogglingDosen, setIsTogglingDosen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedDosenForPlot, setSelectedDosenForPlot] = useState<Dosen | null>(null);
  const isDosenAktif = dosenToToggle?.aktif_periode === true;

  const handleToggleAktif = async () => {
    if (!dosenToToggle) return;
    setIsTogglingDosen(true);
    try {
      const response = await DosenService.toggleAktifPeriode(dosenToToggle.id!);
      mutate(undefined, { revalidate: true });
      setIsToggleDialogOpen(false);
      setDosenToToggle(null);
      handleToastResponse(response);
    } catch (error: any) {
      toast.error(isDosenAktif ? "Gagal menonaktifkan dosen" : "Gagal mengaktifkan dosen");
    } finally {
      setIsTogglingDosen(false);
    }
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      const res = await DosenService.syncDosen();
      if (res.data && Array.isArray(res.data)) {
        mutate(res.data);
        handleToastResponse(res);
      } else {
        mutate();
        toast.info("Berhasil melakukan sinkronisasi data, tidak ada data baru");
      }
    } catch {
      toast.error("Failed to sync data");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenEditForm = (dosen: Dosen) => {
    setSelectedDosen(dosen);
    setEditMode(true);
    setShowDosenForm(true);
  };

  if (error) return <div>Gagal memuat data</div>;

  const handleSaveDosen = async (dosen: Dosen) => {
    try {
      if (editMode) {
        if (!dosen.id) {
          throw new Error("Dosen ID is missing");
        }
        const res = await DosenService.updateDosen(dosen, dosen.id);
        handleToastResponse(res);
        if (res.success) {
          mutate();
          setShowDosenForm(false);
        }
      } else {
        const res = await DosenService.tambahDosen(dosen);
        handleToastResponse(res);
        if (res.success) {
          mutate();
          setShowDosenForm(false);
        }
      }
    } catch (error) {
      console.error("Error saving dosen:", error);
      toast.error(editMode ? "Gagal mengupdate dosen" : "Gagal menambahkan dosen");
    }
  };

  const handleToggleOpen = (dosen: Dosen) => {
    setDosenToToggle(dosen);
    setIsToggleDialogOpen(true);
  };

  const handleSort = (newSort: SortConfig) => {
    const params = new URLSearchParams(searchParams.toString());
    if (Object.keys(newSort).length > 0) {
      params.set("sort", encodeURIComponent(JSON.stringify(newSort)));
    } else {
      params.delete("sort");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const columns = Columns({
    currentPage,
    perPage,
    onEdit: handleOpenEditForm,
    onToggle: handleToggleOpen,
    onPlot: (dosenId: number) => {
      const dosen = daftarDosen.find((d: any) => d.id === dosenId);
      if (!dosen) return;
      setSelectedDosenForPlot(dosen);
    },
    currentSort: sortConfig,
    onSort: handleSort,
  })

  return (
    <div>
      {/* Toolbar - Always visible */}
      <DaftarDosenToolbar
        onSyncClick={handleSyncData}
        onSync={isSyncing}
        onBulkClick={() => setIsBulkModalOpen(true)}
      />

      {/* Table Area - Shows skeleton when loading */}
      {isLoading ? (
        <DaftarDosenTableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={daftarDosen}
          loading={false}
          pagination={{
            currentPage: page,
            lastPage: totalPages,
            limit,
            total: totalData,
          }}
        />
      )}

      {showDosenForm && (
        <DaftarDosenForm
          onClose={() => setShowDosenForm(false)}
          onSave={handleSaveDosen}
          dosen={selectedDosen ?? undefined}
          editMode={editMode}
        />
      )}

      <BulkActivateDosenModal
        open={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        mutateKey={["dosen", page, limit, searchTerm, periode_id, sortConfig, activeProdiId ?? undefined]}
      />

      {selectedDosenForPlot && (
        <PlotStudentsKP
          isOpen={true}
          onOpenChange={(open) => {
            if (!open) setSelectedDosenForPlot(null);
          }}
          dosen={{
            dosen_id: selectedDosenForPlot.id as number,
            name: `${selectedDosenForPlot.gelar_depan ? selectedDosenForPlot.gelar_depan + ' ' : ''}${selectedDosenForPlot.nama ?? ''}${selectedDosenForPlot.gelar_belakang ? ', ' + selectedDosenForPlot.gelar_belakang : ''}`,
            sisa_kuota: selectedDosenForPlot.sisa_kuota ?? 0,
            currentStudents: (selectedDosenForPlot.kuota ?? 0) - (selectedDosenForPlot.sisa_kuota ?? 0),
            quota: selectedDosenForPlot.kuota ?? 0,
          }}
          onPlotSuccess={() => {
            mutate();
            setSelectedDosenForPlot(null);
          }}
        />
      )}

      <AlertDialog open={isToggleDialogOpen} onOpenChange={setIsToggleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isDosenAktif ? "Nonaktifkan" : "Aktifkan"} Dosen Periode Ini
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isDosenAktif ? (
                <>
                  Apakah Anda yakin ingin <strong>menonaktifkan</strong> dosen{" "}
                  <strong>{dosenToToggle?.nama}</strong> dari periode ini? Dosen masih akan tampil di daftar Data Dosen, namun tidak akan tampil di halaman Kuota Dosen.
                </>
              ) : (
                <>
                  Apakah Anda yakin ingin <strong>mengaktifkan</strong> dosen{" "}
                  <strong>{dosenToToggle?.nama}</strong> untuk periode ini? Dosen akan tampil di halaman Kuota Dosen dengan kuota awal 0.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDosenToToggle(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleAktif}
              disabled={isTogglingDosen}
              className={isDosenAktif ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"}
            >
              {isTogglingDosen ? "Memproses..." : isDosenAktif ? (
                <><XCircle className="h-4 w-4 mr-1.5" />Nonaktifkan</>
              ) : (
                <><CheckCircle className="h-4 w-4 mr-1.5" />Aktifkan</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DaftarDosenKoordinator