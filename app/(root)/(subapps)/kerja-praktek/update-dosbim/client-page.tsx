"use client";

import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import DashboardHeader from "@/components/dashboard-header";
import { DosenService, MahasiswaService } from "@/api/kerja-praktek";
import { toast } from "sonner";
import { handleToastResponse } from "@/lib/toast-response";
import {
  UpdateDospemView,
  type MahasiswaDospem,
  type DosenDospem,
  type RiwayatDospem,
} from "@/components/shared-ta-kp/update-dospem/update-dospem-view";

const MHS_LIMIT = 10;

export default function UpdateDosbimClientPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<MahasiswaDospem | null>(null);
  const [dosenId, setDosenId] = useState<number | null>(null);
  const [dosenOpen, setDosenOpen] = useState(false);
  const [dosenSearch, setDosenSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isKonversi, setIsKonversi] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { data: mhsResponse, isLoading: mhsLoading } = useSWR(
    ["kp-mhs-update-dospem", search, page],
    () => MahasiswaService.getAllMahasiswa(page, MHS_LIMIT, search),
    { revalidateOnFocus: false },
  );

  const { data: dosenData, isLoading: dosenLoading } = useSWR(
    "kp-dosen-by-periode-update-dospem",
    () => DosenService.getDosenByPeriode(1, 1000, "", undefined).then((res) => res.data ?? []),
    { revalidateOnFocus: false },
  );

  const { data: riwayatData, isLoading: riwayatLoading } = useSWR(
    selected ? ["kp-riwayat-dospem", selected.mahasiswa_id] : null,
    () => MahasiswaService.getRiwayatDospem(selected!.mahasiswa_id),
    { revalidateOnFocus: false },
  );

  const mhsList: MahasiswaDospem[] = mhsResponse?.data?.map((m: any) => ({
    mahasiswa_id: m.id,
    project_id: m.project_id,
    name: m.nama,
    nim: m.nim,
    dosen_name: m.dosen_pembimbing?.nama ?? null,
    photo: m.foto ?? null,
  })) ?? [];

  const mhsPagination = mhsResponse?.meta?.pagination;
  const lastPage = mhsPagination?.last_page ?? 1;
  const mhsTotal = mhsPagination?.total ?? 0;
  const dosenList: DosenDospem[] = (dosenData ?? []).map((d: any) => ({
    dosen_id: d.id,
    npp: d.npp ?? "",
    name: d.nama,
    gelar_depan: d.gelar_depan ?? null,
    gelar_belakang: d.gelar_belakang ?? null,
    sisa_kuota: d.sisa_kuota ?? 0,
  }));
  const riwayat: RiwayatDospem[] = Array.isArray(riwayatData?.data) ? riwayatData.data : [];

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
    if (!selected || !dosenId || !selected.project_id) return;
    setSubmitting(true);
    try {
      const res = await MahasiswaService.updateDospem(
        [selected.project_id],
        dosenId,
        isKonversi,
      );
      handleToastResponse(res);

      if (selectedDosen) {
        const newDosenLabel = getDosenLabel(selectedDosen);
        const targetId = selected.project_id;

        // Update SWR cache directly with new dospem name
        mutate(
          ["kp-mhs-update-dospem", search, page],
          (prev: any) =>
            prev
              ? {
                  ...prev,
                  data: prev.data.map((m: any) =>
                    m.project_id === targetId
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

      // Revalidate riwayat dospem after update
      if (selected?.mahasiswa_id) {
        mutate(["kp-riwayat-dospem", selected.mahasiswa_id]);
      }

      setDosenId(null);
      setIsKonversi(false);
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
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          { name: "Mahasiswa", url: "/kerja-praktek/data-mahasiswa" },
          { name: "Update Dospem", url: "/kerja-praktek/update-dosbim" },
        ]}
        titleItems={[
          {
            title: "Update Dosen Pembimbing",
            subtitle: "Ganti dosen pembimbing mahasiswa dan lihat riwayat perubahan",
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
        isKonversi={isKonversi}
        onIsKonversiChange={(checked) => setIsKonversi(checked === true)}
      />
    </div>
  );
}
