import React from "react";
import DashboardHeader from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";

const mockBimbingan = [
  {
    id: 1,
    nama_mahasiswa: "John Doe",
    npm: "12345678",
    program_studi: "ti",
    judul_tugas_akhir: "Pengembangan Sistem Informasi Perpustakaan",
    tahun: "2024",
    status: "Aktif",
  },
  {
    id: 2,
    nama_mahasiswa: "Jane Smith",
    npm: "87654321",
    program_studi: "si",
    judul_tugas_akhir: "Analisis Data Mining untuk Prediksi Penjualan",
    tahun: "2024",
    status: "Selesai",
  },
];

interface Bimbingan {
  id: number;
  nama_mahasiswa: string;
  npm: string;
  program_studi: string;
  judul_tugas_akhir: string;
  tahun: string;
  status: string;
}

// Interface lokal untuk mock data (tidak harus sama persis dengan Dosen API)
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
  { id: 2, nidn: "0022088201", npp: "198205152008011001", nama: "Dr. Budi Santoso, M.Si.", prodi_homebase: "si", prodi_tugas: ["ti"], jabatan: "Lektor", status: "Aktif", golongan: "IV/a", email: "budi.santoso@universitas.edu" },
  { id: 3, nidn: "0032017901", npp: "197901022003121001", nama: "Prof. Dr. Dewi Lestari, M.Sc.", prodi_homebase: "ti", prodi_tugas: ["bd"], jabatan: "Guru Besar", status: "Aktif", golongan: "IV/e", email: "dewi.lestari@universitas.edu" },
  { id: 4, nidn: "0045029001", npp: "199002152015031001", nama: "Rudi Hermawan, M.Kom.", prodi_homebase: "bd", prodi_tugas: ["si"], jabatan: "Asisten Ahli", status: "Aktif", golongan: "III/b", email: "rudi.hermawan@universitas.edu" },
  { id: 5, nidn: "0051108501", npp: "198510152010031001", nama: "Siti Nurhaliza, M.T.", prodi_homebase: "si", prodi_tugas: ["ti"], jabatan: "Lektor", status: "Aktif", golongan: "IV/a", email: "siti.nurhaliza@universitas.edu" },
  { id: 6, nidn: "0061017701", npp: "197701152005021001", nama: "Dr. Hasan Basri, M.Pd.", prodi_homebase: "ti", prodi_tugas: ["si"], jabatan: "Lektor Kepala", status: "Nonaktif", golongan: "IV/c", email: "hasan.basri@universitas.edu" },
];

const prodiLabel: Record<string, string> = { ti: "Teknik Informatika", si: "Sistem Informasi", bd: "Bisnis Digital" };

interface DetailBimbinganPageProps {
  params: Promise<{ id: string }>;
}

const DetailBimbinganPage = async ({ params }: DetailBimbinganPageProps) => {
  const { id } = await params;
  const dosenId = parseInt(id);
  const dosen = mockDosen.find((d) => d.id === dosenId);

  const columnsBimbingan: ColumnDef<Bimbingan>[] = [
    { header: "No", cell: ({ row }) => row.index + 1 },
    { accessorKey: "nama_mahasiswa", header: "Nama Mahasiswa" },
    { accessorKey: "npm", header: "NPM" },
    { accessorKey: "program_studi", header: "Program Studi", cell: ({ row }) => prodiLabel[row.getValue("program_studi") as string] || row.getValue("program_studi") },
    { accessorKey: "judul_tugas_akhir", header: "Judul Tugas Akhir" },
    { accessorKey: "tahun", header: "Tahun" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={row.getValue("status") === "Aktif" ? "default" : "secondary"}>{row.getValue("status") as string}</Badge> },
  ];

  if (!dosen) {
    return (
      <div>
        <DashboardHeader breadcrumbItems={[{ name: "Dashboard", url: "/fakultas" }, { name: "Manajemen Dosen", url: "/fakultas/manajemen-dosen" }, { name: "Detail Bimbingan", url: `/fakultas/manajemen-dosen/bimbingan/${id}` }]} titleItems={[{ title: "Detail Bimbingan", subtitle: "Data tidak ditemukan" }]} />
        <div className="mt-4"><Card className="p-8 text-center"><p className="text-muted-foreground">Data dosen tidak ditemukan.</p><Link href="/fakultas/manajemen-dosen" className="mt-4 inline-block"><Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" />Kembali</Button></Link></Card></div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader breadcrumbItems={[{ name: "Dashboard", url: "/fakultas" }, { name: "Manajemen Dosen", url: "/fakultas/manajemen-dosen" }, { name: dosen.nama, url: `/fakultas/manajemen-dosen/bimbingan/${id}` }]} titleItems={[{ title: "Detail Bimbingan Dosen", subtitle: `NPP: ${dosen.npp}` }]} />
      <div className="mt-4 space-y-6">
        <Card><CardHeader><CardTitle>Profil Dosen</CardTitle></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><div><label className="text-sm text-muted-foreground">Nama Lengkap</label><p className="font-medium">{dosen.nama}</p></div><div><label className="text-sm text-muted-foreground">NIDN</label><p className="font-medium">{dosen.nidn}</p></div><div><label className="text-sm text-muted-foreground">NPP</label><p className="font-medium">{dosen.npp}</p></div><div><label className="text-sm text-muted-foreground">Prodi Homebase</label><p className="font-medium">{prodiLabel[dosen.prodi_homebase] ?? dosen.prodi_homebase}</p></div><div><label className="text-sm text-muted-foreground">Prodi Tugas</label><p className="font-medium">{dosen.prodi_tugas.map((t) => prodiLabel[t] ?? t).join(", ")}</p></div><div><label className="text-sm text-muted-foreground">Jabatan</label><p className="font-medium">{dosen.jabatan}</p></div><div><label className="text-sm text-muted-foreground">Golongan</label><p className="font-medium">{dosen.golongan}</p></div><div><label className="text-sm text-muted-foreground">Email</label><p className="font-medium">{dosen.email}</p></div></div></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Bimbingan Tugas Akhir</CardTitle></CardHeader><CardContent><DataTable columns={columnsBimbingan} data={mockBimbingan} loading={false} pagination={{ currentPage: 1, lastPage: 1, limit: 10, total: mockBimbingan.length }} /></CardContent></Card>
        <div><Link href="/fakultas/manajemen-dosen"><Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" />Kembali</Button></Link></div>
      </div>
    </div>
  );
};

export default DetailBimbinganPage;