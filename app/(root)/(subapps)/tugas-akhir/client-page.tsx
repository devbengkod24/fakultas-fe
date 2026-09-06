"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard-header";
import React from "react";
import DashboardDosen from "./(dashboard)/dosen";
import DashboardKoordinator from "./(dashboard)/koordinator";
import DashboardMahasiswa from "./(dashboard)/mahasiswa";
import { Role } from "@/types/role";
import { useProfile } from "@/context/profileUseContext";
import useSWR from "swr";
import { DashboardService } from "@/api/tugas-akhir";

const DashboardTaClient = () => {
  const { profile, activeProdiId } = useProfile();
  const router = useRouter();
  const role: Role = profile?.roles as Role;
  const activeRole =
    role === "admin" ||
    role === "super_fakultas" ||
    role === "admin_fakultas"
      ? "koordinator"
      : role;

  const { data: taData } = useSWR(
    activeRole === "koordinator" ? ["dashboard-ta-periode"] : null,
    () => DashboardService.getCurrentPeriode(),
    { revalidateOnFocus: false },
  );

  const activeProdi =
    profile?.daftar_prodi?.find((p) => p.id === activeProdiId) ||
    profile?.prodi ||
    taData?.data?.user?.prodi;

  useEffect(() => {
    // Additional check in component
    if (
      profile &&
      profile.mahasiswa &&
      profile.mahasiswa.is_completed === false
    ) {
      router.replace("/onboarding");
    }
  }, [profile, router]);
  return (
    <>
      <DashboardHeader
        breadcrumbItems={[{ name: "Dashboard", url: "tugas-akhir" }]}
        titleItems={[
          {
            title: `Selamat Datang, ${profile?.name} di prodi ${activeProdi?.nama ?? ""}`,
            subtitle: "Berikut adalah data-data yang dapat Anda akses.",
          },
        ]}
      />
      <div className="flex flex-col justify-center">
        {activeRole === "dosen" ? (
          <DashboardDosen />
        ) : activeRole === "koordinator" ? (
          <DashboardKoordinator />
        ) : (
          <DashboardMahasiswa />
        )}
      </div>
    </>
  );
};

export default DashboardTaClient;
