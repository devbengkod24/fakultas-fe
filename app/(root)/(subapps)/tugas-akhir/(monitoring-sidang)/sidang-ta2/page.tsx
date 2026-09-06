import { Metadata } from "next";
import MahasiswaSidang2Client from "./client-page";
import DashboardHeader from "@/components/dashboard-header";

export const metadata: Metadata = {
  title: "Sidang TA 2 - Tugas Akhir",
};

const MahasiswaSidang2 = () => {
  return (
    <>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/tugas-akhir" },
          {
            name: "Sidang TA 2",
            url: "/tugas-akhir/sidang-ta2",
          },
        ]}
        titleItems={[
          {
            title: "Monitoring Sidang Mahasiswa Tugas Akhir 2",
            subtitle:
              "Berikut ini adalah daftar mahasiswa yang mengajukan sidang Tugas Akhir 2",
          },
        ]}
      />
      <MahasiswaSidang2Client />
    </>
  );
};

export default MahasiswaSidang2;
