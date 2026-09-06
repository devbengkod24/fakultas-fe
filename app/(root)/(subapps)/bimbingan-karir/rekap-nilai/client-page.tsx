"use client";

import DashboardHeader from "@/components/dashboard-header";
import { Role } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";
import { KoordinatorRekapNilai } from "./koordinator";
import { MahasiswaRekapNilai } from "./mahasiswa";
import withAuth from "@/app/(root)/hoc/withAuth";

const RekapNilaiClient = () => {
  const { profile, activeProdiId } = useProfile();
  const role: Role = profile?.roles as Role;
  const isKoordinatorRole = role === "koordinator" || role === "super_fakultas" || role === "admin_fakultas" || role === "admin";

  return (
    <div>
      <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/bimbingan-karir" },
            { name: "Rekap Nilai", url: "/bimbingan-karir/rekap-kegiatan" },
          ]}
          titleItems={[
            {
              title: "Rekap Nilai",
              subtitle: "Berikut adalah rekap nilai kegiatan Bimbingan Karir!",
            },
          ]}
      />
      <div className="flex flex-col justify-center">
        {isKoordinatorRole ? (
          <KoordinatorRekapNilai key={activeProdiId} />
        ) : (
          <MahasiswaRekapNilai />
        )}
      </div>
    </div>
  );
};

export default withAuth(RekapNilaiClient, "bimbingan-karir", ["koordinator", "admin", "super_fakultas", "admin_fakultas", "mahasiswa"]);
