import DashboardHeader from "@/components/dashboard-header";
import { DataFasilitas } from "../_components/fasilitas/table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Fasilitas Fakultas",
  description: "Dashboard untuk mengelola fasilitas fakultas.",
};

export default function FasilitasPage() {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/admin-fakultas" },
          { name: "Fasilitas Fakultas", url: "/admin-fakultas/fasilitas" },
        ]}
        titleItems={[
          {
            title: "Fasilitas Fakultas",
            subtitle: "Berikut adalah daftar fasilitas yang ada di Fakultas.",
          },
        ]}
      />
      <DataFasilitas />
    </div>
  );
}
