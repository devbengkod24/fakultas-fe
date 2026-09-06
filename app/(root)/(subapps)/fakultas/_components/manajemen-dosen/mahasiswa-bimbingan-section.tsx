"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { StatsCard } from "./stats-card";
import { StudentTable } from "./student-table";

interface MahasiswaBimbinganSectionProps {
  stats: {
    total_mhs_saat_ini: number;
    jumlah_lulusan: number;
    lulus_persen: string;
    kuota_ta_baru: number;
  };
  students: {
    id: number;
    nama: string;
    nim: string;
    prodi: string;
    judul_ta: string;
    status: "Bimbingan" | "Lulus";
  }[];
}

export function MahasiswaBimbinganSection({
  stats,
  students,
}: MahasiswaBimbinganSectionProps) {
  return (
    <Card className="rounded-xl shadow-sm border border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-slate-600" />
          <span>Mahasiswa Bimbingan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Mahasiswa Aktif"
            value={stats.total_mhs_saat_ini}
            icon="active"
            isMain={true}
          />
          <StatsCard
            title="Lulusan"
            value={stats.jumlah_lulusan}
            icon="graduated"
          />
          <StatsCard
            title="Tingkat Kelulusan"
            value={`${stats.lulus_persen}%`}
            icon="percentage"
          />
          <StatsCard
            title="Kuota TA Baru"
            value={stats.kuota_ta_baru}
            icon="quota"
          />
        </div>

        {/* Student Table */}
        <StudentTable students={students} />
      </CardContent>
    </Card>
  );
}