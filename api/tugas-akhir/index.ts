import { configureHeaders } from "@/api/index";
import { API_URL } from "@/lib/constant";
import { API_URL_V2 } from "@/lib/constant";
import Periode from "./periode";
import Mahasiswa from "./mahasiswa";
import MahasiswaV2 from "./mahasiswa-v2";
import LogAktivitas from "./log-aktivitas";
import MonitoringSidang1 from "./monitoring-sidang1";
import MonitoringSidang2 from "./monitoring-sidang2";
import Logbook from "./logbook";
import KuotaDosen from "./kuota-dosen";
import Dosen from "./dosen";
import PengajuanMahasiswa from "./pengajuan-mahasiswa";
import Dashboard from "./dashboard";
import DashboardV2 from "./dashboard-v2";
import SidangKoor from "./sidang-koor";
import GelombangTA from "./gelombang";
import TAPengumuman from "./pengumuman";

export const DashboardService = Dashboard({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const DashboardServiceV2 = DashboardV2({
  baseUrl: API_URL_V2 || "",
  config: () => configureHeaders(),
});

export const PeriodeService = Periode({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const MahasiswaService = Mahasiswa({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const MahasiswaServiceV2 = MahasiswaV2({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const LogAktivitasService = LogAktivitas({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const MonitoringSidang1Service = MonitoringSidang1({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const MonitoringSidang2Service = MonitoringSidang2({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const LogbookService = Logbook({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const KuotaDosenService = KuotaDosen({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const DosenService = Dosen({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const PengajuanMahasiswaService = PengajuanMahasiswa({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const SidangKoorService = SidangKoor({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const GelombangTAService = GelombangTA({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const TAPengumumanService = TAPengumuman({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});
