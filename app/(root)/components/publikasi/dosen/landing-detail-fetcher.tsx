"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

import { AuthorDetailSuperAdminServices } from "@/api/superadmin";
import { usePublicDosen } from "@/hooks/use-public-dosen";

import DetailDosenClient from "@/app/(root)/(subapps)/fakultas/manajemen-dosen/detail/[dosenId]/detail-dosen-client";

import {
  Dosen,
  Publication,
  Research,
  CommunityService,
} from "@/types/fakultas/penelitian/penelitian";

export default function LandingDetailDosenFetcher({
  authorId,
}: {
  authorId: string | number;
}) {
  const [publikasi, setPublikasi] = useState<Publication[]>([]);
  const [penelitian, setPenelitian] = useState<Research[]>([]);
  const [pengabdian, setPengabdian] = useState<CommunityService[]>([]);
  const [isLoadingTridharma, setIsLoadingTridharma] = useState(false);

  const authorIdNum = Number(authorId);
  const { dosen: authorData, isLoading: isLoadingAuthor, error: authorError } =
    usePublicDosen(authorIdNum);

  /* ================= FETCH TRIDHARMA (with pagination) ================= */

  useEffect(() => {
    let cancelled = false;
    const fetchAllData = async () => {
      setIsLoadingTridharma(true);
      try {
        const LIMIT = 10;

        // Articles
        let allArticles: Publication[] = [];
        let articlePage = 1;
        while (true) {
          const res: any = await AuthorDetailSuperAdminServices.getDosenArticles(
            {
              id: authorId,
              page: articlePage,
              limit: LIMIT,
            },
          );
          if (!res?.success || !res?.data) break;
          const articles: Publication[] = (res.data.articles ?? []).map(
            (a: any) => ({
              id: a.id,
              title: a.title,
              journal: a.journal,
              year: Number(a.year) || new Date().getFullYear(),
              doi: a.doi,
              source: a.source,
              article_url: a.article_url,
              accred: a.accred,
              citation_count: a.citation_count,
              authors: a.authors,
            }),
          );
          allArticles = [...allArticles, ...articles];
          if (articles.length < LIMIT) break;
          articlePage++;
        }
        if (cancelled) return;
        // Halaman publik diurutkan sitasi terbanyak dulu — beda tujuan dengan
        // halaman admin (tri-dharma-section) yang terbaru dulu untuk melihat
        // entri yang baru diinput. Endpoint-nya sama, pemisahannya di sini.
        // Sitasi NULL (59 dari 7803 artikel) dihitung 0, bukan dibuang.
        allArticles.sort(
          (a, b) => (b.citation_count ?? 0) - (a.citation_count ?? 0) || b.id - a.id
        );
        setPublikasi(allArticles);

        // Researches
        let allResearches: Research[] = [];
        let researchPage = 1;
        while (true) {
          const res: any = await AuthorDetailSuperAdminServices.getDosenResearch(
            {
              id: authorId,
              page: researchPage,
              limit: LIMIT,
            },
          );
          if (!res?.success || !res?.data) break;
          const researches: Research[] = (res.data.researches ?? []).map(
            (r: any) => ({
              id: r.id,
              title: r.title,
              jenis_penelitian: r.jenis_penelitian || r.jenis,
              year: Number(r.year) || new Date().getFullYear(),
              dana_penelitian: r.dana_penelitian || 0,
              status_penelitian: r.status_penelitian || r.status || "Unknown",
              sumber_pendanaan: r.sumber_pendanaan || r.fund_source || "",
              leader_name: r.leader_name || r.nama_ketua || "",
              personils: r.personils,
            }),
          );
          allResearches = [...allResearches, ...researches];
          if (researches.length < LIMIT) break;
          researchPage++;
        }
        if (cancelled) return;
        // Publik urut tahun terbaru — pengunjung membaca karya, bukan menginput.
        // Halaman admin (detail-dosen-fetcher) tetap terbaru-dibuat; endpoint-nya
        // sama, pemisahannya di fetcher masing-masing. Tahun sama -> yang baru
        // dibuat di atas, konsisten dengan tie-break artikel.
        allResearches.sort((a, b) => b.year - a.year || b.id - a.id);
        setPenelitian(allResearches);

        // Community services (pengabdian) — endpoint yang sama, field community_services
        try {
          const res: any = await AuthorDetailSuperAdminServices.getDosenDetail({
            id: authorId,
            article_page: 1,
            article_limit: 1,
            research_page: 1,
            research_limit: 1,
          });
          const csData = res?.data?.community_services ?? [];
          if (!cancelled) {
            setPengabdian(
              csData.map((c: any) => ({
                id: c.id,
                title: c.title,
                lokasi: c.lokasi,
                tahun: c.tahun ? Number(c.tahun) : undefined,
                label: c.label,
              })),
            );
          }
        } catch {
          /* diamkan */
        }
      } catch (err) {
        console.error("[LandingDetailDosenFetcher] Error fetch tridharma:", err);
      } finally {
        if (!cancelled) setIsLoadingTridharma(false);
      }
    };
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorId]);

  /* ================= LOADING ================= */

  if (isLoadingAuthor || isLoadingTridharma) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (authorError || !authorData) {
    // Pakai pesan dari BE response kalau ada. Fallback pakai pesan BE-style kalau error tidak ada/exception non-Error.
    const beMessage =
      authorError instanceof Error && authorError.message
        ? authorError.message
        : "Dosen tidak ditemukan atau belum terhubung ke data publikasi.";
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-2 text-muted-foreground">
        <AlertTriangle className="h-8 w-8" />
        <p>{beMessage}</p>
      </div>
    );
  }

  /* ================= MAP TO DOSEN ================= */

  const dosen: Dosen = {
    user_id: authorData?.id ?? authorIdNum,
    dosen_id: authorData?.id ?? authorIdNum,
    author_id: authorData?.penulis_id ?? authorIdNum,
    nama: authorData?.nama || "Tidak diketahui",
    email: authorData?.email || "",
    npp: authorData?.npp || "",
    nidn: authorData?.nidn || "",
    gelar_depan: "",
    gelar_belakang: "",
    jabatan: authorData?.jabatan_fungsional || "-",
    peminatan: "-",
    prodi_homebase: authorData?.home_base?.nama || "-",
    prodi_tugas: [],
    bidang_kajian: "",
    telepon: "",
    email_alternatif: "",
    golongan: authorData?.golongan || "-",
    scholar_link: "",
    status: authorData?.status_staff || "Aktif",
    foto_url: authorData?.avatar || null,
    articles: publikasi,
    researches: penelitian,
    community_services: pengabdian,
    jadwal_mengajar: (authorData?.jadwal_mengajar ?? []).map((j) => ({
      id: j.id,
      mata_kuliah: j.matkul,
      kelompok: j.kelas,
      hari: j.hari,
      jam: j.jam,
      ruang: j.ruang,
    })),
    pengabdian: (authorData?.pengabdian ?? []).map((p) => ({
      id: p.id,
      keterangan: p.keterangan,
      judul: p.judul,
      tahun: p.tahun,
      dana_dikti: p.dana_dikti,
      dana_perguruan_tinggi: p.dana_perguruan_tinggi,
      dana_institusi_lain: p.dana_institusi_lain,
    })),
    kekayaan_intelektual: (authorData?.kekayaan_intelektual ?? []).map((k) => ({
      id: k.id,
      keterangan: k.keterangan,
      judul: k.judul,
      tahun: k.tahun,
    })),
    // Sections yang memang tidak tersedia di publik (hidden via conditional render):
    riwayat_karir: [],
    riwayat_pendidikan: [],
    mahasiswa_bimbingan: [],
    stats: {
      jumlah_lulusan: 0,
      lulus_persen: "0",
      total_mhs_ta: 0,
      total_mhs_saat_ini: 0,
      kuota_ta_baru: 0,
    },
  };

  return (
    <DetailDosenClient dosen={dosen} baseUrl="/publikasi/dosen" readOnly={true} isPublic={true} />
  );
}
