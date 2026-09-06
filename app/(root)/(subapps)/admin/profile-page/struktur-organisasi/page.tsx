import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataStrukturOrganisasi } from "../../_components/profile-page/struktur-organisasi/table";

const StrukturOrganisasi = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          {
            name: "Struktur Organisasi",
            url: "/admin/profile-page/struktur-organisasi",
          },
        ]}
        titleItems={[
          {
            title: "Struktur Organisasi Program Studi",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataStrukturOrganisasi />
    </div>
  );
};

export default StrukturOrganisasi;
