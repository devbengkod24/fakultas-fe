import { ProdiConfig } from "../config";
import { notFound } from "next/navigation";
import TitleSection from "@/app/(root)/prodi/[kode]/title";
import ProspekKarir from "@/app/(root)/prodi/[kode]/landing-page-prodi/prospek-karir/prospek-karir";
import DaftarMataKuliah from "@/app/(root)/prodi/[kode]/landing-page-prodi/daftar-mata-kuliah/daftar-mata-kuliah";
import SambutanKaprodi from "@/app/(root)/prodi/[kode]/landing-page-prodi/sambutan/sambutan";
import ProgramUnggulan from "@/app/(root)/prodi/[kode]/landing-page-prodi/program-unggulan/program-unggulan";
import ProfilProgramStudi from "@/app/(root)/prodi/[kode]/landing-page-prodi/profil-program-studi/profil-program-studi";
import PengumumanTerbaru from "@/app/(root)/prodi/[kode]/landing-page-prodi/pengumuman-terbaru/pengumuman-terbaru";
import AkreditasiProgramStudi from "@/app/(root)/prodi/[kode]/landing-page-prodi/akreditasi-program-studi/akreditasi-program-studi";
import StrukturOrganisasi from "@/app/(root)/prodi/[kode]/landing-page-prodi/struktur-organisasi/struktur-organisasi";
import AksesMudah from "@/app/(root)/prodi/[kode]/landing-page-prodi/akses-mudah/akses-mudah";
import HeroSlider from "@/app/(root)/prodi/[kode]/landing-page-prodi/hero-slider/hero-slider";
import { ProdiConfigService } from "@/api";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

// Import Services
import {
  HeroSliderSuperAdminService,
  SambutanKaprodiSuperAdminService,
  AkreditasiSuperAdminService,
  PengertianSuperAdminService,
  VisiMisiSuperAdminService,
  ProgramUnggulanSuperAdminService,
  StrukturOrganisasiSuperAdminService,
  ProfilLulusanSuperAdminService,
  ProfesiLulusanSuperAdminService,
} from "@/api/superadmin";

// Types
import { HeroSlider as HeroSliderType } from "@/types/admin/landing-page/hero-slider/hero-slider";

/**
 * Data Fetching Helpers
 */
async function getHeroSliders(prodiId: number) {
  try {
    const response = await HeroSliderSuperAdminService.getHeroSliderList(
      1,
      10,
      prodiId
    );
    const data = response.data?.data || response.data || [];
    const activeSliders = data.filter((s: HeroSliderType) => s.isActive === 1);

    if (activeSliders.length === 0) {
      return {
        images: [{
          id: 0,
          title: "Selamat Datang di Program Studi",
          subtitle: "Temukan pengalaman belajar terbaik bersama kami.",
          image: "/assets/landingpage/img/building-udinus.png",
          isActive: 1,
        }],
        error: null
      };
    }

    const sanitizedSliders = activeSliders.map((s: HeroSliderType) => ({
      ...s,
      image: !s.image || s.image.includes("bg-home2.png")
        ? "/assets/landingpage/img/building-udinus.png"
        : s.image,
    }));

    return { images: sanitizedSliders, error: null };
  } catch {
    return {
      images: [{
        id: 0,
        title: "Selamat Datang di Program Studi",
        subtitle: "Temukan pengalaman belajar terbaik bersama kami.",
        image: "/assets/landingpage/img/building-udinus.png",
        isActive: 1,
      }],
      error: null
    };
  }
}

async function getSambutan(prodiId: number) {
  try {
    const response = await SambutanKaprodiSuperAdminService.getAllSambutan(
      prodiId
    );
    const data = response.data?.data || response.data || null;
    const sambutan = Array.isArray(data) ? data[0] : data;

    if (!sambutan) {
      return {
        sambutan: {
          name: "Ketua Program Studi",
          role: "Ketua Program Studi",
          photo: "/assets/landingpage/img/default-kaprodi.png",
          image: "/assets/landingpage/img/default-kaprodi.png",
          quote: "Selamat datang di website resmi program studi kami.",
          message: "<p>Pesan sambutan dari Ketua Program Studi sedang dalam penyusunan dan akan segera diperbarui.</p>",
        },
        isEmpty: true,
        error: null
      };
    }

    const sanitizedSambutan = {
      ...sambutan,
      image: sambutan.image && sambutan.image.trim() !== "" ? sambutan.image : ((sambutan as any).photo && (sambutan as any).photo.trim() !== "" ? (sambutan as any).photo : "/assets/landingpage/img/default-kaprodi.png"),
      photo: (sambutan as any).photo && (sambutan as any).photo.trim() !== "" ? (sambutan as any).photo : (sambutan.image && sambutan.image.trim() !== "" ? sambutan.image : "/assets/landingpage/img/default-kaprodi.png"),
    };

    return { sambutan: sanitizedSambutan, isEmpty: false, error: null };
  } catch {
    return {
      sambutan: {
        name: "Ketua Program Studi",
        role: "Ketua Program Studi",
        photo: "/assets/landingpage/img/default-kaprodi.png",
        image: "/assets/landingpage/img/default-kaprodi.png",
        quote: "Selamat datang di website resmi program studi kami.",
        message: "<p>Pesan sambutan dari Ketua Program Studi sedang dalam penyusunan dan akan segera diperbarui.</p>",
      },
      isEmpty: true,
      error: null
    };
  }
}

