export interface MatakuliahGagal {
  matakuliah_id: number;
  kode_matakuliah: string;
  nama_matakuliah: string;
  sks: number;
  jumlah_mahasiswa_gagal: number;
}

export interface IpsPerSemester {
  [key: string]: number;
}

export interface DataPerAngkatan {
  tahun_masuk: number;
  jumlah_mahasiswa: number;
  ips_per_semester: IpsPerSemester;
}

export interface Prodi {
  id: number;
  kode_prodi: string;
  nama_prodi: string;
}

export interface ProdiDataGagal {
  prodi: Prodi;
  total_mahasiswa_gagal: number;
  top_matakuliah_gagal: MatakuliahGagal[];
}

export interface RataIpsData {
  prodi: Prodi;
  data_per_angkatan: DataPerAngkatan[];
}

export interface TabelCapaianProdi {
  prodi: Prodi;
  tren_ips: "Naik" | "Turun" | "Tetap";
  rata_rata_sks_lulus: number;
  jumlah_matakuliah_gagal: number;
}

export interface TabelCapaianDetail {
  tahun_angkatan: number;
  tren_ips: string;
  jumlah_matakuliah_gagal: number;
  rata_rata_sks_lulus: number;
  prodi: Prodi;
}

export interface MahasiswaGagal {
  mahasiswa_id: number;
  nim: string;
  nama_mahasiswa: string;
  ipk: number;
  sks_lulus: number;
  nilai_akhir: string;
  semester: number;
}
