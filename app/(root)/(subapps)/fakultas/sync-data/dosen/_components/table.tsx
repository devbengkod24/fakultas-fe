"use client";

import { DataTable } from "@/components/data-table";
import { FilterSyncDosen } from "./filter";
import { Columns, SyncDosen } from "./column";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search } from "lucide-react";

// ─── Dummy Data ────────────────────────────────────────────────────────────────

const dummySyncDosen: SyncDosen[] = [
  {
    id: 1,
    npp: "198501012010121001",
    nama: "Prof. Dr. Ahmad Fauzi, M.Kom.",
    email: "ahmad.fauzi@university.ac.id",
    prodi_homebase: "Informatika",
    jabatan: "Guru Besar",
    status: "Aktif",
  },
  {
    id: 2,
    npp: "198601022011022002",
    nama: "Dr. Siti Nurhaliza, M.T.",
    email: "siti.nurhaliza@university.ac.id",
    prodi_homebase: "Informatika",
    jabatan: "Lektor Kepala",
    status: "Aktif",
  },
  {
    id: 3,
    npp: "197803032008012003",
    nama: "Prof. Dr. Budi Santoso, M.M.",
    email: "budi.santoso@university.ac.id",
    prodi_homebase: "Sistem Informasi",
    jabatan: "Guru Besar",
    status: "Aktif",
  },
  {
    id: 4,
    npp: "198907042012032004",
    nama: "Dr. Rina Susanti, M.Kom.",
    email: "rina.susanti@university.ac.id",
    prodi_homebase: "Sistem Informasi",
    jabatan: "Lektor Kepala",
    status: "Aktif",
  },
  {
    id: 5,
    npp: "199105052013042005",
    nama: "Dr. Wahyu Nugroho, M.Sc.",
    email: "wahyu.nugroho@university.ac.id",
    prodi_homebase: "Teknik Komputer",
    jabatan: "Lektor",
    status: "Aktif",
  },
  {
    id: 6,
    npp: "198308062010062006",
    nama: "Dr. Diana Putri, M.T.",
    email: "diana.putri@university.ac.id",
    prodi_homebase: "Informatika",
    jabatan: "Lektor",
    status: "Aktif",
  },
  {
    id: 7,
    npp: "199210072014032007",
    nama: "Eko Prasetyo, M.Kom.",
    email: "eko.prasetyo@university.ac.id",
    prodi_homebase: "Teknik Komputer",
    jabatan: "Asisten Ahli",
    status: "Aktif",
  },
  {
    id: 8,
    npp: "198412082009012008",
    nama: "Dr. Lestari Handoko, M.Si.",
    email: "lestari.handoko@university.ac.id",
    prodi_homebase: "Sistem Informasi",
    jabatan: "Lektor Kepala",
    status: "Cuti",
  },
];

export function TableSyncDosen() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = dummySyncDosen.filter(
    (dosen) =>
      dosen.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dosen.npp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dosen.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama dosen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Data
          </Button>
        </div>
      </div>
      <DataTable
        columns={Columns}
        data={filteredData}
        loading={false}
        pagination={{
          currentPage: 1,
          lastPage: 1,
          limit: 10,
          total: filteredData.length,
        }}
      />
    </div>
  );
}
