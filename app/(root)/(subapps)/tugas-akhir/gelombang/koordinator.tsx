"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import useSWR from "swr";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GelombangTA } from "@/types/tugas-akhir/gelombang";
import { GelombangTAService } from "@/api/tugas-akhir";
import { GelombangTable } from "../_components/gelombang/table";
import { GelombangToolbar } from "../_components/gelombang/toolbar";
import { GelombangForm } from "../_components/gelombang/form";
import { GelombangSkeleton } from "../_components/gelombang/skeleton";
import EmptyState from "@/components/empty-state";
import { handleToastResponse } from "@/lib/toast-response";
import PaginationControls from "@/components/pagination-control";

const fetcher = (
  periode_id?: number,
  tipe?: string,
  search?: string,
  page?: number,
  limit?: number,
) => GelombangTAService.getAllGelombang(periode_id, tipe, search, page, limit);

export default function GelombangKoordinator() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<GelombangTA | null>(null);
  const [isAktifPeriode, setIsAktifPeriode] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const periode_id = Number(searchParams.get("periode_id")) || undefined;
  const tipe = searchParams.get("tipe") ?? undefined;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const { data, error, isLoading, mutate } = useSWR(
    ["gelombang-ta", periode_id, tipe, search, page, limit],
    () => fetcher(periode_id, tipe, search, page, limit),
    { revalidateOnFocus: false, dedupingInterval: 0 },
  );

  const daftarGelombang: GelombangTA[] = data?.data?.data ?? [];
  const lastPage: number = data?.data?.last_page ?? 1;
  const total: number = data?.data?.total ?? 0;

  const handleOpenModal = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const handleEdit = (gelombang: GelombangTA) => {
    setEditData(gelombang);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const res = await GelombangTAService.activateGelombang(id);
      if (res.success) {
        handleToastResponse(res);
        await mutate();
      } else {
        handleToastResponse(res);
      }
    } catch {
      toast.error("Gagal mengubah status gelombang.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await GelombangTAService.deleteGelombang(id);
      handleToastResponse(res);
      mutate();
    } catch {
      toast.error("Gagal menghapus gelombang.");
    }
  };

  const handleSave = async (payload: GelombangTA) => {
    try {
      let res;
      if (editData?.id) {
        res = await GelombangTAService.editGelombang(payload, editData.id);
      } else {
        res = await GelombangTAService.addGelombang(payload);
      }

      if (res.success) {
        handleToastResponse(res);
        handleCloseModal();
        if (!editData && payload.periode_id) {
          const params = new URLSearchParams(searchParams.toString());
          params.set("periode_id", String(payload.periode_id));
          router.push(`${pathname}?${params.toString()}`);
        }
        mutate();
      } else {
        handleToastResponse(res);
      }
    } catch {
      toast.error(
        `Gagal ${editData ? "memperbarui" : "menambahkan"} gelombang.`,
      );
    }
  };

  if (isLoading) return <GelombangSkeleton />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <GelombangToolbar
          onModalClick={handleOpenModal}
          onAktifPeriodeChange={setIsAktifPeriode}
          showTambah={isAktifPeriode}
        />

        {error ? (
          <EmptyState
            icon={AlertCircle}
            title="Terjadi Kesalahan"
            subtitle={`Gagal memuat data gelombang: ${error.message}`}
            button={
              <Button onClick={() => mutate()} variant="outline" size="sm">
                Coba Lagi
              </Button>
            }
          />
        ) : daftarGelombang.length === 0 ? (
          <EmptyState
            icon={AlertCircle}
            title="Belum Ada Gelombang"
            subtitle={
              search
                ? `Tidak ada gelombang dengan kata kunci "${search}"`
                : "Belum ada gelombang sidang TA. Mulai dengan menambahkan gelombang pertama."
            }
            button={
              isAktifPeriode ? (
                <Button onClick={handleOpenModal} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Gelombang
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <GelombangTable
              data={daftarGelombang}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              page={page}
              limit={limit}
            />
            <PaginationControls
              currentPage={page}
              lastPage={lastPage}
              total={total}
            />
          </>
        )}

        {isModalOpen && (
          <GelombangForm
            onClose={handleCloseModal}
            onSave={handleSave}
            editData={editData}
          />
        )}
      </div>
    </div>
  );
}
