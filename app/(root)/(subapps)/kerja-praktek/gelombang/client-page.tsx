"use client"

import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import GelombangKoordinator from "../_components/gelombang/koordinator";
import withAuth from "@/app/(root)/hoc/withAuth";


const GelombangClientPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          {
            name: "Gelombang Sidang",
            url: "/kerja-praktek/gelombang",
          },
        ]}
        titleItems={[
          {
            title: "Gelombang Sidang",
            subtitle:
              "Berikut data gelombang sidang yang telah dibuat.",
          },
        ]}
      />

      <GelombangKoordinator />
    </div>
  );
};

export default withAuth(GelombangClientPage, "kerja-praktek", ["koordinator", "super_fakultas"]);