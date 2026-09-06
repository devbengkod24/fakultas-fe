import { configureHeaders, configurePublicHeaders } from "@/api/index";
import { API_URL } from "@/lib/constant";
import Pengenalan from "./profile-page/pengenalan";
import Pengertian from "./profile-page/pengertian";
import VisiMisi from "./profile-page/visi-misi";
import Sambutan from "../admin-fakultas/sambutan/sambutan";
import RuanganSidangDef from "./manajemen-ruangan/ruangan-sidang";
import DosenFakultAS from "./dosen/dosen";
import PeriodeFakultas from "./periode";
import LaporanEksekutifFakultas from "./laporan-eksekutif";

const FIK_URL = `${API_URL}`;
const PUBLIC_FAKULTAS_URL = `${API_URL}/cms/public`;
const ADMIN_FAKULTAS_URL = `${API_URL}/cms/admin-fakultas`;

export const SambutanFakultasService = Sambutan({
  baseUrl: PUBLIC_FAKULTAS_URL,
  config: () => configurePublicHeaders(),
});

export const PengenalanFakultasService = Pengenalan({
  baseUrl: PUBLIC_FAKULTAS_URL,
  config: () => configurePublicHeaders(),
});

export const PengertianFakultasService = Pengertian({
  baseUrl: PUBLIC_FAKULTAS_URL,
  config: () => configurePublicHeaders(),
});

export const VisiMisiFakultasService = VisiMisi({
  baseUrl: PUBLIC_FAKULTAS_URL,
  config: () => configurePublicHeaders(),
});

export const SambutanAdminService = Sambutan({
  baseUrl: ADMIN_FAKULTAS_URL,
  config: () => configureHeaders({ skipProdiId: true }),
});

export const PengenalanAdminService = Pengenalan({
  baseUrl: ADMIN_FAKULTAS_URL,
  config: () => configureHeaders({ skipProdiId: true }),
});

export const PengertianAdminService = Pengertian({
  baseUrl: ADMIN_FAKULTAS_URL,
  config: () => configureHeaders({ skipProdiId: true }),
});

export const VisiMisiAdminService = VisiMisi({
  baseUrl: ADMIN_FAKULTAS_URL,
  config: () => configureHeaders({ skipProdiId: true }),
});

export const RuanganSidangService = RuanganSidangDef({
  baseUrl: FIK_URL,
  config: () => configureHeaders({ skipProdiId: true }),
});

export const DosenFakultASService = DosenFakultAS({
  baseUrl: `${API_URL}/dosen`,
  config: () => configureHeaders({ skipProdiId: true }),
});

export const PeriodeFakultasService = PeriodeFakultas({
  baseUrl: FIK_URL,
  config: () => configureHeaders({ skipProdiId: true }),
});

export const LaporanEksekutifFakultasService = LaporanEksekutifFakultas({
  baseUrl: FIK_URL,
  config: () => configureHeaders({ skipProdiId: true }),
});
