import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataDaftarKoordinator } from "../_components/manajemen-koordinator/table";

const ManajemenKoordinator = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          {
            name: "Manajemen Koordinator",
            url: "/fakultas/manajemen-koordinator",
          },
        ]}
        titleItems={[
          {
            title: "Manajemen Koordinator",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataDaftarKoordinator />
    </div>
  );
};

export default ManajemenKoordinator;
