/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Header from "@/app/(root)/components/header";
import Footer from "@/app/(root)/components/footer";
import { Suspense } from "react";

// Import Skeletons
import { HeroSkeleton } from "@/app/(root)/components/landingpage/hero-slider/hero-skeleton";
import SambutanSkeleton from "@/app/(root)/components/landingpage/sambutan/sambutan-skeleton";
import { BeritaKegiatanSkeleton } from "@/app/(root)/components/landingpage/berita-kegiatan/berita-kegiatan-skeleton";

// Import New FIK Components
import HeroSlider from "@/app/(root)/components/landingpage/hero-slider/hero-slider";
import BeritaKegiatanSection from "@/app/(root)/components/landingpage/berita-kegiatan/berita-kegiatan";
import SambutanKaprodi from "@/app/(root)/components/landingpage/sambutan/sambutan";
import ProgramStudiClient from "@/app/(root)/components/landingpage/program-studi/program-studi-client";
import FasilitasClient from "@/app/(root)/components/landingpage/fasilitas/fasilitas-client";
import AlumniStoriesClient from "@/app/(root)/components/landingpage/alumni-stories/alumni-stories-client";
import CTAClient from "@/app/(root)/components/landingpage/cta/cta-client";

// Import Types & Services
import type { HeroSlider as HeroSliderType } from "@/types/admin/landing-page/hero-slider/hero-slider";
import type { BeritaItem } from "@/app/(root)/components/landingpage/berita-kegiatan/berita-kegiatan-client";
import {
  HeroSliderPublicService,
} from "@/api/superadmin";
import {
  SambutanFakultasService,
} from "@/api/fakultas";

async function getHeroSliders() {
  try {
    const response = await HeroSliderPublicService.getHeroSliderList(1, 50, 0);
    const slidersData = response.data?.data || response.data || [];
    const activeSliders = Array.isArray(slidersData)
      ? slidersData.filter((slider: HeroSliderType) => slider.isActive === 1)
      : [];
    return { images: activeSliders, error: null };
  } catch (err) {
    return { images: [], error: "Gagal memuat data hero slider" };
  }
}

async function getSambutan() {
  try {
    const response = await SambutanFakultasService.getAllSambutan();
    const sambutData = response.data?.data || response.data || null;
    const finalData = Array.isArray(sambutData) ? sambutData[0] : sambutData;
    return { sambutan: finalData, error: null };
  } catch (err) {
    return { sambutan: null, error: "Gagal memuat data sambutan" };
  }
}

const Home = async () => {
  const { images, error: heroError } = await getHeroSliders();
  const { sambutan, error: sambutanError } = await getSambutan();

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSlider images={images} error={heroError} />
      </Suspense>

      {/* Berita & Kegiatan */}
      <Suspense fallback={<BeritaKegiatanSkeleton />}>
        <BeritaKegiatanSection />
      </Suspense>

      {/* Sambutan Dekan */}
      <Suspense fallback={<SambutanSkeleton />}>
        <SambutanKaprodi />
      </Suspense>

      {/* Program Studi (Sudah punya routing Link internal ke /prodi/[kode]) */}
      <ProgramStudiClient />

      {/* Fasilitas Unggulan */}
      <FasilitasClient />

      {/* Kisah Sukses Alumni */}
      <AlumniStoriesClient />

      {/* CTA Pendaftaran Mahasiswa Baru */}
      <CTAClient />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
