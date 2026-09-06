"use client";

import type React from "react";
import { useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AlertTriangle, Megaphone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard-header";
import { toast } from "sonner";
import PengumumanCards from "./cards";
import withAuth from "@/app/(root)/hoc/withAuth";
import { useProfile } from "@/context/profileUseContext";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import EmptyState from "@/components/empty-state";
import useSWR from "swr";
import type { Pengumuman } from "@/types/admin-fakultas/pengumuman/pengumuman";
import { FilterPengumuman } from "./filter";
import PaginationControls from "@/components/pagination-control";
import { PengumumanService } from "@/api";

export type { Pengumuman };

function PengumumanClientPage() {
  const { profile } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const filterProdi = searchParams.get("prodi") || "all";
  const filterType = searchParams.get("type") || "all";
  const filterStatus = searchParams.get("status") || "all";
  const viewMode = (searchParams.get("view") as "card" | "table") || "card";

  // "all" here means "everything except general" (general belongs to the
  // Kelola Pengumuman/tambah page) — backend supports a comma-separated
  // type list to express that exclusion.
  const resolvedType = filterType === "all" ? "ta,kp,bk" : filterType;

  const { data, error, isLoading, mutate } = useSWR(
    [
      "fakultas-pengumuman",
      page,
      limit,
      resolvedType,
      filterStatus,
      filterProdi,
      search,
    ],
    () =>
      PengumumanService.getAdminFakultasPengumumanList(
        resolvedType,
        filterStatus,
        limit,
        "desc",
        page,
        search,
        filterProdi,
      ),
    { revalidateOnFocus: false },
  );

  const sortedPengumumans = useMemo(() => data?.data || [], [data?.data]);

  const totalItems = data?.meta?.pagination?.total || 0;
  const lastPage =
    data?.meta?.pagination?.last_page || Math.ceil(totalItems / limit);
  const isAnyFilterActive =
    filterProdi !== "all" ||
    filterType !== "all" ||
    filterStatus !== "all" ||
    search !== "";

  const updateQuery = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    if (!updates.page) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    router.push(pathname);
  };

  const handleApprove = async (pengumuman: Pengumuman) => {
    try {
      await PengumumanService.verifyAdminFakultasPengumuman(
        pengumuman.id!,
        "approve",
      );
      toast.success("Pengumuman berhasil diterima");
      mutate();
    } catch {
      toast.error("Gagal menerima pengumuman");
    }
  };

  const handleReject = async (pengumuman: Pengumuman) => {
    try {
      await PengumumanService.verifyAdminFakultasPengumuman(
        pengumuman.id!,
        "reject",
      );
      toast.success("Pengumuman berhasil ditolak");
      mutate();
    } catch {
      toast.error("Gagal menolak pengumuman");
    }
  };

  const isAdminFakultas =
    profile?.roles === "admin_fakultas" || profile?.roles === "super_fakultas";

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin-fakultas" },
          {
            name: "Validasi Pengumuman",
            url: "/admin-fakultas/pengumuman/validasi",
          },
        ]}
        titleItems={[
          {
            title: "Validasi Pengumuman",
            subtitle:
              "Tinjau dan setujui pengumuman dari koordinator program studi.",
          },
        ]}
      />

      <div className="flex flex-col gap-6 mt-2">
        <FilterPengumuman
          filterProdi={filterProdi}
          filterType={filterType}
          filterStatus={filterStatus}
          viewMode={viewMode}
          onUpdateQuery={updateQuery}
        />

        {error ? (
          <EmptyState
            icon={AlertTriangle}
            title="Terjadi Kesalahan"
            subtitle="Data pengumuman tidak dapat dimuat. Silakan coba lagi nanti."
            button={
              <Button variant="outline" size="sm" onClick={() => mutate()}>
                Coba Lagi
              </Button>
            }
            className="h-[400px] border rounded-xl bg-background"
          />
        ) : !isLoading && sortedPengumumans.length === 0 ? (
          <EmptyState
            icon={isAnyFilterActive ? Search : Megaphone}
            title={
              isAnyFilterActive ? "Tidak Ada Hasil" : "Belum Ada Pengumuman"
            }
            subtitle={
              isAnyFilterActive
                ? "Tidak ditemukan pengumuman yang sesuai dengan kriteria filter atau pencarian Anda."
                : "Belum ada pengumuman yang diajukan oleh koordinator prodi untuk saat ini."
            }
            button={
              isAnyFilterActive ? (
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset Semua Filter
                </Button>
              ) : null
            }
            className="h-[400px] border rounded-xl bg-background"
          />
        ) : viewMode === "table" ? (
          <DataTable
            columns={columns(handleApprove, handleReject, isAdminFakultas)}
            data={sortedPengumumans}
            loading={isLoading}
            pagination={{
              currentPage: page,
              lastPage: lastPage,
              limit,
              total: totalItems,
            }}
          />
        ) : (
          <div className="flex flex-col gap-6">
            <PengumumanCards
              data={sortedPengumumans}
              onApprove={handleApprove}
              onReject={handleReject}
              isLoading={isLoading}
              profile={profile}
            />
            {!isLoading && sortedPengumumans.length > 0 && (
              <PaginationControls
                currentPage={page}
                lastPage={lastPage}
                total={totalItems}
                limit={limit}
                onPageChange={(p) => updateQuery({ page: p.toString() })}
                onLimitChange={(l) =>
                  updateQuery({ limit: l.toString(), page: "1" })
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(PengumumanClientPage, "admin-fakultas", [
  "admin_fakultas",
  "super_fakultas",
]);
