import type { Pengumuman } from "@/types/admin-fakultas/pengumuman/pengumuman";

export interface FakultasPengumuman extends Pengumuman {
  is_active: boolean;
  is_popup: boolean;
  is_pop_up?: boolean;
}

export const DUMMY_FAKULTAS_PENGUMUMANS: FakultasPengumuman[] = [
  {
    id: 101,
    judul: "Pemberitahuan Libur Idul Fitri 1447 H di Lingkungan Fakultas",
    type: "fakultas",
    is_active: true,
    is_popup: true,
    isi: "<p>Diberitahukan kepada seluruh sivitas akademika Fakultas Ilmu Komputer bahwa kegiatan perkuliahan dan pelayanan administratif akan diliburkan mulai tanggal 20 Maret s.d. 27 Maret 2026 dalam rangka menyambut Hari Raya Idul Fitri. Pelayanan akan kembali aktif pada tanggal 28 Maret 2026.</p>",
    published_at: "2026-03-15T08:00:00Z",
    created_at: "2026-03-15T08:00:00Z",
    user: "Admin Fakultas",
  },
  {
    id: 102,
    judul: "Pemeliharaan Sistem Akademik Fakultas Terpusat",
    type: "fakultas",
    is_active: true,
    is_popup: true,
    isi: "<p>Akan dilakukan pemeliharaan rutin pada server akademik fakultas pada hari Sabtu, 18 April 2026 mulai pukul 22:00 WIB hingga Minggu, 19 April 2026 pukul 04:00 WIB. Durante waktu tersebut, akses ke portal mahasiswa dan dosen mungkin akan mengalami gangguan.</p>",
    published_at: "2026-04-10T10:00:00Z",
    created_at: "2026-04-10T10:00:00Z",
    user: "Admin",
  },
  {
    id: 103,
    judul: "Sosialisasi Program Pertukaran Mahasiswa Merdeka (PMM) 2026",
    type: "fakultas",
    is_active: false,
    is_popup: false,
    isi: "<p>Fakultas akan mengadakan sesi sosialisasi daring mengenai tata cara pendaftaran PMM tahun 2026. Sesi ini wajib diikuti oleh mahasiswa semester 4 dan 6 yang berminat untuk mengambil mata kuliah di luar universitas asal. Link Zoom akan dibagikan melalui grup resmi.</p>",
    published_at: "2026-04-12T14:30:00Z",
    created_at: "2026-04-12T14:30:00Z",
    user: "Admin Fakultas",
  },
  {
    id: 104,
    judul: "Update Aturan Parkir Area FIK",
    type: "fakultas",
    is_active: false,
    is_popup: false,
    isi: "<p>Sedang disiapkan pengumuman mengenai pengaturan ulang zona parkir kendaraan bermotor di area gedung D dan gedung H guna meningkatkan keamanan dan kenyamanan akses masuk fakultas.</p>",
    published_at: "2026-04-20T09:00:00Z",
    created_at: "2026-04-20T09:00:00Z",
    user: "Admin Fakultas",
  },
];
