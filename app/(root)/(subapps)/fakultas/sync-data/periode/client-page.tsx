"use client";

import DashboardHeader from "@/components/dashboard-header";
import TableSyncPeriode from "./table";
import withAuth from "@/app/(root)/hoc/withAuth";

function SyncDataPeriodeClientPage() {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          { name: "Sync Data", url: "/fakultas/sync-data" },
          { name: "Periode", url: "/fakultas/sync-data/periode" },
        ]}
        titleItems={[
          {
            title: "Sinkronisasi Data Periode",
            subtitle: "Sinkronkan data periode fakultas dengan sistem pusat.",
          },
        ]}
      />
      <div className="flex flex-col justify-center space-y-4 mt-4">
        <TableSyncPeriode />
      </div>
    </div>
  );
}

export default withAuth(SyncDataPeriodeClientPage, "fakultas", ["super_fakultas"]);
