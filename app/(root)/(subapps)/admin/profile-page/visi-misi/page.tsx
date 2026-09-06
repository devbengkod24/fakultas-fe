import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataVisiMisi } from "../../_components/profile-page/visi-misi/table";

const VisiMisiPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          {
            name: "Visi Misi Program Studi",
            url: "/admin/profile-page/visi-misi",
          },
        ]}
        titleItems={[
          {
            title: "Visi Misi Program Studi",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataVisiMisi />
    </div>
  );
};

export default VisiMisiPage;
