"use client";

import type React from "react";
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
import { BkPengumumanService } from "@/api/bimbingan-karir";
import withAuth from "@/app/(root)/hoc/withAuth";
import { useProfile } from "@/context/profileUseContext";
import PengumumanFormDialog from "../_components/pengumuman/form-dialog";
import PengumumanCards from "../_components/pengumuman/cards";
import DeletePengumumanDialog from "../_components/pengumuman/dialog";

export interface Pengumuman {
  id: number;
  judul: string;
  type?: string;
  user?: string;
  isi: string;
  published_at: string;
  created_at?: string;
  updated_at?: string;
}

const fetcher = (type: string, page: number, limit: number, search: string, prodiId?: number | string) =>
  BkPengumumanService.getPengumumanList(type, page, limit, search, prodiId).then(
    (res) => res
  );

function PengumumanClientPage() {
  const { profile, activeProdiId } = useProfile();
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
    ["pengumuman", "bk", page, limit, search, activeProdiId],
    () => fetcher("bk", page, limit, search, activeProdiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const pengumumans = data?.data ?? [];
  const lastPages = data?.meta?.pagination.last_page ?? 1;
  const totalData = data?.meta?.pagination.total ?? 0;

  const handleAddPengumuman = async (newPengumuman: Pengumuman) => {
    const promise = BkPengumumanService.createPengumuman({
      judul: newPengumuman.judul,
      user: newPengumuman.user || "Koordinator BK",
      isi: newPengumuman.isi,
      type: newPengumuman.type || "bk",
      prodi_id: activeProdiId,
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
    const promise = BkPengumumanService.updatePengumuman(updatedPengumuman.id, {
      judul: updatedPengumuman.judul,
      isi: updatedPengumuman.isi,
      user: "Koordinator BK",
      type: "bk",
      prodi_id: activeProdiId,
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
      const promise = BkPengumumanService.deletePengumuman(
        selectedPengumuman.id
      ).then((res) => {
        handleToastResponse(res);
        mutate();
        setIsDeleteDialogOpen(false);
        setSelectedPengumuman(null);
        return res;
      });

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
        breadcrumbItems={[
          { name: "Dashboard", url: "/bimbingan-karir" },
          { name: "Pengumuman", url: "/bimbingan-karir/pengumuman" }
        ]}
        titleItems={[
          {
            title: "Pengumuman",
            subtitle:
              "Berikut data pengumuman yang tersedia untuk Bimbingan Karir",
          },
        ]}
      />

      <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
        <div className="flex items-center w-full gap-2">
          <SearchControl placeholder="Cari pengumuman..." className="w-full md:w-80 xl:w-80" />
        </div>
        
        <div className="flex items-center gap-2">
          {(profile?.roles === "koordinator") && (
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
      </div>

      {isFormDialogOpen && (
        <PengumumanFormDialog
          pengumuman={
            isEditMode && selectedPengumuman ? selectedPengumuman : undefined
          }
          onSave={isEditMode ? handleEditPengumuman : handleAddPengumuman}
          onClose={() => {
            setIsFormDialogOpen(false);
            setIsEditMode(false);
            setSelectedPengumuman(null);
          }}
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
          <PengumumanCards
            pengumumans={pengumumans}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            isLoading={isLoading}
            profile={profile}
          />
          {!isLoading && pengumumans.length === 0 && (
            <EmptyState
              icon={CalendarIcon}
              title="Belum ada pengumuman"
              subtitle="Tidak ada pengumuman yang tersedia saat ini. Silakan periksa kembali secara berkala untuk melihat jika ada informasi terbaru."
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

      <DeletePengumumanDialog
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

export default withAuth(PengumumanClientPage, "bimbingan-karir");
