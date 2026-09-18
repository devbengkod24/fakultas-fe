import { ProdiData } from "../manajemen-prodi/manajemen-prodi";

export interface MataKuliahSync {
  id: number;
  kode: string;
  name: string;
  sks: number;
  semester_ditawarkan: number;
  tipe_mk: "nasional" | "fakultas" | "prodi" | "umum" | "peminatan" | string;
  prodi_id: number | null;
  peminatan_id?: number | null;
  prodi?: ProdiData;
}
