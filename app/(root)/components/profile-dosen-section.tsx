"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Briefcase, GraduationCap, Mail, Pencil, Phone,
  Plus, User, X, BookOpen, FlaskConical, Users,
  CalendarDays, Calendar, Banknote, ExternalLink, Search,
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis,
} from "@/components/ui/pagination";
import { getInitials } from "@/lib/utils";
import { DosenFakultasService } from "@/api";
import { handleToastResponse } from "@/lib/toast-response";
import { CreateArtikelDialog, CreatePenelitianDialog } from "./tridharma-dialogs";
import { useRouter } from "next/navigation";
import { TtdSection } from "@/app/(root)/(subapps)/fakultas/_components/manajemen-dosen/ttd-section"
import { DosenPeriode, KerjaPraktekItem, TugasAkhirItem, DosenStats } from "@/types/dosen-shared";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Prodi {
  id: number;
  nama: string;
  kode_prodi: string;
}

interface RiwayatKarir {
  id: number;
  posisi: string;
  instasi: string;
  tahun: string;
}

interface RiwayatPendidikan {
  id: number;
  jenjang: string;
  programStudi: string;
  instasi: string;
  tahun: string;
}

interface JadwalMengajar {
  id: number;
  mata_kuliah: string;
  kelompok: string;
  sks: number;
  hari: string;
  jam: string;
  ruang: string;
}

interface Publication {
  id: number;
  title: string;
  journal: string;
  year: number;
  doi?: string;
  source?: string;
  article_url?: string;
  accred?: string;
  citation_count?: number;
  authors?: PublicationAuthor[];
}

interface PublicationAuthor {
  author_id: number;
  author_name: string;
  author_order: number;
  avatar?: string;
  dosen_id?: number | null;
}

interface Research {
  id?: number;
  title: string;
  jenis_penelitian: string;
  year: number;
  dana_penelitian: number;
  status_penelitian: string;
  sumber_pendanaan: string;
  leader_name: string;
  personils?: string | null;
}

interface CommunityService {
  id: number;
  title: string;
  lokasi?: string;
  tahun?: number;
  label?: string;
}

interface ProfileDosenSectionProps {
  dosenId: number;
  name: string;
  email: string;
  foto?: string;
  npp?: string | null;
  nidn?: string | null;
  gelar_depan?: string | null;
  gelar_belakang?: string | null;
  jabatan?: string | null;
  golongan?: string | null;
  telepon?: string | null;
  bidang_kajian?: string | null;
  scholar_link?: string | null;
  email_alternatif?: string | null;
  prodi_homebase?: Prodi | null;
  prodi_tugas?: Prodi[];
  status?: string;
  riwayat_karir?: RiwayatKarir[];
  riwayat_pendidikan?: RiwayatPendidikan[];
  jadwal_mengajar?: JadwalMengajar[];
  basePath?: string;
  onChangePassword?: () => void;
  onSuccess?: () => void;
  dosen_periode?: DosenPeriode[];
  kerja_praktek?: KerjaPraktekItem[];
  projects?: TugasAkhirItem[];
  pengajuan_sidang?: unknown[];
  stats?: DosenStats | null;
}

// ─── Dummy data (hapus setelah BE siap) ──────────────────────────────────────

const DUMMY_KARIR: RiwayatKarir[] = [
  { id: 1, tahun: "2020 - Sekarang", posisi: "Lektor Kepala", instasi: "Universitas Dian Nuswantoro" },
  { id: 2, tahun: "2015 - 2020", posisi: "Lektor", instasi: "Universitas Dian Nuswantoro" },
];

const DUMMY_PENDIDIKAN: RiwayatPendidikan[] = [
  { id: 1, tahun: "2015", jenjang: "Doktor (S3)", programStudi: "Ilmu Komputer", instasi: "Universitas Gadjah Mada" },
  { id: 2, tahun: "2010", jenjang: "Magister (S2)", programStudi: "Ilmu Komputer", instasi: "Universitas Gadjah Mada" },
];

