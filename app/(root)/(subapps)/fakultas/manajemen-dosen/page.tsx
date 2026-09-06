import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { TableDosen } from "../_components/manajemen-dosen/table";

const ManajemenDosenPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          {
            name: "Manajemen Dosen",
            url: "/fakultas/manajemen-dosen",
          },
        ]}
        titleItems={[
          {
            title: "Manajemen Dosen",
            subtitle: "Kelola data dosen yang ada di tingkat fakultas.",
          },
        ]}
      />
      <div className="mt-4">
        <TableDosen />
      </div>
    </div>
  );
};

export default ManajemenDosenPage;
