"use client";

import DashboardHeader from "@/components/dashboard-header";
import PeriodeTable from "../_components/periode-ajaran/periode";
import withAuth from "@/app/(root)/hoc/withAuth";

const PeriodeClientPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[{ name: "Dashboard", url: "tugas-akhir" }]}
        titleItems={[
          {
            title: "Periode Ajaran",
            subtitle:
              "Berikut data periode yang sinkron dengan database tahun ajaran pada SIADIN",
          },
        ]}
      />
      <PeriodeTable />
    </div>
  );
};

export default withAuth(PeriodeClientPage, "tugas-akhir", ["koordinator", "admin", "super_fakultas"]);
