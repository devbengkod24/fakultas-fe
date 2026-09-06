"use client"

import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import PeriodeKoordinator from "../_components/periode/koordinator";
import withAuth from "@/app/(root)/hoc/withAuth";

const PeriodeClientPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          {
            name: "Periode KP",
            url: "/kerja-praktek/gelombang",
          },
        ]}
        titleItems={[
          {
            title: "Periode KP",
            subtitle:
              "Berikut data Periode KP yang telah dibuat.",
          },
        ]}
      />

      <PeriodeKoordinator />
    </div>
  );
};

export default withAuth(PeriodeClientPage, "kerja-praktek", ["koordinator", "super_fakultas"]);