import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataPublikasiIlmiah } from "../../_components/publikasi-page/publikasi-ilmiah/table";

const PublikasiIlmiah = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          {
            name: "Publikasi Ilmiah",
            url: "/admin/publikasi-page/publikasi-ilmiah",
          },
        ]}
        titleItems={[
          {
            title: "Publikasi Ilmiah",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataPublikasiIlmiah />
    </div>
  );
};

export default PublikasiIlmiah;
