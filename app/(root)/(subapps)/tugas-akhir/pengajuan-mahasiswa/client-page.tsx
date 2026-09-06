"use client";

import { Role } from "@/types/role";
import KoordinatorPengajuanMahasiswa from "./koordinator";
import DosenPengajuanMahasiswa from "./dosen";
import { useProfile } from "@/context/profileUseContext";
import DashboardHeader from "@/components/dashboard-header";
import PengajuanMahasiswa from "./mahasiswa";

const PengajuanMahasiswaClient = () => {
  const { profile } = useProfile();
  const role: Role = profile?.roles as Role;

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/tugas-akhir" },
          {
            name: "Pengajuan Mahasiswa",
            url: "/tugas-akhir/pengajuan-mahasiswa",
          },
        ]}
        titleItems={[
          {
            title:
              role === "mahasiswa"
                ? "Pengajuan Tugas Akhir"
                : "Daftar Pengajuan Mahasiswa Bimbingan",
            subtitle:
              role === "mahasiswa"
                ? "Ajukan proposal tugas akhir Anda untuk mendapatkan persetujuan dosen pembimbing"
                : "Berikut ini adalah daftar semua pengajuan mahasiswa bimbingan ke dosen pembimbing",
          },
        ]}
      />
      <div className="flex flex-col justify-center">
        {role === "dosen" ? (
          <DosenPengajuanMahasiswa />
        ) : role === "koordinator" ||
          role === "admin" ||
          role === "super_fakultas" ? (
          <KoordinatorPengajuanMahasiswa />
        ) : (
          <PengajuanMahasiswa />
        )}
      </div>
    </div>
  );
};

export default PengajuanMahasiswaClient;
