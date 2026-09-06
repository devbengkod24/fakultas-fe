export interface GelombangTA {
  id?: number;
  nama_gelombang?: string;
  tipe?: "ta1" | "ta2";
  periode_id?: number;
  tgl_awal?: string;
  tgl_akhir?: string;
  status?: number;
  total_pendaftar?: number;
  is_editable?: boolean;
  is_ended?: boolean;
  periode?: {
    id: number;
    kode_periode?: number;
    tahun_ajaran?: string;
  };
}
