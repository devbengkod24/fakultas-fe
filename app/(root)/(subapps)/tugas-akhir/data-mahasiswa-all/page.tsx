"use client";

import DashboardHeader from "@/components/dashboard-header";
import MahasiswaTable from "./table";

const DataAllMahasiswa = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "tugas-akhir" },
          { name: "Data Mahasiswa", url: "tugas-akhir/data-mahasiswa-all" },
        ]}
        titleItems={[
          {
            title: "Data Seluruh Mahasiswa",
            subtitle: "Berikut ini adalah data seluruh mahasiswa yang terdaftar",
          },
        ]}
      />
      <MahasiswaTable />
    </div>
  );
};

export default DataAllMahasiswa;
