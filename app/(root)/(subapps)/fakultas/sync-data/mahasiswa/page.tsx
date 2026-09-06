"use client";

import React, { useState } from "react";
import DashboardHeader from "@/components/dashboard-header";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";

// Mock Data Type
type MahasiswaSyncData = {
  nim: string;
  nama: string;
  prodi: string;
  angkatan: string;
  semesterAktif: string;
  status: string;
  ipk: string;
  sksLulus: string;
  sksAktif: string;
  sksGagal: string;
  minat: string;
  cuti: string;
};

// Mock Data
const mockData: MahasiswaSyncData[] = [
  {
    nim: "123456789",
    nama: "Budi Santoso",
    prodi: "S1 Teknik Informatika",
    angkatan: "2021",
    semesterAktif: "5",
    status: "Aktif",
    ipk: "3.80",
    sksLulus: "90",
    sksAktif: "20",
    sksGagal: "0",
    minat: "Software Engineering",
    cuti: "Tidak",
  },
  {
    nim: "987654321",
    nama: "Siti Aminah",
    prodi: "S1 Sistem Informasi",
    angkatan: "2020",
    semesterAktif: "7",
    status: "Aktif",
    ipk: "3.95",
    sksLulus: "120",
    sksAktif: "18",
    sksGagal: "0",
    minat: "Data Science",
    cuti: "Tidak",
  },
  {
    nim: "456123789",
    nama: "Andi Saputra",
    prodi: "D3 Teknik Komputer",
    angkatan: "2022",
    semesterAktif: "3",
    status: "Cuti",
    ipk: "3.20",
    sksLulus: "40",
    sksAktif: "0",
    sksGagal: "2",
    minat: "Jaringan Komputer",
    cuti: "1 Semester",
  },
  ...Array.from({ length: 22 }).map((_, i) => ({
    nim: `A11.2024.900${i + 70}`,
    nama: `Mahasiswa Dummy ${i + 4}`,
    prodi: i % 3 === 0 ? "S1 Teknik Informatika" : i % 3 === 1 ? "S1 Sistem Informasi" : "D3 Teknik Komputer",
    angkatan: "2024",
    semesterAktif: "1",
    status: "Aktif",
    ipk: "3.50",
    sksLulus: "20",
    sksAktif: "20",
    sksGagal: "0",
    minat: "Web Development",
    cuti: "Tidak",
  })),
];

const columns: ColumnDef<MahasiswaSyncData>[] = [
  {
    id: "no",
    header: () => <div className="text-center w-8">No</div>,
    cell: ({ row }) => <div className="text-center w-8">{row.index + 1}</div>,
  },
  {
    accessorKey: "nama",
    header: "Nama",
    cell: ({ row }) => {
      const nama = row.getValue("nama") as string;
      const nim = row.original.nim;
      const initial = nama.charAt(0).toUpperCase();

      return (
        <div className="flex items-center gap-3 py-1">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-muted text-muted-foreground font-medium">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{nama}</span>
            <span className="text-sm text-muted-foreground">{nim}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "prodi",
    header: "Prodi",
  },
  {
    accessorKey: "angkatan",
    header: () => <div className="text-center">Angkatan</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("angkatan")}</div>,
  },
  {
    accessorKey: "semesterAktif",
    header: () => <div className="text-center">Semester Aktif</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("semesterAktif")}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isAktif = status === "Aktif";
      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={
              isAktif
                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100/80 font-medium"
                : "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100/80 font-medium"
            }
          >
            {status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "ipk",
    header: () => <div className="text-center">IPK</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("ipk")}</div>,
  },
  {
    accessorKey: "sksLulus",
    header: () => <div className="text-center">SKS Lulus</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("sksLulus")}</div>,
  },
  {
    accessorKey: "sksAktif",
    header: () => <div className="text-center">SKS Aktif</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("sksAktif")}</div>,
  },
  {
    accessorKey: "sksGagal",
    header: () => <div className="text-center">SKS Gagal</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("sksGagal")}</div>,
  },
  {
    accessorKey: "minat",
    header: "Minat",
  },
  {
    accessorKey: "cuti",
    header: "Cuti",
  },
];

const SyncDataMahasiswaPage = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [isSyncing, setIsSyncing] = useState(false);

  // Filter Data
  const filteredData = mockData.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nim.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProdi =
      selectedProdi === "all" ? true : item.prodi === selectedProdi;

    return matchesSearch && matchesProdi;
  });

  const total = filteredData.length;
  const lastPage = Math.ceil(total / limit);
  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const uniqueProdi = Array.from(new Set(mockData.map((item) => item.prodi)));

  const handleSyncData = () => {
    setIsSyncing(true);
    // Simulate API call
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Data berhasil disinkronisasi");
    }, 1500);
  };

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          { name: "Sync Data", url: "/fakultas/sync-data" },
          { name: "Mahasiswa", url: "/fakultas/sync-data/mahasiswa" },
        ]}
        titleItems={[
          {
            title: "Sinkronisasi Data Mahasiswa",
            subtitle: "Sinkronkan data mahasiswa fakultas dengan sistem pusat.",
          },
        ]}
      />

      <div className="mt-4 flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative w-full md:w-1/4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari mahasiswa..."
            className="pl-9 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
          <div className="w-full md:w-48">
            <Select value={selectedProdi} onValueChange={setSelectedProdi}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Pilih Prodi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prodi</SelectItem>
                {uniqueProdi.map((prodi) => (
                  <SelectItem key={prodi} value={prodi}>
                    {prodi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSyncData} disabled={isSyncing} className="h-10">
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Menyinkronkan..." : "Sync Data"}
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <DataTable 
          columns={columns} 
          data={paginatedData} 
          pagination={{
            currentPage: page,
            lastPage: lastPage,
            limit: limit,
            total: total,
          }}
        />
      </div>
    </div>
  );
};

export default SyncDataMahasiswaPage;
