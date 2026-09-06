"use client"

import LogbookMahasiswaKoordinator from '../_components/logbook-mahasiswa/koordinator'
import DashboardHeader from "@/components/dashboard-header"
import { Role } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";
import LogbookMahasiswaDosen from '../_components/logbook-mahasiswa/dosen';
import withAuth from "@/app/(root)/hoc/withAuth";

const LogbookMahasiswaClientPage = () => {
  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;

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

      {role === "koordinator" || role === "super_fakultas" ? (
        <LogbookMahasiswaKoordinator />
      ) : role === "dosen" ? (
        <LogbookMahasiswaDosen />
      ) : null}
    </div>
  )
}

export default withAuth(LogbookMahasiswaClientPage, "kerja-praktek", ["dosen", "koordinator", "super_fakultas"]);