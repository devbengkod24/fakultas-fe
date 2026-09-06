"use client";

import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent } from "@/components/ui/card";
import  ProfileImageSection from "./profile-image-section";
import { Dosen } from "@/types/fakultas/penelitian/penelitian";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Pencil, X } from "lucide-react";
import { DosenFakultasService } from "@/api";
import { AuthorDetailSuperAdminServices } from "@/api/superadmin";
import { handleToastResponse } from "@/lib/toast-response";

interface ProfileCardProps {
  dosen: Dosen;
  onSuccess?: () => void;
  readOnly?: boolean;
  editScope?: "full" | "limited";
  isPublic?: boolean;
  canAssignProdi?: boolean;
}

export function ProfileCard({ dosen, onSuccess, readOnly = false, editScope = "full", isPublic = false, canAssignProdi = false }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // inisialisasi dari dosen.prodi_tugas yang sudah di-assign
  const initialProdiIds = Array.isArray(dosen.prodi_tugas)
    ? dosen.prodi_tugas.map((p: any) => Number(p.id)).filter(Boolean)
    : [];
  const [selectedProdiIds, setSelectedProdiIds] = useState<number[]>(initialProdiIds);

  // fetch list prodi — hanya saat canAssignProdi aktif
  const { data: prodiResponse } = useSWR(
    canAssignProdi && editScope === "full" ? "prodi-list" : null,
    () => DosenFakultasService.getProdi(),
    { revalidateOnFocus: false }
  );
  const prodiList: { id: number; nama: string }[] = prodiResponse?.data?.data ?? [];

  // Data SINTA dari API publikasi — dosen yang belum ter-link balikin success:false, blok SINTA
  // otomatis tidak dirender. limit 1 karena artikel/penelitian tidak dipakai di sini.
  const { data: sintaResponse } = useSWR(
    dosen.dosen_id ? ["sinta-profile", dosen.dosen_id] : null,
    () =>
      AuthorDetailSuperAdminServices.getDosenDetail({
        id: dosen.dosen_id,
        article_limit: 1,
        research_limit: 1,
      }),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );
  const sinta = sintaResponse?.data ?? null;

  const toggleProdi = (id: number) => {
    setSelectedProdiIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const [form, setForm] = useState({
    npp: dosen.npp || "",
    nidn: dosen.nidn || "",
    gelar_depan: dosen.gelar_depan || "",
    gelar_belakang: dosen.gelar_belakang || "",
    golongan: dosen.golongan || "",
    jabatan_fungsional: dosen.jabatan_fungsional || dosen.jabatan || "",
    bidang_kajian: dosen.bidang_kajian || "",
    scholar_link: dosen.scholar_link || "",
    telepon: dosen.telepon || "",
    email_alternatif: dosen.email_alternatif || "",
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res =
        editScope === "limited"
          ? await DosenFakultasService.updateProfil({
              bidang_kajian: form.bidang_kajian,
              scholar_link: form.scholar_link,
              telepon: form.telepon,
              email_alternatif: form.email_alternatif,
            })
          : await DosenFakultasService.update(
              (dosen as any).dosen_id ?? (dosen as any).id,
              {
                npp: form.npp,
                nidn: form.nidn,
                gelar_depan: form.gelar_depan,
                gelar_belakang: form.gelar_belakang,
                jabatan_fungsional: form.jabatan_fungsional,
                golongan: form.golongan,
                bidang_kajian: form.bidang_kajian,
                scholar_link: form.scholar_link,
                telepon: form.telepon,
                email_alternatif: form.email_alternatif,
                ...(canAssignProdi ? { prodi_ids: selectedProdiIds } : {}),
              }
            );
      handleToastResponse(res);
      if (res?.success) {
        setIsEditing(false);
        onSuccess?.();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const prodiHomebaseRaw =
    typeof dosen.prodi_homebase === "object" && dosen.prodi_homebase !== null
      ? dosen.prodi_homebase.nama
      : String(dosen.prodi_homebase ?? "-");

  // home_base sering null di endpoint publik — pakai department dari SINTA sebagai cadangan
  const prodiHomebase =
    prodiHomebaseRaw && prodiHomebaseRaw !== "-"
      ? prodiHomebaseRaw
      : sinta?.department || "-";

  const status = dosen.status || "Aktif";

  const namaLengkap = [
    form.gelar_depan,
    dosen.nama,
    form.gelar_belakang ? `, ${form.gelar_belakang}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className="rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <CardContent className="p-0">
        {/* Grid: foto kiri fixed, konten kanan scroll jika overflow */}
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr]">

          {/* FOTO — public: ikut tinggi card supaya tidak ada celah putih.
              Selain public: tetap 420px seperti semula */}
          <div
            className={`flex-shrink-0 ${
              isPublic ? "min-h-[420px]" : "h-[420px]"
            }`}
          >
            <ProfileImageSection
              fotoUrl={(dosen as any).foto_url}
              nama={dosen.nama}
            />
          </div>

          {/* KANAN — public: tumbuh mengikuti konten, tanpa scroll.
              Selain public (ada mode edit): tinggi tetap 420px, konten scroll jika overflow */}
          <div
            className={`p-6 flex flex-col ${
              isPublic ? "min-h-[420px]" : "h-[420px] overflow-y-auto"
            }`}
          >

            {/* HEADER */}
            <div className="flex items-start justify-between mb-4 flex-shrink-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <h2 className="text-2xl font-bold text-slate-900 break-words">
                    {namaLengkap}
                  </h2>
                  {sinta?.sinta_profile_url && (
                    <a
                      href={sinta.sinta_profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Lihat profil SINTA"
                      aria-label="Lihat profil SINTA"
                      className="shrink-0 mt-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                </div>
                <p className="text-slate-500 mt-1">{prodiHomebase}</p>
                {!!sinta?.subjects?.length && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {sinta.subjects.map((subject: string) => (
                      <Badge key={subject} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <Badge
                  variant={status === "Aktif" ? "default" : "secondary"}
                  className={status === "Aktif" ? "bg-primary text-white" : ""}
                >
                  {status}
                </Badge>
                {!readOnly && !isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {!readOnly && isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={loading}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* ── VIEW MODE ── */}
            {!isEditing && (
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-x-10">

                  {/* Kolom Kiri */}
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs text-slate-400">NPP</label>
                      <p className="font-semibold">{dosen.npp || "-"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">NIDN</label>
                      <p className="font-semibold">{dosen.nidn || "-"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Jabatan Fungsional</label>
                      <p className="font-semibold">{dosen.jabatan_fungsional || dosen.jabatan || "-"}</p>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Golongan</label>
                      <p className="font-semibold">{dosen.golongan || "-"}</p>
                    </div>
                    {isPublic ? (
                      <div>
                        <label className="text-xs text-slate-400">Email</label>
                        <p className="font-semibold break-all">{dosen.email || "-"}</p>
                      </div>
                    ) : (
                      <div>
                        <label className="text-xs text-slate-400">Bidang Kajian</label>
                        <p className="font-semibold">{dosen.bidang_kajian || "-"}</p>
                      </div>
                    )}
                  </div>

                  {/* Kolom Kanan */}
                  <div className="flex flex-col gap-4">
                    {!isPublic && (
                      <div>
                        <label className="text-xs text-slate-400">Prodi Tugas</label>
                        <p className="font-semibold">
                          {Array.isArray(dosen.prodi_tugas)
                            ? dosen.prodi_tugas.map((p: any) => p.nama).join(", ") || "-"
                            : "-"}
                        </p>
                      </div>
                    )}
                    {!isPublic && (
                      <div>
                        <label className="text-xs text-slate-400">Email</label>
                        <p className="font-semibold break-all">{dosen.email || "-"}</p>
                      </div>
                    )}
                    {!isPublic && (
                      <div>
                        <label className="text-xs text-slate-400">Telepon</label>
                        <p className="font-semibold">{dosen.telepon || "-"}</p>
                      </div>
                    )}
                    {!isPublic && (
                      <div>
                        <label className="text-xs text-slate-400">Email Alternatif</label>
                        <p className="font-semibold break-all">{dosen.email_alternatif || "-"}</p>
                      </div>
                    )}
                    {!isPublic && (
                      <div>
                        <label className="text-xs text-slate-400">Google Scholar</label>
                        {dosen.scholar_link ? (
                          
                            <a href={dosen.scholar_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 hover:underline block truncate"
                          >
                            {dosen.scholar_link}
                          </a>
                        ) : (
                          <p className="font-semibold">-</p>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* ── EDIT MODE ── */}
            {isEditing && (
              <div className="flex flex-col gap-3 flex-1">
                {editScope === "full" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs text-slate-500">NPP</Label>
                      <Input value={form.npp} onChange={(e) => handleChange("npp", e.target.value)} className="h-8 text-sm" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs text-slate-500">NIDN</Label>
                      <Input value={form.nidn} onChange={(e) => handleChange("nidn", e.target.value)} className="h-8 text-sm" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs text-slate-500">Gelar Depan</Label>
                      <Input value={form.gelar_depan} onChange={(e) => handleChange("gelar_depan", e.target.value)} className="h-8 text-sm" placeholder="Dr., Prof., Ir." />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs text-slate-500">Gelar Belakang</Label>
                      <Input value={form.gelar_belakang} onChange={(e) => handleChange("gelar_belakang", e.target.value)} className="h-8 text-sm" placeholder="S.Kom, M.Kom" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs text-slate-500">Jabatan Fungsional</Label>
                      <Input value={form.jabatan_fungsional} onChange={(e) => handleChange("jabatan_fungsional", e.target.value)} className="h-8 text-sm" placeholder="Lektor, Lektor Kepala" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs text-slate-500">Golongan</Label>
                      <Input value={form.golongan} onChange={(e) => handleChange("golongan", e.target.value)} className="h-8 text-sm" placeholder="IV/A, III/B" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs text-slate-500">Bidang Kajian</Label>
                    <Input value={form.bidang_kajian} onChange={(e) => handleChange("bidang_kajian", e.target.value)} className="h-8 text-sm" placeholder="SC, RPLD, SK3D" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs text-slate-500">Telepon</Label>
                    <Input value={form.telepon} onChange={(e) => handleChange("telepon", e.target.value)} className="h-8 text-sm" placeholder="+628123456789" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs text-slate-500">Email Alternatif</Label>
                    <Input value={form.email_alternatif} onChange={(e) => handleChange("email_alternatif", e.target.value)} className="h-8 text-sm" placeholder="email@contoh.com" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs text-slate-500">Google Scholar</Label>
                    <Input value={form.scholar_link} onChange={(e) => handleChange("scholar_link", e.target.value)} className="h-8 text-sm" placeholder="https://scholar.google.com/..." />
                  </div>
                </div>

                {/* Prodi Tugas — hanya super_fakultas */}
                {canAssignProdi && editScope === "full" && (
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs text-slate-500">Prodi Tugas</Label>
                    <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
                      {prodiList.length === 0 ? (
                        <p className="text-xs text-slate-400 col-span-2">Memuat...</p>
                      ) : (
                        prodiList.map((prodi) => (
                          <label key={prodi.id} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={selectedProdiIds.includes(prodi.id)}
                              onChange={() => toggleProdi(prodi.id)}
                            />
                            {prodi.nama}
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={loading}>
                    Batal
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={loading}>
                    {loading ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </CardContent>
    </Card>
  );
}