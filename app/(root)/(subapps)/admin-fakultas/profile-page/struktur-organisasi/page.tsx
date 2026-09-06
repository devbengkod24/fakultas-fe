import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataStrukturOrganisasi } from "../../_components/struktur-organisasi/table";

const strukturOrganisasiPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin-fakultas" },
          {
            name: "Struktur Organisasi",
            url: "/admin-fakultas/profile-page/struktur-organisasi",
          },
        ]}
        titleItems={[
          {
            title: "Struktur Organisasi Fakultas",
            subtitle: "Berikut adalah data struktur organisasi yang dapat Anda akses.",
          },
        ]}
      />
      <DataStrukturOrganisasi />
    </div>
  );
};

export default strukturOrganisasiPage;
