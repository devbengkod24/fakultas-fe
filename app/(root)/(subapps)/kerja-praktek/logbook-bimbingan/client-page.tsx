"use client"

import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import LogbookBimbinganMahasiswa from "../_components/logbook-bimbingan/mahasiswa";
import withAuth from "@/app/(root)/hoc/withAuth";


const LogbookBimbinganClientPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          {
            name: "Logbook Bimbingan",
            url: "/kerja-praktek/logbook-bimbingan",
          },
        ]}
        titleItems={[
          {
            title: "Daftar Logbook Bimbingan",
            subtitle:
              "Berikut adalah daftar logbook mahasiswa bimbingan.",
          },
        ]}
      />
      <LogbookBimbinganMahasiswa />
    </div>
  );
};

export default withAuth(LogbookBimbinganClientPage, "kerja-praktek", "mahasiswa");