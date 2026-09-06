// types/dosen-shared.ts

export interface Periode {
  id: number;
  nama: string | null;
}

export interface DosenPeriode {
  id: number;
  periode_id: number;
  periode: Periode;
  kategori: "kp" | "ta";
  kuota: number;
  link_wa: string | null;
}

export interface MahasiswaRingkas {
  id: number;
  nama: string;
}

export interface KerjaPraktekItem {
  id: number;
  mahasiswa: MahasiswaRingkas | null;
  periode: Periode;
  judul: string | null;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  status: "accepted" | "rejected" | "pending" | string;
}

export interface JenisProjek {
  id: number;
  nama: string | null;
}

// "projects" di response API = data Tugas Akhir
export interface TugasAkhirItem {
  id: number;
  mahasiswa: MahasiswaRingkas | null;
  jenis_projek: JenisProjek;
  periode_mulai: Periode;
}

export interface DosenStats {
  jumlah_lulusan: number;
  lulus_persen: string;
  total_mhs_ta: number;
  total_mhs_saat_ini: number;
  kuota_ta_baru: number;
}

// Field-field baru yang dikembalikan endpoint detail dosen terbaru
// (baik dari GET /dosen/{id} maupun GET /profile -> data.dosen)
export interface DosenDetailExtra {
  dosen_periode?: DosenPeriode[];
  kerja_praktek?: KerjaPraktekItem[];
  projects?: TugasAkhirItem[]; // Tugas Akhir
  pengajuan_sidang?: unknown[]; // struktur belum diketahui, sementara unknown[]
  stats?: DosenStats;
}