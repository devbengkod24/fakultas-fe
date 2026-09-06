"use client";

import DashboardHeader from "@/components/dashboard-header";
import GelombangKoordinator from "./koordinator";
import withAuth from "@/app/(root)/hoc/withAuth";

const GelombangPage = () => {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/tugas-akhir" },
          { name: "Gelombang Sidang", url: "/tugas-akhir/gelombang" },
        ]}
        titleItems={[
          {
            title: "Gelombang Sidang",
            subtitle:
              "Kelola gelombang sidang Tugas Akhir 1 dan Tugas Akhir 2.",
          },
        ]}
      />
      <GelombangKoordinator />
    </div>
  );
};

export default withAuth(GelombangPage, "tugas-akhir", ["koordinator", "admin", "super_fakultas"]);
