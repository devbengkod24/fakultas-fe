interface Mahasiswa {
    id: number;
    nama?: string;
    nim?: string;
}

interface Pembimbing {
    id: number;
    nama?: string;
    gelar_depan?: string;
    gelar_belakang?: string;
}

interface Ruangan {
    id: number;
    nama: string;
}

interface Penguji {
    id: number;
    nama: string;
}

interface Jadwal {
    tanggal?: string;
    jam?: string;
    status?: string;
}

export interface PlottingJadwal {
    sidang_id: number;
    pengajuan_sidang_id: number;
    mahasiswa: Mahasiswa;
    pembimbing: Pembimbing;
    ruangan: Ruangan | null;
    penguji_1: Penguji | null;
    penguji_2: Penguji | null;
    penguji_3: Penguji | null;
    jadwal: Jadwal;
    gelombang: { id: number; nama: string } | null;
}
