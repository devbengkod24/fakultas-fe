"use client"

import DashboardHeader from "@/components/dashboard-header";
import DaftarMahasiswaKoordinator from '../_components/data-mahasiswa/koordinator';
import withAuth from "@/app/(root)/hoc/withAuth";

const DataMahasiswaClientPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/kerja-praktek" },
          { name: "Mahasiswa", url: "/kerja-praktek" },
          { name: "Data Mahasiswa", url: "/kerja-praktek/data-mahasiswa" },
        ]}
        titleItems={[
          {
            title: "Data Mahasiswa",
            subtitle: "Berikut ini adalah data mahasiswa yang terdaftar",
          },
        ]}
      />
      <DaftarMahasiswaKoordinator />
    </div>
  );
};

export default withAuth(DataMahasiswaClientPage, "kerja-praktek", ["koordinator", "super_fakultas"]);