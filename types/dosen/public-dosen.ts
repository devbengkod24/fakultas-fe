export interface PublicDosenHomeBase {
  kode: string;
  nama: string;
}

export interface PublicJadwalMengajar {
  id: number;
  hari: string;
  jam: string;
  kelas: string;
  matkul: string;
  ruang: string;
}

export interface PublicKeterangan {
  id: number;
  keterangan: string;
  judul?: string | null;
  tahun?: number | null;
  dana_dikti?: number | null;
  dana_perguruan_tinggi?: number | null;
  dana_institusi_lain?: number | null;
}

export interface PublicDosen {
  id: number;
  nama: string | null;
  nidn: string | null;
  npp: string | null;
  home_base: PublicDosenHomeBase | null;
  jabatan_fungsional: string | null;
  status_staff: string | null;
  golongan: string | null;
  email: string | null;
  penulis_id: number | null;
  linked_to_publikasi: boolean;
  avatar: string | null;
  jadwal_mengajar?: PublicJadwalMengajar[];
  pengabdian?: PublicKeterangan[];
  kekayaan_intelektual?: PublicKeterangan[];
}

export interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T;
}