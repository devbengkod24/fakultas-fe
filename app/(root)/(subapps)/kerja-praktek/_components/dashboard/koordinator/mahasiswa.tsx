import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, Clock, CheckCircle, FileText, Briefcase, UserCheck, Database, BarChart } from "lucide-react"
import StatCard from "../stat-card"
import { Dashboard } from "@/types/kerja-praktek/dashboard"

interface DashboardKoordinatorMahasiswaProps {
  data: Dashboard
}

export default function DashboardKoordinatorMahasiswa({ data }: DashboardKoordinatorMahasiswaProps) {
  
  const mahasiswaData = data?.mahasiswa ?? {};
  const dosenData = data?.dosen ?? {};
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm sm:text-base">Data Mahasiswa</CardTitle>
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <StatCard
                title="Jumlah Mahasiswa"
                value={mahasiswaData.total_mahasiswa?.toString() ?? "0"}
                icon={<Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />}
                variant="borderless"
                textSize="md"
              />
              <StatCard
                title="Belum Selesai Sidang"
                value={mahasiswaData.belum_selesai_sidang?.toString() ?? "0"}
                icon={<Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />}
                variant="borderless"
                textSize="md"
              />
              <StatCard
                title="Sudah Selesai Sidang"
                value={mahasiswaData.sudah_selesai_sidang?.toString() ?? "0"}
                icon={<CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />}
                variant="borderless"
                textSize="md"
                className="w-full"
              />
              <StatCard
                title="Dalam Proses Bimbingan"
                value={mahasiswaData.progress_bimbingan?.toString() ?? "0"}
                icon={<FileText className="h-4 w-4 sm:h-5 sm:w-5 text-violet-500" />}
                variant="borderless"
                textSize="md"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm sm:text-base">Data Dosen Pembimbing</CardTitle>
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <StatCard
                title="Jumlah Dosen Pembimbing"
                value={dosenData.total_dosen?.toString() ?? "0"}
                icon={<UserCheck className="h-5 w-5 sm:h-7 sm:w-7 text-blue-500" />}
                variant="borderless"
                textSize="md"
              />
              <StatCard
                title="Dosen dengan Kuota"
                value={dosenData.dosen_dengan_kuota?.toString() ?? "0"}
                icon={<Database className="h-4 w-4 sm:h-5 sm:w-5 text-violet-500" />}
                variant="borderless"
                textSize="md"
              />
              <StatCard
                title="Total Kuota Pengajuan"
                value={dosenData.total_kuota?.toString() ?? "0"}
                icon={<BarChart className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />}
                variant="borderless"
                textSize="md"
              />
              <StatCard
                title="Sisa Kuota Pengajuan"
                value={dosenData.sisa_kuota?.toString() ?? "0"}
                icon={<Database className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />}
                variant="borderless"
                textSize="md"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
