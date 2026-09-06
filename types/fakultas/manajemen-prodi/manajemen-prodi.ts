export interface ProdiCategory {
  id: number;
  nama: string;
}

export interface ProdiData {
  id: number;
  nama: string;
  kode_prodi: string;
  category_id: number;
  gelar: string;
  category?: ProdiCategory | string;
}
