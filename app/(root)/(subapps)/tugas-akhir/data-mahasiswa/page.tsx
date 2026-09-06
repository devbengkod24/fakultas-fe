"use client";

import DashboardHeader from "@/components/dashboard-header";
import MahasiswaTable from "./table";

const DataMahasiswa = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[{ name: "Dashboard", url: "tugas-akhir" }]}
        titleItems={[
          {
            title: "Data Mahasiswa Tugas Akhir",
            subtitle: "Berikut ini adalah data mahasiswa terdaftar belum lulus",
          },
        ]}
      />
      <MahasiswaTable />
    </div>
  );
};

export default DataMahasiswa;
