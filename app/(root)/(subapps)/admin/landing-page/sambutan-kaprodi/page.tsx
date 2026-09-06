import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataSambutanKaprodi } from "../../_components/landing-page/sambutan-kaprodi/table";

const SambutanKaprodi = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          {
            name: "Sambutan Kaprodi",
            url: "/admin/landing-page/sambutan-kaprodi",
          },
        ]}
        titleItems={[
          {
            title: "Sambutan Kaprodi",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataSambutanKaprodi />
    </div>
  );
};

export default SambutanKaprodi;
