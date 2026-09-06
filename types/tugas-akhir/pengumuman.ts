export interface Pengumuman {
  id: number;
  judul: string;
  type?: string;
  user?: string;
  isi: string;
  published_at: string;
  created_at?: string;
  updated_at?: string;
}
