import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataDaftarProdi } from "../../_components/manajemen-prodi/table";

const ManajemenProgramPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard Fakultas", url: "/fakultas" },
          {
            name: "Manajemen Program Studi",
            url: "/fakultas/data-master-prodi/manajemen-prodi",
          },
        ]}
        titleItems={[
          {
            title: "Manajemen Program Studi",
            subtitle: "Kelola data program studi yang ada di fakultas.",
          },
        ]}
      />
      <DataDaftarProdi />
    </div>
  );
};

export default ManajemenProgramPage;