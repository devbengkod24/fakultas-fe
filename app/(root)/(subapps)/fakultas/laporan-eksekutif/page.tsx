import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import EmptyState from "@/components/empty-state";
import { FileBarChart } from "lucide-react";

const LaporanEksekutifPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          {
            name: "Laporan Eksekutif",
            url: "/fakultas/laporan-eksekutif",
          },
        ]}
        titleItems={[
          {
            title: "Laporan Eksekutif",
            subtitle:
              "Laporan eksekutif untuk pimpinan fakultas.",
          },
        ]}
      />
      <div className="mt-4">
        <EmptyState
          icon={FileBarChart}
          title="Pilih Program Studi"
          subtitle="Silakan pilih program studi dari menu sidebar untuk melihat laporan eksekutif."
          className="h-[400px]"
        />
      </div>
    </div>
  );
};

export default LaporanEksekutifPage;
