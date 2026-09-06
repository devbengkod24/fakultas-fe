"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "./status-badge";

interface Student {
  id: number;
  nama: string;
  nim: string;
  prodi: string;
  judul_ta: string;
  status: "Bimbingan" | "Lulus";
}

interface StudentTableProps {
  students: Student[];
}

export function StudentTable({ students }: StudentTableProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.nama.toLowerCase().includes(search.toLowerCase()) ||
      student.nim.toLowerCase().includes(search.toLowerCase()) ||
      student.judul_ta.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "all" || student.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama, NIM, atau judul TA..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[160px] bg-slate-50 border-slate-200">
            <Filter className="h-4 w-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="Bimbingan">Bimbingan</SelectItem>
            <SelectItem value="Lulus">Lulus</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">
                  NIM
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">
                  Program Studi
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Judul TA
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada data mahasiswa bimbingan
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm text-slate-400">{index + 1}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900">{student.nama}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-500">{student.nim}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-500">{student.prodi}</p>
                    </td>
                    <td className="px-4 py-4 max-w-[200px]">
                      <p className="text-sm text-slate-700 truncate" title={student.judul_ta}>
                        {student.judul_ta}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={student.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination info */}
      {filteredStudents.length > 0 && (
        <p className="text-sm text-slate-500 text-center">
          Menampilkan {filteredStudents.length} dari {students.length} mahasiswa
        </p>
      )}
    </div>
  );
}