import DashboardHeader from "@/components/dashboard-header";
import { DataRuanganSidang } from "../_components/ruangan-sidang/table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ruangan Sidang",
  description: "Kelola ruangan sidang yang tersedia di fakultas.",
};

export default function RuanganSidangPage() {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin-fakultas" },
          { name: "Ruangan Sidang", url: "/admin-fakultas/ruangan-sidang" },
        ]}
        titleItems={[
          {
            title: "Ruangan Sidang",
            subtitle:
              "Kelola daftar ruangan yang dapat digunakan untuk plot jadwal sidang.",
          },
        ]}
      />
      <DataRuanganSidang />
    </div>
  );
}