async function getProfilData(prodiId: number) {
  try {
    const [pengertianRes, visiMisiRes] = await Promise.all([
      PengertianSuperAdminService.getAllPengertian(prodiId),
      VisiMisiSuperAdminService.getAllVisiMisi(prodiId),
    ]);

    const pData = pengertianRes.data?.[0] || pengertianRes?.[0];
    const pengertian = pData?.pengertian || "Informasi profil dan deskripsi umum program studi sedang dalam proses pengkinian data resmi.";
    const vmData = visiMisiRes.data?.[0] || visiMisiRes?.[0] || {};

    const visi = vmData.visi || "Visi program studi sedang dalam penyusunan.";
    const misi = vmData.misi && vmData.misi.length > 0 ? vmData.misi : ["Misi program studi sedang dalam penyusunan."];

    return {
      deskripsi: pengertian,
      visi,
      misi,
      isEmpty: !pData && !vmData.visi && (!vmData.misi || vmData.misi.length === 0)
    };
  } catch {
    return {
      deskripsi: "Informasi profil dan deskripsi umum program studi sedang dalam proses pengkinian data resmi.",
      visi: "Visi program studi sedang dalam penyusunan.",
      misi: ["Misi program studi sedang dalam penyusunan."],
      isEmpty: true
    };
  }
}

async function getAkreditasi(prodiId: number) {
  try {
    const response = await AkreditasiSuperAdminService.getAllAkreditasi(prodiId);
    const data = response.data || response || [];
    if (data.length === 0) {
      return { akreditasi: [], isEmpty: true };
    }
    return { akreditasi: data, isEmpty: false };
  } catch {
    return { akreditasi: [], isEmpty: true };
  }
}

async function getStruktur(prodiId: number) {
  try {
    const response =
      await StrukturOrganisasiSuperAdminService.getStrukturOrgnisasiAll(
        1,
        50,
        "",
        prodiId
      );
    const data = response.data?.data || response.data || [];
    if (data.length === 0) {
      return { struktur: [], isEmpty: true };
    }
    const sanitized = data.map((item: any) => ({
      ...item,
      image: item.image && item.image.trim() !== "" ? item.image : "/assets/landingpage/img/default-dosen-photo.png",
    }));
    return { struktur: sanitized, isEmpty: false };
  } catch {
    return { struktur: [], isEmpty: true };
  }
}

async function getProgramUnggulan(prodiId: number) {
  try {
    const response =
      await ProgramUnggulanSuperAdminService.getProgramUnggulanList(
        1,
        10,
        prodiId
      );
    const data = response.data?.data || response.data || [];
    if (data.length === 0) {
      return { programs: [], isEmpty: true };
    }
    return { programs: data, isEmpty: false };
  } catch {
    return { programs: [], isEmpty: true };
  }
}

async function getProspekKarir(prodiId: number) {
  try {
    const [profil, profesi] = await Promise.all([
      ProfilLulusanSuperAdminService.getAll(1, 100, prodiId),
      ProfesiLulusanSuperAdminService.getAll(1, 100, prodiId),
    ]);

    const deskripsi = profil.data?.data || profil.data || [];
    const profesiLulusan = profesi.data?.data || profesi.data || [];

    if (deskripsi.length === 0 && profesiLulusan.length === 0) {
      return { deskripsi: [], profesiLulusan: [], isEmpty: true };
    }

    return {
      deskripsi,
      profesiLulusan,
      isEmpty: false
    };
  } catch {
    return {
      deskripsi: [],
      profesiLulusan: [],
      isEmpty: true
    };
  }
}

/**
 * Landing Page utama per Prodi.
 * Mendukung data dinamis dari API berdasarkan kode prodi.
 */
