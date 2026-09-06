import { configureHeaders, configurePublicHeaders } from "@/api/index";
import { API_URL } from "@/lib/constant";
import { API_PUBLIKASI_URL } from "@/lib/constant";
import Pengertian from "./profile-page/pengertian";
import VisiMisi from "./profile-page/visi-misi";
import AkreditasiService from "./profile-page/akreditasi";
import SambutanKaprodiService from "./landing-page/sambutan-kaprodi";
import HeroSliderService from "./landing-page/hero-slider";
import {
  ProfilLulusanService,
  ProfesiLulusanService,
} from "./landing-page/prospek-karir";
import StrukturOrganisasiService from "./profile-page/struktur-organisasi";
import ManajemenKoordinatorService from "./manajemen-koordinator/manajemen-koordinator";
import ManajemenDosenService from "./manajemen-dosen";
import MataKuliahService from "./akademik-page/mata-kuliah";
import MataKuliahPeminatanService from "./akademik-page/mata-kuliah-peminatan";
import PeminatanService from "./akademik-page/peminatan";
import ProgramUnggulanService from "./program-unggulan-page/program-unggulan";
import ProgramUnggulanPengumumanService from "./program-unggulan-page/pengumuman-program-unggulan";
import ProgramUnggulanAktivitasService from "./program-unggulan-page/aktivitas-program-unggulan";
import ArticleService from "./publikasi-page/article";
import ResearchService from "./publikasi-page/riset";
import ImportService from "./publikasi-page/import";
import ExportPublikasiService from "./publikasi-page/export";
import AuthorDetailServices from "./publikasi-page/author-detail";
import LadderboardArticleServices from "./publikasi-page/ladderboard-article";
import LadderboardTopAuthorsServices from "./publikasi-page/ladderboard-article";
import LadderboardResearchServices from "./publikasi-page/ladderboard-research";
import SummaryStatisticServices from "./publikasi-page/summary-statistic";
import ArticleStatisticServices from "./publikasi-page/article-statistic";
import ResearchStatisticServices from "./publikasi-page/research-statistic";
import ResearchFundServices from "./publikasi-page/research-fund";
import VerifikasiSertifikatServices from "./verifikasi-sertifikat-page/verifikasi";
import ManajemenProdiService from "./manajemen-prodi/manajemen-prodi";
import ManajemenAdminService from "./manajemen-admin/manajemen-admin";

export { type ExportArtikelParams, type ExportPenelitianParams } from "./publikasi-page/export";

