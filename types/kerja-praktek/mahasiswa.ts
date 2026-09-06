export interface DosenPembimbing {
  id?: number;
  gelar_depan?: string;
  nama?: string;
  gelar_belakang?: string;
}

export interface Mahasiswa {
  id?: number;
  nim?: string;
  nama?: string;
  email?: string;
  ipk?: number;
  transkrip?: string;
  telepon?: string;
  dosen_pembimbing?: DosenPembimbing;
  project_id?: number;
  kode_periode?: string;
  tahun_ajaran?: string;
}

// Add this interface for the API request body
export interface MahasiswaRequestBody {
  name: string;
  email: string;
  nim: string;
  ipk?: number;
  transkrip?: string;
  telepon?: string;
}

interface Periode {
  id: number;
  tahun_ajaran: string;
}

export interface Dosen {
  id: number;
  nama?: string;
  email?: string;
  npp?: string;
  telepon?: string;
}

interface KerjaPraktek {
  id: number;
  judul?: string;
  perusahaan?: string;
  posisi?: string;
  tgl_awal?: string;
  tgl_akhir?: string;
}

export interface Penyelia {
  id: number;
  nama?: string;
  posisi?: string;
  perusahaan?: string;
  telepon?: string;
  alamat?: string;
}

interface Project {
  id: number;
  periode: Periode;
  dosen: Dosen;
  kerja_praktek: KerjaPraktek;
  penyelia: Penyelia;
}

export interface DetailMahasiswa {
  id: number;
  nim?: string;
  nama?: string;
  email?: string;
  telepon?: string;
  transkrip?: string;
  project: Project;
}