const DUMMY_JADWAL: JadwalMengajar[] = [
  { id: 1, mata_kuliah: "Algoritma dan Pemrograman", kelompok: "A11.4818", sks: 3, hari: "Senin", jam: "08:00 - 10:30", ruang: "Ruang 301" },
  { id: 2, mata_kuliah: "Struktur Data", kelompok: "A11.4819", sks: 3, hari: "Rabu", jam: "10:00 - 12:30", ruang: "Ruang 302" },
];

// ─── Tab Navigation ───────────────────────────────────────────────────────────

function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <div className="border-b border-slate-200 mb-6">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`pb-3 px-1 text-sm font-medium transition-all duration-200 relative ${
              activeTab === tab ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Pagination Helper ────────────────────────────────────────────────────────

function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  const pages: (number | "...")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }
  return pages;
}

// ─── Pagination UI ────────────────────────────────────────────────────────────

function PaginationControl({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
      <p className="text-sm text-slate-500">
        Page {currentPage} of {totalPages} ({totalItems} total items)
      </p>
      <Pagination className="w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-30" : "cursor-pointer"}
            />
          </PaginationItem>
          {getPageNumbers(currentPage, totalPages).map((page, i) =>
            page === "..." ? (
              <PaginationItem key={`e-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => onPageChange(page as number)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-30" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProfileDosenSection({
  dosenId,
  name,
  email,
  foto,
  npp,
  nidn,
  gelar_depan,
  gelar_belakang,
  jabatan,
  golongan,
  telepon,
  bidang_kajian,
  scholar_link,
  email_alternatif,
  prodi_homebase,
  prodi_tugas,
  status = "Aktif",
  riwayat_karir = DUMMY_KARIR,
  riwayat_pendidikan = DUMMY_PENDIDIKAN,
  jadwal_mengajar = DUMMY_JADWAL,
  dosen_periode = [],
  kerja_praktek = [],
  projects = [],
  pengajuan_sidang = [],
  stats = null, 
  basePath = "/kerja-praktek",
  onChangePassword,
  onSuccess,
}: ProfileDosenSectionProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tridharmaTab, setTridharmaTab] = useState("Publikasi");
  const [form, setForm] = useState({
    bidang_kajian: bidang_kajian || "",
    scholar_link: scholar_link || "",
    telepon: telepon || "",
    email_alternatif: email_alternatif || "",
  });

  const [publikasi, setPublikasi] = useState<Publication[]>([]);
  const [penelitian, setPenelitian] = useState<Research[]>([]);
  const [pengabdian, setPengabdian] = useState<CommunityService[]>([]);
  const [isLoadingTridharma, setIsLoadingTridharma] = useState(true);

  // ── Pagination state ──
  const ITEMS_PER_PAGE = 5;
  const [pubPage, setPubPage] = useState(1);
  const [penelitianPage, setPenelitianPage] = useState(1);
  const [pengabdianPage, setPengabdianPage] = useState(1);

  const [openArtikelDialog, setOpenArtikelDialog] = useState(false);
  const [openPenelitianDialog, setOpenPenelitianDialog] = useState(false);
  const [searchPublikasi, setSearchPublikasi] = useState("");
  const [searchPenelitian, setSearchPenelitian] = useState("");

  const filteredPublikasi = publikasi.filter((pub) =>
    pub.title.toLowerCase().includes(searchPublikasi.toLowerCase())
  );
  const filteredPenelitian = penelitian.filter((res) =>
    res.title.toLowerCase().includes(searchPenelitian.toLowerCase())
  );

  const paginatedPublikasi = filteredPublikasi.slice((pubPage - 1) * ITEMS_PER_PAGE, pubPage * ITEMS_PER_PAGE);
  const paginatedPenelitian = filteredPenelitian.slice((penelitianPage - 1) * ITEMS_PER_PAGE, penelitianPage * ITEMS_PER_PAGE);
  const paginatedPengabdian = pengabdian.slice((pengabdianPage - 1) * ITEMS_PER_PAGE, pengabdianPage * ITEMS_PER_PAGE);

  const totalPubPages = Math.ceil(filteredPublikasi.length / ITEMS_PER_PAGE);
  const totalPenelitianPages = Math.ceil(filteredPenelitian.length / ITEMS_PER_PAGE);
  const totalPengabdianPages = Math.ceil(pengabdian.length / ITEMS_PER_PAGE);


  // ── Fetch tridharma data ──
  useEffect(() => {
    if (!dosenId) {
      console.warn("[ProfileDosenSection] dosenId tidak valid:", dosenId);
      setIsLoadingTridharma(false);
      return;
    }

    const fetchAllData = async () => {
      setIsLoadingTridharma(true);
      try {
        const LIMIT = 10;

        // ── Fetch halaman pertama untuk dapat author_id dan total counts ──
        const firstRes = await DosenFakultasService.getPublikasi(dosenId, {
          article_page: 1,
          article_limit: LIMIT,
          research_page: 1,
          research_limit: LIMIT,
        });

        if (!firstRes?.success || !firstRes?.data) {
          setIsLoadingTridharma(false);
          return;
        }

        // Ambil author_id dari response (bisa berbeda dari dosen_id)
        const authorId: number = firstRes.data.id ?? dosenId;
        const totalArticles: number = firstRes.data.total_articles ?? 0;
        const totalResearches: number = firstRes.data.total_researches ?? 0;
        const totalArticlePages = Math.ceil(totalArticles / LIMIT);
        const totalResearchPages = Math.ceil(totalResearches / LIMIT);

        // ── Fetch semua artikel berdasarkan total_articles ──
        let allArticles: Publication[] = firstRes.data.articles ?? [];
        for (let page = 2; page <= totalArticlePages; page++) {
          const res = await DosenFakultasService.getPublikasi(authorId, {
            article_page: page,
            article_limit: LIMIT,
            research_page: 1,
            research_limit: 1,
          });
          if (!res?.success || !res?.data) break;
          allArticles = [...allArticles, ...(res.data.articles ?? [])];
        }

        // ── Fetch semua penelitian berdasarkan total_researches ──
        let allResearches: Research[] = firstRes.data.researches ?? [];
        for (let page = 2; page <= totalResearchPages; page++) {
          const res = await DosenFakultasService.getPublikasi(authorId, {
            article_page: 1,
            article_limit: 1,
            research_page: page,
            research_limit: LIMIT,
          });
          if (!res?.success || !res?.data) break;
          allResearches = [...allResearches, ...(res.data.researches ?? [])];
        }

        // ── Pengabdian sudah ada di firstRes ──
        const pengabdianData = firstRes.data.community_services ?? [];

        setPublikasi(allArticles);
        setPenelitian(allResearches);
        setPengabdian(pengabdianData);
      } catch (err) {
        console.error("[ProfileDosenSection] Error fetch tridharma:", err);
      } finally {
        setIsLoadingTridharma(false);
      }
    };

    fetchAllData();
  }, [dosenId]);

  const namaLengkap = [gelar_depan, name, gelar_belakang ? `, ${gelar_belakang}` : ""]
    .filter(Boolean)
    .join(" ");

  const prodiHomebaseNama =
    typeof prodi_homebase === "object" && prodi_homebase !== null
      ? prodi_homebase.nama : "-";

  const prodiTugasNama =
    Array.isArray(prodi_tugas) && prodi_tugas.length > 0
      ? prodi_tugas.map((p) => p.nama).join(", ") : "-";

  const fotoUrl = npp
    ? `https://simpeg.dinus.ac.id/updir/small_med_${npp}.jpg`
    : foto || null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await DosenFakultasService.updateProfil({
        bidang_kajian: form.bidang_kajian,
        scholar_link: form.scholar_link,
        telepon: form.telepon,
        email_alternatif: form.email_alternatif,
      });
      handleToastResponse(res);
      if (res?.success) {
        setIsEditing(false);
        onSuccess?.();
      }
    } catch {
      handleToastResponse({ success: false, message: "Gagal memperbarui profil." });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      bidang_kajian: bidang_kajian || "",
      scholar_link: scholar_link || "",
      telepon: telepon || "",
      email_alternatif: email_alternatif || "",
    });
    setIsEditing(false);
  };

  const infoItems = [
    { label: "NIDN", value: nidn || "-" },
    { label: "NPP", value: npp || "-" },
    { label: "Prodi Homebase", value: prodiHomebaseNama },
    { label: "Prodi Tugas", value: prodiTugasNama },
    { label: "Jabatan Fungsional", value: jabatan || "-" },
    { label: "Golongan", value: golongan || "-" },
  ];

  const formatFundingSource = (source?: string) => {
    if (!source) return "UNKNOWN";
    if (source.includes("INTERNAL")) return "INTERNAL SOURCE";
    if (source.includes("BIMA")) return "BIMA SOURCE";
    return source.replace(/_/g, " ").toUpperCase();
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">

      {/* ── 1. Profile Card ── */}
      <Card className="rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">

            {/* Foto */}
            <div className="md:col-span-1 relative bg-slate-100 min-h-[320px]">
              {fotoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fotoUrl}
                  alt={`Foto ${name}`}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = "none";
                    const fallback = img.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              )}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ display: fotoUrl ? "none" : "flex" }}
              >
                <Avatar className="size-24">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-semibold">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-3 p-6 flex flex-col min-h-[320px]">

              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-slate-900 break-words">{namaLengkap}</h2>
                  <p className="text-slate-500 mt-1">{prodiHomebaseNama}</p>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <Badge
                    variant={status === "Aktif" ? "default" : "secondary"}
                    className={status === "Aktif" ? "bg-primary text-white" : ""}
                  >
                    {status}
                  </Badge>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={handleCancel} disabled={loading}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-3">
                {infoItems.map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <label className="text-xs text-slate-400 font-medium">{item.label}</label>
                    <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Mode View */}
              {!isEditing && (
                <div className="space-y-3 flex-1 min-h-0">
                  <div className="flex flex-col">
                    <label className="text-xs text-slate-400 font-medium">Bidang Kajian</label>
                    <p className="text-sm font-semibold text-slate-800">{bidang_kajian || "-"}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Mail className="size-4 text-slate-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-slate-400">Email</p>
                          <p className="text-sm font-semibold text-slate-800 break-all">{email || "-"}</p>
                        </div>
                      </div>
                      {onChangePassword && (
                        <Button size="sm" onClick={onChangePassword} className="flex-shrink-0 ml-4">
                          <Plus size={16} />
                          <span className="ml-1">Ganti password</span>
                        </Button>
                      )}
                    </div>
                    {(telepon || email_alternatif || scholar_link) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {telepon && (
                          <div className="flex items-center gap-2">
                            <Phone className="size-4 text-slate-400 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-slate-400">Telepon</p>
                              <p className="text-sm font-semibold text-slate-800">{telepon}</p>
                            </div>
                          </div>
                        )}
                        {email_alternatif && (
                          <div className="flex items-center gap-2">
                            <Mail className="size-4 text-slate-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-slate-400">Email Alternatif</p>
                              <p className="text-sm font-semibold text-slate-800 break-all">{email_alternatif}</p>
                            </div>
                          </div>
                        )}
                        {scholar_link && (
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <User className="size-4 text-slate-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs text-slate-400">Google Scholar</p>
                              <a href={scholar_link} target="_blank" rel="noopener noreferrer"
                                className="text-sm font-semibold text-blue-600 hover:underline truncate block">
                                {scholar_link}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mode Edit */}
              {isEditing && (
                <div className="space-y-3 flex-1 min-h-0">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="bidang_kajian" className="text-xs text-slate-400">Bidang Kajian</Label>
                      <Input id="bidang_kajian" name="bidang_kajian" value={form.bidang_kajian}
                        onChange={handleChange} className="h-8 text-sm" placeholder="SC, RPLD, SK3D, dll" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="telepon" className="text-xs text-slate-400">Telepon</Label>
                      <Input id="telepon" name="telepon" value={form.telepon}
                        onChange={handleChange} className="h-8 text-sm" placeholder="+628123456789" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="email_alternatif" className="text-xs text-slate-400">Email Alternatif</Label>
                      <Input id="email_alternatif" name="email_alternatif" value={form.email_alternatif}
                        onChange={handleChange} className="h-8 text-sm" placeholder="email@contoh.com" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="scholar_link" className="text-xs text-slate-400">Google Scholar</Label>
                      <Input id="scholar_link" name="scholar_link" value={form.scholar_link}
                        onChange={handleChange} className="h-8 text-sm" placeholder="https://scholar.google.com/..." />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <Button variant="outline" size="sm" onClick={handleCancel} disabled={loading}>Batal</Button>
                    <Button size="sm" onClick={handleSubmit} disabled={loading}>
                      {loading ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── TTD Dosen ── */}
      <TtdSection dosenId={dosenId} />

      {/* ── 2. Riwayat Karir & Pendidikan ── */}
      {(riwayat_karir.length > 0 || riwayat_pendidikan.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {riwayat_karir.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                    <Briefcase className="size-4 text-blue-600" />
                  </div>
                  Riwayat Karir
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {riwayat_karir.map((karir) => (
                    <div key={karir.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-sm">{karir.posisi}</p>
                        <p className="text-xs text-muted-foreground">{karir.instasi}</p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 sm:mt-0">{karir.tahun}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {riwayat_pendidikan.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
                    <GraduationCap className="size-4 text-green-600" />
                  </div>
                  Riwayat Pendidikan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {riwayat_pendidikan.map((pendidikan) => (
                    <div key={pendidikan.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-sm">{pendidikan.jenjang}</p>
                        <p className="text-xs text-muted-foreground">
                          {pendidikan.programStudi} — {pendidikan.instasi}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 sm:mt-0">{pendidikan.tahun}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ── 3. Jadwal Mengajar ── */}
      {jadwal_mengajar.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Jadwal Mengajar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>Kelompok</TableHead>
                  <TableHead className="w-16">SKS</TableHead>
                  <TableHead>Jadwal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jadwal_mengajar.map((jadwal, index) => (
                  <TableRow key={jadwal.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{jadwal.mata_kuliah}</TableCell>
                    <TableCell>{jadwal.kelompok}</TableCell>
                    <TableCell>{jadwal.sks}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{jadwal.hari}</span>, {jadwal.jam}
                        <br />
                        <span className="text-muted-foreground">{jadwal.ruang}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* ── 4. Tri Dharma ── */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {tridharmaTab === "Publikasi" && <BookOpen className="h-5 w-5" />}
            {tridharmaTab === "Penelitian" && <FlaskConical className="h-5 w-5" />}
            {tridharmaTab === "Pengabdian" && <Users className="h-5 w-5" />}
            Tri Dharma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TabNavigation
            tabs={["Publikasi", "Penelitian", "Pengabdian"]}
            activeTab={tridharmaTab}
            onTabChange={(tab) => {
              setTridharmaTab(tab);
              setPubPage(1);
              setPenelitianPage(1);
              setPengabdianPage(1);
            }}
          />

          <div className="space-y-5">

            {/* ── PUBLIKASI ── */}
{tridharmaTab === "Publikasi" && (
  <>
    <div className="flex justify-between items-center mb-4 gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Cari publikasi..."
          value={searchPublikasi}
          onChange={(e) => {
            setSearchPublikasi(e.target.value);
            setPubPage(1);
          }}
          className="pl-9 h-9"
        />
      </div>
      <Button size="sm" onClick={() => setOpenArtikelDialog(true)}>
        <Plus className="w-4 h-4 mr-1" /> Tambah Publikasi
      </Button>
    </div>
    {isLoadingTridharma ? (
      <p className="text-sm text-slate-400">Memuat...</p>
    ) : filteredPublikasi.length === 0 ? (
      <div className="text-center py-10 text-muted-foreground">
        {searchPublikasi ? "Tidak ada publikasi yang cocok" : "Belum ada data publikasi"}
      </div>
    ) : (
      <>
        {paginatedPublikasi.map((pub, index) => (
          <Card
            key={pub.id || index}
            className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-primary-600"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <h3
                  className="text-lg font-semibold text-primary-600 flex-1 leading-relaxed cursor-pointer hover:underline"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                  onClick={() => pub.id && router.push(
                    `/publikasi/detail?id=${pub.id}&type=artikel&from=${encodeURIComponent(window.location.pathname)}`
                  )}
                >
                  {pub.title}
                </h3>
                {pub.article_url && (
                  <button
                    onClick={() => window.open(pub.article_url, "_blank")}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => router.push(`${basePath}/profile/publikasi/${pub.id}`)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600">
                {pub.journal}
                {pub.accred && ` ${pub.accred}`}
                {pub.year && `, ${pub.year}`}
              </p>
              <div className="flex flex-wrap items-center text-xs text-gray-500 gap-3">
                {pub.year && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {pub.year}
                  </div>
                )}
                {pub.doi && <div className="flex items-center">DOI: {pub.doi}</div>}
                <div className="flex items-center">
                  <Badge
                    variant={pub.source?.includes("SCOPUS") ? "default" : "secondary"}
                    className={
                      pub.source?.includes("SCOPUS")
                        ? "bg-[#1e7fd9] hover:bg-[#1063b9] text-white"
                        : pub.source?.includes("GARUDA")
                        ? "bg-[#eb8b15] hover:bg-[#d0670f] text-white"
                        : pub.source?.includes("GOOGLE_SCHOLAR")
                        ? "bg-[#00a651] hover:bg-[#008a44] text-white"
                        : ""
                    }
                  >
                    {pub.source || "UNKNOWN"}
                  </Badge>
                </div>
                {pub.citation_count !== undefined && (
                  <div className="text-xs text-gray-500">{pub.citation_count} Sitasi</div>
                )}
              </div>
              {pub.authors && pub.authors.length > 0 && (
                <div className="pt-2">
                  <p className="text-sm">
                    <span className="font-medium">Author:</span>{" "}
                    {pub.authors
                      .sort((a, b) => a.author_order - b.author_order)
                      .map((author, i) => (
                        <span key={author.author_id}>
                          <span
                            className="hover:text-primary-600 hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/publikasi/dosen/${author.author_id}`;
                            }}
                          >
                            {author.author_name}
                          </span>
                          {i < pub.authors!.length - 1 && ", "}
                        </span>
                      ))}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
        <PaginationControl
          currentPage={pubPage}
          totalPages={totalPubPages}
          totalItems={filteredPublikasi.length}
          onPageChange={setPubPage}
        />
      </>
    )}
  </>
)}

{/* ── PENELITIAN ── */}
{tridharmaTab === "Penelitian" && (
  <>
    <div className="flex justify-between items-center mb-4 gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Cari penelitian..."
          value={searchPenelitian}
          onChange={(e) => {
            setSearchPenelitian(e.target.value);
            setPenelitianPage(1);
          }}
          className="pl-9 h-9"
        />
      </div>
      <Button size="sm" onClick={() => setOpenPenelitianDialog(true)}>
        <Plus className="w-4 h-4 mr-1" /> Tambah Penelitian
      </Button>
    </div>
    {isLoadingTridharma ? (
      <p className="text-sm text-slate-400">Memuat...</p>
    ) : filteredPenelitian.length === 0 ? (
      <div className="text-center py-10 text-muted-foreground">
        Belum ada data penelitian
      </div>
    ) : (
      <>
        {paginatedPenelitian.map((research, index) => (
          <Card
            key={research.id || index}
            className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-primary-600"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-lg font-semibold text-primary-600 flex-1">
                  {research.title}
                </h3>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => router.push(`${basePath}/profile/penelitian/${research.id}`)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center text-xs text-gray-500 gap-3">
                <Badge variant={research.status_penelitian === "Approved" ? "success" : "secondary"}>
                  {research.status_penelitian || "Unknown"}
                </Badge>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {research.year}
                </div>
                {research.dana_penelitian && (
                  <div className="flex items-center">
                    <Banknote className="w-4 h-4 mr-1" />
                    {formatCurrency(research.dana_penelitian)}
                  </div>
                )}
                <Badge
                  variant="outline"
                  className={
                    research.sumber_pendanaan?.includes("INTERNAL_SOURCE")
                      ? "bg-[#1e7fd9] hover:bg-[#1063b9] text-white border-transparent"
                      : research.sumber_pendanaan?.includes("BIMA_SOURCE")
                      ? "bg-[#00a651] hover:bg-[#008a44] text-white border-transparent"
                      : research.sumber_pendanaan?.includes("SIMLITABMAS")
                      ? "bg-[#eb8b15] hover:bg-[#d0670f] text-white border-transparent"
                      : ""
                  }
                >
                  {formatFundingSource(research.sumber_pendanaan)}
                </Badge>
              </div>
              <div className="pt-2">
                <p className="text-sm mb-2">
                  <span className="font-medium">Ketua:</span>{" "}
                  {research.leader_name || "-"}
                </p>
                {research.personils && (
                  <p className="text-sm">
                    <span className="font-medium">Anggota lain:</span>{" "}
                    {research.personils}
                  </p>
                )}
              </div>
              {research.jenis_penelitian && (
                <div className="pt-1 text-sm text-primary-600">
                  {research.jenis_penelitian}
                </div>
              )}
            </div>
          </Card>
        ))}
        <PaginationControl
          currentPage={penelitianPage}
          totalPages={totalPenelitianPages}
          totalItems={filteredPenelitian.length}
          onPageChange={setPenelitianPage}
        />
      </>
    )}
  </>
)}

            {/* ── PENGABDIAN ── */}
            {tridharmaTab === "Pengabdian" && (
              isLoadingTridharma ? (
                <p className="text-sm text-slate-400">Memuat...</p>
              ) : pengabdian.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  Belum ada data pengabdian
                </div>
              ) : (
                <>
                  {paginatedPengabdian.map((service, index) => (
                    <Card
                      key={service.id || index}
                      className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-green-500"
                    >
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-green-700">{service.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          {service.tahun && (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {service.tahun}
                            </div>
                          )}
                          {service.label && (
                            <Badge variant="outline" className="text-green-700 border-green-300">
                              {service.label}
                            </Badge>
                          )}
                        </div>
                        {service.lokasi && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Lokasi:</span>{" "}
                            {service.lokasi}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                  <PaginationControl
                    currentPage={pengabdianPage}
                    totalPages={totalPengabdianPages}
                    totalItems={pengabdian.length}
                    onPageChange={setPengabdianPage}
                  />
                </>
              )
            )}

          </div>
        </CardContent>
      </Card>

      <CreateArtikelDialog
        open={openArtikelDialog}
        authorId={dosenId}
        onClose={() => setOpenArtikelDialog(false)}
        onSuccess={() => {
          setOpenArtikelDialog(false);
          // re-fetch data
          setPubPage(1);
        }}
      />

      <CreatePenelitianDialog
        open={openPenelitianDialog}
        authorId={dosenId}
        onClose={() => setOpenPenelitianDialog(false)}
        onSuccess={() => {
          setOpenPenelitianDialog(false);
          setPenelitianPage(1);
        }}
      />

    </div>
  );
}