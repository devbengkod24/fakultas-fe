"use client";

import React from "react";
import DashboardDosen from "../kerja-praktek/(dashboard)/dosen";
import DashboardMahasiswa from "../kerja-praktek/(dashboard)/mahasiswa";
import DashboardHeader from "@/components/dashboard-header";
import DashboardKoordinator from "../kerja-praktek/(dashboard)/koordinator";
import { Role } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { DashboardService } from "@/api/kerja-praktek";

const DashboardKPClient = () => {
  const { profile, activeProdiId } = useProfile();
  const router = useRouter();
  const role: Role = profile?.roles as Role;
  const activeRole = (role === "admin" || role === "super_fakultas" || role === "admin_fakultas") ? "koordinator" : role;

  const { data: kpData } = useSWR(
    activeRole === "koordinator" ? ["dashboard-koordinator", activeProdiId] : null,
    () => DashboardService.getDashboardKoordinator(activeProdiId ?? undefined),
    { revalidateOnFocus: false }
  );

  const activeProdi = profile?.daftar_prodi?.find((p) => p.id === activeProdiId) || profile?.prodi || (kpData?.data?.user?.prodi);

  useEffect(() => {
    // Additional check in component
    if (profile && profile.mahasiswa && profile.mahasiswa.is_completed === false) {
      router.replace("/onboarding");
    }
  }, [profile, router]);

  return (
    <div>
      <DashboardHeader  
        breadcrumbItems={[{ name: "Dashboard", url: "/kerja-praktek" }]}
        titleItems={[
          {
            title: `Selamat Datang, ${profile?.name} di prodi ${activeProdi?.nama ?? ""}`,
            subtitle:
              "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      
      {activeRole === "dosen" ? (
        <DashboardDosen />
      ) : activeRole === "koordinator" ? (
        <DashboardKoordinator />
      ) : (
        <DashboardMahasiswa />
      )}
    </div>
  );
};

export default DashboardKPClient;
