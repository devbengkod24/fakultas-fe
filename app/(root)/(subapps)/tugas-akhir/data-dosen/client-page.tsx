"use client";

import DashboardHeader from "@/components/dashboard-header";
import TableDataDosen from "./table";
import withAuth from "@/app/(root)/hoc/withAuth";

function DataDosenClientPage() {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[{ name: "Dashboard", url: "tugas-akhir" }]}
        titleItems={[
          {
            title: "Data Dosen Pembimbing",
            subtitle: "Kelola data dosen pembimbing Tugas Akhir",
          },
        ]}
      />
      <div className="flex flex-col justify-center space-y-4">
        <TableDataDosen />
      </div>
    </div>
  );
}

export default withAuth(DataDosenClientPage, "tugas-akhir", ["koordinator", "admin", "super_fakultas"]);
