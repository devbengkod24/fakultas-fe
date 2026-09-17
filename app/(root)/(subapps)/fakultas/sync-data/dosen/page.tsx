"use client";

import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import withAuth from "@/app/(root)/hoc/withAuth";
import { TableSyncDosen } from "./_components/table";

const SyncDataDosenPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          { name: "Sync Data", url: "/fakultas/sync-data" },
          { name: "Dosen", url: "/fakultas/sync-data/dosen" },
        ]}
        titleItems={[
          {
            title: "Sinkronisasi Data Dosen",
            subtitle: "Sinkronkan data dosen fakultas dengan sistem pusat.",
          },
        ]}
      />
      <div className="mt-4">
        <TableSyncDosen />
      </div>
    </div>
  );
};

export default withAuth(SyncDataDosenPage, "fakultas", ["super_fakultas"]);
