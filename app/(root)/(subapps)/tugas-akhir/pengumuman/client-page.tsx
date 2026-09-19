"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard-header";
import useSWR from "swr";
import { toast } from "sonner";
import PaginationControls from "@/components/pagination-control";
import { handleToastResponse } from "@/lib/toast-response";
import SearchControl from "@/components/search-control";
import EmptyState from "@/components/empty-state";
import { TAPengumumanService } from "@/api/tugas-akhir";
import withAuth from "@/app/(root)/hoc/withAuth";
import { useProfile } from "@/context/profileUseContext";
import PengumumanCardsView from "@/components/shared-ta-kp/pengumuman/pengumuman-cards-view";
import PengumumanDeleteDialogView from "@/components/shared-ta-kp/pengumuman/pengumuman-delete-dialog-view";
import PengumumanFormDialogView from "@/components/shared-ta-kp/pengumuman/pengumuman-form-dialog-view";
import type { PengumumanItem } from "@/components/shared-ta-kp/pengumuman/types";

export type Pengumuman = PengumumanItem;

const fetcher = (page: number, limit: number, search: string) =>
  TAPengumumanService.getAll(page, limit, search).then((res) => res);

function PengumumanClientPage() {
  const { profile } = useProfile();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPengumuman, setSelectedPengumuman] =
    useState<Pengumuman | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    ["pengumuman", "TA", page, limit, search],
    () => fetcher(page, limit, search),
    { revalidateOnFocus: false },
  );

  const pengumumans = data?.data ?? [];
  const lastPages = data?.meta?.pagination.last_page ?? 1;
  const totalData = data?.meta?.pagination.total ?? 0;

  const handleAddPengumuman = async (newPengumuman: Pengumuman) => {
    const promise = TAPengumumanService.create({
      judul: newPengumuman.judul,
      user: newPengumuman.user || "Koordinator Tugas Akhir",
      isi: newPengumuman.isi,
    }).then((res) => {
      handleToastResponse(res);
      mutate();
      return res;
    });

    toast.promise(promise, {
      loading: "Menambahkan pengumuman...",
      success: () => "Pengumuman berhasil ditambahkan",
      error: (err) => err?.message || "Gagal menambahkan pengumuman",
    });
  };

  const handleEditPengumuman = async (updatedPengumuman: Pengumuman) => {
    const promise = TAPengumumanService.update(updatedPengumuman.id, {
      judul: updatedPengumuman.judul,
      user: updatedPengumuman.user,
      isi: updatedPengumuman.isi,
    }).then((res) => {
      handleToastResponse(res);
      mutate();
      return res;
    });

    toast.promise(promise, {
      loading: "Memperbarui pengumuman...",
      success: () => "Pengumuman berhasil diperbarui",
      error: (err) => err?.message || "Gagal memperbarui pengumuman",
    });
  };

  const handleDeletePengumuman = async () => {
    if (selectedPengumuman) {
      const promise = TAPengumumanService.delete(selectedPengumuman.id).then(
        (res) => {
          handleToastResponse(res);
          mutate();
          setIsDeleteDialogOpen(false);
          setSelectedPengumuman(null);
          return res;
        },
      );

      toast.promise(promise, {
        loading: "Menghapus pengumuman...",
        success: () => "Pengumuman berhasil dihapus",
        error: (err) => err?.message || "Gagal menghapus pengumuman",
      });
    }
  };

  const openEditDialog = (pengumuman: Pengumuman) => {
    setSelectedPengumuman(pengumuman);
    setIsEditMode(true);
    setIsFormDialogOpen(true);
  };

  const openDeleteDialog = (pengumuman: Pengumuman) => {
    setSelectedPengumuman(pengumuman);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[{ name: "Dashboard", url: "tugas-akhir" }]}
        titleItems={[
          {
            title: "Pengumuman",
            subtitle:
              "Berikut data pengumuman yang telah dibuat di koordinator",
          },
        ]}
      />

      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchControl placeholder="Cari pengumuman..." className="w-1/4" />

        {profile?.roles === "koordinator" && (
          <Button
            size="sm"
            onClick={() => {
              setIsEditMode(false);
              setSelectedPengumuman(null);
              setIsFormDialogOpen(true);
            }}
          >
            <PlusCircle className="size-4" />
            Tambah Pengumuman
          </Button>
        )}
      </div>

      {isFormDialogOpen && (
        <PengumumanFormDialogView
          pengumuman={
            isEditMode && selectedPengumuman ? selectedPengumuman : undefined
          }
          onSave={isEditMode ? handleEditPengumuman : handleAddPengumuman}
          onClose={() => {
            setIsFormDialogOpen(false);
            setIsEditMode(false);
            setSelectedPengumuman(null);
          }}
          defaultType="ta"
          defaultUser="Koordinator Tugas Akhir"
        />
      )}

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
          <PengumumanCardsView
            pengumumans={pengumumans}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            isLoading={isLoading}
            profile={profile}
            detailBasePath="/tugas-akhir/pengumuman"
          />
          {!isLoading && pengumumans.length === 0 && (
            <EmptyState
              icon={CalendarIcon}
              title="Belum ada pengumuman"
              subtitle="Pengumuman tidak tersedia. Klik tombol Tambah Pengumuman untuk membuat pengumuman baru."
            />
          )}
          {pengumumans.length > 0 && (
            <PaginationControls
              currentPage={page}
              lastPage={lastPages}
              total={totalData}
            />
          )}
        </>
      )}

      <PengumumanDeleteDialogView
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setSelectedPengumuman(null);
        }}
        selectedPengumuman={selectedPengumuman}
        onDelete={handleDeletePengumuman}
      />
    </div>
  );
}

export default withAuth(PengumumanClientPage, "tugas-akhir");
