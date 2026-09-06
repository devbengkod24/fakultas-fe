"use client";

import DashboardHeader from "@/components/dashboard-header";
import React from "react";
import { DosenDataTable } from "./table";
import withAuth from "@/app/(root)/hoc/withAuth";

const KuotaDosenClient = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[{ name: "Dashboard", url: "tugas-akhir" }]}
        titleItems={[
          {
            title: "Kuota Dosen",
            subtitle: "Atur kuota dosen pembimbing tugas akhir",
          },
        ]}
      />
      <DosenDataTable />
    </div>
  );
};

export default withAuth(KuotaDosenClient, "tugas-akhir", ["koordinator", "admin", "super_fakultas"]);
