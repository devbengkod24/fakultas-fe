interface Mahasiswa {
    total_mahasiswa?: number,
    belum_selesai_sidang?: number,
    belum_dijadwalkan?: number,
    sudah_selesai_sidang?: number,
    progress_bimbingan?: number,
    progress_sidang?: string,
}

interface Dosen {
    total_dosen?: number,
    dosen_dengan_kuota?: number,
    total_kuota?: number,
    sisa_kuota?: number,
    penggunaan_kuota?: number,
}

interface LogbookStats {
    mahasiswa_acc?: number,
    total_mahasiswa?: number,
    persentase?: string,
}

interface Logbook {
    bab_1?: LogbookStats,
    bab_2?: LogbookStats,
    bab_3?: LogbookStats,
    bab_4?: LogbookStats,
    bab_5?: LogbookStats,
    perlu_acc?: number,
}

export interface Dashboard {
    user?: {
        id: number;
        name: string;
        email: string;
        roles: string;
        prodi?: {
            id: number;
            nama: string;
            kode_prodi: string;
        };
    },
    periode: string,
    gelombang: string,
    mahasiswa: Mahasiswa,
    dosen: Dosen,
    logbook: Logbook,
}

export interface DashboardDosen {
    dosen: {
        id: number,
        npp: number,
        nama: string,
        gelar_depan: string,
        gelar_belakang: string,
        email: string,
        telepon: string,
    },
    gelombang: string,
    periode: string,
    kuota: {
        total_kuota: number,
        total_pengajuan: number,
        ajuan_diterima: number,
        sisa_kuota: number,
    },
    logbook_progress: {
        bab_1?: number,
        bab_2?: number,
        bab_3?: number,
        bab_4?: number,
        bab_5?: number,
    },
}