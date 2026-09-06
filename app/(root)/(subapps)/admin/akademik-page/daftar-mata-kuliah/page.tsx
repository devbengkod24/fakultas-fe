import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataMataKuliah } from "../../_components/akademik-page/daftar-mata-kuliah/table";

const DaftarMataKuliah = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          {
            name: "Daftar Mata Kuliah",
            url: "/admin/akademik-page/daftar-mata-kuliah",
          },
        ]}
        titleItems={[
          {
            title: "Daftar Mata Kuliah",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataMataKuliah />
    </div>
  );
};

export default DaftarMataKuliah;
