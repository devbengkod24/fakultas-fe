"use client"

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardHeader from "@/components/dashboard-header";
import MonitoringSidangKoordinator from "../_components/hasil-sidang/koordinator";
import { Role } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";
import MonitoringSidangDosen from "../_components/hasil-sidang/dosen";
import DataPengajuanDosen from "../_components/data-pengajuan/dosen";
import TtdDosenActions from "../_components/hasil-sidang/ttd-dosen-actions";
import { CustomTabs } from "@/components/custom-tabs";
import { SearchInput } from "@/components/search-input";
import { FileText, CalendarCheck } from "lucide-react";
import withAuth from "@/app/(root)/hoc/withAuth";

const MonitoringSidangClientPage = () => {
  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;
  // Map super_fakultas / admin_fakultas / admin to the koordinator view since
  // they share the same endpoint and permissions on this page.
  const activeRole =
    role === "admin" || role === "super_fakultas" || role === "admin_fakultas"
      ? "koordinator"
      : role;

  // Tab state for dosen view (mirrors koor's "Sidang KP" structure: Data Pengajuan + Hasil)
  const [activeTab, setActiveTab] = useState("hasil");
  const sidangTabs = [
    { status: "pengajuan", label: "Data Pengajuan", icon: FileText },
    { status: "hasil", label: "Hasil", icon: CalendarCheck },
  ];

  // Page-level search (dosen only) — shared across both tabs via URL ?search=...
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("search") ?? "";

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.replace(`?${params.toString()}`);
  };

  // Bersihkan ?gelombang_id=... dari URL karena filter Gelombang tidak ditampilkan di view dosen.
  // Mencegah data silently terfilter dari URL yang di-bookmark dari versi sebelumnya.
  useEffect(() => {
    if (activeRole !== "dosen") return;
    if (!searchParams.get("gelombang_id")) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("gelombang_id");
    router.replace(`?${params.toString()}`);
  }, [activeRole, searchParams, router]);

  // Breadcrumb mengikuti struktur sidebar per-role:
  // - koordinator: Dashboard > Sidang KP > Hasil Sidang (Sidang KP adalah submenu)
  // - dosen: Dashboard > Sidang (top-level menu)
  const breadcrumbItems =
    activeRole === "koordinator"
      ? [
          { name: "Dashboard", url: "/kerja-praktek" },
          { name: "Sidang KP", url: "/kerja-praktek" },
          { name: "Hasil Sidang", url: "/kerja-praktek/hasil-sidang" },
        ]
      : [
          { name: "Dashboard", url: "/kerja-praktek" },
          { name: "Sidang", url: "/kerja-praktek/hasil-sidang" },
        ];

  return (
    <div className="mb-4">
      <DashboardHeader breadcrumbItems={breadcrumbItems} />

      <div className="flex flex-wrap justify-between items-center mt-4 mb-4">
        <div>
          <h2 className="text-xl">
            {activeRole === "dosen" ? "Sidang" : "Hasil Sidang Kerja Praktek"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {activeRole === "dosen"
              ? "Kelola data pengajuan dan hasil sidang kerja praktek."
              : "Berikut data sidang yang sudah diploting jadwalnya."}
          </p>
        </div>
      </div>

      {activeRole === "dosen" && (
        <div className="space-y-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center justify-between">
            <SearchInput
              placeholder="Cari berdasarkan nama, NIM, atau judul..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full sm:w-1/4"
            />
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              {activeTab === "hasil" && <TtdDosenActions />}
            </div>
          </div>

          <CustomTabs
            tabs={sidangTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      )}

      {activeRole === "dosen" && activeTab === "pengajuan" && (
        <DataPengajuanDosen hideSearchBar />
      )}
      {activeRole === "dosen" && activeTab === "hasil" && (
        <MonitoringSidangDosen hideSearchBar />
      )}
      {activeRole === "koordinator" && <MonitoringSidangKoordinator />}

    </div>
  );
};

export default withAuth(MonitoringSidangClientPage, "kerja-praktek", ["dosen", "koordinator", "super_fakultas"]);