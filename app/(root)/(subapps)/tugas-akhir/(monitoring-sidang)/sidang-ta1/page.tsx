import { Metadata } from "next";
import MahasiswaSidang1Client from "./client-page";
import DashboardHeader from "@/components/dashboard-header";

export const metadata: Metadata = {
  title: "Sidang TA 1 - Tugas Akhir",
};

const MahasiswaSidang1 = () => {
  return (
    <>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/tugas-akhir" },
          {
            name: "Sidang TA 1",
            url: "/tugas-akhir/sidang-ta1",
          },
        ]}
        titleItems={[
          {
            title: "Monitoring Sidang Mahasiswa Tugas Akhir 1",
            subtitle:
              "Berikut ini adalah daftar mahasiswa yang mengajukan sidang Tugas Akhir 1",
          },
        ]}
      />
      <MahasiswaSidang1Client />
    </>
  );
};

export default MahasiswaSidang1;
