"use client"

import React from "react";
import LogAktivitasDosen from "../_components/log-aktivitas/dosen";
import DashboardHeader from "@/components/dashboard-header";
import LogAktivitasKoordinator from "../_components/log-aktivitas/koordinator";
import withAuth from "@/app/(root)/hoc/withAuth";
import { useProfile } from "@/context/profileUseContext";
import { Role } from "@/types/role";

const LogAktivitasClientPage = () => {
  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;
  const activeRole = role === "super_fakultas" ? "koordinator" : role;
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          { name: "Log Aktivitas", url: "/kerja-praktek/log-aktivitas" },
        ]}
        titleItems={[
          {
          title: "Log Aktivitas",
          subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />

      {activeRole === "koordinator" ? (
        <LogAktivitasKoordinator />
      ) : activeRole === "dosen" ? (
        <LogAktivitasDosen />
      ) : null}
    </div>
  );
};

export default withAuth(LogAktivitasClientPage, "kerja-praktek", ["koordinator", "dosen", "super_fakultas"]);