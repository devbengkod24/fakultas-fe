export interface RuanganSidang {
  id: number;
  nama_ruangan: string;
  kapasitas: number | null;
  gedung: string | null;
  is_active: boolean;
  is_online: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RuanganSidangFormData {
  nama_ruangan: string;
  kapasitas: number | null;
  gedung: string | null;
  is_active: boolean;
  is_online: boolean;
}