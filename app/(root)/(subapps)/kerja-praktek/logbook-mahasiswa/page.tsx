"use client"

import LogbookMahasiswaKoordinator from '../_components/logbook-mahasiswa/koordinator'
import DashboardHeader from "@/components/dashboard-header"
import { Role } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";
import LogbookMahasiswaDosen from '../_components/logbook-mahasiswa/dosen';
import withAuth from "@/app/(root)/hoc/withAuth";

const LogbookMahasiswa = () => {
  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;
  const activeRole = role === "super_fakultas" ? "koordinator" : role;

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          {
            name: "Logbook Mahasiswa",
            url: "/kerja-praktek/logbook-mahasiswa",
          },
        ]}
        titleItems={[
          {
            title: "Daftar Logbook Mahasiswa",
            subtitle: "Berikut adalah daftar logbook mahasiswa bimbingan.",
          },
        ]}
      />

      {activeRole === "koordinator" ? (
        <LogbookMahasiswaKoordinator />
      ) : activeRole === "dosen" ? (
        <LogbookMahasiswaDosen />
      ) : null}
    </div>
  )
}

export default withAuth(LogbookMahasiswa, "kerja-praktek", ["dosen", "koordinator", "super_fakultas"]);
