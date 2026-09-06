export interface MataKuliahPeminatanItem {
  id?: number;
  kode: string;
  name: string;
  sks: number;
  peminatan_id: number;
  peminatan?: string; // For display purposes in table
}

export interface Peminatan {
  id?: number;
  peminatan: string;
}
