import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataPengumumanProgram } from "../../_components/program-unggulan/pengumuman-program/table";

const PengumumanProgram = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          {
            name: "Pengumuman Program",
            url: "/admin/program-unggulan/pengumuman-program",
          },
        ]}
        titleItems={[
          {
            title: "Pengumuman Program",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataPengumumanProgram />
    </div>
  );
};

export default PengumumanProgram;
