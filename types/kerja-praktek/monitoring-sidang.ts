interface Mahasiswa {
  id?: number;
  nama?: string;
  nim?: string;
}

interface Pembimbing {
  id?: number;
  nama?: string;
  gelar_depan?: string;
  gelar_belakang?: string;
}

// Dosen slot untuk penguji. `null` berarti slot ini tidak di-plotting di koor
// (nilai_penguji_X untuk slot ini akan di-lock di UI).
type PengujiBlock = {
  id?: number;
  nama?: string;
  gelar_depan?: string;
  gelar_belakang?: string;
} | null;

interface Gelombang {
  id?: number;
  nama_gelombang?: string;
}

// Tipe peran dosen pada satu sidang. Sama dengan nama kolom DB (nilai_penguji_X
// untuk slot penguji, dan `pembimbing` untuk nilai_pembimbing).
export type PeranDosen = "pembimbing" | "penguji_1" | "penguji_2" | "penguji_3";

export interface MonitoringSidang {
  sidang_id?: number;
  pengajuan_sidang_id?: number;
  laporan_kp?: string;
  dokumen_penyelia?: string;

  nilai_penyelia?: number;
  nilai_pembimbing?: number;
  nilai_penguji_1?: number;
  nilai_penguji_2?: number;
  nilai_penguji_3?: number;
  nilai_akhir?: number;

  status?: string;

  jadwal_sidang?: {
    tanggal?: string;
    jam?: string;
  };

  mahasiswa?: Mahasiswa;
  pembimbing?: Pembimbing;
  // Tiga slot penguji; null = tidak di-plot di koor.
  penguji_1?: PengujiBlock;
  penguji_2?: PengujiBlock;
  penguji_3?: PengujiBlock;
  gelombang?: Gelombang;
  // Peran dosen yang sedang login pada sidang ini (computed BE).
  // Kosong = dosen tidak terlibat → kolom nilai peran tampil "-".
  // Multi-role: dosen bisa pembimbing DAN penguji sekaligus.
  peran_dosen?: PeranDosen[];
}
