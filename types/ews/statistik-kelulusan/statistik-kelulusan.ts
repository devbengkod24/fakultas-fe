export type ProdiInfo = {
  id: number;
  kode_prodi: string;
  nama_prodi: string;
};

export type DetailAngkatan = {
  tahun_masuk: string | number;
  jumlah_mahasiswa: number;
  
  // Variasi Key Admin vs SuperFakultas
  ipk_dibawah_2?: number;
  ipk_kurang_dari_2?: number; 
  
  sks_kurang_dari_144: number;
  
  // Variasi Key Admin vs SuperFakultas
  nilai_d_lebih_dari_5_persen?: number;
  nilai_d_melebihi_batas?: number;
  
  // Variasi Key Admin vs SuperFakultas
  ada_nilai_e?: number;
  nilai_e?: number;
  
  jumlah_aktif?: number;
  jumlah_mangkir?: number;
  
  eligible: number;
  
  // Variasi Key Admin vs SuperFakultas
  tidak_eligible?: number;
  noneligible?: number;
  
  // Variasi Key Admin vs SuperFakultas
  ipk_rata_rata?: string | number;
  ipk_rata2?: string | number;
  
  // Khusus List SuperFakultas (Flat array di Docs)
  nama_prodi?: string;
  kode_prodi?: string;
};

export type StatistikKelulusanData = {
  prodi?: ProdiInfo;
  detail_per_tahun?: DetailAngkatan[];
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type APIResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PaginatedData<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type MahasiswaFilterItem = {
  mahasiswa_id: number;
  nim: string;
  nama_mahasiswa: string;
  tahun_masuk: string | number;
  ipk: string | number;
  sks_total: number;
  status_mahasiswa: string; // aktif, cuti, mangkir, do
  ews_status: string; // tepat_waktu, normal, perhatian, kritis
  status_kelulusan: string; // eligible, noneligible
  
  // Detail API SuperFakultas Mahasiswa List
  prodi?: ProdiInfo;
  nilai_d_melebihi_batas?: string;
  nilai_e?: string;
};

export type MataKuliah = {
  kode: string;
  nama: string;
  sks: number;
  nilai_akhir_huruf?: string;
  nilai_akhir_angka?: number; 
  semester?: number;
  kelompok?: string;
};

export type MahasiswaNilaiDetail = {
  mahasiswa_id: number;
  nim: string;
  nama_lengkap: string;
  nama_prodi?: string;
  nama_dosen_wali?: string;
  semester_aktif?: number;
  tahun_masuk?: string | number;
  ipk: string | number;
  sks_lulus: number;
  sks_tempuh?: number;
  sks_now?: number | null;
  
  // Progress MK Status (yes/no)
  mk_nasional?: "yes" | "no";
  mk_fakultas?: "yes" | "no";
  mk_prodi?: "yes" | "no";
  status_kelulusan?: string;
  
  // Nilai D
  mata_kuliah_nilai_d: MataKuliah[];
  jumlah_nilai_d: number;
  total_sks_nilai_d: number;
  
  // Nilai E
  mata_kuliah_nilai_e: MataKuliah[];
  jumlah_nilai_e: number;
  total_sks_nilai_e: number;
  
  // MK Kurang Detail
  mk_nasional_kurang: MataKuliah[];
  jumlah_mk_nasional_kurang?: number;
  mk_fakultas_kurang: MataKuliah[];
  jumlah_mk_fakultas_kurang?: number;
  mk_prodi_kurang?: MataKuliah[];
  
  total_sks_tidak_lulus: number;
};