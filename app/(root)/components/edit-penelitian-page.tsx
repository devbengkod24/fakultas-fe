"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Shield, ShieldOff } from "lucide-react";
import { useProfile } from "@/context/profileUseContext";
import { CoAuthorPicker, CoAuthorItem, coAuthorScope, samaOrang } from "./co-author-picker";
import { DosenFakultasService } from "@/api";
import { handleToastResponse } from "@/lib/toast-response";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SUMBER_DANA_OPTIONS,
  STATUS_DANA_OPTIONS,
} from "./tridharma-dialogs";

// Nilai Select untuk ketua yang bukan personil — id penulis selalu positif.
const KETUA_LUAR = -1;

interface EditPenelitianPageProps {
  penelitianId?: string | number;
  backUrl?: string;
  hideDashboardHeader?: boolean;
}

export default function EditPenelitianPage({
  penelitianId: penelitianIdProp,
}: EditPenelitianPageProps = {}) {
  const params = useParams();
  const router = useRouter();
  const { profile } = useProfile();
  const penelitianId =
    penelitianIdProp ?? (params as any)?.detailId ?? (params as any)?.penelitianId;

  const [found, setFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [coAuthors, setCoAuthors] = useState<CoAuthorItem[]>([]);
  const [initialAuthors, setInitialAuthors] = useState<CoAuthorItem[]>([]);

  const [form, setForm] = useState({
    judul: "",
    tahun: "",
    dana: "",
    sumber_dana: "",
    status_dana: "",
    fund_type: "",
    nama_ketua: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await DosenFakultasService.getPenelitianDetail(
          Number(penelitianId)
        );
        const detail = result?.data;
        if (!detail) return;

        setFound(true);
        setIsLocked(Boolean(detail.is_locked));
        setForm({
          judul: detail.judul ?? "",
          tahun: (detail.tahun ?? "").toString(),
          dana: detail.dana == null ? "" : detail.dana.toString(),
          // DB menyimpan "INTERNAL SOURCE" (spasi) sementara nilai opsi Select
          // memakai "INTERNAL_SOURCE" (underscore) — bentuk yang sama dengan
          // yang diterima BE untuk filter. Tanpa konversi ini Select-nya kosong
          // untuk SEMUA penelitian dan admin tidak tahu sumber dananya apa.
          sumber_dana: (detail.sumber_dana ?? "").replace(/ /g, "_"),
          status_dana: detail.status_dana ?? "",
          fund_type: detail.fund_type ?? "",
          nama_ketua: detail.nama_ketua ?? "",
        });

        // BE mengirim `authors` (search/researches.py), bukan `coleaders`.
        const list: CoAuthorItem[] = (detail.authors ?? []).map((a: any) => ({
          author_id: a.author_id,
          author_name: a.nama,
          dosen_id: a.dosen_id ?? null,
          is_primary: Boolean(a.is_leader ?? a.is_primary),
        }));
        setCoAuthors(list);
        setInitialAuthors(list);
      } catch (error) {
        console.error("Error fetching penelitian:", error);
      } finally {
        setLoading(false);
      }
    };

    if (penelitianId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [penelitianId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Ketua dipilih dari personil penelitian ini saja — cerminan "Penulis Utama"
  // di form artikel, yang juga memilih dari daftar penulisnya sendiri.
  //
  // Dicocokkan dengan samaOrang(), BUKAN ===. Dari 626 penelitian cuma 3 yang
  // nama_ketua-nya sama persis dengan nama anggota; 478 lainnya cuma beda
  // kapitalisasi/gelar. Dengan === hampir semua penelitian akan salah dilabeli
  // "bukan personil" dan ketuanya tidak ter-select.
  //
  // Sisanya (145) memang berketua orang luar hasil scrape SINTA yang tidak punya
  // baris personil. Namanya tetap ditawarkan sebagai opsi supaya menyimpan tidak
  // diam-diam menggantinya.
  const kandidatKetua = coAuthors.filter((c) => c.author_name);
  const ketuaTerpilih = kandidatKetua.find((c) => samaOrang(c.author_name, form.nama_ketua));
  const ketuaLuar = !ketuaTerpilih && form.nama_ketua ? form.nama_ketua : null;

  const scope = coAuthorScope(profile, initialAuthors);
  // Dosen non-primary: satu-satunya perubahan sah adalah mencoret dirinya sendiri.
  const leavingSelf =
    !scope.canManage &&
    scope.myAuthorId != null &&
    !coAuthors.some((c) => c.author_id === scope.myAuthorId);

  // Lock cuma perisai terhadap sync — di-toggle sadar, bukan efek samping simpan.
  const toggleLock = async (next: boolean) => {
    setIsLocked(next);
    try {
      await DosenFakultasService.updatePenelitian(Number(penelitianId), { is_locked: next });
      handleToastResponse({
        success: true,
        message: next ? "Data berhasil diproteksi dari sync" : "Proteksi data berhasil dilepas",
      });
    } catch {
      handleToastResponse({
        success: false,
        message: next ? "Gagal memproteksi data" : "Gagal melepas proteksi",
      });
      setIsLocked(!next);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Co-author (termasuk coleader) punya endpoint sendiri; PUT tidak menerimanya.
      //
      // URUTANNYA PENTING, dan berbeda per peran — sama persis dengan
      // edit-publikasi-page.tsx:
      //
      // - Staf/ketua: PATCH DULU, baru PUT. PUT-lah yang memindahkan ketua
      //   (lewat nama_ketua), dan PATCH menguji "kamu ketua?" terhadap keadaan
      //   SESUDAH PUT. Kalau PUT jalan duluan, ketua yang baru saja menyerahkan
      //   jabatannya ditolak 403 di request kedua padahal dia yang melakukannya.
      // - Dosen yang mengeluarkan dirinya sendiri: PUT DULU, baru PATCH. Begitu
      //   dia keluar, PUT menolaknya karena dia bukan personil penelitian ini lagi.
      const saveCoAuthors = () =>
        scope.canManage
          ? DosenFakultasService.updatePenelitianCoAuthors(Number(penelitianId), {
              co_author_ids: coAuthors.map((c) => c.author_id).filter(Boolean),
              action: "replace",
            })
          : leavingSelf
          ? DosenFakultasService.updatePenelitianCoAuthors(Number(penelitianId), {
              co_author_ids: [scope.myAuthorId as number],
              action: "remove",
            })
          : Promise.resolve(null);

      const savePayload = () =>
        DosenFakultasService.updatePenelitian(Number(penelitianId), {
          judul: form.judul,
          tahun: form.tahun ? Number(form.tahun) : undefined,
          dana: form.dana === "" ? undefined : Number(form.dana),
          sumber_dana: form.sumber_dana || undefined,
          status_dana: form.status_dana || undefined,
          fund_type: form.fund_type || undefined,
          // Hanya staf/ketua yang boleh menggantinya. FE tidak boleh mengirim apa
          // yang tidak berhak diubah: BE menguji ini sebagai PERUBAHAN, jadi
          // mengirim nilai yang sama pun aman — tapi anggota biasa tidak perlu
          // ikut mengirimnya sama sekali. Cermin edit-publikasi-page.tsx.
          nama_ketua: scope.canManage ? form.nama_ketua || undefined : undefined,
        });

      let res;
      if (scope.canManage) {
        const coRes = await saveCoAuthors();
        if (coRes && coRes.success === false) {
          handleToastResponse({
            success: false,
            message: coRes.message || "Anggota peneliti gagal disimpan",
          });
          return;
        }
        res = await savePayload();
        if (res && res.success === false) {
          throw new Error(res.message || "Gagal update");
        }
      } else {
        res = await savePayload();
        if (res && res.success === false) {
          throw new Error(res.message || "Gagal update");
        }
        const coRes = await saveCoAuthors();
        if (coRes && coRes.success === false) {
          handleToastResponse({
            success: false,
            message: coRes.message || "Penelitian tersimpan, anggota peneliti gagal",
          });
          return;
        }
      }

      handleToastResponse({ success: true, message: "Berhasil update penelitian" });
      router.back();
    } catch (error) {
      console.error(error);
      handleToastResponse({ success: false, message: "Gagal update penelitian" });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!found) return <p>Data tidak ditemukan</p>;

  return (
    <div className="w-full">
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-0 h-auto"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            Edit Penelitian
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lock Status Banner */}
          {isLocked ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">Data ini sudah diproteksi dari sync</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleLock(false)}
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                <ShieldOff className="h-4 w-4 mr-1" />
                Lepas Proteksi
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-700">
                <ShieldOff className="h-5 w-5" />
                <span className="text-sm">Data dapat diedit dan akan ter-sync otomatis</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleLock(true)}
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <Shield className="h-4 w-4 mr-1" />
                Lindungi Data
              </Button>
            </div>
          )}

          {/* Judul */}
          <div className="space-y-1.5">
            <Label htmlFor="judul">Judul</Label>
            <Input
              id="judul"
              name="judul"
              value={form.judul}
              onChange={handleChange}
              placeholder="Judul penelitian"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Tahun */}
            <div className="space-y-1.5">
              <Label htmlFor="tahun">Tahun</Label>
              <Input
                id="tahun"
                name="tahun"
                type="number"
                value={form.tahun}
                onChange={handleChange}
                placeholder="2024"
              />
            </div>

            {/* Dana */}
            <div className="space-y-1.5">
              <Label htmlFor="dana">Dana</Label>
              <Input
                id="dana"
                name="dana"
                type="number"
                value={form.dana}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          {/* Sumber Dana */}
          <div className="space-y-1.5">
            <Label>Sumber Dana</Label>
            <Select
              value={form.sumber_dana}
              onValueChange={(v) => handleSelect("sumber_dana", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih sumber dana" />
              </SelectTrigger>
              <SelectContent>
                {SUMBER_DANA_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Status Dana */}
            <div className="space-y-1.5">
              <Label>Status Dana</Label>
              <Select
                value={form.status_dana}
                onValueChange={(v) => handleSelect("status_dana", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_DANA_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Jenis Penelitian */}
            <div className="space-y-1.5">
              <Label htmlFor="fund_type">Jenis Penelitian</Label>
              <Input
                id="fund_type"
                name="fund_type"
                value={form.fund_type}
                onChange={handleChange}
                placeholder="mis. PROGRAM HIBAH INTERNAL ( PDPT )"
              />
            </div>
          </div>

          {/* Nama Ketua — dipilih dari Anggota Peneliti di bawah, bukan dari
              seluruh daftar penulis. Ketua yang bukan personil jadi ketua-hantu:
              BE menambahkannya lewat _pastikan_ketua_jadi_personil, lalu PATCH
              "replace" beberapa milidetik kemudian menghapusnya lagi karena
              daftar di state ini tidak memuatnya. */}
          <div className="space-y-1.5">
            <Label>Nama Ketua</Label>
            <Select
              value={(ketuaTerpilih?.author_id ?? KETUA_LUAR).toString()}
              onValueChange={(v) => {
                const dipilih = kandidatKetua.find((c) => c.author_id.toString() === v);
                // Hanya ditimpa saat benar-benar diganti. Kalau tidak, nama_ketua
                // yang tersimpan dikirim apa adanya — 478 baris tidak perlu
                // ditulis ulang kapitalisasinya cuma karena form dibuka.
                if (dipilih) handleSelect("nama_ketua", dipilih.author_name);
              }}
              disabled={!scope.canManage}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih ketua" />
              </SelectTrigger>
              <SelectContent>
                {ketuaLuar && (
                  <SelectItem value={KETUA_LUAR.toString()}>
                    {ketuaLuar} (bukan personil)
                  </SelectItem>
                )}
                {kandidatKetua.map((c) => (
                  <SelectItem key={c.author_id} value={c.author_id.toString()}>
                    {c.author_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <CoAuthorPicker
              value={coAuthors}
              onChange={setCoAuthors}
              canAdd={scope.canManage}
              canRemove={scope.canRemove}
              label="Anggota Peneliti"
              note={
                scope.canManage
                  ? "Ketua ditentukan lewat field Nama Ketua di atas."
                  : "Anda anggota di penelitian ini. Anda hanya bisa mengeluarkan diri sendiri; anggota lain cuma bisa diubah oleh ketua atau admin."
              }
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => router.back()} disabled={isSaving}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</> : "Simpan"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
