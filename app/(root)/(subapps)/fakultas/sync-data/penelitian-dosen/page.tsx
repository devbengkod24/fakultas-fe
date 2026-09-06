import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import EmptyState from "@/components/empty-state";
import { MonitorCheck } from "lucide-react";

const SyncDataPenelitianDosenPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard Fakultas", url: "/fakultas" },
          { name: "Sync Data", url: "/fakultas/sync-data" },
          { name: "Sync Penelitian Dosen", url: "/fakultas/sync-data/penelitian-dosen" },
        ]}
        titleItems={[
          {
            title: "Sinkronisasi Data Penelitian Dosen",
            subtitle: "Sinkronkan data penelitian dosen dengan sistem pusat.",
          },
        ]}
      />
      <div className="mt-4">
        <EmptyState
          icon={MonitorCheck}
          title="Modul Belum Tersedia"
          subtitle="Modul Sinkronisasi Data Penelitian Dosen sedang dalam tahap pengembangan."
          className="h-[400px]"
        />
      </div>
    </div>
  );
};

export default SyncDataPenelitianDosenPage;
