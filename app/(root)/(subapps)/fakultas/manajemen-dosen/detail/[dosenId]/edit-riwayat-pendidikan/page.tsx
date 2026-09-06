import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import DialogEditRiwayatPendidikan from "../../../../_components/manajemen-dosen/dialog-edit-riwayat-pendidikan";

const mockRiwayatPendidikan = [
  { id: 1, tahun: "2015", jenjang: "Doktor (S3)", programStudi: "Ilmu Komputer", instasi: "Universitas ABC" },
  { id: 2, tahun: "2010", jenjang: "Magister (S2)", programStudi: "Ilmu Komputer", instasi: "Universitas ABC" },
  { id: 3, tahun: "2005", jenjang: "Sarjana (S1)", programStudi: "Teknik Informatika", instasi: "Universitas DEF" },
];

interface EditRiwayatPendidikanPageProps {
  params: Promise<{ dosenId: string }>;
}

const EditRiwayatPendidikanPage = async ({ params }: EditRiwayatPendidikanPageProps) => {
  const { dosenId } = await params;

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          { name: "Manajemen Dosen", url: "/fakultas/manajemen-dosen" },
          { name: "Edit Riwayat Pendidikan", url: `/fakultas/manajemen-dosen/detail/${dosenId}/edit-riwayat-pendidikan` },
        ]}
        titleItems={[{ title: "Edit Riwayat Pendidikan"}]}
      />

      <div className="mt-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Pendidikan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRiwayatPendidikan.map((pendidikan) => (
                <div key={pendidikan.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="font-medium">{pendidikan.jenjang}</p>
                    <p className="text-sm text-muted-foreground">{pendidikan.programStudi} - {pendidikan.instasi}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{pendidikan.tahun}</span>
                    <DialogEditRiwayatPendidikan />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Link href={`/fakultas/manajemen-dosen/detail/${dosenId}`}>
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditRiwayatPendidikanPage;