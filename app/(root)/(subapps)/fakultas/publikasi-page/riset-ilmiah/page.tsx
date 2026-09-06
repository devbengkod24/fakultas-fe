"use client";

import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataRisetIlmiah } from "@/app/(root)/(subapps)/admin/_components/publikasi-page/riset-ilmiah/table";
import withAuth from "@/app/(root)/hoc/withAuth";

const RisetIlmiahFakultas = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          {
            name: "Riset Ilmiah",
            url: "/fakultas/publikasi-page/riset-ilmiah",
          },
        ]}
        titleItems={[
          {
            title: "Riset Ilmiah",
            subtitle: "Berikut adalah data riset seluruh dosen fakultas.",
          },
        ]}
      />
      <DataRisetIlmiah />
    </div>
  );
};

export default withAuth(RisetIlmiahFakultas, "fakultas", [
  "super_fakultas",
]);
