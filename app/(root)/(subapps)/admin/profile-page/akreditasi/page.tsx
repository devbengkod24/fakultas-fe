import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataAkreditasi } from "../../_components/profile-page/akreditasi/table";

const AkreditasiPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          {
            name: "Akreditasi Program Studi",
            url: "/admin/profile-page/akreditasi",
          },
        ]}
        titleItems={[
          {
            title: "Akreditasi Program Studi",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataAkreditasi />
    </div>
  );
};

export default AkreditasiPage;
