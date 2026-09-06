"use client"

import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import DataPengajuanKoordinator from "../_components/data-pengajuan/koordinator";
import withAuth from "@/app/(root)/hoc/withAuth";

const DataPengajuanClientPage = () => {
  return (
    <div className="px-3 sm:px-0">
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          { name: "Sidang KP", url: "/kerja-praktek/sidang" },
          { name: "Data Pengajuan Sidang", url: "/kerja-praktek/sidang/data-pengajuan",},
        ]}
        titleItems={[
          {
            title: "Data Pengajuan Sidang",
            subtitle:
              "Lihat data mahasiswa yang mengajukan sidang KP.",
          },
        ]}
      />

      <DataPengajuanKoordinator />
    </div>
  );
};

export default withAuth(DataPengajuanClientPage, "kerja-praktek", ["koordinator", "super_fakultas"]);