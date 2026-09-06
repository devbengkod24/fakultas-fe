export interface PublicDosenHomeBase {
  kode: string;
  nama: string;
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
  email_alternatif: string | null;
  penulis_id: number | null;
  linked_to_publikasi: boolean;
  avatar: string | null;
}

export interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T;
}