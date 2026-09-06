"use client"

import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import PengajuanSidangMahasiswa from "./mahasiswa";
import withAuth from "@/app/(root)/hoc/withAuth";


const PengajuanSidangClientPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          { name: "Pengajuan Sidang", url: "/kerja-praktek/pengajuan-sidang" },
        ]}
        titleItems={[
          {
            title: "Pengajuan Sidang",
            subtitle:
              "Berikut adalah halaman untuk mengajukan sidang kerja practise.",
          },
        ]}
      />
      <PengajuanSidangMahasiswa />
    </div>
  );
};

export default withAuth(PengajuanSidangClientPage, "kerja-praktek", "mahasiswa");