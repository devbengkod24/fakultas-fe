"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, CheckCircle2, MapPin, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Anggota {
  nama: string;
  peran: string;
}

interface Pengabdian {
  id: number;
  judul: string;
  abstrak: string;
  lokasi: string;
  mitra: string;
  tahun: string;
  sumberDana: string;
  besarDana: string;
  label: string;
  anggota: Anggota[];
  luaran: string[];
  peserta: number;
  status: string;
}

interface Props {
  pengabdian: Pengabdian | null;
  dosenId: string;
  baseUrl?: string;
}

export function PengabdianDetailClient({ pengabdian, dosenId, baseUrl = "/fakultas/manajemen-dosen/detail" }: Props) {
  const router = useRouter();

  if (!pengabdian) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Users className="h-12 w-12 text-slate-300" />
        <p className="text-slate-500 text-lg">Data pengabdian tidak ditemukan.</p>
        <Button variant="outline" onClick={() => router.push(`${baseUrl}/${dosenId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-500" />
              <CardTitle className="text-base text-slate-500 font-medium">
                Pengabdian Masyarakat
              </CardTitle>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge className="bg-green-100 text-green-700">{pengabdian.label}</Badge>
              <Badge
                className={
                  pengabdian.status === "Selesai"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }
              >
                {pengabdian.status}
              </Badge>
            </div>
          </div>
          <h1 className="text-xl font-bold text-slate-900 leading-snug mt-2">
            {pengabdian.judul}
          </h1>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Lokasi</p>
              <p className="text-slate-700 font-medium flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                {pengabdian.lokasi}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Mitra</p>
              <p className="text-slate-700 font-medium flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                {pengabdian.mitra}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Tahun</p>
              <p className="text-slate-700 font-medium">{pengabdian.tahun}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Jumlah Peserta</p>
              <p className="text-slate-700 font-medium">{pengabdian.peserta} orang</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Sumber Dana</p>
              <p className="text-slate-700 font-medium">{pengabdian.sumberDana}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Besar Dana</p>
              <p className="text-slate-700 font-medium">{pengabdian.besarDana}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deskripsi */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Deskripsi Kegiatan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 leading-relaxed text-sm">{pengabdian.abstrak}</p>
        </CardContent>
      </Card>

      {/* Tim Pelaksana */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Tim Pelaksana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pengabdian.anggota.map((a, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <p className="font-medium text-slate-800">{a.nama}</p>
                <span className="text-sm text-slate-400">{a.peran}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Luaran */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle2 className="h-4 w-4" />
            Luaran Kegiatan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {pengabdian.luaran.map((l, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                {l}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Back */}
      <div>
        <Button
          variant="outline"
          onClick={() => router.push(`${baseUrl}/${dosenId}`)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Detail Dosen
        </Button>
      </div>
    </div>
  );
}