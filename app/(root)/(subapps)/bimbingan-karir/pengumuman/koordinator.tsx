"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { CalendarIcon, Plus } from "lucide-react";
import { PengumumanService } from "@/api";
import CardAnnouncement from "../_components/pengumuman/koordinator/card";
import FormDialogAnnouncement from "../_components/pengumuman/koordinator/form-dialog";
import DeleteDialogPengumuman from "../_components/pengumuman/koordinator/delete";
import DetailDialogAnnouncement from "../_components/pengumuman/koordinator/detail";
import { Button } from "@/components/ui/button";
import { Announcement } from "@/types/bimbingan-karir/koordinator/pengumuman/pengumuman";
import { handleToastResponse } from "@/lib/toast-response";
import SearchControl from "@/components/search-control";
import PaginationControls from "@/components/pagination-control";
import { SkeletonPengumuman } from "../_components/pengumuman/skeleton";

// === Fetcher untuk SWR ===
const fetcher = (type: string, page: number, limit: number, search: string) =>
  PengumumanService.getPengumumanList(type, page, limit, search).then((res) => res);

export default function KoordinatorPengumumanBK() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;


  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPengumuman, setSelectedPengumuman] = useState<Announcement | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);


  const { data, error, isLoading, mutate } = useSWR(
    ["pengumuman", "bk", page, limit, search],
    () => fetcher("bk", page, limit, search),
    { revalidateOnFocus: false }
  );

  const pengumumans = data?.data ?? [];
  const totalPages = data?.meta?.pagination.last_page ?? 1;
  const totalData = data?.meta?.pagination.total ?? 0;


  const handleAddPengumuman = async (newPengumuman: { judul: string; published_at: string; isi: string }) => {
    try {
      const res = await PengumumanService.createPengumuman({
        judul: newPengumuman.judul,
        isi: newPengumuman.isi,
        type: "bk",
        user: "Koordinator BK"
      });
      handleToastResponse(res);
      mutate();
      setIsFormDialogOpen(false);
    } catch {
      toast.error("Gagal menambahkan pengumuman");
    }
  };
  

  const handleEditPengumuman = async (updatedPengumuman: Announcement) => {
    try {
      const res = await PengumumanService.updatePengumuman(updatedPengumuman.id, {
        judul: updatedPengumuman.judul,
        isi: updatedPengumuman.isi,
        type: "bk",
        user: "Koordinator BK"
      });
      handleToastResponse(res);
      mutate();
      setIsFormDialogOpen(false);
    } catch {
      toast.error("Gagal memperbarui pengumuman");
    }
  };

  const handleDeletePengumuman = async () => {
    if (selectedPengumuman) {
      try {
        const res = await PengumumanService.deletePengumuman(
          selectedPengumuman.id
        );
        handleToastResponse(res);
        mutate();
        setIsDeleteDialogOpen(false);
        setSelectedPengumuman(null);
      } catch {
        toast.error("Gagal menghapus pengumuman");
      }
    }
  };

  const openAddDialog = () => {
    setIsEditMode(false);
    setSelectedPengumuman(null);
    setIsFormDialogOpen(true);
  };

  const openEditDialog = (pengumuman: Announcement) => {
    setSelectedPengumuman(pengumuman);
    setIsEditMode(true);
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (pengumuman: Announcement) => {
    setSelectedPengumuman(pengumuman);
    setIsDeleteDialogOpen(true);
  };

  const openDetailDialog = (pengumuman: Announcement) => {
    setSelectedPengumuman(pengumuman);
    setIsDetailDialogOpen(true);
  };

  if (isLoading) return <SkeletonPengumuman/>;
  if (error) return <div>Gagal memuat data pengumuman</div>;

  return (
    <div className="space-y-4 relative">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-2 w-full items-center">
          <SearchControl placeholder="Cari pengumuman..." className="w-full md:w-80 xl:w-80" />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={openAddDialog}>
            <Plus size={16} />
            Tambah Pengumuman
          </Button>
        </div>
      </div>

      {error ? (
        <div className="text-center text-red-500">
          Error: Gagal mengambil data pengumuman
          <Button
            size="sm"
            onClick={() => mutate()}
            className="mt-2"
            variant="outline"
          >
            Coba Lagi
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {pengumumans.map((announcement: Announcement) => (
              <CardAnnouncement
                key={announcement.id}
                announcement={announcement}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                onViewDetail={openDetailDialog}
              />
            ))}
          </div>

          {/* Kalau datanya kosong */}
          {!isLoading && pengumumans.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <CalendarIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Belum ada pengumuman</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Pengumuman tidak tersedia. Klik tombol Tambah Pengumuman untuk
                membuat pengumuman baru.
              </p>
            </div>
          )}

          {/* Kalau loading atau ada data, tampilkan Pagination */}
          {(isLoading || pengumumans.length > 0) && (
            <PaginationControls currentPage={page} lastPage={totalPages} total={totalData}/>
          )}
        </>
      )}

      {/* Dialog Tambah/Edit */}
      {isFormDialogOpen && (
        <FormDialogAnnouncement
          announcement={isEditMode && selectedPengumuman ? selectedPengumuman : undefined}
          isOpen={isFormDialogOpen}
          setIsOpen={setIsFormDialogOpen}
          mode={isEditMode ? "edit" : "add"}
          onSubmit={isEditMode ? handleEditPengumuman : handleAddPengumuman}
        />
      )}

      {/* Dialog Hapus */}
      {isDeleteDialogOpen && (
        <DeleteDialogPengumuman
          isOpen={isDeleteDialogOpen}
          setIsOpen={setIsDeleteDialogOpen}
          onConfirm={handleDeletePengumuman}
        />
      )}

      {/* Dialog Detail */}
      {isDetailDialogOpen && (
        <DetailDialogAnnouncement
          isOpen={isDetailDialogOpen}
          setIsOpen={setIsDetailDialogOpen}
          announcement={selectedPengumuman || undefined}
        />
      )}
    </div>
  );
}
