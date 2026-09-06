import { configureHeaders } from "@/api/index";
import { API_URL } from "@/lib/constant";
import Sambutan from "./sambutan/sambutan";
import AdminBeritaDef from "./berita/admin-berita";
import BeritaDef from "./berita/berita";
import AdminFakultasPengumumanServiceDef from "./pengumuman/pengumuman";
import PublicFakultasPengumumanServiceDef from "./pengumuman/pengumuman-public";
import FasilitasService from "./fasilitas/fasilitas";
import HeroSliderService from "@/api/superadmin/landing-page/hero-slider";
import DashboardServiceDef from "./dashboard/dashboard";

const PUBLIC_FAKULTAS_URL = `${API_URL}/cms/public`;
const ADMIN_FAKULTAS_URL = `${API_URL}/cms/admin-fakultas`;

export const SambutanFakultasService = Sambutan({
  baseUrl: PUBLIC_FAKULTAS_URL,
  config: () => configureHeaders(),
});

export const SambutanAdminService = Sambutan({
  baseUrl: ADMIN_FAKULTAS_URL,
  config: () => configureHeaders({ skipProdiId: true }),
});

export const AdminFakultasPengumumanService = AdminFakultasPengumumanServiceDef({
  baseUrl: API_URL || "",
  config: () => configureHeaders({ skipProdiId: true }),
});

export const PublicFakultasPengumumanService = PublicFakultasPengumumanServiceDef({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const AdminBeritaService = AdminBeritaDef({
  baseUrl: API_URL || "",
  config: () => configureHeaders({ skipProdiId: true }),
});

export const BeritaFakultasService = BeritaDef({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const AdminFakultasFasilitasService = FasilitasService({
  baseUrl: ADMIN_FAKULTAS_URL,
  config: () => configureHeaders({ skipProdiId: true }),
});

export const PublicFakultasFasilitasService = FasilitasService({
  baseUrl: PUBLIC_FAKULTAS_URL,
  config: () => configureHeaders(),
});

export const AdminFakultasHeroSliderService = HeroSliderService({
  baseUrl: API_URL || "",
  config: () => configureHeaders({ skipProdiId: true }),
  endpoint: "/cms/admin-fakultas/heroslider",
});

export const AdminFakultasDashboardService = DashboardServiceDef({
  baseUrl: API_URL || "",
  config: () => configureHeaders({ skipProdiId: true }),
});
