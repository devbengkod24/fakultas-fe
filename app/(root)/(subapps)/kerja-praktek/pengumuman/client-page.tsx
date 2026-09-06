"use client"

import React, { useState } from "react"
import useSWR from "swr"
import DashboardHeader from "@/components/dashboard-header"
import EmptyState from "@/components/empty-state"
import type { Pengumuman } from "@/types/kerja-praktek/pengumuman"
import { PengumumanFormDialog } from "../_components/pengumuman/pengumuman-form-dialog"
import { PengumumanCards } from "../_components/pengumuman/pengumuman-cards"
import { PengumumanService } from "@/api/kerja-praktek"
import { Button } from "@/components/ui/button"
import { CalendarIcon, PlusCircle } from "lucide-react"
import { toast } from "sonner"
import SearchControl from "@/components/search-control"
import { handleToastResponse } from "@/lib/toast-response";
import DeletePengumumanDialog from "../_components/pengumuman/delete-dialog"
import withAuth from "@/app/(root)/hoc/withAuth"
import { useProfile } from "@/context/profileUseContext"

const PengumumanClientPage = () => {
  const { profile } = useProfile();
  const canCreatePengumuman = profile?.roles !== "super_fakultas";
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPengumuman, setSelectedPengumuman] =
    useState<Pengumuman | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    "pengumuman-kp-list",
    () => PengumumanService.getPengumumanList(),
    { revalidateOnFocus: false }
  );

  const pengumumans = data?.data ?? [];

  const handleAddPengumuman = async (newPengumuman: Pengumuman) => {
    try {
      const res = await PengumumanService.createPengumuman({
        judul: newPengumuman.judul,
        user: newPengumuman.user ?? profile?.name ?? "Koordinator Kerja Praktek",
        isi: newPengumuman.isi,
        type: newPengumuman.type ?? "kp",
      });
      handleToastResponse(res);
      if (res.success) {
        mutate();
      } else {
        mutate();
      }
    } catch {
      toast.error("Gagal menambahkan pengumuman");
    }
  };

  const handleEditPengumuman = async (updatedPengumuman: Pengumuman) => {
    try {
      const res = await PengumumanService.updatePengumuman(
        updatedPengumuman.id,
        {
          judul: updatedPengumuman.judul,
          user: updatedPengumuman.user,
          isi: updatedPengumuman.isi,
          type: updatedPengumuman.type ?? "kp",
        }
      );
      handleToastResponse(res);
      mutate();
    } catch {
      toast.error("Gagal memperbarui pengumuman");
      mutate();
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
        breadcrumbItems={[{ name: "Dashboard", url: "kerja-praktek" }]}
        titleItems={[{ title: "Pengumuman", subtitle: "Berikut data pengumuman yang telah dibuat di koordinator" }]}
      />

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchControl placeholder="Cari pengumuman..." className="w-1/4" />

        {canCreatePengumuman ? (
          <Button
            size="sm"
            className="sm:ml-auto"
            onClick={() => {
              setIsEditMode(false);
              setSelectedPengumuman(null);
              setIsFormDialogOpen(true);
            }}
          >
            <PlusCircle className="size-4 mr-2" />
            Tambah Pengumuman
          </Button>
        ) : null}
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
          />

          {!isLoading && pengumumans.length === 0 && (
            <EmptyState
              icon={CalendarIcon}
              title="Belum ada pengumuman"
              subtitle={
                canCreatePengumuman
                  ? "Pengumuman tidak tersedia. Klik tombol Tambah Pengumuman untuk membuat pengumuman baru."
                  : "Pengumuman tidak tersedia."
              }
              button={
                canCreatePengumuman ? (
                  <Button
                    onClick={() => {
                      setIsEditMode(false);
                      setSelectedPengumuman(null);
                      setIsFormDialogOpen(true);
                    }}
                    size="sm"
                  >
                    <PlusCircle className="size-4 mr-2" />
                    Tambah Pengumuman
                  </Button>
                ) : undefined
              }
              className="h-200px"
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
  )
}

export default withAuth(PengumumanClientPage, "kerja-praktek", ["koordinator","super_fakultas"]);