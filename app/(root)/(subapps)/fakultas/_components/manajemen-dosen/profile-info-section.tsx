import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface Prodi {
  id: number;
  nama: string;
  kode_prodi: string;
}

interface ProfileInfoSectionProps {
  nama: string;
  gelar_depan?: string | null;
  gelar_belakang?: string | null;
  prodi_homebase: string;
  status?: string;
  nidn?: string | null;
  npp?: string | null;
  prodi_tugas?: string[] | Prodi[];
  jabatan?: string | null;
  golongan?: string | null;
  email?: string;
  editButton?: ReactNode;
}

export function ProfileInfoSection({
  nama,
  gelar_depan,
  gelar_belakang,
  prodi_homebase,
  status = "Aktif",
  nidn,
  npp,
  prodi_tugas,
  jabatan,
  golongan,
  email,
  editButton,
}: ProfileInfoSectionProps) {
  const formatProdiTugas = (prodi: string[] | Prodi[] | undefined) => {
    if (!prodi) return "-";
    if (Array.isArray(prodi)) {
      if (prodi.length === 0) return "-";
      return prodi.map((p) => (typeof p === "object" ? p.nama : p)).join(", ");
    }
    return String(prodi);
  };

  const infoItems = [
    { label: "NIDN", value: nidn || "-" },
    { label: "NPP", value: npp || "-" },
    { label: "Prodi Tugas", value: formatProdiTugas(prodi_tugas) },
    { label: "Jabatan", value: jabatan || "-" },
    { label: "Golongan", value: golongan || "-" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header: Nama + Prodi + Status + Edit */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900">
            {gelar_depan && `${gelar_depan} `}{nama}{gelar_belakang && `, ${gelar_belakang}`}
          </h2>
          <p className="text-slate-500 mt-1">{prodi_homebase}</p>
        </div>
        {/* Status badge + Edit button */}
        <div className="flex items-center gap-2 ml-4">
          <Badge
            variant={status === "Aktif" ? "default" : "secondary"}
            className={status === "Aktif" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
          >
            {status}
          </Badge>
          {editButton}
        </div>
      </div>

      {/* Info Grid 2 columns */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {infoItems.map((item, index) => (
          <div key={index} className="flex flex-col">
            <label className="text-xs text-slate-400 font-medium">{item.label}</label>
            <p className="text-sm font-semibold text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Email - full width */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <label className="text-xs text-slate-400 font-medium">Email</label>
        <p className="text-sm font-semibold text-slate-800">{email || "-"}</p>
      </div>
    </div>
  );
}