export interface Pengumuman {
    id: number
    judul: string
    type: string
    published_at: Date
    created_at: Date
    updated_at: Date
    user: string
    isi: string
}

export interface JmlMhsMinat {
    webdev: number
    mobiledev: number
    datascience: number
}

export interface ChartData {
  [period: string]: {
    [category: string]: {
      [key: string]: number;
    };
  };
}

export interface MenuDashboardItem {
  title: string;
  subtitle: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  total_mahasiswa?: number;
  total_kegiatan?: number;
  periode_saat_ini?: {
    tahun_ajaran: string;
  };
}

export interface KegiatanItem {
  nama_kegiatan: string;
  lokasi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  jumlah_mahasiswa: number;
  jumlah_hadir: number;
  nilai: number;
  poster?: string;
}