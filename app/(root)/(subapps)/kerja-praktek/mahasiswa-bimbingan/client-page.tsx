"use client";

import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import MahasiswaBimbinganDosen from "../_components/mahasiswa-bimbingan/dosen";
import MahasiswaBimbinganKoordinator from "../_components/mahasiswa-bimbingan/koordinator";
import { Role } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";
import withAuth from "@/app/(root)/hoc/withAuth";

const MahasiswaBimbinganClientPage = () => {
  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;
  // Map super_fakultas / admin_fakultas / admin to the koordinator view since
  // they share the same endpoint and permissions on this page.
  const activeRole =
    role === "admin" || role === "super_fakultas" || role === "admin_fakultas"
      ? "koordinator"
      : role;

  // Breadcrumb mengikuti struktur sidebar per-role:
  // - koordinator: Dashboard > Mahasiswa > Daftar Pengajuan (Mahasiswa adalah submenu)
  // - dosen: Dashboard > Mahasiswa Bimbingan (top-level menu)
  const breadcrumbItems =
    activeRole === "koordinator"
      ? [
          { name: "Dashboard", url: "/kerja-praktek" },
          { name: "Mahasiswa", url: "/kerja-praktek" },
          {
            name: "Daftar Pengajuan",
            url: "/kerja-praktek/mahasiswa-bimbingan",
          },
        ]
      : [
          { name: "Dashboard", url: "/kerja-praktek" },
          {
            name: "Mahasiswa Bimbingan",
            url: "/kerja-praktek/mahasiswa-bimbingan",
          },
        ];

  // Title section berbeda per-role agar sesuai konteks sidebar.
  const titleItems =
    activeRole === "koordinator"
      ? [
          {
            title: "Daftar Pengajuan Mahasiswa Bimbingan",
            subtitle:
              "Berikut ini adalah daftar semua pengajuan mahasiswa bimbingan ke dosen pembimbing.",
          },
        ]
      : [
          {
            title: "Mahasiswa Bimbingan",
            subtitle:
              "Berikut adalah daftar mahasiswa bimbingan yang menjadi tanggung jawab Anda sebagai dosen pembimbing.",
          },
        ];

  return (
    <div className="mb-4">
      <DashboardHeader
        breadcrumbItems={breadcrumbItems}
        titleItems={titleItems}
      />

      {activeRole === "koordinator" && <MahasiswaBimbinganKoordinator />}
      {activeRole === "dosen" && <MahasiswaBimbinganDosen />}
    </div>
  );
};

export default withAuth(MahasiswaBimbinganClientPage, "kerja-praktek", [
  "dosen",
  "koordinator",
  "super_fakultas",
]);
