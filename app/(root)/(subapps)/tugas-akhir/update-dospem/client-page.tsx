"use client";

import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import DashboardHeader from "@/components/dashboard-header";
import { MahasiswaServiceV2, DosenService } from "@/api/tugas-akhir";
import { toast } from "sonner";
import { handleToastResponse } from "@/lib/toast-response";
import {
  UpdateDospemView,
  type MahasiswaDospem,
  type DosenDospem,
  type RiwayatDospem,
} from "@/components/shared-ta-kp/update-dospem/update-dospem-view";

const MHS_LIMIT = 10;

export default function UpdateDospemClientPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<MahasiswaDospem | null>(null);
  const [dosenId, setDosenId] = useState<number | null>(null);
  const [dosenOpen, setDosenOpen] = useState(false);
  const [dosenSearch, setDosenSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { data: mhsResponse, isLoading: mhsLoading } = useSWR(
    ["mhs-update-dospem", search, page],
    () => MahasiswaServiceV2.getAllV2(page, MHS_LIMIT, search, "ta"),
    { revalidateOnFocus: false },
  );

  const { data: dosenData, isLoading: dosenLoading } = useSWR(
    "dosen-all-update-dospem",
    () =>
      DosenService.getAll(1, 1000, "", "", "").then((res) => res.data ?? []),
    { revalidateOnFocus: false },
  );

  const { data: riwayatData, isLoading: riwayatLoading } = useSWR(
    selected ? ["riwayat-dospem", selected.mahasiswa_id] : null,
    () => MahasiswaServiceV2.getRiwayatDospem(selected!.mahasiswa_id),
    { revalidateOnFocus: false },
  );

  const mhsList: MahasiswaDospem[] = mhsResponse?.data ?? [];
  const mhsPagination = mhsResponse?.meta?.pagination;
  const lastPage = mhsPagination?.last_page ?? 1;
  const mhsTotal = mhsPagination?.total ?? 0;
  const dosenList: DosenDospem[] = dosenData ?? [];
  const riwayat: RiwayatDospem[] = riwayatData?.data ?? [];

  const filteredDosen = dosenSearch
    ? dosenList.filter(
        (d) =>
          d.name.toLowerCase().includes(dosenSearch.toLowerCase()) ||
          d.npp?.toLowerCase().includes(dosenSearch.toLowerCase()),
      )
    : dosenList;

  const selectedDosen = dosenList.find((d) => d.dosen_id === dosenId);

  const getDosenLabel = (d: DosenDospem) => {
    const depan = d.gelar_depan ? `${d.gelar_depan} ` : "";
    const belakang = d.gelar_belakang ? `, ${d.gelar_belakang}` : "";
    return `${depan}${d.name}${belakang}`;
  };

  const handleSubmit = async () => {
    if (!selected || !dosenId) return;
    setSubmitting(true);
    try {
      const res = await MahasiswaServiceV2.updateDospemById(
        selected.mahasiswa_id,
        dosenId,
      );
      handleToastResponse(res);
      mutate(["riwayat-dospem", selected.mahasiswa_id]);
      if (selectedDosen) {
        const newDosenLabel = getDosenLabel(selectedDosen);
        const targetId = selected.mahasiswa_id;
        mutate(
          ["mhs-update-dospem", search, page],
          (prev: { data: MahasiswaDospem[] } | undefined) =>
            prev
              ? {
                  ...prev,
                  data: prev.data.map((m) =>
                    m.mahasiswa_id === targetId
                      ? { ...m, dosen_name: newDosenLabel }
                      : m,
                  ),
                }
              : prev,
          { revalidate: true },
        );
        setSelected((prev) =>
          prev ? { ...prev, dosen_name: newDosenLabel } : prev,
        );
      }
      setDosenId(null);
    } catch (e: unknown) {
      toast.error("Gagal mengupdate dosen pembimbing");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[{ name: "Dashboard", url: "tugas-akhir" }]}
        titleItems={[
          {
            title: "Update Dosen Pembimbing",
            subtitle:
              "Ganti dosen pembimbing mahasiswa dan lihat riwayat perubahan",
          },
        ]}
      />

      <UpdateDospemView
        mhsList={mhsList}
        mhsLoading={mhsLoading}
        mhsLastPage={lastPage}
        mhsTotal={mhsTotal}
        mhsLimit={MHS_LIMIT}
        search={search}
        onSearchChange={setSearch}
        page={page}
        onPageChange={setPage}
        dosenList={dosenList}
        dosenLoading={dosenLoading}
        filteredDosen={filteredDosen}
        selectedDosen={selectedDosen}
        dosenSearch={dosenSearch}
        onDosenSearchChange={setDosenSearch}
        dosenOpen={dosenOpen}
        onDosenOpenChange={setDosenOpen}
        dosenId={dosenId}
        onDosenIdChange={setDosenId}
        selected={selected}
        onSelectMahasiswa={setSelected}
        riwayat={riwayat}
        riwayatLoading={riwayatLoading}
        submitting={submitting}
        confirmOpen={confirmOpen}
        onConfirmOpenChange={setConfirmOpen}
        onRequestConfirm={() => setConfirmOpen(true)}
        onSubmit={handleSubmit}
        getDosenLabel={getDosenLabel}
      />
    </div>
  );
}
