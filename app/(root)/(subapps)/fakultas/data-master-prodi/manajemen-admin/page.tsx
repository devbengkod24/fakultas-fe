import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataDaftarAdmin } from "../../_components/manajemen-admin/table";

const ManajemenAdmin = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          {
            name: "Manajemen Admin",
            url: "/fakultas/data-master-prodi/manajemen-admin",
          },
        ]}
        titleItems={[
          {
            title: "Manajemen Admin",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataDaftarAdmin />
    </div>
  );
};

export default ManajemenAdmin;