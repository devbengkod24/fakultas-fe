import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataVisiMisi } from "../../_components/visi-misi/table";

const VisiMisiPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin-fakultas" },
          {
            name: "Visi Misi Fakultas",
            url: "/admin-fakultas/profile-page/visi-misi",
          },
        ]}
        titleItems={[
          {
            title: "Visi Misi Fakultas",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataVisiMisi />
    </div>
  );
};

export default VisiMisiPage;
