import { configureHeaders } from "@/api/index";
import { API_EWS_URL } from "@/lib/constant";
import DashboardDef from "./dashboard/dashboard";
import StatistikKelulusanDef from "./statistik-kelulusan/statistik-kelulusan";
import AuthDef from "./auth/auth";
import MahasiswaDef from "./mahasiswa/mahasiswa";
import CapaianMahasiswaDef from "./capaian-mahasiswa/capaian-mahasiswa";

const EWS_BASE_URL = API_EWS_URL || "https://api-ews.dieseltrack.site/api";
const EWS_URL = EWS_BASE_URL.endsWith("/ews") ? EWS_BASE_URL : `${EWS_BASE_URL}/ews`;

export const EWSAuthService = AuthDef({
  baseUrl: EWS_URL,
  config: (options) => configureHeaders(options ?? {}),
});

export const EWSDashboardService = DashboardDef({
  baseUrl: EWS_URL,
  config: (options) => configureHeaders(options ?? {}),
});

export const EWSStatistikKelulusanService = StatistikKelulusanDef({
  baseUrl: EWS_URL,
  config: (options) => configureHeaders(options ?? {}),
});

export const EWSMahasiswaService = MahasiswaDef({
  baseUrl: EWS_URL,
  config: (options) => configureHeaders(options ?? {}),
});

export const EWSCapaianMahasiswaService = CapaianMahasiswaDef({
  baseUrl: EWS_URL,
  config: (options) => configureHeaders(options ?? {}),
});
