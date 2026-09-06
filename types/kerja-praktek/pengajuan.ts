interface Mahasiswa {
    id?: number;
    nim?: string;
    nama?: string;
    email?: string;
    telepon?: string;
}

interface Dosen {
    id?: number;
    nama?: string;
    gelar_depan?: string;
    gelar_belakang?: string;
    email?: string;
}

export interface Pengajuan {
    kerja_praktek_id?: number;
    judul?: string;
    jobdesk?: string;
    tanggal_mulai_magang?: string;
    tanggal_akhir_magang?: string;
    status?: string;
    mahasiswa?: Mahasiswa;
    dosen?: Dosen;
}

export interface PengajuanForm {
    dosen_id: number;
    posisi?: string;
}