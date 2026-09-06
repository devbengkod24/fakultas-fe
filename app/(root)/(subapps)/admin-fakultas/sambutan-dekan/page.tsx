import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataSambutanDekan } from "../_components/sambutan-dekan/table";

const SambutanDekan = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard Fakultas", url: "/admin-fakultas" },
          {
            name: "Sambutan Dekan",
            url: "/admin-fakultas/sambutan-dekan",
          },
        ]}
        titleItems={[
          {
            title: "Sambutan Dekan",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataSambutanDekan />
    </div>
  );
};

export default SambutanDekan;
