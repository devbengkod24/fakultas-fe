"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  XSquare,
  Book,
  GraduationCap,
  Library,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmptyState from "@/components/empty-state";
import type { EwsProfileData } from "@/context/profileUseContext";

const StatCard = ({
  label,
  value,
  isRed = false,
}: {
  label: string;
  value: string | number;
  isRed?: boolean;
}) => {
  const borderColor = isRed ? "border-l-red-500" : "border-l-blue-500";
  const valueColor = isRed ? "text-red-500" : "text-foreground";
  return (
    <Card className={`overflow-hidden border-l-4 ${borderColor} shadow-sm`}>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-lg font-semibold mt-0.5 ${valueColor}`}>{value}</p>
      </CardContent>
    </Card>
  );
};

const ProgressBadge = ({
  label,
  isCompleted,
  icon: Icon,
  activeColor,
}: {
  label: string;
  isCompleted: boolean;
  icon: React.ComponentType<{ size?: number | string }>;
  activeColor: string;
}) => (
  <div
    className={`p-3 rounded-xl border ${
      isCompleted
        ? "bg-white border-gray-100"
        : "bg-gray-50 border-gray-100 opacity-60"
    } flex items-center justify-between transition-all`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`p-2 rounded-lg ${
          isCompleted ? activeColor : "bg-gray-200 text-gray-400"
        }`}
      >
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs font-bold text-foreground uppercase tracking-tight">
          {label}
        </p>
        <p
          className={`text-[10px] font-bold ${
            isCompleted ? "text-emerald-600" : "text-muted-foreground"
          }`}
        >
          {isCompleted ? "LULUS / DILAMPUI" : "BELUM SELESAI"}
        </p>
      </div>
    </div>
    {isCompleted ? (
      <CheckCircle2 className="text-emerald-500" size={16} />
    ) : (
      <XSquare className="text-gray-300" size={16} />
    )}
  </div>
);

interface EwsProfileSectionProps {
  data: EwsProfileData | null | undefined;
  isLoading?: boolean;
}

const EwsProfileSection = ({ data, isLoading }: EwsProfileSectionProps) => {
  const [showNfpDialog, setShowNfpDialog] = useState(false);

  const { mahasiswa, akademik, ews, matakuliah_nilai_de, progress_mk } =
    data || ({} as EwsProfileData);

  const isEligible = ews?.status_kelulusan === "eligible";

  const mkCategories = useMemo(() => {
    if (!progress_mk) return [];
    return [
      {
        key: "nasional",
        label: "MK Nasional",
        isCompleted: progress_mk.mk_nasional === "yes",
        icon: Book,
        activeColor: "bg-primary text-white",
      },
      {
        key: "fakultas",
        label: "MK Fakultas",
        isCompleted: progress_mk.mk_fakultas === "yes",
        icon: Library,
        activeColor: "bg-emerald-600 text-white",
      },
      {
        key: "prodi",
        label: "MK Prodi / Umum",
        isCompleted: progress_mk.mk_prodi === "yes",
        icon: GraduationCap,
        activeColor: "bg-orange-500 text-white",
      },
    ];
  }, [progress_mk]);

  const nfpCount = mkCategories.filter((c) => !c.isCompleted).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!data || !mahasiswa) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Data EWS belum tersedia"
        subtitle="Pastikan Anda sudah login dengan role mahasiswa."
        variant="small"
        className="py-8"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Row 1: SKS Lulus + SKS Tempuh (data UNIK, belum ada di profil) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatCard label="SKS Lulus" value={akademik.sks_lulus} />
        <StatCard label="SKS Tempuh" value={akademik.sks_tempuh} />
      </div>

      {/* Row 2: Status EWS + Kelulusan (UNIK, dengan Semester & Angkatan) */}
      <Card
        className={`border-l-4 shadow-sm ${
          isEligible ? "border-l-emerald-500" : "border-l-red-500"
        }`}
      >
        <CardContent
          className={`p-4 ${isEligible ? "bg-emerald-500/5" : "bg-red-500/5"}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div
              className={`p-2 bg-white rounded-lg shadow-sm shrink-0 ${
                isEligible ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {isEligible ? (
                <CheckCircle2 size={20} />
              ) : (
                <XSquare size={20} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={`text-[10px] font-black uppercase tracking-widest ${
                    isEligible ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {isEligible ? "ELIGIBLE" : "TIDAK ELIGIBLE"}
                </p>
                <Badge variant="secondary" className="text-[10px]">
                  EWS: {ews.status.replace("_", " ")}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Semester {mahasiswa.semester_aktif} · Angkatan{" "}
                {mahasiswa.tahun_masuk}
              </p>
              {isEligible ? (
                <p className="text-xs text-emerald-600 font-medium opacity-80 mt-1">
                  Selamat! Anda telah memenuhi kriteria dasar kelulusan.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNfpDialog(true)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  Lihat alasan
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Row 3: Matkul NFP (clickable card → dialog) */}
      <Card
        className="shadow-sm cursor-pointer hover:shadow-md transition-shadow border-dashed border-amber-200 bg-amber-50/30"
        onClick={() => setShowNfpDialog(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowNfpDialog(true);
          }
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                <Book className="size-4 text-amber-600" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm">Matkul NFP (Nilai Fitur Persiapan)</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Klik untuk melihat kelengkapan mata kuliah yang harus diselesaikan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge
                variant={nfpCount === 0 ? "success" : "yellow"}
                className="text-[10px] font-black"
              >
                {nfpCount === 0 ? "Semua Lulus" : `${nfpCount} Belum Selesai`}
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {mkCategories.map((cat) => (
              <ProgressBadge
                key={cat.key}
                label={cat.label}
                isCompleted={cat.isCompleted}
                icon={cat.icon}
                activeColor={cat.activeColor}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Row 4: Tabel Nilai D dan E */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                <AlertCircle className="size-4 text-orange-600" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm">Mata Kuliah Nilai D & E</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Daftar mata kuliah dengan nilai D atau E
                </p>
              </div>
            </div>
            {matakuliah_nilai_de.length > 0 && (
              <Badge variant="destructiveOutline" className="text-[10px] font-black shrink-0">
                {matakuliah_nilai_de.length} Matakuliah
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {matakuliah_nilai_de.length > 0 ? (
            <div className="rounded-md border overflow-hidden mx-6 mb-6">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-12 text-center">No</TableHead>
                    <TableHead>Kode</TableHead>
                    <TableHead>Mata Kuliah</TableHead>
                    <TableHead className="text-center">SKS</TableHead>
                    <TableHead className="text-center">Nilai</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matakuliah_nilai_de.map((mk, i) => (
                    <TableRow key={`${mk.kode_mk}-${i}`}>
                      <TableCell className="text-center text-xs font-medium">
                        {i + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {mk.kode_mk}
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        {mk.nama_mk}
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        {mk.sks}
                      </TableCell>
                      <TableCell
                        className={`text-center text-xs font-black ${
                          mk.nilai === "E" ? "text-red-500" : "text-orange-500"
                        }`}
                      >
                        {mk.nilai}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="px-6 pb-6">
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed rounded-lg">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 mb-2">
                  <CheckCircle2 size={24} />
                </div>
                <p className="text-xs font-bold text-muted-foreground">
                  Tidak ada nilai D atau E
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Performa akademik sangat baik!
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* NFP Dialog */}
      <Dialog open={showNfpDialog} onOpenChange={setShowNfpDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2 pr-6">
              <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                <Book className="size-4 text-amber-600" />
              </div>
              <div>
                <DialogTitle className="text-base">
                  Detail Kelengkapan Matkul
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Daftar hal yang harus dipenuhi untuk kelulusan
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {mkCategories.map((cat) => (
                <div
                  key={cat.key}
                  className={`p-3 rounded-lg border ${
                    cat.isCompleted
                      ? "bg-emerald-50 border-emerald-100"
                      : "bg-red-50 border-red-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {cat.isCompleted ? (
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XSquare className="size-4 text-red-500 shrink-0" />
                    )}
                    <p
                      className={`text-xs font-bold ${
                        cat.isCompleted ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {cat.label}
                    </p>
                  </div>
                  <p
                    className={`text-[10px] mt-0.5 ${
                      cat.isCompleted ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {cat.isCompleted ? "Lulus / dilampaui" : "Belum selesai"}
                  </p>
                </div>
              ))}
            </div>

            {ews.alasan_tidak_eligible.length > 0 ? (
              <div className="rounded-lg border border-red-100 bg-red-50/50 p-3">
                <p className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1.5">
                  <XSquare className="size-3.5" />
                  Alasan belum eligible ({ews.alasan_tidak_eligible.length})
                </p>
                <ul className="space-y-1.5">
                  {ews.alasan_tidak_eligible.map((alasan, i) => (
                    <li
                      key={i}
                      className="text-xs text-red-700 flex items-start gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 shrink-0" />
                      <span>{alasan}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5" />
                  Semua persyaratan kelulusan telah terpenuhi
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EwsProfileSection;
