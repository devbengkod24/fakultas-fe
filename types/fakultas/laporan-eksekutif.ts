export interface PeriodeInfo {
  id: number;
  tahun_ajaran: string;
  kode_periode: string;
}

export interface ProdiInfo {
  id: number;
  nama: string;
  kode_prodi: string;
  gelar: string;
  kategori_prodi: string | null;
}

export interface LogbookBabStat {
  mahasiswa_acc: number;
  total_mahasiswa: number;
  persentase: number;
}

export type LogbookPerBab = Record<`bab_${1 | 2 | 3 | 4 | 5}`, LogbookBabStat>;

export interface KrsDistributionItem {
  label: string;
  value: number;
}

export interface TaStats {
  total_mahasiswa: number;
  sudah_selesai: number;
  masih_proses: number;
  dosen_pembimbing: number;
  ta1_count: number;
  ta2_count: number;
  ta1_dan_ta2_count: number;
  logbook_per_bab: LogbookPerBab;
  distribusi_krs: KrsDistributionItem[];
}

export interface KpKuota {
  alokasi: number;
  terpakai: number;
  tersisa: number;
  penggunaan_persen: number;
}

export interface KpStats {
  total_mahasiswa: number;
  sudah_selesai: number;
  masih_proses: number;
  dosen_pembimbing: number;
  kuota: KpKuota;
  logbook_per_bab: LogbookPerBab;
}

export interface BkStats {
  total_mahasiswa: number;
  jumlah_kegiatan: number;
  mahasiswa_lulus: number;
  tingkat_kelulusan_persen: number;
  threshold_nilai: number;
}

export interface EwsStats {
  aman: number;
  waspada: number;
  bahaya: number;
  total: number;
  bahaya_persen: number;
}

export interface ProdiDetailResponse {
  periode: PeriodeInfo;
  prodi: ProdiInfo;
  ta: TaStats;
  kp: KpStats;
  bk: BkStats;
  ews: EwsStats;
}
