"use client";

import React from "react";
import DashboardDosenMenu from "../_components/dashboard/dosen/menu";
import DashboardDosenChartLogbook from "../_components/dashboard/dosen/chart-logbook";
import DashboardDosenInfoKuota from "../_components/dashboard/dosen/info-kuota";
import DashboardLogAktivitas from "../_components/dashboard/log-aktivitas";
import DashboardDosenLinkWa from "../_components/dashboard/dosen/link-wa";
import DashboardDosenJadwalSidang from "../_components/dashboard/dosen/jadwal-sidang";
import DashboardLayout, { DashboardSection } from "../_components/dashboard/dashboard-wrapper";
import useSWR from "swr";
import { DashboardService } from "@/api/kerja-praktek";
import PeriodeKP from "../_components/dashboard/koordinator/periode-kp";
import GelombangAktifKoor from "../_components/dashboard/koordinator/gelombang-aktif-koor";
import withAuth from "@/app/(root)/hoc/withAuth";

const fetcher = () =>
  DashboardService.getDashboardDosen().then((res) => res);

const DashboardDosen = () => {

  const { data } = useSWR(
    ["dashboard-dosen"],
    () => fetcher(),
    { revalidateOnFocus: false }
  );

  const dashboard = data?.data ?? [];

  return (
    <DashboardLayout>
      <DashboardSection span={8}>
        <DashboardDosenMenu />
        <DashboardDosenLinkWa />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3">
          <DashboardDosenChartLogbook data={dashboard} />
          <DashboardDosenJadwalSidang />
        </div>
      </DashboardSection>
      <DashboardSection span={4}>
        <div className="space-y-4">
          <PeriodeKP />
          <GelombangAktifKoor />
          <DashboardDosenInfoKuota data={dashboard} />
        </div>

        <div className="mt-4">
          <DashboardLogAktivitas type="dosen" />
        </div>
      </DashboardSection>
    </DashboardLayout>
  );
};

export default withAuth(DashboardDosen, "kerja-praktek", "dosen");
