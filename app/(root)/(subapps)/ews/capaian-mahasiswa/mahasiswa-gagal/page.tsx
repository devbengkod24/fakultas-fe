"use client";

import { useProfile } from "@/context/profileUseContext";
import { useSearchParams } from "next/navigation";
import DashboardHeader from "@/components/dashboard-header";
import SuperFakultasMahasiswaGagalClient from "../../_components/capaian-mahasiswa/super-fakultas-mahasiswa-gagal-client";
import AdminMahasiswaGagalClient from "../../_components/capaian-mahasiswa/admin-mahasiswa-gagal-client";

export default function CapaianMahasiswaMahasiswaGagalPage() {
  const { profile } = useProfile();
  const role = profile?.roles;
  const searchParams = useSearchParams();
  
  const prodiId = searchParams.get("prodi_id");
  const tahunMasuk = searchParams.get("tahun_masuk");

  // Reconstruct URL List Mata Kuliah untuk panah back di Breadcrumb
  const listMkUrlParams = new URLSearchParams();
  if (prodiId) listMkUrlParams.append("prodi_id", prodiId);
  if (tahunMasuk) listMkUrlParams.append("tahun_masuk", tahunMasuk);
  const listMkUrl = `/ews/capaian-mahasiswa/list-matakuliah?${listMkUrlParams.toString()}`;

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

  breadcrumbItems.push({ name: "Capaian Mata Kuliah", url: listMkUrl });
  breadcrumbItems.push({ name: "Daftar Mahasiswa Belum Lulus", url: "#" });

  if (role === "super_fakultas" || role === "admin") {
    return (
      <div>
        <DashboardHeader
          breadcrumbItems={breadcrumbItems}
          titleItems={[
            {
              title: "Daftar Mahasiswa Belum Lulus",
              subtitle: "Detail mahasiswa yang belum mencapai nilai batas lulus pada mata kuliah ini.",
            },
          ]}
        />
        <div className="mt-6">
          {role === "super_fakultas" ? <SuperFakultasMahasiswaGagalClient /> : <AdminMahasiswaGagalClient />}
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