import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataRisetIlmiah } from "../../_components/publikasi-page/riset-ilmiah/table";

const RisetIlmiah = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          {
            name: "Riset Ilmiah",
            url: "/admin/publikasi-page/riset-ilmiah",
          },
        ]}
        titleItems={[
          {
            title: "Riset Ilmiah",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataRisetIlmiah />
    </div>
  );
};

export default RisetIlmiah;
