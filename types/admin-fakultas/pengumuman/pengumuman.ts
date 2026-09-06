export interface Prodi {
  id: number;
  nama: string;
}

export interface Pengumuman {
  id: number;
  judul: string;
  type?: string;
  user?: string;
  prodi?: Prodi | string;
  status?: "pending" | "approved" | "rejected" | "published" | "archived";
  isi: string;
  published_at: string;
  created_at?: string;
  updated_at?: string;
}