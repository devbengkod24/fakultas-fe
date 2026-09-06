import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataProgramUnggulan } from "../../_components/program-unggulan/program-unggulan/table";

const ProgramUnggulan = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          {
            name: "Program Unggulan",
            url: "/admin/publikasi-page/publikasi-ilmiah",
          },
        ]}
        titleItems={[
          {
            title: "Program Unggulan",
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <DataProgramUnggulan />
    </div>
  );
};

export default ProgramUnggulan;
