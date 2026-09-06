"use client";

import { BookCheck, Clock, GraduationCap } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SearchInput } from "@/components/search-input";

type Status = "pending" | "accepted" | "rejected";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortOrder: "newest" | "oldest";
  setSortOrder: (order: "newest" | "oldest") => void;
  pathFilter: string;
  setPathFilter: (path: string) => void;
  fieldFilter: string;
  setFieldFilter: (field: string) => void;
  statusFilter: Status | "all";
  setStatusFilter: (status: Status | "all") => void;
  setCurrentPage: (page: number) => void;
}

export function FilterBar({
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
  pathFilter,
  setPathFilter,
  fieldFilter,
  setFieldFilter,
  setCurrentPage,
}: FilterBarProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <SearchInput
          placeholder="Cari berdasarkan nama, NIM, atau judul..."
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
        />

        <div className="flex gap-2">
          <Select
            value={sortOrder}
            onValueChange={(value: "newest" | "oldest") => setSortOrder(value)}
          >
            <SelectTrigger className="w-[130px] h-full">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>{sortOrder === "newest" ? "Terbaru" : "Terlama"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={pathFilter}
            onValueChange={(value) => {
              setPathFilter(value);
              setCurrentPage(1);
            }}
          >
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
            </SelectContent>
          </Select>

          <Select
            value={fieldFilter}
            onValueChange={(value) => {
              setFieldFilter(value);
              setCurrentPage(1);
            }}
          >
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
