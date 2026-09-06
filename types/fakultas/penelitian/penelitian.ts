import { DosenDetailExtra, DosenStats } from "@/types/dosen-shared";

export interface ProdiInfo {
  id: number;
  nama: string;
  kode_prodi: string;
}

// Re-export supaya file lain yang masih import { DosenStats } dari sini tidak rusak
export type { DosenStats };

export interface Dosen extends DosenDetailExtra {
  user_id: number;
  dosen_id: number;
  author_id?: number;
  nama: string;
  email: string;
  npp?: string;
  nidn?: string;
  gelar_depan?: string;
  gelar_belakang?: string;
  telepon?: string;
  email_alternatif?: string;
  golongan?: string;
  jabatan?: string;
  jabatan_fungsional?: string;
  peminatan?: string;
  prodi_homebase?: ProdiInfo | string;
  prodi_tugas?: ProdiInfo[] | string;
  bidang_kajian?: string;
  scholar_link?: string;
  foto_url?: string | null;
  status?: string;
  riwayat_karir?: RiwayatKarir[];
  riwayat_pendidikan?: RiwayatPendidikan[];
  jadwal_mengajar?: JadwalMengajar[];
  mahasiswa_bimbingan?: MahasiswaBimbingan[];
  articles?: Publication[];
  researches?: Research[];
  community_services?: CommunityService[];
}

export interface RiwayatKarir {
  id: number;
  tahun: string;
  posisi: string;
  instasi: string;
}

export interface RiwayatPendidikan {
  id: number;
  tahun: string;
  jenjang: string;
  programStudi: string;
  instasi: string;
}

export interface JadwalMengajar {
  id: number;
  mata_kuliah: string;
  kelompok: string;
  sks: number;
  hari: string;
  jam: string;
  ruang: string;
}

export interface MahasiswaBimbingan {
  id: number;
  nama: string;
  nim: string;
  prodi: string;
  judul_ta: string;
  status: "Bimbingan" | "Lulus";
}

export interface Publication {
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

export interface PublicationAuthor {
  author_id: number;
  author_name: string;
  author_order: number;
  avatar?: string;
  dosen_id?: number | null;
}

export interface Research {
  id: number;
  title: string;
  is_locked?: boolean;
  jenis_penelitian: string;
  year: number;
  dana_penelitian: number;
  status_penelitian: string;
  sumber_pendanaan: string;
  leader_name: string;
  coleader_name?: string | null;
  personils?: string | null;
}

export interface CommunityService {
  id: number;
  title: string;
  lokasi?: string;
  tahun?: number;
  label?: string;
}