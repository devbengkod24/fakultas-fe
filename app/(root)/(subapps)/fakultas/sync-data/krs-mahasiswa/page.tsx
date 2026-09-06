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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSearchParams } from "next/navigation";

type KrsMahasiswaSyncData = {
  nama: string;
  nim: string;
  matakuliah: string;
  kelompok: string;
  semester_ambil: string;
  status: "B" | "U";
  absen: string;
  nilai_uts: string;
  nilai_uas: string;
  nilai_akhir_angka: string;
  nilai_akhir_huruf: string;
};

const mockData: KrsMahasiswaSyncData[] = [
  {
    nama: "Budi Santoso",
    nim: "A11.2022.15345",
    matakuliah: "Matematika Diskrit",
    kelompok: "	A11.46UG",
    semester_ambil: "5",
    status: "B",
    absen: "92%",
    nilai_uts: "85",
    nilai_uas: "90",
    nilai_akhir_angka: "87.5",
    nilai_akhir_huruf: "A",
  },
  {
    nama: "Siti Aminah",
    nim: "A11.2021.12345",
    matakuliah: "Komputasi Awan",
    kelompok: "	A11.46UG",
    semester_ambil: "7",
    status: "U",
    absen: "70%",
    nilai_uts: "70",
    nilai_uas: "75",
    nilai_akhir_angka: "73.0",
    nilai_akhir_huruf: "B",
  },
  {
    nama: "Andi Saputra",
    nim: "A11.2022.12345",
    matakuliah: "Basis Data",
    kelompok: "	A11.4801",
    semester_ambil: "3",
    status: "B",
    absen: "85%",
    nilai_uts: "90",
    nilai_uas: "95",
    nilai_akhir_angka: "92.5",
    nilai_akhir_huruf: "A",
  },
  ...Array.from({ length: 22 }).map((_, i) => {
    const nilaiAkhirAngka = 50 + (i % 40) + (i % 10) / 10;
    const nilaiAkhirHuruf =
      nilaiAkhirAngka >= 80 ? "A" :
      nilaiAkhirAngka >= 70 ? "B" :
      nilaiAkhirAngka >= 60 ? "C" :
      nilaiAkhirAngka >= 50 ? "D" : "E";
    return {
      nama: `Mahasiswa Dummy ${i + 4}`,
      nim: `A11.2024.900${i + 70}`,
      matakuliah: `MK${100 + (i % 5)}`,
      kelompok: `A11.48${String(i + 1).padStart(2, "0")}`,
      semester_ambil: `${(i % 8) + 1}`,
      status: (i % 3 === 0 ? "U" : "B") as "B" | "U",
      absen: `${75 + (i % 25)}%`,
      nilai_uts: `${Math.min(100, 50 + (i % 50))}`,
      nilai_uas: `${Math.min(100, 55 + (i % 45))}`,
      nilai_akhir_angka: nilaiAkhirAngka.toFixed(1),
      nilai_akhir_huruf: nilaiAkhirHuruf,
    };
  }),
];

const columns: ColumnDef<KrsMahasiswaSyncData>[] = [
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
    accessorKey: "matakuliah",
    header: "Matakuliah",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("matakuliah")}</div>
    ),
  },
  {
    accessorKey: "kelompok",
    header: () => <div className="text-center">Kelompok Mata Kuliah</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("kelompok")}</div>,
  },
  {
    accessorKey: "semester_ambil",
    header: () => <div className="text-center">Semester</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("semester_ambil")}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isBaru = status === "B";
      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={
              isBaru
                ? "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100/80 font-medium"
                : "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100/80 font-medium"
            }
          >
            {isBaru ? "Baru" : "Ulang"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "absen",
    header: () => <div className="text-center">Absen</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("absen")}</div>,
  },
  {
    accessorKey: "nilai_uts",
    header: () => <div className="text-center">UTS</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("nilai_uts")}</div>,
  },
  {
    accessorKey: "nilai_uas",
    header: () => <div className="text-center">UAS</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("nilai_uas")}</div>,
  },
  {
    accessorKey: "nilai_akhir_angka",
    header: () => <div className="text-center">Nilai Angka</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("nilai_akhir_angka")}</div>,
  },
  {
    accessorKey: "nilai_akhir_huruf",
    header: () => <div className="text-center">Nilai Huruf</div>,
    cell: ({ row }) => {
      const nilai = row.getValue("nilai_akhir_huruf") as string;
      const isLulus = nilai === "A" || nilai === "B";
      const isC = nilai === "C";
      return (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={
              isLulus
                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100/80 font-medium"
                : isC
                ? "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100/80 font-medium"
                : "bg-red-100 text-red-700 border-red-200 hover:bg-red-100/80 font-medium"
            }
          >
            {nilai}
          </Badge>
        </div>
      );
    },
  },
];

const SyncDataKrsMahasiswaPage = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredData = mockData.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.matakuliah.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" ? true : item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const total = filteredData.length;
  const lastPage = Math.ceil(total / limit);
  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("Data KRS berhasil disinkronisasi");
    }, 1500);
  };

  return (
    <div>
      <DashboardHeader
        breadcrumbItems={[
          { name: "Dashboard", url: "/fakultas" },
          { name: "Sync Data", url: "/fakultas/sync-data" },
          { name: "KRS Mahasiswa", url: "/fakultas/sync-data/krs-mahasiswa" },
        ]}
        titleItems={[
          {
            title: "Sinkronisasi Data KRS Mahasiswa",
            subtitle: "Sinkronkan data KRS mahasiswa fakultas dengan sistem pusat.",
          },
        ]}
      />

      <div className="mt-4 flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="relative w-full md:w-1/4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari mahasiswa atau matakuliah..."
            className="pl-9 h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
          <div className="w-full md:w-48">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="B">Baru</SelectItem>
                <SelectItem value="U">Ulang</SelectItem>
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

export default SyncDataKrsMahasiswaPage;
