"use client";

import { BookOpen, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import type { MataKuliahItem } from "@/types/admin/akademik-page/daftar-mata-kuliah/daftar-mata-kuliah";
import type { MataKuliahPeminatanItem } from "@/types/admin/akademik-page/mata-kuliah-peminatan/mata-kuliah-peminatan";

// ─── Error ────────────────────────────────────────────────────────────────────

interface DaftarMataKuliahErrorStateProps {
  onRetry?: () => void;
}

export const DaftarMataKuliahErrorState = ({ onRetry }: DaftarMataKuliahErrorStateProps) => {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="bg-[#fff5f5] border border-[#feb2b2] rounded-2xl shadow-sm p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-8 bg-[#fed7d7] rounded-full flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-[#e53e3e]" />
        </div>
        <h3 className="text-2xl font-bold text-[#9b2c2c] mb-4">Terjadi Kesalahan</h3>
        <p className="text-[#c53030] mb-8 max-w-lg mx-auto leading-relaxed text-lg">
          Gagal memuat data mata kuliah. Silakan coba lagi atau hubungi administrator jika masalah berlanjut.
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bg-[#e53e3e] hover:bg-[#c53030] text-white px-8 h-12 rounded-full font-semibold shadow-md transition-all hover:scale-105 active:scale-95 border-none"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Coba Lagi
          </Button>
        )}
      </div>
    </div>
  );
};

// ─── Empty ────────────────────────────────────────────────────────────────────

interface DaftarMataKuliahEmptyStateProps {
  type: "umum" | "peminatan";
  title?: string;
  description?: string;
  onRefresh?: () => void;
}

export const DaftarMataKuliahEmptyState = ({
  type,
  title = "Belum Ada Data Mata Kuliah",
  description = "Saat ini belum ada data mata kuliah yang tersedia. Silakan cek kembali nanti atau hubungi administrator.",
  onRefresh,
}: DaftarMataKuliahEmptyStateProps) => {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-8 bg-prodi-subtle rounded-full flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed text-lg">
          {type === "peminatan" 
            ? "Belum ada data mata kuliah peminatan yang tersedia untuk program studi ini."
            : description}
        </p>
        {onRefresh && (
          <Button
            onClick={onRefresh}
            className="bg-primary hover:bg-primary-600 text-white px-8 h-12 rounded-full font-semibold shadow-md transition-all hover:scale-105 active:scale-95 border-none"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Muat Ulang
          </Button>
        )}
      </div>
    </div>
  );
};
