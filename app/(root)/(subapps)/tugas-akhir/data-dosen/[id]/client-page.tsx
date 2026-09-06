"use client";

import DashboardHeader from "@/components/dashboard-header";
import { DosenHeader } from "./header";
import { DosenInfoCard } from "./info-card";
import { KuotaCard } from "./kuota-card";
import { MahasiswaBimbinganTable } from "./mahasiswa-bimbingan-table";

interface DosenDetailClientPageProps {
  dosenId: string;
}

export default function DosenDetailClientPage({
  dosenId,
}: DosenDetailClientPageProps) {
  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[{ name: "Dashboard", url: "tugas-akhir" }]}
      />
      <DosenHeader dosenId={dosenId} />
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <DosenInfoCard dosenId={dosenId} />
        <KuotaCard dosenId={dosenId} />
      </div>
      <MahasiswaBimbinganTable dosenId={dosenId} />
    </div>
  );
}
