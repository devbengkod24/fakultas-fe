"use client";

import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataPublikasiIlmiah } from "@/app/(root)/(subapps)/admin/_components/publikasi-page/publikasi-ilmiah/table";
import withAuth from "@/app/(root)/hoc/withAuth";

const PublikasiIlmiahFakultas = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          {
            name: "Publikasi Ilmiah",
            url: "/fakultas/publikasi-page/publikasi-ilmiah",
          },
        ]}
        titleItems={[
          {
            title: "Publikasi Ilmiah",
            subtitle: "Berikut adalah data publikasi seluruh dosen fakultas.",
          },
        ]}
      />
      <DataPublikasiIlmiah />
    </div>
  );
};

export default withAuth(PublikasiIlmiahFakultas, "fakultas", [
  "super_fakultas",
]);
