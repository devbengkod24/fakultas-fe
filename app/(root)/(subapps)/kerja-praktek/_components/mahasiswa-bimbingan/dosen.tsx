"use client";

import { useEffect } from "react";
import { Inbox, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";

import { CustomTabs } from "@/components/custom-tabs";
import SearchInput from "./search-input";
import PaginationControls from "@/components/pagination-control";
import { SubmissionList } from "./submission-list";
import { SubmissionListSkeleton } from "./submission-list-skeleton";
import { BimbinganTable, type BimbinganRow } from "./bimbingan-table";
import { LogbookService, PengajuanService } from "@/api/kerja-praktek";

type TabKey = "pengajuan" | "bimbingan";

// ===== Pengajuan (tab existing) =====

const pengajuanFetcher = (page?: number, limit?: number, search?: string) =>
  PengajuanService.getAllPengajuanDosen(page, limit, search).then((res) => res);

// ===== Bimbingan (tab baru) =====

const bimbinganFetcher = (page?: number, limit?: number, search?: string) =>
  LogbookService.getMahasiswaBimbinganDosen(page ?? 1, limit ?? 10, search ?? "").then(
    (res) => res,
  );

// Adapter: response dari endpoint baru /kp/dosen/bimbingan (BE BimbinganService)
// → BimbinganRow[]. Response shape nested `mahasiswa` block (bukan `project.mahasiswa`).
function mapToBimbinganRows(data: any[] | undefined): BimbinganRow[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const m = row?.mahasiswa;
    return {
      nim: m?.nim ?? "",
      nama: m?.nama ?? "",
      email: m?.email,
      telepon: m?.telepon,
      foto: m?.foto ?? null,
      status_kp: row?.tipe_kp ?? null,
      judul_kp: row?.judul ?? null,
      tanggal_bimbingan_terakhir: row?.tanggal_bimbingan_terakhir ?? null,
    };
  });
}

export default function MahasiswaBimbinganDosen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  // Tab aktif dari URL (default "bimbingan"). useEffect di bawah akan
  // redirect ke ?tab=pengajuan jika ada KP pending, atau diam di
  // ?tab=bimbingan jika tidak ada. Default ke "bimbingan" sesuai UX:
  // dosen biasanya buka halaman ini untuk lihat daftar bimbingannya, bukan
  // antrian pengajuan.
  const urlTab = searchParams.get("tab") as TabKey | null;
  const activeTab: TabKey =
    urlTab === "pengajuan" || urlTab === "bimbingan" ? urlTab : "bimbingan";

  // SWR pengajuan (selalu di-fetch dengan key agar konsisten; render conditional).
  const pengajuanSwr = useSWR(
    ["pengajuan", page, limit, searchTerm],
    () => pengajuanFetcher(page, limit, searchTerm),
    { revalidateOnFocus: false },
  );

  // SWR bimbingan — hanya di-fetch jika tab aktif = bimbingan agar hemat request.
  const bimbinganSwr = useSWR(
    activeTab === "bimbingan" ? ["bimbingan", page, limit, searchTerm] : null,
    () => bimbinganFetcher(page, limit, searchTerm),
    { revalidateOnFocus: false },
  );

  // Auto-redirect (Step 2-revised tanpa probe): saat data pengajuan loaded,
  // tidak ada ?tab= di URL, dan total === 0 → switch ke ?tab=bimbingan.
  useEffect(() => {
    const hasTab = searchParams.get("tab");
    if (hasTab) return;
    if (pengajuanSwr.isLoading || pengajuanSwr.error) return;
    const total = pengajuanSwr.data?.meta?.pagination?.total ?? 0;
    const targetTab: TabKey = total > 0 ? "pengajuan" : "bimbingan";
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", targetTab);
    router.replace(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pengajuanSwr.isLoading, pengajuanSwr.error, pengajuanSwr.data]);

  // Handler switch tab: update URL, reset page ke 1.
  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const handlePengajuanStatusChange = () => {
    pengajuanSwr.mutate();
  };

  // Tab definition (CustomTabs expects {status, label, icon}).
  const tabs = [
    { status: "pengajuan", label: "Pengajuan", icon: Inbox },
    { status: "bimbingan", label: "Mahasiswa Bimbingan", icon: Users },
  ];

  // ====== Render ======

  const renderPengajuan = () => {
    const { data, error, isLoading } = pengajuanSwr;
    const daftarPengajuan = data?.data ?? [];
    const lastPages = data?.meta?.pagination?.last_page ?? 1;
    const totalData = data?.meta?.pagination?.total ?? 0;

    if (isLoading) return <SubmissionListSkeleton />;
    if (error)
      return (
        <div className="flex justify-center items-center p-8 text-destructive">
          <p>Terjadi kesalahan saat memuat data</p>
        </div>
      );

    return (
      <>
        <SubmissionList
          submissions={daftarPengajuan}
          onStatusChange={handlePengajuanStatusChange}
        />
        <PaginationControls
          currentPage={page}
          lastPage={lastPages}
          total={totalData}
        />
      </>
    );
  };

  const renderBimbingan = () => {
    const { data, error, isLoading } = bimbinganSwr;
    const rows = mapToBimbinganRows(data?.data);
    const lastPages = data?.meta?.pagination?.last_page ?? 1;
    const totalData = data?.meta?.pagination?.total ?? 0;
    const startIndex = (page - 1) * limit;

    if (isLoading) return <SubmissionListSkeleton />;
    if (error)
      return (
        <div className="flex justify-center items-center p-8 text-destructive">
          <p>Terjadi kesalahan saat memuat data</p>
        </div>
      );

    return (
      <>
        <BimbinganTable rows={rows} startIndex={startIndex} />
        <PaginationControls
          currentPage={page}
          lastPage={lastPages}
          total={totalData}
        />
      </>
    );
  };

  return (
    <div className="space-y-6">
      <SearchInput placeholder="Cari berdasarkan nama, NIM, atau judul..." />

      <CustomTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {activeTab === "pengajuan" ? renderPengajuan() : renderBimbingan()}
    </div>
  );
}
