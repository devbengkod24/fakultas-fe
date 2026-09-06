import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataMataKuliahPeminatan } from "../../_components/akademik-page/mata-kuliah-peminatan/table";

const MataKuliahPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          {
            name: "Daftar Mata Kuliah Peminatan",
            url: "/admin/akademik-page/mata-kuliah-peminatan",
          },
        ]}
        titleItems={[
          {
            title: "Daftar Mata Kuliah Peminatan",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataMataKuliahPeminatan />
    </div>
  );
};

export default MataKuliahPage;
