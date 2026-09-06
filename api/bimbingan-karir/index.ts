import { configureHeaders } from "@/api/index";
import { API_URL } from "@/lib/constant";
import DaftarMhs from "./koordinator/daftar-mahasiswa/daftar-mhs";
import RekapNilai from "./koordinator/rekap-nilai/rekap-nilai";
import PersentaseRekap from "./koordinator/rekap-nilai/persentase";
import ImportMhs from "./koordinator/daftar-mahasiswa/import-mhs";
import ImportNilai from "./koordinator/rekap-nilai/import-nilai";
import Riwayat from "./koordinator/riwayat/riwayat";
import RiwayatDetail from "./koordinator/riwayat/riwayat-detail";
import DaftarKegiatan from "./koordinator/daftar-kegiatan/daftar-kegiatan";
import Presensi from "./koordinator/daftar-kegiatan/presensi";
import Sertifikat from "./koordinator/daftar-kegiatan/sertifikat";
import DaftarKegiatanMahasiswa from "./mahasiswa/daftar-kegiatan/daftar-kegiatan";
import RekapNilaiMahasiswa from "./mahasiswa/rekap-nilai/rekap-nilai";
import AnalisisKegiatan from "./koordinator/analisis-kegiatan/analisis-kegiatan";
import DashboardBK from "./koordinator/dashboard/dashboard";
import DashboardPengajarBK from "./pengajar/dashboard/dashboard";
import DashboardMhsBK from "./mahasiswa/dashboard/dashboard";
import Periode from "./koordinator/periode/periode";
import LogAktivitas from "./koordinator/log-aktivitas/log";
import FeedbackRating from "./koordinator/feedback-rating/feedback-rating";
import MinatMhs from "./koordinator/daftar-mahasiswa/minat";
import Minat from "./koordinator/minat/minat";
import AturanNilai from "./koordinator/rekap-nilai/aturan-nilai";
import ScanHeader from "./koordinator/scan";
import ManajemenPengajar from "./koordinator/manajemen-pengajar/manajemen";
import SyncLms from "./koordinator/daftar-kegiatan/lms";
import KategoriConfig from "./koordinator/kategori/kategori";
import BkPengumuman from "./pengumuman";


// Koordinator
export const DaftarMhsService = DaftarMhs({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const RekapNilaiService = RekapNilai({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const PersentaseRekapService = PersentaseRekap({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const ImportMahasiswaService = ImportMhs({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const ImportNilaiService = ImportNilai({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const RiwayatService = Riwayat({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const RiwayatDetailService = RiwayatDetail({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const DaftarKegiatanService = DaftarKegiatan({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const PresensiService = Presensi({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const SertifikatService = Sertifikat({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const AnalisisKegiatanService = AnalisisKegiatan({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const DashboardService = DashboardBK({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const DashboardPengajarService = DashboardPengajarBK({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const PeriodeService = Periode({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const LogAktivitasService = LogAktivitas({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const FeedbackRatingService = FeedbackRating({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const MinatMhsService = MinatMhs({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const AturanNilaiService = AturanNilai({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const ScanHeaderService = ScanHeader({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const ManajemenPengajarService = ManajemenPengajar({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const SyncLmsService = SyncLms({
  config: () => configureHeaders(),
});

export const KategoriService = KategoriConfig({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const MinatService = Minat({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

// Mahasiswa
export const DaftarKegiatanMahasiswaService = DaftarKegiatanMahasiswa({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const RekapNilaiMahasiswaService = RekapNilaiMahasiswa({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const DashboardMahasiswaService = DashboardMhsBK({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const BkPengumumanService = BkPengumuman({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

