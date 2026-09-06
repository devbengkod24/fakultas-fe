export interface Mahasiswa {
  nama: string;
  id?: number;
  mahasiswa_id?: number;
  name: string;
  nim: string;
  email: string;
  photo?: string;
  ipk: number;
  telepon: string;
  transkrip?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  krs_ta1: number;
  krs_ta2: number;
  created_at_sta1: string | null;
  created_at_sta2: string | null;
  jalur_sta1: string | null;
  jalur_sta2: string | null;
  status_ta: string | null;
  tgl_yudisium: string | null;
  dosen_name?: string;
  kode_periode?: string;
  tahun_ajaran?: string;
}