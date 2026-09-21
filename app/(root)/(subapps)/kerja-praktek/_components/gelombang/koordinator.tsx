"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import type { Gelombang } from "@/types/kerja-praktek/gelombang"
import { GelombangTable } from "./table"
import { GelombangForm } from "./form"
import { GelombangService } from "@/api/kerja-praktek"
import { PeriodeService } from "@/api/kerja-praktek"
import useSWR from "swr"
import { toast } from "sonner"
import { GelombangTableSkeleton } from "./skeleton"
import EmptyState from "@/components/empty-state"
import { AlertCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { handleToastResponse } from "@/lib/toast-response"
import { useProfile } from "@/context/profileUseContext"
import { GelombangToolbarView } from "@/components/shared-ta-kp/gelombang/toolbar-view"
import { GelombangFormView } from "@/components/shared-ta-kp/gelombang/form-view"
import type { PeriodeOption, TipeOption } from "@/components/shared-ta-kp/gelombang/toolbar-view"

const fetcher = (periode_id?: number, searchTerm?: string, prodi_id?: number) =>
  GelombangService.getAllGelombang(periode_id, searchTerm, prodi_id).then((res) => res);

const tipeOptions: TipeOption[] = []

export default function GelombangKoordinator() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Gelombang | null>(null);
  const [isAktifPeriode, setIsAktifPeriode] = useState(false);

  const { activeProdiId } = useProfile();

  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const periode_id = Number(searchParams.get("periode_id")) || undefined;

  const { data, error, isLoading, mutate } = useSWR(
    ["gelombang", periode_id, search, activeProdiId ?? undefined],
    () => fetcher(periode_id, search, activeProdiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const { data: periodeData } = useSWR("periode-list", () => PeriodeService.getAllPeriode())

  const daftarGelombang = data?.data ?? [];

  const periodeList: PeriodeOption[] = periodeData?.data?.map((p: any) => ({
    id: p.id,
    tahun_ajaran: p.tahun_ajaran,
    status: p.status,
    tgl_awal: p.tgl_awal,
    tgl_akhir: p.tgl_akhir,
    tgl_awal_ta: p.tgl_awal_ta,
    tgl_akhir_ta: p.tgl_akhir_ta,
  })) ?? []

  const handleOpenModal = () => {
    setEditData(null);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  }

  const handleEdit = (gelombang: Gelombang) => {
    setEditData(gelombang);
    setIsModalOpen(true);
  }

  const handleToggleStatus = async (id: number) => {
    try {
      const res = await GelombangService.activateGelombang(id);

      if (res.success) {
        handleToastResponse(res)
        mutate();
      } else {
        handleToastResponse(res)
      }
    } catch (error) {
      toast.error("Gagal mengubah status gelombang");
      console.error(error);
    }
  }

  const handleSave = async (formData: any) => {
    try {
      const payload: Gelombang = {
        nama_gelombang: formData.nama_gelombang,
        tipe: formData.tipe,
        periode_id: formData.periode_id,
        tgl_awal: formData.tgl_awal,
        tgl_akhir: formData.tgl_akhir,
      }

      let res;
      if (editData?.id) {
        res = await GelombangService.editGelombang(payload, editData.id);
      } else {
        res = await GelombangService.addGelombang(payload);
      }

      if (res.success) {
        handleToastResponse(res)
        handleCloseModal();
        mutate();
      } else {
        handleToastResponse(res);
      }
    } catch (error) {
      toast.error(`Gagal ${editData ? 'memperbarui' : 'menambahkan'} gelombang`);
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col space-y-4">
        <GelombangToolbarView
          periodeList={periodeList}
          tipeOptions={tipeOptions}
          onModalClick={handleOpenModal}
          onAktifPeriodeChange={setIsAktifPeriode}
          showTambah={isAktifPeriode}
          searchPlaceholder="Cari gelombang..."
        />

        {isLoading ? (
          <GelombangTableSkeleton />
        ) : error ? (
          <EmptyState
            icon={AlertCircle}
            title="Terjadi Kesalahan"
            subtitle={`Gagal memuat data gelombang: ${error.message}`}
            button={
              <Button onClick={() => mutate()} variant="outline">
                Coba Lagi
              </Button>
            }
          />
        ) : daftarGelombang.length === 0 ? (
          <EmptyState
            icon={AlertCircle}
            title="Belum Ada Gelombang"
            subtitle="Belum ada gelombang kerja practise yang dibuat. Mulai dengan menambahkan gelombang pertama."
            button={
              isAktifPeriode ? (
                <Button onClick={handleOpenModal} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Gelombang
                </Button>
              ) : undefined
            }
          />
        ) : (
          <GelombangTable
            data={daftarGelombang}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            currentPage={1}
            entriesPerPage={daftarGelombang.length}
          />
        )}

        {isModalOpen && (
          <GelombangFormView
            periodeList={periodeList}
            tipeOptions={tipeOptions}
            onClose={handleCloseModal}
            onSave={handleSave}
            editData={editData}
          />
        )}
      </div>
    </div>
  )
}