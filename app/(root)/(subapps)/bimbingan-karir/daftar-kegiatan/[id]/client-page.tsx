"use client";

import DashboardHeader from "@/components/dashboard-header";
import { RoleBk } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";
import KoordinatorDetailKegiatan from "./koordinator";
import MahasiswaDetailKegiatan from "./mahasiswa";
import PengajarDetailKegiatan from "./pengajar";
import withAuth from "@/app/(root)/hoc/withAuth";

const DaftarKegiatanClient = ({ id }: { id: string }) => {
  const { profile } = useProfile();
  const role: RoleBk = profile?.roles as RoleBk;

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/bimbingan-karir" },
          {
            name: "Daftar Kegiatan",
            url: "/bimbingan-karir/daftar-kegiatan",
          },
          {
            name: `Detail Kegiatan`,
            url: "",
          },
        ]}
      />
      <div className="flex flex-col justify-center">
        {role === "koordinator" ? (
          <KoordinatorDetailKegiatan id={id}/>
        ) : role === "pengajar" || role === "dosen" ? (
          <PengajarDetailKegiatan id={id}/>
        ) 
        : (
          <MahasiswaDetailKegiatan id={id}/>
        )}
      </div>
    </div>
  );
};

export default withAuth(DaftarKegiatanClient, "bimbingan-karir", ["koordinator", "admin", "super_fakultas", "admin_fakultas", "mahasiswa", "pengajar", "dosen"]);
