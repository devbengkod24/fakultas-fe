"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DosenFakultasService } from "@/api";
import { handleToastResponse } from "@/lib/toast-response";
import { CoAuthorPicker, CoAuthorItem } from "./co-author-picker";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CreateArtikelDialogProps {
  open: boolean;
  authorId: number;
  /** Nama dosen yang halamannya dibuka — jadi default penulis utama. */
  authorName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface CreatePenelitianDialogProps {
  open: boolean;
  authorId: number;
  /** Nama dosen yang halamannya dibuka — jadi default nama ketua. Aman dipakai
   *  apa adanya: `same_person()` di BE menerima `users.name` maupun
   *  `nama_penulis`, dan nama ini salah satunya. */
  authorName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

// ─── Konstanta ───────────────────────────────────────────────────────────────

// Artikel input tangan tetap harus mengaku dari salah satu dari tiga sumber ini.
// "MANUAL" sengaja tidak ditawarkan — nilai itu bikin kategori tersendiri yang
// tidak dikenali laporan mana pun.
export const ARTICLE_SUMBER_OPTIONS = [
  { value: "GARUDA", label: "Garuda" },
  { value: "SCOPUS", label: "Scopus" },
  { value: "GOOGLE_SCHOLAR", label: "Google Scholar" },
];

export const SUMBER_DANA_OPTIONS = [
  { value: "INTERNAL_SOURCE", label: "Internal" },
  { value: "BIMA_SOURCE", label: "BIMA" },
  { value: "SIMLITABMAS_SOURCE", label: "Simlitabmas" },
];

// Kosakata yang sama dengan yang ditulis scraper SINTA
// (repository/research_crawl.py:62) dan template import. "active"/"inactive"
// dulu dikarang khusus untuk form ini dan tidak pernah cocok: 623 dari 624
// penelitian bernilai "Approved", jadi entri manual selamanya terbaca belum
// approved dan Select-nya kosong saat membuka data hasil scrape.
export const STATUS_DANA_OPTIONS = [
  { value: "Approved", label: "Approved" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Completed", label: "Completed" },
  { value: "Pending", label: "Pending" },
  { value: "Rejected", label: "Rejected" },
];

// fund_type sengaja TIDAK pakai Select: SINTA menulisnya bebas dan sudah ada
// 62 varian berbeda di DB ("PROGRAM HIBAH INTERNAL ( PDPT )",
// "Penelitian Kompetitif Nasional ( PDP/Dosen Pemula )", ...). Daftar tertutup
// apa pun akan meleset, dan memaksanya bikin nilai asli hilang saat diedit.

// ─── Create Artikel Dialog ────────────────────────────────────────────────────

export function CreateArtikelDialog({
  open,
  authorId,
  authorName,
  onClose,
  onSuccess,
}: CreateArtikelDialogProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    judul: "",
    tahun: new Date().getFullYear(),
    jurnal: "",
    doi: "",
    accred: "",
    abstrak: "",
    url_artikel: "",
    sumber: "GARUDA",
    jumlah_sitasi: "",
    is_locked: false,
  });

  const [selectedCoAuthors, setSelectedCoAuthors] = useState<CoAuthorItem[]>([]);
  // Default penulis utama = dosen halaman. Dulu urutan 1 dipaksa ke dia tanpa
  // pilihan, padahal dia sering bukan penulis pertama paper-nya.
  const [penulisUtamaId, setPenulisUtamaId] = useState<number>(authorId);

  const kandidatUtama = [
    { author_id: authorId, author_name: authorName || "Dosen ini" },
    ...selectedCoAuthors,
  ];
  // Kalau yang dipilih dihapus dari daftar co-author, balik ke dosen halaman.
  const penulisUtamaValid = kandidatUtama.some((k) => k.author_id === penulisUtamaId)
    ? penulisUtamaId
    : authorId;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "tahun" ? parseInt(value) || 0 : value,
    }));
  };

  const handleReset = () => {
    setForm({
      judul: "",
      tahun: new Date().getFullYear(),
      jurnal: "",
      doi: "",
      accred: "",
      abstrak: "",
      url_artikel: "",
      sumber: "GARUDA",
      jumlah_sitasi: "",
      is_locked: false,
    });
    setSelectedCoAuthors([]);
    setPenulisUtamaId(authorId);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.judul || !form.jurnal || !form.tahun) {
      handleToastResponse({ success: false, message: "Judul, jurnal, dan tahun wajib diisi." });
      return;
    }
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        judul: form.judul,
        tahun: form.tahun,
        jurnal: form.jurnal,
        is_locked: form.is_locked,
      };
      if (form.doi) payload.doi = form.doi;
      if (form.accred) payload.accred = form.accred;
      if (form.abstrak) payload.abstrak = form.abstrak;
      if (form.url_artikel) payload.url_artikel = form.url_artikel;
      payload.sumber = form.sumber;
      if (form.jumlah_sitasi !== "") payload.jumlah_sitasi = Number(form.jumlah_sitasi);
      if (selectedCoAuthors.length > 0) payload.co_author_ids = selectedCoAuthors.map(co => co.author_id);
      payload.penulis_utama_id = penulisUtamaValid;

      const res = await DosenFakultasService.createArtikel(authorId, payload as Parameters<typeof DosenFakultasService.createArtikel>[1]);
      handleToastResponse(res);
      if (res?.success) {
        handleClose();
        onSuccess();
      }
    } catch {
      handleToastResponse({ success: false, message: "Gagal menambahkan artikel." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Publikasi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Judul */}
          <div className="space-y-1.5">
            <Label htmlFor="judul">
              Judul <span className="text-red-500">*</span>
            </Label>
            <Input
              id="judul"
              name="judul"
              value={form.judul}
              onChange={handleChange}
              placeholder="Judul artikel"
            />
          </div>

          {/* Tahun & Accred */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tahun">
                Tahun <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tahun"
                name="tahun"
                type="number"
                value={form.tahun}
                onChange={handleChange}
                placeholder="2024"
                min={1990}
                max={new Date().getFullYear() + 1}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="accred">Akreditasi</Label>
              <Input
                id="accred"
                name="accred"
                value={form.accred}
                onChange={handleChange}
                placeholder="Sinta 2, Q1, dll"
              />
            </div>
          </div>

          {/* Sumber & Jumlah Sitasi */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>
                Sumber <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.sumber}
                onValueChange={(v) => setForm((prev) => ({ ...prev, sumber: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih sumber" />
                </SelectTrigger>
                <SelectContent>
                  {ARTICLE_SUMBER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
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

          {/* Jurnal */}
          <div className="space-y-1.5">
            <Label htmlFor="jurnal">
              Jurnal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="jurnal"
              name="jurnal"
              value={form.jurnal}
              onChange={handleChange}
              placeholder="Nama jurnal"
            />
          </div>

          {/* DOI */}
          <div className="space-y-1.5">
            <Label htmlFor="doi">DOI</Label>
            <Input
              id="doi"
              name="doi"
              value={form.doi}
              onChange={handleChange}
              placeholder="10.xxxx/xxxx"
            />
          </div>

          {/* URL Artikel */}
          <div className="space-y-1.5">
            <Label htmlFor="url_artikel">URL Artikel</Label>
            <Input
              id="url_artikel"
              name="url_artikel"
              value={form.url_artikel}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <CoAuthorPicker
            value={selectedCoAuthors}
            onChange={setSelectedCoAuthors}
            excludeAuthorId={authorId}
            label="Penulis Pendamping"
          />

          {/* Penulis Utama — yang dapat urutan_penulis = 1 */}
          <div className="space-y-1.5">
            <Label>Penulis Utama</Label>
            <Select
              value={penulisUtamaValid.toString()}
              onValueChange={(v) => setPenulisUtamaId(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih penulis utama" />
              </SelectTrigger>
              <SelectContent>
                {kandidatUtama.map((k) => (
                  <SelectItem key={k.author_id} value={k.author_id.toString()}>
                    {k.author_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Default dosen ini. Ganti kalau dia bukan penulis pertama artikelnya.
            </p>
          </div>

          {/* Abstrak */}
          <div className="space-y-1.5">
            <Label htmlFor="abstrak">Abstrak</Label>
            <Textarea
              id="abstrak"
              name="abstrak"
              value={form.abstrak}
              onChange={handleChange}
              placeholder="Abstrak artikel..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Create Penelitian Dialog ─────────────────────────────────────────────────

export function CreatePenelitianDialog({
  open,
  authorId,
  authorName,
  onClose,
  onSuccess,
}: CreatePenelitianDialogProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    judul: "",
    tahun: new Date().getFullYear(),
    dana: "",
    sumber_dana: "",
    status_dana: "",
    fund_type: "",
    is_locked: false,
  });

  // Coleader = co-author biasa, dan BE menerima daftar — jadi multi-select,
  // sama persis dengan dialog artikel.
  const [selectedCoAuthors, setSelectedCoAuthors] = useState<CoAuthorItem[]>([]);

  // Ketua dipilih dari anggota penelitian ini saja — cerminan "Penulis Utama"
  // di dialog artikel. BE menentukan is_leader dengan mencocokkan string
  // nama_ketua (helpers/permissions.py::same_person), jadi namanya diambil dari
  // kandidat, tidak pernah diketik bebas.
  const [ketuaId, setKetuaId] = useState<number>(authorId);

  const kandidatKetua = [
    { author_id: authorId, author_name: authorName || "Dosen ini" },
    ...selectedCoAuthors,
  ];
  // Kalau yang dipilih dicoret dari anggota, ketua balik ke dosen halaman.
  const ketuaValid = kandidatKetua.some((k) => k.author_id === ketuaId) ? ketuaId : authorId;
  const namaKetua = kandidatKetua.find((k) => k.author_id === ketuaValid)?.author_name;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "tahun" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelect = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setForm({
      judul: "",
      tahun: new Date().getFullYear(),
      dana: "",
      sumber_dana: "",
      status_dana: "",
      fund_type: "",
      is_locked: false,
    });
    setSelectedCoAuthors([]);
    setKetuaId(authorId);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.judul || !form.tahun) {
      handleToastResponse({ success: false, message: "Judul dan tahun wajib diisi." });
      return;
    }
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        judul: form.judul,
        tahun: form.tahun,
        is_locked: form.is_locked,
      };
      if (form.dana) payload.dana = parseInt(form.dana);
      if (form.sumber_dana) payload.sumber_dana = form.sumber_dana;
      if (form.status_dana) payload.status_dana = form.status_dana;
      if (form.fund_type) payload.fund_type = form.fund_type;
      if (namaKetua) payload.nama_ketua = namaKetua;
      // Coleader = co-author biasa: masuk junction lewat co_author_ids.
      // Siapa leader tetap ditentukan BE dari nama_ketua, bukan dari sini.
      if (selectedCoAuthors.length > 0) payload.co_author_ids = selectedCoAuthors.map(co => co.author_id);

      const res = await DosenFakultasService.createPenelitian(authorId, payload as Parameters<typeof DosenFakultasService.createPenelitian>[1]);
      handleToastResponse(res);
      if (res?.success) {
        handleClose();
        onSuccess();
      }
    } catch {
      handleToastResponse({ success: false, message: "Gagal menambahkan penelitian." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Penelitian</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Judul */}
          <div className="space-y-1.5">
            <Label htmlFor="p-judul">
              Judul <span className="text-red-500">*</span>
            </Label>
            <Input
              id="p-judul"
              name="judul"
              value={form.judul}
              onChange={handleChange}
              placeholder="Judul penelitian"
            />
          </div>

          {/* Tahun & Dana */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="p-tahun">
                Tahun <span className="text-red-500">*</span>
              </Label>
              <Input
                id="p-tahun"
                name="tahun"
                type="number"
                value={form.tahun}
                onChange={handleChange}
                placeholder="2024"
                min={1990}
                max={new Date().getFullYear() + 1}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dana">Dana (Rp)</Label>
              <Input
                id="dana"
                name="dana"
                type="number"
                value={form.dana}
                onChange={handleChange}
                placeholder="50000000"
                min={0}
              />
            </div>
          </div>

          {/* Nama Ketua — dipilih dari Anggota Peneliti, bukan dicari ke
              seluruh daftar penulis. Cerminan "Penulis Utama" di dialog artikel:
              ketua yang bukan anggota tidak punya baris personil, jadi tidak
              bisa dihapus lewat UI dan is_leader tidak menyala di siapa pun. */}
          <div className="space-y-1.5">
            <Label>Nama Ketua</Label>
            <Select
              value={ketuaValid.toString()}
              onValueChange={(v) => setKetuaId(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih ketua" />
              </SelectTrigger>
              <SelectContent>
                {kandidatKetua.map((k) => (
                  <SelectItem key={k.author_id} value={k.author_id.toString()}>
                    {k.author_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              Default dosen ini. Tambahkan orangnya di Anggota Peneliti dulu kalau
              ketuanya bukan salah satu nama di daftar.
            </p>
          </div>

          <CoAuthorPicker
            value={selectedCoAuthors}
            onChange={setSelectedCoAuthors}
            excludeAuthorId={authorId}
            label="Anggota Peneliti"
          />

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

          {/* Status Dana & Fund Type */}
          <div className="grid grid-cols-2 gap-3">
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}