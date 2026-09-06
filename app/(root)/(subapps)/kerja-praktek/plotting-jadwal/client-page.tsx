"use client"

import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import PlottingJadwalKoordinator from "../_components/plotting-jadwal/koordinator";
import withAuth from "@/app/(root)/hoc/withAuth";

const PlottingJadwalClientPage = () => {
  return (
    <div className="px-3 sm:px-0">
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          { name: "Sidang KP", url: "/kerja-praktek/sidang" },
          { name: "Plotting Jadwal", url: "/kerja-praktek/sidang/plotting-jadwal", },
        ]}
        titleItems={[
          {
            title: "Plotting Jadwal Sidang",
            subtitle:
              "Atur jadwal sidang sebelum hasil sidang ditampilkan.",
          },
        ]}
      />

      <PlottingJadwalKoordinator />
    </div>
  );
};

export default withAuth(PlottingJadwalClientPage, "kerja-praktek", ["koordinator", "super_fakultas"]);