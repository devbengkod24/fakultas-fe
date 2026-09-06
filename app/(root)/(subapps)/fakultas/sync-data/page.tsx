import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import EmptyState from "@/components/empty-state";
import { MonitorCheck } from "lucide-react";

const SyncDataPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          {
            name: "Sync Data",
            url: "/fakultas/sync-data",
          },
        ]}
        titleItems={[
          {
            title: "Sinkronisasi Data",
            subtitle: "Sinkronkan data fakultas dengan sistem pusat.",
          },
        ]}
      />
      <div className="mt-4">
        <EmptyState
          icon={MonitorCheck}
          title="Modul Belum Tersedia"
          subtitle="Modul Sinkronisasi Data sedang dalam tahap pengembangan."
          className="h-[400px]"
        />
      </div>
    </div>
  );
};

export default SyncDataPage;