export default async function ProdiLandingPage({
  params,
}: {
  params: Promise<{ kode: string }>;
}) {
  const { kode } = await params;

  // Fetch prodi identity first
  let prodi: ProdiConfig | null = null;
  try {
    const response = await ProdiConfigService.getByKode(kode);
    prodi = response?.data || null;
  } catch (error) {
    console.error("Error fetching prodi identity:", error);
  }

  if (!prodi) {
    notFound();
  }

  // Fetch all dynamic data in parallel using the prodi.id
  const [heroData, sambutanData, profilData, akreditasiRes, strukturRes, programsRes, prospekKarirRes] =
    await Promise.all([
      getHeroSliders(prodi.id),
      getSambutan(prodi.id),
      getProfilData(prodi.id),
      getAkreditasi(prodi.id),
      getStruktur(prodi.id),
      getProgramUnggulan(prodi.id),
      getProspekKarir(prodi.id),
    ]);

  const hasMatkul = true;
  const hasAnnouncements = true;

  return (
    <div className="p-4 sm:p-6 lg:p-12 mt-16">

      {/* Header / Hero */}
      {heroData.images.length > 0 && (
        <div className="py-4 mb-12">
          <section id="hero-slider" className="h-full">
            <HeroSlider
              images={heroData.images}
              error={heroData.error}
              prodiName={prodi.nama}
            />
          </section>
        </div>
      )}

      {/* Content */}
      <div className="space-y-12">
        {/* 1. Sambutan */}
        {sambutanData.sambutan && (
          <section id="sambutan" className="py-4 md:py-8 bg-white">
            <div className="container mx-auto">
              <SambutanKaprodi
                sambutan={sambutanData.sambutan}
                slogan={sambutanData.sambutan.quote}
                prodiNama={prodi.nama}
              />
            </div>
          </section>
        )}

        {/* 2. Profil Program Studi */}
        <section id="profil-program-studi" className="py-4 md:py-8 bg-white">
          <div className="container mx-auto">
            <TitleSection
              titlePrefix="Profil"
              titleHighlight="Program Studi"
              subtitle={`Kenali lebih dekat pengertian umum beserta visi dan misi dari program studi ${prodi.nama}.`}
            />
            <ProfilProgramStudi
              deskripsi={profilData.deskripsi}
              visi={profilData.visi}
              misi={profilData.misi}
              prodiNama={prodi.nama}
            />
          </div>
        </section>

        {/* 3. Prospek Karir */}
        <section id="prospek-karir" className="py-4 md:py-8 bg-white">
          <div className="container mx-auto">
            <TitleSection
              titlePrefix="Prospek"
              titleHighlight="Karir"
              subtitle={`Berbagai peluang karir menanti lulusan Program Studi ${prodi.nama}.`}
            />
            <ProspekKarir data={prospekKarirRes} isEmpty={prospekKarirRes.isEmpty} prodiNama={prodi.nama} />
          </div>
        </section>

        {/* 4. Akreditasi Program Studi */}
        <section id="akreditasi-program-studi" className="py-4 md:py-8 bg-white">
          <div className="container mx-auto">
            <TitleSection
              titlePrefix="Akreditasi"
              titleHighlight="Program Studi"
              subtitle={`Sertifikat akreditasi dari program studi ${prodi.nama}.`}
            />
            <AkreditasiProgramStudi akreditasi={akreditasiRes.akreditasi} isEmpty={akreditasiRes.isEmpty} prodiNama={prodi.nama} />
          </div>
        </section>


        {/* 5. Daftar Mata Kuliah */}
        {hasMatkul && (
          <section id="daftar-mata-kuliah" className="py-4 md:py-8 bg-white">
            <div className="container mx-auto">
              <TitleSection
                titlePrefix="Daftar"
                titleHighlight="Mata Kuliah"
                subtitle={`Kurikulum dan daftar mata kuliah yang akan dipelajari di program studi ${prodi.nama}.`}
              />
              <DaftarMataKuliah prodiId={prodi.id} />
            </div>
          </section>
        )}


        {/* 6. Program Unggulan */}
        <section id="program-unggulan" className="py-4 md:py-8 bg-white">
          <div className="container mx-auto">
            <TitleSection
              titlePrefix="Program"
              titleHighlight="Unggulan"
              subtitle={`Program khusus yang dirancang untuk mempersiapkan Anda menghadapi perkembangan industri masa depan.`}
            />
            <ProgramUnggulan programs={programsRes.programs} isEmpty={programsRes.isEmpty} prodiNama={prodi.nama} />
          </div>
        </section>

        {/* 7. Struktur Organisasi */}
        <section id="struktur-organisasi" className="py-4 md:py-8 bg-white">
          <div className="container mx-auto">
            <TitleSection
              titlePrefix="Struktur"
              titleHighlight="Organisasi"
              subtitle={`Informasi tentang struktur organisasi program studi ${prodi.nama}.`}
            />
            <StrukturOrganisasi strukturOrganisasi={strukturRes.struktur} isEmpty={strukturRes.isEmpty} prodiNama={prodi.nama} />
          </div>
        </section>

        {/* 8. Pengumuman Terbaru */}
        {hasAnnouncements && (
          <section id="pengumuman-terbaru" className="py-4 md:py-8 bg-white">
            <div className="container mx-auto">
              <TitleSection
                titlePrefix="Pengumuman"
                titleHighlight="Terbaru"
                subtitle={`Informasi terkini tentang program studi ${prodi.nama}.`}
              />
              <PengumumanTerbaru prodiId={prodi.id} />
            </div>
          </section>
        )}

        {/* 9. Akses Mudah */}
        <section id="akses-mudah" className="py-4 md:py-8 bg-white">
          <div className="container mx-auto">
            <TitleSection
              titlePrefix="Akses"
              titleHighlight="Mudah"
              subtitle={`Berbagai layanan akademik dan fasilitas kampus dalam satu platform terintegrasi.`}
            />
            <AksesMudah />
          </div>
        </section>
      </div>
    </div>
  );
}
