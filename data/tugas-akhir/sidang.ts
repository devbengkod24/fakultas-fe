import { Dosen } from "@/types/tugas-akhir/dosen";
import { Mahasiswa } from "@/types/tugas-akhir/mahasiswa";

export interface SubmissionData {
  id: number;
  id_mhs: number;
  id_dsn: number;
  jalur: string;
  judul: string;
  bidang_kajian: string;
  bab_terakhir: number;
  jml_bimbingan: number;
  dokumen: string;
  persetujuan: string;
  status: string;
  status_jurnal: string | null;
  persetujuan_jurnal: string | null;
  alasan_revisi: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  bold: boolean;
  dosen: Dosen;
  mahasiswa: Mahasiswa;
}

export interface SidangTA1 {
  sidang_ta1_id: number;
  mahasiswa_id: number;
  name: string;
  nim: string;
  kelas: string | null;
  judul: string;
  jalur: string;
  status_jurnal: string | null;
  link_dokumen: string;
  link_persetujuan: string;
  link_persetujuan_jurnal: string | null;
  alasan_revisi: string | null;
  status: string;
  nama_dosen: string;
  tanggal_pengajuan_sidang: string;
  gelombang_id?: number | null;
  gelombang?: any | null;
  gelombang_nama?: string | null;
}

export interface SidangTA2 {
  sidang_ta2_id: number;
  mahasiswa_id: number;
  name: string;
  nim: string;
  kelas: string | null;
  judul: string;
  link_dokumen: string;
  link_persetujuan: string;
  link_bba: string | null;
  link_skbp: string | null;
  link_turnitin: string | null;
  link_saj: string | null;
  url_jurnal: string | null;
  link_loa: string | null;
  link_bpk: string | null;
  link_pakta: string | null;
  status: string;
  jalur: string;
  alasan_revisi: string | null;
  nama_dosen: string;
  tanggal_pengajuan_sidang: string;
  gelombang_id?: number | null;
  gelombang?: any | null;
  gelombang_nama?: string | null;
}
