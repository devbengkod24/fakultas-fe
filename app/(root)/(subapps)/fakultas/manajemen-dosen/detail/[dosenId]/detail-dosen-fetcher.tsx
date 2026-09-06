"use client";

import useSWR from "swr";
import { AlertTriangle, Loader2 } from "lucide-react";

import { DosenFakultasService } from "@/api";
import DetailDosenClient from "./detail-dosen-client";
import { Dosen, Publication, Research, CommunityService } from "@/types/fakultas/penelitian/penelitian";

export default function DetailDosenFetcher({
  dosenId,
  baseUrl = "/fakultas/manajemen-dosen/detail",
  readOnly = false,
  editScope = "full",
  isSelfView = false,
  initialDosen,
  canAssignProdi = false,
}: {
  dosenId: number;
  baseUrl?: string;
  readOnly?: boolean;
  editScope?: "full" | "limited";
  isSelfView?: boolean;
  initialDosen?: any;
  canAssignProdi?: boolean;
  prodiId?: string;
}) {
  /* ================= FETCH DOSEN (langsung by ID, endpoint /master/dosen/{id}) ================= */
  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    initialDosen? null : ["dosen-detail", dosenId],
    () => DosenFakultasService.getById(dosenId),
    { revalidateOnFocus: false }
  );

  const rawDosen = initialDosen ?? response?.data;

  /* ================= FETCH PUBLIKASI EKSTERNAL ================= */
  const { data: publicationResponse, isLoading: publicationLoading } = useSWR(
    rawDosen ? [`publikasi-dosen`, dosenId] : null,
    async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_PUBLIKASI_URL}/dosen/publikasi/${dosenId}`
      );
      return res.json();
    },
    { revalidateOnFocus: false }
  );

  /* ================= FETCH TRIDHARMA ================= */
  // Ber-key supaya bisa di-refetch dari luar: TridharmaSection memanggil
  // mutate(["tridharma", dosenId]) tiap create sukses. Dulu ini useState +
  // useEffect ber-dep [dosen_id] yang cuma jalan sekali seumur mount, jadi
  // item baru tidak muncul sampai halaman di-refresh manual.
  // Key HARUS pakai dosen_id yang sama dengan yang dikirim ke TridharmaSection
  // (detail-dosen-client.tsx: dosenId={dosen.dosen_id}) - SWR banding key by
  // value, beda tipe/nilai = mutate meleset tanpa error.
  const { data: tridharma, isLoading: tridharmaLoading } = useSWR(
    rawDosen?.dosen_id ? ["tridharma", Number(rawDosen.dosen_id)] : null,
    async () => {
      const userId = rawDosen.dosen_id;
      const LIMIT = 10;

      let allArticles: Publication[] = [];
      let articlePage = 1;
      while (true) {
        const res = await DosenFakultasService.getPublikasi(userId, {
          article_page: articlePage,
          article_limit: LIMIT,
          research_page: 1,
          research_limit: 1,
        });
        if (!res?.success || !res?.data) break;
        const articles = res.data.articles ?? [];
        allArticles = [...allArticles, ...articles];
        if (articles.length < LIMIT) break;
        articlePage++;
      }

      let allResearches: Research[] = [];
      let researchPage = 1;
      while (true) {
        const res = await DosenFakultasService.getPublikasi(userId, {
          article_page: 1,
          article_limit: 1,
          research_page: researchPage,
          research_limit: LIMIT,
        });
        if (!res?.success || !res?.data) break;
        const researches = res.data.researches ?? [];
        allResearches = [...allResearches, ...researches];
        if (researches.length < LIMIT) break;
        researchPage++;
      }

      const resPengabdian = await DosenFakultasService.getPublikasi(userId, {
        article_page: 1,
        article_limit: 1,
        research_page: 1,
        research_limit: 1,
      });

      return {
        articles: allArticles,
        researches: allResearches,
        communityServices: (resPengabdian?.data?.community_services ?? []) as CommunityService[],
      };
    },
    {
      revalidateOnFocus: false,
      onError: (err) => console.error("[DetailDosenFetcher] Error fetch tridharma:", err),
    }
  );

  /* ================= LOADING / ERROR ================= */
  if (!initialDosen && isLoading || publicationLoading || tridharmaLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (initialDosen && error || !rawDosen) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-2 text-muted-foreground">
        <AlertTriangle className="h-8 w-8" />
        <p>Data dosen tidak dapat dimuat.</p>
      </div>
    );
  }

  const publikasiData = publicationResponse?.data;

  /* ================= DOSEN OBJECT ================= */
  const dosen: Dosen = {
    user_id: rawDosen.user_id,
    dosen_id: rawDosen.dosen_id,
    nama: rawDosen.name || "Tidak diketahui",
    email: rawDosen.email || "",
    npp: rawDosen.npp ?? "",
    nidn: rawDosen.nidn ?? "",
    prodi_homebase: rawDosen.prodi_homebase,
    prodi_tugas: Array.isArray(rawDosen.prodi_tugas) ? rawDosen.prodi_tugas : [],
    jabatan_fungsional: rawDosen.jabatan_fungsional ?? "-",
    golongan: rawDosen.golongan ?? "-",
    bidang_kajian: rawDosen.bidang_kajian ?? "-",
    scholar_link: rawDosen.scholar_link ?? "",
    telepon: rawDosen.telepon ?? "",
    email_alternatif: rawDosen.email_alternatif ?? "",
    gelar_depan: rawDosen.gelar_depan ?? "",
    gelar_belakang: rawDosen.gelar_belakang ?? "",
    foto_url: rawDosen.npp
      ? `https://simpeg.dinus.ac.id/updir/small_med_${rawDosen.npp}.jpg`
      : null,

    /* ── TRI DHARMA ── */
    author_id: publikasiData?.id ?? 0,
    articles: tridharma?.articles ?? [],
    researches: tridharma?.researches ?? [],
    community_services: tridharma?.communityServices ?? [],

    /* ── FIELD BARU (DATA ASLI DARI API) ── */
    dosen_periode: rawDosen.dosen_periode ?? [],
    kerja_praktek: rawDosen.kerja_praktek ?? [],
    projects: rawDosen.projects ?? [],
    pengajuan_sidang: rawDosen.pengajuan_sidang ?? [],
    stats: rawDosen.stats ?? {
      jumlah_lulusan: 0,
      lulus_persen: "0",
      total_mhs_ta: 0,
      total_mhs_saat_ini: 0,
      kuota_ta_baru: 0,
    },

    /* ── DUMMY (preview tampilan, belum ada API-nya) ── */
    riwayat_karir: [
      { id: 1, tahun: "2020 - Sekarang", posisi: "Lektor Kepala", instasi: "Universitas Dian Nuswantoro" },
    ],
    riwayat_pendidikan: [
      { id: 1, tahun: "2015", jenjang: "Doktor (S3)", programStudi: "Ilmu Komputer", instasi: "Universitas Gadjah Mada" },
    ],
    jadwal_mengajar: [
      { id: 1, mata_kuliah: "Algoritma dan Pemrograman", kelompok: "A11.4818", sks: 3, hari: "Senin", jam: "08:00 - 10:30", ruang: "Ruang 301" },
    ],
  };

  return <DetailDosenClient 
  dosen={dosen} 
  baseUrl={baseUrl} 
  readOnly={readOnly} 
  editScope={editScope}
  isSelfView={isSelfView}
  canAssignProdi={canAssignProdi}
  />;
}