import { Metadata } from "next";
import DashboardHeader from "@/components/dashboard-header";
import StatistikKelulusanClient from "../_components/statistik-kelulusan/statistik-kelulusan-list";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Statistik Kelulusan EWS",
  description: "Statistik Kelulusan per Prodi - Early Warning System",
};

export default async function StatistikKelulusanPage() {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/ews" },
          { name: "Statistik Kelulusan", url: "/ews/statistik-kelulusan" },
        ]}
        titleItems={[
          {
            title: "Statistik Kelulusan",
            subtitle: "Monitoring eligible kelulusan mahasiswa berdasarkan syarat akademik Fakultas.",
          },
        ]}
      />
      <div className="mt-6">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]">Loading...</div>}>
          <StatistikKelulusanClient />
        </Suspense>
      </div>
    </div>
  );
}