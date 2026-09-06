"use client";

import { useProfile } from "@/context/profileUseContext";
import DashboardHeader from "@/components/dashboard-header";
import SuperFakultasCapaianDetailClient from "../../_components/capaian-mahasiswa/super-fakultas-capaian-detail-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CapaianMahasiswaDetailPage() {
  const { profile } = useProfile();
  const role = profile?.roles;

  if (role === "super_fakultas") {
    return (
      <div>
        <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/ews" },
            { name: "Capaian Mahasiswa", url: "/ews/capaian-mahasiswa" },
            { name: "Detail Capaian Prodi", url: "#" }, 
          ]}
          titleItems={[
            {
              title: "Detail Capaian Prodi",
              subtitle: "Data capaian persentase kelulusan per tahun angkatan.",
            },
          ]}
        />
        <div className="mt-6">
          <SuperFakultasCapaianDetailClient />
        </div>
      </div>
    );
  }

  // Tampilan ketika akses ditolak, dirombak agar senada dengan UI Dashboard
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-sm border-gray-100 overflow-hidden text-center">
        <CardContent className="pt-10 pb-8 px-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-[#2D3E50]">Akses Ditolak</h2>
          <p className="text-sm text-gray-500 mt-2 mb-6">
            Halaman detail ini hanya tersedia untuk role Super Fakultas. Silakan kembali ke halaman sebelumnya.
          </p>
          <Button asChild className="bg-[#2D3E50] hover:bg-[#1a2a3a]">
            <Link href="/ews/capaian-mahasiswa" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}