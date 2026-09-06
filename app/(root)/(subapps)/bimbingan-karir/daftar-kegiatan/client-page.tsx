"use client";

import DashboardHeader from "@/components/dashboard-header";
import { RoleBk } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";
import KoordinatorListKegiatan from "./koordinator";
import MahasiswaListKegiatan from "./mahasiswa";
import PengajarListKegiatan from "./pengajar";
import withAuth from "@/app/(root)/hoc/withAuth";

const DaftarKegiatanClient = () => {
  const { profile, activeProdiId } = useProfile();
  const role: RoleBk = profile?.roles as RoleBk;
  const isKoordinatorRole = role === "koordinator" || role === "super_fakultas" || role === "admin_fakultas" || role === "admin";

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/bimbingan-karir" },
          {
            name: "Daftar Kegiatan",
            url: "/bimbingan-karir/daftar-kegiatan",
          },
        ]}
        titleItems={[
          {
            title: "Daftar Kegiatan",
            subtitle:
              "Berikut adalah daftar kegiatan Bimbingan Karir periode ini!",
          },
        ]}
      />
      <div className="flex flex-col justify-center">
        {isKoordinatorRole ? (
          <KoordinatorListKegiatan key={activeProdiId} />
        ) : role === "pengajar" || role === "dosen" ? (
          <PengajarListKegiatan />
        ) : (
          <MahasiswaListKegiatan />
        )}
      </div>
    </div>
  );
};

export default withAuth(DaftarKegiatanClient, "bimbingan-karir", ["koordinator", "admin", "super_fakultas", "admin_fakultas", "mahasiswa", "pengajar", "dosen"]);
