"use client"

import EmptyState from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react";


interface GeneralInfoProps {
  informasiUmum: {
    periode_1: {
      nama_kegiatan: string;
      lokasi: string;
      tanggal_mulai: string;
      tanggal_selesai: string;
      jumlah_peserta: number;
      jumlah_lulus: number;
      rata_rata_rating: number;
    }[];
    periode_2: {
      nama_kegiatan: string;
      lokasi: string;
      tanggal_mulai: string;
      tanggal_selesai: string;
      jumlah_peserta: number;
      jumlah_lulus: number;
      rata_rata_rating: number;
    }[];
  };
}


export function GeneralInfo({ informasiUmum }: GeneralInfoProps) {
  const first = informasiUmum.periode_1[0] || null;
  const second = informasiUmum.periode_2[0] || null;

  // Jika kedua periode kosong, tampilkan EmptyState
  if (!first && !second) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informasi Umum</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState 
            title="Tidak ada data"
            subtitle="Data informasi umum belum tersedia untuk kedua periode."
            icon={Info}
            className="h-96"
          />
        </CardContent>
      </Card>
    );
  }

  // Default values untuk periode yang kosong
  const defaultPeriode = {
    nama_kegiatan: "-",
    lokasi: "-",
    tanggal_mulai: "-",
    tanggal_selesai: "-",
    jumlah_peserta: 0,
    jumlah_lulus: 0,
    rata_rata_rating: 0,
  };

  const periode1 = first || defaultPeriode;
  const periode2 = second || defaultPeriode;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">Informasi Umum</CardTitle>
        <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
          <div className="text-center py-1.5 bg-primary-50 rounded text-primary-700 font-medium">
            Periode 1
          </div>
          <div className="text-center py-1.5 bg-primary-50 rounded text-primary-700 font-medium">
            Periode 2
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Nama Kegiatan */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Nama Kegiatan</p>
            <p className="text-sm font-medium">{periode1.nama_kegiatan}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Nama Kegiatan</p>
            <p className="text-sm font-medium">{periode2.nama_kegiatan}</p>
          </div>
        </div>

        {/* Lokasi */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Lokasi</p>
            <p className="text-sm">{periode1.lokasi}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Lokasi</p>
            <p className="text-sm">{periode2.lokasi}</p>
          </div>
        </div>

        {/* Tanggal */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Tanggal</p>
            <p className="text-sm">
              {periode1.tanggal_mulai === "-" 
                ? "-" 
                : `${periode1.tanggal_mulai} - ${periode1.tanggal_selesai}`}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Tanggal</p>
            <p className="text-sm">
              {periode2.tanggal_mulai === "-" 
                ? "-" 
                : `${periode2.tanggal_mulai} - ${periode2.tanggal_selesai}`}
            </p>
          </div>
        </div>

        {/* Peserta & Lulus */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500 mb-1">Jumlah Peserta</p>
              <p className="text-lg font-semibold">{periode1.jumlah_peserta}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Jumlah Lulus</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-green-600">{periode1.jumlah_lulus}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Rata-rata Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{periode1.rata_rata_rating}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500 mb-1">Jumlah Peserta</p>
              <p className="text-lg font-semibold">{periode2.jumlah_peserta}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Jumlah Lulus</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-green-600">{periode2.jumlah_lulus}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Rata-rata Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{periode2.rata_rata_rating}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}