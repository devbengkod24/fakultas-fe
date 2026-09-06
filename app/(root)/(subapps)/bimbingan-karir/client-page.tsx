"use client";

import DashboardHeader from "@/components/dashboard-header";
import { Role } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";
import KoordinatorDashboard from "./(dashboard)/koordinator";
import MahasiswaDashboard from "./(dashboard)/mahasiswa";
import PengajarDashboard from "./(dashboard)/pengajar";
import { ProdiSwitcher } from "@/components/prodi-switcher";
import withAuth from "@/app/(root)/hoc/withAuth";

const DashboardBKClient = () => {
  const { profile, activeProdiId } = useProfile();
  const role: Role = profile?.roles as Role;
  const activeRole = (role === "admin" || role === "super_fakultas" || role === "admin_fakultas") ? "koordinator" : role;
  const isSuperFak = role === "super_fakultas" && (profile?.daftar_prodi?.length ?? 0) > 1;

  return (
    <div>
      <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/bimbingan-karir" },
          ]}
          titleItems={[
            {
              title: `Selamat Datang, ${profile?.name}`,
              subtitle: "Berikut adalah data-data yang dapat Anda akses.",
            },
          ]}
      />
      <div className="flex flex-col justify-center">
        {activeRole === "koordinator" ? (
          <KoordinatorDashboard prodiId={activeProdiId} />
        ) : activeRole === "pengajar" ? (
          <PengajarDashboard prodiId={activeProdiId} />
        ) : (
          <MahasiswaDashboard />
        )}
      </div>
    </div>
  );
};

export default withAuth(DashboardBKClient, "bimbingan-karir", ["koordinator", "admin", "super_fakultas", "admin_fakultas", "mahasiswa", "pengajar", "dosen"]);
