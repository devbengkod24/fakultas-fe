import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataPeminatan } from "../../_components/akademik-page/peminatan/table";

const PeminatanPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          {
            name: "Daftar Peminatan",
            url: "/admin/akademik-page/mata-kuliah-peminatan",
          },
        ]}
        titleItems={[
          {
            title: "Daftar Peminatan",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataPeminatan />
    </div>
  );
};

export default PeminatanPage;
