"use client";

import { useProfile } from "@/context/profileUseContext";
import { useSearchParams } from "next/navigation";
import DashboardHeader from "@/components/dashboard-header";
import SuperFakultasListMatakuliahClient from "../../_components/capaian-mahasiswa/super-fakultas-list-matakuliah-client";
import AdminListMatakuliahClient from "../../_components/capaian-mahasiswa/admin-list-matakuliah-client";

export default function CapaianMahasiswaListMatakuliahPage() {
  const { profile } = useProfile();
  const role = profile?.roles;
  const searchParams = useSearchParams();
  const prodiId = searchParams.get("prodi_id");

  const breadcrumbItems = [
    { name: "Dashboard", url: "/ews" },
    { name: "Capaian Mahasiswa", url: "/ews/capaian-mahasiswa" },
  ];

  if (role === "super_fakultas" && prodiId) {
    breadcrumbItems.push({
      name: "Detail Capaian Prodi",
      url: `/ews/capaian-mahasiswa/detail?prodi_id=${prodiId}`,
    });
  }

  breadcrumbItems.push({ name: "Capaian Mata Kuliah", url: "#" });

  if (role === "super_fakultas" || role === "admin") {
    return (
      <div>
        <DashboardHeader
          breadcrumbItems={breadcrumbItems}
          titleItems={[
            {
              title: "Capaian Mata Kuliah",
              subtitle: "Persentase kelulusan mahasiswa pada tiap mata kuliah.",
            },
          ]}
        />
        <div className="mt-6">
          {role === "super_fakultas" ? <SuperFakultasListMatakuliahClient /> : <AdminListMatakuliahClient />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800">Akses Ditolak</h2>
        <p className="text-gray-500 mt-2">Anda tidak memiliki akses ke halaman ini.</p>
      </div>
    </div>
  );
}