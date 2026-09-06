export type Berita = {
  id?: number;
  tipe: "prestasi" | "kegiatan" | "berita";
  judul: string;
  konten: string;
  gambar?: string;
  gambarFile?: File;
  user_id?: number;
  user_name?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
};

export type BeritaFormData = {
  tipe: "prestasi" | "kegiatan" | "berita";
  judul: string;
  konten: string;
  gambar?: string;
  gambarFile?: File;
};
