import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataDaftarMataKuliah } from "../../_components/sync-data/mata-kuliah/table";
// import { DataDaftarKoordinator } from "../_components/manajemen-koordinator/table";

const SyncMataKuliah = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          { name: "Sync Data", url: "/fakultas/sync-data" },
          {
            name: "Mata Kuliah",
            url: "/fakultas/sync-data/mata-kuliah",
          },
        ]}
        titleItems={[
          {
            title: "Sinkronisasi Data Mata Kuliah",
            subtitle: "Sinkronkan data KRS mahasiswa fakultas dengan sistem pusat.",
          },
        ]}
      />
      
      <DataDaftarMataKuliah />
    </div>
  );
};

export default SyncMataKuliah;
