"use client";

import DashboardHeader from "@/components/dashboard-header";
import ProdiFilterDropdown from "@/components/prodi-filter-dropdown";
import { ProdiFilterProvider } from "@/context/prodiFilterContext";
import { useProfile } from "@/context/profileUseContext";
import DashboardSuperFakultas from "./(dashboard)/super-fakultas";
import DashboardAdmin from "./(dashboard)/admin";
import MahasiswaDashboardClient from "./_components/mahasiswa-dashboard";

const DashboardEWSClient = () => {
  const { profile } = useProfile();

  const role =
    profile?.roles;

  const showProdiFilter = role === "super_fakultas";

  return (
    <ProdiFilterProvider>
      <DashboardHeader
        breadcrumbItems={[
          {
            name: "Dashboard",
            url: "/ews",
          },
        ]}
        titleItems={[
          {
            title: `Selamat Datang, ${profile?.name}`,
            subtitle:
              "Berikut adalah data Early Warning System yang dapat Anda akses.",
          },
        ]}
        titleRightContent={showProdiFilter ? <ProdiFilterDropdown /> : undefined}
      />

      <div className="flex flex-col justify-center">
        {role === "super_fakultas" ? (
          <DashboardSuperFakultas />
        ) : role === "admin" ? (
          <DashboardAdmin />
        ) : role === "mahasiswa" ? (
          <MahasiswaDashboardClient />
        ) : (
          <div className="border rounded-xl p-6">
            <h2 className="font-semibold">
              Early Warning System
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Dashboard belum tersedia untuk role ini.
            </p>
          </div>
        )}
      </div>
    </ProdiFilterProvider>
  );
};

export default DashboardEWSClient;