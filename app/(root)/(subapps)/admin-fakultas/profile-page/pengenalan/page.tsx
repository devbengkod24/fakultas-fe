import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { Datapengenalan } from "../../_components/profile-page/table";

const pengenalanPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin-fakultas" },
          {
            name: "Pengenalan Fakultas",
            url: "/admin-fakultas/profile-page/pengenalan",
          },
        ]}
        titleItems={[
          {
            title: "Pengenalan Fakultas",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <Datapengenalan />
    </div>
  );
};

export default pengenalanPage;
