"use client";

import {
  BookCheck,
  Clock,
  GraduationCap,
  Grid3X3,
  TableProperties,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import SearchControl from "@/components/search-control";

type Status = "pending" | "accepted" | "rejected" | "canceled";

interface FilterBarProps {
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  pathFilter: string;
  setPathFilter: (path: string) => void;
  fieldFilter: string;
  setFieldFilter: (field: string) => void;
  statusFilter: Status | "all";
  setStatusFilter: (status: Status | "all") => void;
  setCurrentPage: (page: number) => void;
  viewMode: "card" | "table";
  setViewMode: (mode: "card" | "table") => void;
}

export function FilterBar({
  sortOrder,
  setSortOrder,
  pathFilter,
  setPathFilter,
  fieldFilter,
  setFieldFilter,
  viewMode,
  setViewMode,
}: FilterBarProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <SearchControl
          className="w-1/3"
          placeholder="Cari berdasarkan nama, NIM, atau judul..."
        />

        <div className="flex gap-2 ml-auto">
          {/* View Mode Selector */}
          <Select
            value={viewMode}
            onValueChange={(value: "card" | "table") => setViewMode(value)}
          >
            <SelectTrigger className="w-[120px] h-full">
              <div className="flex items-center">
                {viewMode === "card" ? (
                  <Grid3X3 className="size-4 mr-2" />
                ) : (
                  <TableProperties className="size-4 mr-2" />
                )}
                <span>{viewMode === "card" ? "Kartu" : "Tabel"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">
                <div className="flex items-center">
                  <Grid3X3 className="size-4 mr-2" />
                  Tampilan Kartu
                </div>
              </SelectItem>
              <SelectItem value="table">
                <div className="flex items-center">
                  <TableProperties className="size-4 mr-2" />
                  Tampilan Tabel
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Sort order */}
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[130px] h-full">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>{sortOrder === "desc" ? "Terbaru" : "Terlama"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Terbaru</SelectItem>
              <SelectItem value="asc">Terlama</SelectItem>
            </SelectContent>
          </Select>

          {/* Path Filter (Jalur) */}
          <Select value={pathFilter} onValueChange={setPathFilter}>
            <SelectTrigger className="w-[150px] h-full">
              <div className="flex items-center">
                <BookCheck className="mr-2 h-4 w-4" />
                <span>
                  {pathFilter === "all"
                    ? "Semua Jalur"
                    : `Jalur: ${pathFilter}`}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jalur</SelectItem>
              <SelectItem value="Publikasi">Publikasi</SelectItem>
              <SelectItem value="Reguler">Reguler</SelectItem>
              <SelectItem value="Projek">Projek</SelectItem>
            </SelectContent>
          </Select>

          {/* Field Filter (Bidang) */}
          <Select value={fieldFilter} onValueChange={setFieldFilter}>
            <SelectTrigger className="w-[150px] h-full">
              <div className="flex items-center">
                <GraduationCap className="mr-2 h-4 w-4" />
                <span>
                  {fieldFilter === "all"
                    ? "Semua Bidang"
                    : `Bidang: ${fieldFilter}`}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Bidang</SelectItem>
              <SelectItem value="SC">SC</SelectItem>
              <SelectItem value="RPLD">RPLD</SelectItem>
              <SelectItem value="SK3D">SK3D</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
