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
import MataKuliahFakultas from "./mata-kuliah";
import MahasiswaFakultas from "./mahasiswa";
import KrsFakultas from "./krs";
import KelompokMatkulFakultas from "./kelompok-matkul";
import ProdiFakultas from "./prodi";

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

export const MataKuliahFakultasService = MataKuliahFakultas({
  baseUrl: FIK_URL,
  config: () => configureHeaders({ skipProdiId: true }),
});

export const MahasiswaFakultasService = MahasiswaFakultas({
  baseUrl: FIK_URL,
  config: () => configureHeaders({ skipProdiId: true }),
});

export const KrsFakultasService = KrsFakultas({
  baseUrl: FIK_URL,
  config: () => configureHeaders({ skipProdiId: true }),
});

export const KelompokMatkulFakultasService = KelompokMatkulFakultas({
  baseUrl: FIK_URL,
  config: () => configureHeaders({ skipProdiId: true }),
});

export const ProdiFakultasService = ProdiFakultas({
  baseUrl: FIK_URL,
  config: () => configureHeaders({ skipProdiId: true }),
});
