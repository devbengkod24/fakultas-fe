import Dosen from './dosen';
import { configureHeaders } from "@/api/index";
import { API_URL } from "@/lib/constant";
import Periode from "./periode";
import Logbook from "./logbook";
import Mahasiswa from "./mahasiswa";
import Gelombang from "./gelombang";
import Pengajuan from "./pengajuan";
import MonitoringSidang from "./monitoring-sidang";
import PlottingJadwal from './plotting-jadwal';
import Dashboard from './dashboard';
import Sidang from './sidang';
import LogActivity from './log-activity';
import Pengumuman from './pengumuman';

export const PeriodeService = Periode({
    baseUrl: API_URL ?? "",
    config: () => configureHeaders(),
});

export const DosenService = Dosen({
    baseUrl: API_URL ?? "",
    config: () => configureHeaders(),
});

export const LogbookService = Logbook({
    baseUrl: API_URL ?? "",
    config: () => configureHeaders(),
});

export const MahasiswaService = Mahasiswa({
    baseUrl: API_URL ?? "",
    config: (options) => configureHeaders(options),
});

export const GelombangService = Gelombang({
    baseUrl: API_URL ?? "",
    config: () => configureHeaders(),
});

export const PengajuanService = Pengajuan({
    baseUrl: API_URL ?? "",
    config: () => configureHeaders(),
});

export const MonitoringSidangService = MonitoringSidang({
    baseUrl: API_URL ?? "",
    config: () => configureHeaders(),
});

export const PlottingJadwalService = PlottingJadwal({
    baseUrl: API_URL ?? "",
    config: () => configureHeaders(),
});

export const DashboardService = Dashboard({
    baseUrl: API_URL ?? "",
    config: () => configureHeaders(),
});

export const SidangService = Sidang({
    baseUrl: API_URL ?? "",
    config: () => configureHeaders(),
});

export const LogActivityService = LogActivity({
    baseUrl: API_URL ?? "",
    config: () => configureHeaders(),
});

export const PengumumanService = Pengumuman({
    baseUrl: API_URL ?? "",
    config: () => configureHeaders(),
});