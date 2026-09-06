export interface Dosen {
  id?: number
  npp?: string
  nama?: string
  kuota?: number
  jumlah_ajuan?: number
  ajuan_diterima?: number
  ajuan_ditolak?: number
  sisa_kuota?: number
  email?: string
  gelar_depan?: string
  gelar_belakang?: string
  aktif_periode?: boolean
}

interface MahasiswaData {
  nim?: string;
  nama?: string;
  tipe_kp?: string;
  telepon?: string;
}

export interface DosenDetail {
  id: number;
  name: string;
  gelar_depan: string;
  gelar_belakang: string;
  npp: string;
  email: string;
  telepon: string;
  link_wa: string;
  kuota: number;
  sisa_kuota: number;
  mahasiswa: MahasiswaData[];
}