export const PengertianSuperAdminService = Pengertian({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const VisiMisiSuperAdminService = VisiMisi({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const AkreditasiSuperAdminService = AkreditasiService({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const SambutanKaprodiSuperAdminService = SambutanKaprodiService({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const SambutanKaprodiPublicService = SambutanKaprodiService({
  baseUrl: API_URL || "",
  config: () => configurePublicHeaders(),
});

export const HeroSliderSuperAdminService = HeroSliderService({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const HeroSliderPublicService = HeroSliderService({
  baseUrl: API_URL || "",
  config: () => configurePublicHeaders(),
  endpoint: "/cms/public/heroslider",
});

export const StrukturOrganisasiSuperAdminService = StrukturOrganisasiService({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const ProfilLulusanSuperAdminService = ProfilLulusanService({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const ProfesiLulusanSuperAdminService = ProfesiLulusanService({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const KoordinatorUsersSuperAdminService = ManajemenKoordinatorService({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const ManajemenDosenSuperAdminService = ManajemenDosenService({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const MataKuliahSuperAdminService = MataKuliahService({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const MataKuliahPeminatanSuperAdminService = MataKuliahPeminatanService({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const PeminatanSuperAdminService = PeminatanService({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const ProgramUnggulanSuperAdminService = ProgramUnggulanService({
  baseUrl: API_URL || "",
  config: () => configureHeaders(),
});

export const PengumumanProgramUnggulanSuperAdminService =
  ProgramUnggulanPengumumanService({
    baseUrl: API_URL || "",
    config: () => configureHeaders(),
  });

export const AktivitasProgramUnggulanSuperAdminService =
  ProgramUnggulanAktivitasService({
    baseUrl: API_URL || "",
    config: () => configureHeaders(),
  });

export const AktivitasProgramUnggulanPublicService =
  ProgramUnggulanAktivitasService({
    baseUrl: API_URL || "",
    config: () => configurePublicHeaders(),
  });

export const PublikasiRisetSuperAdminService = ArticleService({
  baseUrl: API_PUBLIKASI_URL || "",
  config: () => configureHeaders(),
});

export const RisetSuperAdminService = ResearchService({
  baseUrl: API_PUBLIKASI_URL || "",
  config: () => configureHeaders(),
});

export const PublikasiRisetFakultasService = ArticleService({
  baseUrl: API_PUBLIKASI_URL || "",
  config: () => configureHeaders({ skipProdiId: true }),
});

export const RisetFakultasService = ResearchService({
  baseUrl: API_PUBLIKASI_URL || "",
  config: () => configureHeaders({ skipProdiId: true }),
});

export const ImportPublikasiSuperAdminService = ImportService({
  baseUrl: API_PUBLIKASI_URL || "",
  config: () => configureHeaders({ skipProdiId: true }),
});

export const ExportPublikasiSuperAdminService = ExportPublikasiService({
  baseUrl: API_PUBLIKASI_URL || "",
  config: () => configureHeaders({ skipProdiId: true }),
});

export const LadderboardArticleSuperAdminService = LadderboardArticleServices({
  baseUrl: API_PUBLIKASI_URL || "",
  config: () => configureHeaders(),
});

export const AuthorDetailSuperAdminServices = AuthorDetailServices({
  baseUrl: API_PUBLIKASI_URL || "",
  config: () => configureHeaders(),
});

export const SummaryStatisticSuperAdminService = SummaryStatisticServices({
  baseUrl: API_PUBLIKASI_URL || "",
  config: () => configureHeaders(),
});

export const ArticleStatisticSuperAdminService = ArticleStatisticServices({
  baseUrl: API_PUBLIKASI_URL || "",
  config: () => configureHeaders(),
});

export const ResearchStatisticSuperAdminService = ResearchStatisticServices({
  baseUrl: API_PUBLIKASI_URL || "",
  config: () => configureHeaders(),
});

export const ResearchFundSuperAdminService = ResearchFundServices({
  baseUrl: API_PUBLIKASI_URL || "",
  config: () => configureHeaders(),
});

export const LadderboardTopAuthorsSuperAdminService =
  LadderboardTopAuthorsServices({
    baseUrl: API_PUBLIKASI_URL || "",
    config: () => configureHeaders(),
  });

export const LadderboardResearchSuperAdminService = LadderboardResearchServices(
  {
    baseUrl: API_PUBLIKASI_URL || "",
    config: () => configureHeaders(),
  },
);

export const VerifikasiSertifikatLandingPageServices =
  VerifikasiSertifikatServices({
    baseUrl: API_URL || "",
    config: () => configurePublicHeaders(),
  });

export const ManajemenProdiSuperAdminService = ManajemenProdiService({
  baseUrl: API_URL || "",
  config: () => configureHeaders({ skipProdiId: true }),
});

export const ManajemenKoordinatorSuperAdminService =
  ManajemenKoordinatorService({
    baseUrl: API_URL || "",
    config: () => configureHeaders({ skipProdiId: true }),
  });

export const ManajemenProdiPublicService = ManajemenProdiService({
  baseUrl: API_URL || "",
  config: () => configurePublicHeaders(),
});

export const ManajemenAdminSuperAdminService = ManajemenAdminService({
  baseUrl: API_URL || "",
  config: () => configureHeaders({ skipProdiId: true }),
});
