"use client";

import { useProfile } from "@/context/profileUseContext";
import DashboardHeader from "@/components/dashboard-header";
import SuperFakultasCapaianDashboard from "../_components/capaian-mahasiswa/super-fakultas-capaian-dashboard";
import AdminCapaianDashboard from "../_components/capaian-mahasiswa/admin-capaian-dashboard";
import { CapaianProdiProvider, useCapaianProdi } from "@/context/capaianProdiContext";
import ProdiSelect from "@/components/prodi-select";

const ProdiSelectWithContext = () => {
  const { selectedProdiId, setSelectedProdiId } = useCapaianProdi();
  return <ProdiSelect value={selectedProdiId} onChange={setSelectedProdiId} />;
};

export default function CapaianMahasiswaPage() {
  const { profile } = useProfile();
  const role = profile?.roles;

  if (role === "super_fakultas" || role === "admin") {
    return (
      <CapaianProdiProvider>
        <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/ews" },
            { name: "Capaian Mahasiswa", url: "/ews/capaian-mahasiswa" },
          ]}
          titleItems={[
            {
              title: "Capaian Mahasiswa",
              subtitle: "Pantau persentase tingkat kelulusan mata kuliah mahasiswa.",
            },
          ]}
          titleRightContent={role === "super_fakultas" ? <ProdiSelectWithContext /> : undefined}
        />
        <div className="mt-6">
          {role === "super_fakultas" ? <SuperFakultasCapaianDashboard /> : <AdminCapaianDashboard />}
        </div>
      </CapaianProdiProvider>
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