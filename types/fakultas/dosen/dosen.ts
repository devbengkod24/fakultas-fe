import { DosenDetailExtra } from "@/types/dosen-shared";

export interface Prodi {
  id: number;
  nama: string;
  kode_prodi: string;
}

export interface Dosen {
  user_id: number;
  dosen_id: number | null;
  name: string;
  email: string;
  npp: string | null;
  gelar_depan: string | null;
  gelar_belakang: string | null;
  bidang_kajian: string | null;
  scholar_link: string | null;
  telepon: string | null;
  prodi_homebase: Prodi;
  prodi_tugas: Prodi[];
  status_dosen?: string | null;
}

export type DosenFakultas = Dosen;

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface Meta {
  success: boolean;
  message: string;
  pagination: Pagination;
}

export interface DosenDataResponse {
  data: Dosen[];
  meta: Meta;
}

export interface DosenResponse {
  success: boolean;
  message: string;
  data: DosenDataResponse;
}
