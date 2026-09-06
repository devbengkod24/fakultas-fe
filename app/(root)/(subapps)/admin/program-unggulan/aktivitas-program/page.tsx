"use client";

import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataAktivitasProgram } from "../../_components/program-unggulan/program-unggulan-aktivitas/table";
import { useProfile } from "@/context/profileUseContext";

const ProgramUnggulanAktivitas = () => {
  const { profile } = useProfile();
  

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin" },
          {
            name: "Program Unggulan Aktivitas",
            url: "/admin/program-unggulan/aktivitas-program",
          },
        ]}
        titleItems={[
          {
            title: `Aktivitas Program Unggulan`,
            subtitle: "Kelola data aktivitas program unggulan sesuai program studi Anda.",
          },
        ]}
      />
      {/* Komponen Table mengambil activeProdiId secara internal dari useProfile */}
      <DataAktivitasProgram />
    </div>
  );
};

export default ProgramUnggulanAktivitas;
