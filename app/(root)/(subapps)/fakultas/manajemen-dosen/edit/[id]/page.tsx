import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { Dosen } from "@/types/fakultas/penelitian/penelitian";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import DialogEditProfil from "../../../_components/manajemen-dosen/dialog-edit-profil";
import DialogEditRiwayatKarir from "../../../_components/manajemen-dosen/dialog-edit-riwayat-karir";
import DialogEditRiwayatPendidikan from "../../../_components/manajemen-dosen/dialog-edit-riwayat-pendidikan";
import DialogTambahRiwayatKarir from "../../../_components/manajemen-dosen/dialog-tambah-riwayat-karir";
import DialogTambahRiwayatPendidikan from "../../../_components/manajemen-dosen/dialog-tambah-riwayat-pendidikan";

interface MockDosen {
  id: number;
  nidn: string;
  npp: string;
  nama: string;
  prodi_homebase: string;
  prodi_tugas: string[];
  jabatan: string;
  status: string;
  golongan: string;
  email: string;
}

const mockDosen: MockDosen[] = [
  { id: 1, nidn: "0015127501", npp: "197501152000121001", nama: "Dr. Ahmad Fauzi, M.Kom.", prodi_homebase: "ti", prodi_tugas: ["si"], jabatan: "Lektor Kepala", status: "Aktif", golongan: "IV/c", email: "ahmad.fauzi@universitas.edu" },
];

const mockRiwayatKarir = [
  { id: 1, tahun: "2020 - Sekarang", posisi: "Lektor Kepala", instasi: "Universitas XYZ" },
  { id: 2, tahun: "2015 - 2020", posisi: "Lektor", instasi: "Universitas XYZ" },
];

const mockRiwayatPendidikan = [
  { id: 1, tahun: "2015", jenjang: "Doktor (S3)", programStudi: "Ilmu Komputer", instasi: "Universitas ABC" },
  { id: 2, tahun: "2010", jenjang: "Magister (S2)", programStudi: "Ilmu Komputer", instasi: "Universitas ABC" },
];

interface EditDosenPageProps {
  params: Promise<{ id: string }>;
}

const EditDosenPage = async ({ params }: EditDosenPageProps) => {
  const { id } = await params;
  const dosenId = parseInt(id);
  const dosen = mockDosen.find((d) => d.id === dosenId);

  if (!dosen) {
    return (
      <div>
        <DashboardHeader breadcrumbItems={[{ name: "Dashboard", url: "/fakultas" }, { name: "Manajemen Dosen", url: "/fakultas/manajemen-dosen" }, { name: "Edit", url: `/fakultas/manajemen-dosen/edit/${id}` }]} titleItems={[{ title: "Edit Dosen", subtitle: "Data tidak ditemukan" }]} />
        <div className="mt-4"><Card className="p-8 text-center"><p className="text-muted-foreground">Data dosen tidak ditemukan.</p><Link href="/fakultas/manajemen-dosen" className="mt-4 inline-block"><Button variant="outline"><ArrowLeft className="h-4 w-4" />Kembali</Button></Link></Card></div>
      </div>
    );
  }

  // Cast mock data ke Dosen untuk dipass ke DialogEditProfil
  const dosenForDialog: Dosen = {
    user_id: dosen.id,
    dosen_id: dosen.id,
    nama: dosen.nama,
    email: dosen.email,
    npp: dosen.npp,
    nidn: dosen.nidn,
    jabatan: dosen.jabatan,
    golongan: dosen.golongan,
    status: dosen.status,
    prodi_homebase: dosen.prodi_homebase,
    prodi_tugas: dosen.prodi_tugas as any,
  };

  return (
    <div>
      <DashboardHeader breadcrumbItems={[{ name: "Dashboard", url: "/fakultas" }, { name: "Manajemen Dosen", url: "/fakultas/manajemen-dosen" }, { name: "Edit", url: `/fakultas/manajemen-dosen/edit/${id}` }]} titleItems={[{ title: "Edit Dosen", subtitle: `NPP: ${dosen.npp}` }]} />

      <div className="mt-4 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profil Dosen</CardTitle>
              <DialogEditProfil dosen={dosenForDialog} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div><label className="text-sm text-muted-foreground">Nama Lengkap</label><p className="font-medium">{dosen.nama}</p></div>
              <div><label className="text-sm text-muted-foreground">NIDN</label><p className="font-medium">{dosen.nidn}</p></div>
              <div><label className="text-sm text-muted-foreground">NPP</label><p className="font-medium">{dosen.npp}</p></div>
              <div><label className="text-sm text-muted-foreground">Prodi Homebase</label><p className="font-medium">{dosen.prodi_homebase}</p></div>
              <div><label className="text-sm text-muted-foreground">Prodi Tugas</label><p className="font-medium">{dosen.prodi_tugas.join(", ")}</p></div>
              <div><label className="text-sm text-muted-foreground">Jabatan</label><p className="font-medium">{dosen.jabatan}</p></div>
              <div><label className="text-sm text-muted-foreground">Golongan</label><p className="font-medium">{dosen.golongan}</p></div>
              <div><label className="text-sm text-muted-foreground">Email</label><p className="font-medium">{dosen.email}</p></div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Riwayat Karir</CardTitle>
                <div className="flex gap-2">
                  <DialogEditRiwayatKarir />
                  <DialogTambahRiwayatKarir />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRiwayatKarir.map((karir) => (
                  <div key={karir.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex-1"><p className="font-medium">{karir.posisi}</p><p className="text-sm text-muted-foreground">{karir.instasi}</p></div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{karir.tahun}</span>
                      <DialogEditRiwayatKarir />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Riwayat Pendidikan</CardTitle>
                <div className="flex gap-2">
                  <DialogEditRiwayatPendidikan />
                  <DialogTambahRiwayatPendidikan />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRiwayatPendidikan.map((pendidikan) => (
                  <div key={pendidikan.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex-1"><p className="font-medium">{pendidikan.jenjang}</p><p className="text-sm text-muted-foreground">{pendidikan.programStudi} - {pendidikan.instasi}</p></div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{pendidikan.tahun}</span>
                      <DialogEditRiwayatPendidikan />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between">
          <Link href="/fakultas/manajemen-dosen"><Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" />Batal</Button></Link>
          <Button className="gap-2"><Save className="h-4 w-4" />Simpan</Button>
        </div>
      </div>
    </div>
  );
};

export default EditDosenPage;