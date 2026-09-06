import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataPengertian } from "../../_components/profile-page/pengertian/table";

const PengertianPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          {
            name: "Pengertian Program Studi",
            url: "/admin/profile-page/pengertian",
          },
        ]}
        titleItems={[
          {
            title: "Pengertian Program Studi",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataPengertian />
    </div>
  );
};

export default PengertianPage;
