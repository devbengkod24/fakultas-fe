import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, Save } from "lucide-react";
import Link from "next/link";
import DialogEditRiwayatKarir from "../../../../_components/manajemen-dosen/dialog-edit-riwayat-karir";

const mockRiwayatKarir = [
  { id: 1, tahun: "2020 - Sekarang", posisi: "Lektor Kepala", instasi: "Universitas XYZ" },
  { id: 2, tahun: "2015 - 2020", posisi: "Lektor", instasi: "Universitas XYZ" },
  { id: 3, tahun: "2010 - 2015", posisi: "Asisten Ahli", instasi: "Universitas XYZ" },
];

interface EditRiwayatKarirPageProps {
  params: Promise<{ dosenId: string }>;
}

const EditRiwayatKarirPage = async ({ params }: EditRiwayatKarirPageProps) => {
  const { dosenId } = await params;

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          { name: "Manajemen Dosen", url: "/fakultas/manajemen-dosen" },
          { name: "Edit Riwayat Karir", url: `/fakultas/manajemen-dosen/detail/${dosenId}/edit-riwayat-karir` },
        ]}
        titleItems={[{ title: "Edit Riwayat Karir"}]}
      />

      <div className="mt-4 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Riwayat Karir</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRiwayatKarir.map((karir) => (
                <div key={karir.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="font-medium">{karir.posisi}</p>
                    <p className="text-sm text-muted-foreground">{karir.instasi}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{karir.tahun}</span>
                    <DialogEditRiwayatKarir />
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

export default EditRiwayatKarirPage;