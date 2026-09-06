"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ARTICLE_SUMBER_OPTIONS } from "./tridharma-dialogs";
import { ArrowLeft, Loader2, Shield, ShieldOff } from "lucide-react";
import { useProfile } from "@/context/profileUseContext";
import { CoAuthorPicker, CoAuthorItem, coAuthorScope } from "./co-author-picker";
import { DosenFakultasService } from "@/api";
import { handleToastResponse } from "@/lib/toast-response";
import DashboardHeader from "@/components/dashboard-header";

interface EditPublikasiPageProps {
  articleId: number;
  backUrl: string;
  hideDashboardHeader?: boolean;
}

export default function EditPublikasiPage({ articleId, backUrl, hideDashboardHeader }: EditPublikasiPageProps) {
  const router = useRouter();
  const { profile } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    judul: "",
    tahun: new Date().getFullYear(),
    jurnal: "",
    doi: "",
    accred: "",
    abstrak: "",
    url_artikel: "",
    sumber: "GARUDA",
    jumlah_sitasi: "" as number | string,
    is_locked: false,
  });
  // urutan_penulis = 1. Sebelum ini tidak ada jalur API mana pun yang bisa
  // menggesernya: PATCH co-authors justru mempertahankan baris primary.
  const [penulisUtamaId, setPenulisUtamaId] = useState<number | null>(null);

  const [coAuthors, setCoAuthors] = useState<CoAuthorItem[]>([]);
  // Daftar awal dari server — dipakai membandingkan apa yang berubah, dan
  // menentukan siapa primary (BE tetap gerbang sebenarnya).
  const [initialAuthors, setInitialAuthors] = useState<CoAuthorItem[]>([]);

  // Track if form has been modified by user
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_PUBLIKASI_URL}/articles/${articleId}`,
          { method: "GET" }
        );
        const data = await res.json();
        if (data?.success && data?.data) {
          const d = data.data;
          setForm({
            judul: d.title ?? d.judul ?? "",
            tahun: d.year ?? d.tahun ?? new Date().getFullYear(),
            jurnal: d.journal ?? d.jurnal ?? "",
            doi: d.doi ?? "",
            accred: d.accred ?? "",
            abstrak: d.abstrak ?? d.abstract ?? "",
            url_artikel: d.article_url ?? d.url_artikel ?? "",
            // Artikel lama bisa bersumber "MANUAL"; itu bukan pilihan yang
            // ditawarkan lagi, jadi jatuhkan ke GARUDA supaya Select punya
            // nilai yang valid dan admin bisa membetulkannya.
            sumber: ARTICLE_SUMBER_OPTIONS.some((o) => o.value === (d.source ?? d.sumber))
              ? (d.source ?? d.sumber)
              : "GARUDA",
            jumlah_sitasi: d.citation_count ?? d.jumlah_sitasi ?? "",
            is_locked: d.is_locked ?? false,
          });
          setIsModified(false);
          if (d.authors && Array.isArray(d.authors)) {
            const list: CoAuthorItem[] = d.authors.map((a: any) => ({
              author_id: a.author_id,
              author_name: a.author_name ?? a.nama,
              dosen_id: a.dosen_id ?? null,
              is_primary: Boolean(a.is_primary),
            }));
            setCoAuthors(list);
            setInitialAuthors(list);
            setPenulisUtamaId((list.find((a) => a.is_primary) ?? list[0])?.author_id ?? null);
          }
        }
      } catch (err) {
        console.error("Error fetch detail artikel:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [articleId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "tahun" ? parseInt(value) || 0 : value,
    }));
    setIsModified(true);
  };

  const toggleLock = async (next: boolean) => {
    setForm((prev) => ({ ...prev, is_locked: next }));
    try {
      await DosenFakultasService.updateArtikel(articleId, { is_locked: next });
      handleToastResponse({
        success: true,
        message: next ? "Data berhasil diproteksi dari sync" : "Proteksi data berhasil dilepas",
      });
    } catch {
      handleToastResponse({ success: false, message: next ? "Gagal memproteksi data" : "Gagal melepas proteksi" });
      setForm((prev) => ({ ...prev, is_locked: !next }));
    }
  };

  const scope = coAuthorScope(profile, initialAuthors);
  // Dosen non-primary: satu-satunya perubahan sah adalah mencoret dirinya sendiri.
  const leavingSelf =
    !scope.canManage &&
    scope.myAuthorId != null &&
    !coAuthors.some((c) => c.author_id === scope.myAuthorId);

  const handleSubmit = async () => {
    if (!form.judul || !form.jurnal || !form.tahun) {
      handleToastResponse({ success: false, message: "Judul, jurnal, dan tahun wajib diisi." });
      return;
    }
    setIsSaving(true);
    try {
      // is_locked TIDAK ikut di-set di sini. Lock adalah perisai terhadap sync
      // yang di-toggle sadar lewat banner di atas, bukan efek samping menyimpan.
      const payload: Record<string, unknown> = {
        judul: form.judul,
        tahun: form.tahun,
        jurnal: form.jurnal,
      };
      if (form.doi) payload.doi = form.doi;
      if (form.accred) payload.accred = form.accred;
      if (form.abstrak) payload.abstrak = form.abstrak;
      if (form.url_artikel) payload.url_artikel = form.url_artikel;
      payload.sumber = form.sumber;
      if (form.jumlah_sitasi !== "") payload.jumlah_sitasi = Number(form.jumlah_sitasi);
      // Hanya staf/primary yang boleh menggeser penulis utama, dan hanya kalau
      // orangnya masih ada di daftar setelah diedit.
      if (
        scope.canManage &&
        penulisUtamaId != null &&
        coAuthors.some((c) => c.author_id === penulisUtamaId)
      ) {
        payload.penulis_utama_id = penulisUtamaId;
      }

      // Co-author tidak bisa lewat PUT (ArticleUpdateRequest tidak punya
      // field-nya) — endpoint-nya terpisah, jadi satu klik Simpan = dua request.
      //
      // URUTANNYA PENTING, dan berbeda per peran:
      //
      // - Staf/penulis utama: PATCH DULU, baru PUT. PUT-lah yang menyerahkan
      //   penulis utama ke orang lain, dan PATCH menguji "kamu penulis utama?"
      //   terhadap keadaan SESUDAH PUT. Kalau PUT jalan duluan, penulis utama
      //   yang baru saja menyerahkan jabatannya langsung ditolak 403 di request
      //   kedua padahal dia yang melakukannya. Urutan ini juga membuat "tambah
      //   orang baru sekalian jadikan penulis utama" bisa dalam satu simpan:
      //   orangnya sudah ada di junction saat PUT memvalidasinya.
      //   `replace` mempertahankan baris urutan_penulis=1 (article_crud.py:557),
      //   jadi hak si penyimpan masih utuh waktu PUT dijalankan.
      //
      // - Dosen yang mengeluarkan dirinya sendiri: PUT DULU, baru PATCH.
      //   Begitu dia keluar dari daftar penulis, PUT menolaknya karena dia bukan
      //   penulis artikel ini lagi.
      const saveCoAuthors = () =>
        scope.canManage
          ? DosenFakultasService.updateArtikelCoAuthors(articleId, {
              co_author_ids: coAuthors.map((c) => c.author_id).filter(Boolean),
              action: "replace",
            })
          : leavingSelf
          ? DosenFakultasService.updateArtikelCoAuthors(articleId, {
              co_author_ids: [scope.myAuthorId as number],
              action: "remove",
            })
          : Promise.resolve(null);

      const savePayload = () =>
        DosenFakultasService.updateArtikel(
          articleId,
          payload as Parameters<typeof DosenFakultasService.updateArtikel>[1]
        );

      let res;
      if (scope.canManage) {
        const coRes = await saveCoAuthors();
        if (coRes && coRes.success === false) {
          handleToastResponse({ success: false, message: coRes.message || "Penulis pendamping gagal disimpan" });
          return;
        }
        res = await savePayload();
      } else {
        res = await savePayload();
        if (res?.success) {
          const coRes = await saveCoAuthors();
          if (coRes && coRes.success === false) {
            handleToastResponse({ success: false, message: coRes.message || "Artikel tersimpan, penulis pendamping gagal" });
            return;
          }
        }
      }

      handleToastResponse(res);
      if (res?.success) {
        router.push(backUrl);
      }
    } catch {
      handleToastResponse({ success: false, message: "Gagal memperbarui artikel." });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {!hideDashboardHeader && (
        <DashboardHeader
          breadcrumbItems={[
            { name: "Dashboard", url: "/" },
            { name: "Profile", url: backUrl },
            { name: "Edit Publikasi", url: "#" },
          ]}
          titleItems={[{ title: "Edit Publikasi", subtitle: "Perbarui data artikel publikasi" }]}
        />
      )}

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(backUrl)}
              className="p-0 h-auto"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            Detail Publikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lock = perisai terhadap sync, bukan pemblokir edit. Toggle dua arah. */}
          {form.is_locked ? (
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
          <div className="space-y-1.5">
            <Label htmlFor="judul">Judul <span className="text-red-500">*</span></Label>
            <Input
              id="judul"
              name="judul"
              value={form.judul}
              onChange={handleChange} placeholder="Judul artikel"              />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tahun">Tahun <span className="text-red-500">*</span></Label>
              <Input
              id="tahun"
              name="tahun"
              type="number"
              value={form.tahun}
              onChange={handleChange} placeholder="2024" min={1990} max={new Date().getFullYear() + 1}              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="accred">Akreditasi</Label>
              <Input
              id="accred"
              name="accred"
              value={form.accred}
              onChange={handleChange} placeholder="Sinta 2, Q1, dll"              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Sumber <span className="text-red-500">*</span></Label>
              <Select
                value={form.sumber}
                onValueChange={(v) => { setForm((p) => ({ ...p, sumber: v })); setIsModified(true); }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih sumber" />
                </SelectTrigger>
                <SelectContent>
                  {ARTICLE_SUMBER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jumlah_sitasi">Jumlah Sitasi</Label>
              <Input
                id="jumlah_sitasi"
                name="jumlah_sitasi"
                type="number"
                min={0}
                value={form.jumlah_sitasi}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="jurnal">Jurnal <span className="text-red-500">*</span></Label>
            <Input
            id="jurnal"
            name="jurnal"
            value={form.jurnal}
            onChange={handleChange} placeholder="Nama jurnal"            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doi">DOI</Label>
            <Input
            id="doi"
            name="doi"
            value={form.doi}
            onChange={handleChange} placeholder="10.xxxx/xxxx"            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="url_artikel">URL Artikel</Label>
            <Input
            id="url_artikel"
            name="url_artikel"
            value={form.url_artikel}
            onChange={handleChange} placeholder="https://..."            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="abstrak">Abstrak</Label>
            <Textarea
              id="abstrak"
              name="abstrak"
              value={form.abstrak}
              onChange={handleChange}
              placeholder="Abstrak artikel..."
              rows={4}              />
          </div>

          {scope.canManage && coAuthors.length > 0 && (
            <div className="space-y-1.5">
              <Label>Penulis Utama</Label>
              <Select
                value={(penulisUtamaId ?? coAuthors[0]?.author_id ?? 0).toString()}
                onValueChange={(v) => { setPenulisUtamaId(Number(v)); setIsModified(true); }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih penulis utama" />
                </SelectTrigger>
                <SelectContent>
                  {coAuthors.map((a) => (
                    <SelectItem key={a.author_id} value={a.author_id.toString()}>
                      {a.author_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            <CoAuthorPicker
              value={coAuthors}
              onChange={setCoAuthors}
              canAdd={scope.canManage}
              canRemove={scope.canRemove}
              label="Penulis Pendamping"
              note={
                scope.canManage
                  ? undefined
                  : "Anda penulis pendamping di artikel ini. Anda hanya bisa mengeluarkan diri sendiri; penulis lain cuma bisa diubah oleh penulis utama atau admin."
              }
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => router.push(backUrl)} disabled={isSaving}>Batal</Button>
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</> : "Simpan"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
