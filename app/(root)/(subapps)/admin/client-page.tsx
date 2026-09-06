"use client";

import React from "react";
import useSWR from "swr";
import DashboardHeader from "@/components/dashboard-header";
import { useProfile } from "@/context/profileUseContext";
import { AdminDashboardService } from "@/api/admin";
import { KpSummary } from "./_components/dashboard/kp-summary";
import { TaLogbookChart } from "./_components/dashboard/ta-logbook-chart";
import { MiniCharts } from "./_components/dashboard/mini-charts";

const fetcher = (url: string) =>
  fetch(url, { headers: AdminDashboardService.getSummary ? {} : {} }).then((r) => r.json());

const DashboardAdminClient = () => {
  const { profile, activeProdiId } = useProfile();
  const activeProdi =
    profile?.daftar_prodi?.find((p) => p.id === activeProdiId) ??
    profile?.prodi;

  const { data, error, isLoading } = useSWR(
    "admin-dashboard-summary",
    () => AdminDashboardService.getSummary(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const dashboardData = data?.data;

  return (
    <>
       <DashboardHeader
        breadcrumbItems={[{ name: "Dashboard", url: "admin" }]}
        titleItems={[
          {
            title: `Selamat Datang, ${profile?.name}`,
            subtitle: activeProdi
              ? `Dasbor pengelolaan Program Studi ${activeProdi.nama} (${activeProdi.kode_prodi}). Berikut adalah data-data yang dapat Anda akses.`
              : "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />

      <div className="grid grid-cols-12 gap-4 mt-4 pb-6">
        <div className="col-span-12 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KpSummary data={dashboardData?.kp} loading={isLoading} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MiniCharts data={dashboardData} loading={isLoading} />
          </div>

          <TaLogbookChart data={dashboardData?.ta?.logbook} loading={isLoading} />
        </div>
      </div>
    </>
  );
};

export default DashboardAdminClient;
