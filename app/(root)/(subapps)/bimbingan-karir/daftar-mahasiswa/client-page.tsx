"use client";

import DashboardHeader from "@/components/dashboard-header";
import { KoordinatorDaftarMahasiswa } from "@/app/(root)/(subapps)/bimbingan-karir/daftar-mahasiswa/koordinator";
import { useProfile } from "@/context/profileUseContext";
import { RoleBk } from "@/types/role";
import { PengajarDaftarMahasiswa } from "./pengajar";
import withAuth from "@/app/(root)/hoc/withAuth";

const DaftarMahasiswaClient = () => {
  const { profile, activeProdiId } = useProfile();
  const role: RoleBk = profile?.roles as RoleBk;
  const isKoordinatorRole = role === "koordinator" || role === "super_fakultas" || role === "admin_fakultas" || role === "admin";

  return (
    <div>
        <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/bimbingan-karir" },
            { name: "Daftar Mahasiswa", url: "/bimbingan-karir/daftar-mahasiswa" },
          ]}
          titleItems={[
            {
              title: "Daftar Mahasiswa",
              subtitle: "Berikut adalah daftar mahasiswa yang terdaftar pada Bimbingan Karir periode ini!",
            },
          ]}
        />
        {isKoordinatorRole ? (
          <KoordinatorDaftarMahasiswa key={activeProdiId} />
        ) : (
          <PengajarDaftarMahasiswa />
        )  }
    </div>
  );
}

export default withAuth(DaftarMahasiswaClient, "bimbingan-karir", ["koordinator", "admin", "super_fakultas", "admin_fakultas", "pengajar", "dosen"]);