import { HeroSection } from "@/app/(root)/components/hero-section";
import PengenalancClient from "@/app/(root)/components/profil/pengenalan/pengenalan-client";
import VisiMisiSection from "@/app/(root)/components/profil/visi-misi/visi-misi";
import StrukturOrganisasiClient from "@/app/(root)/components/profil/struktur-organisasi/struktur-organisasi-client";
import {
  StrukturOrganisasiService,
} from "@/api";
import {
  PengertianFakultasService,
} from "@/api/fakultas";
import VisiMisiSkeleton from "../../components/profil/visi-misi/visi-misi-skeleton";
import type { StrukturOrganisasi } from "@/types/fakultas/profile-page/struktur-organisasi/struktur-organisasi";
import type { Pengertian } from "@/types/fakultas/profile-page/pengenalan/pengenalan";

import { Suspense } from "react";

const fetchPengertian = async (): Promise<{
  pengertian: Pengertian | null;
  error: string | null;
}> => {
  try {
    const response = await PengertianFakultasService.getAllPengertian();

    if (response.success && response.data && response.data.length > 0) {
      return { pengertian: response.data[0], error: null };
    }
    return { pengertian: null, error: null };
  } catch (err) {
    console.error("Error fetching pengertian:", err);
    return { pengertian: null, error: null };
  }
};

const fetchStrukturOrganisasi = async (): Promise<{
  strukturOrganisasi: StrukturOrganisasi[] | null;
  error: string | null;
}> => {
  try {
    const response = await StrukturOrganisasiService.getStrukturPublic();

    if (response.success && response.data) {
      // Handle nested structure if the API returns { data: [...] }
      const responseData = response.data as unknown as { data?: StrukturOrganisasi[] };
      const data = Array.isArray(response.data) 
        ? response.data 
        : responseData.data || [];
        
      return { strukturOrganisasi: data, error: null };
    }
    // Data kosong, bukan error
    return { strukturOrganisasi: null, error: null };
  } catch (err) {
    console.error("Error fetching public struktur organisasi:", err);
    return {
      strukturOrganisasi: null,
      error: "Gagal mengambil data struktur organisasi.",
    };
  }
};

const ProfilPage = async () => {
  const { pengertian } = await fetchPengertian();
  const { strukturOrganisasi } = await fetchStrukturOrganisasi();

  return (
    <>
      <main className="flex-grow" id="ProfilPage">
        {/* Hero Banner */}
        <HeroSection
          variant="badge"
          title="Profil Fakultas"
          subtitle="Fakultas Ilmu Komputer"
          badgeText="Tentang FIK UDINUS"
          badgeIcon="Award"
        />

        {/* Pengenalan Section */}
        <section id="pengenalan" className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PengenalancClient pengertian={pengertian} />
          </div>
        </section>

        {/* Visi Misi Section */}
        <section id="visi-misi" className="py-12 md:py-16 bg-white">
          <div id="visi-misi">
            <Suspense fallback={<VisiMisiSkeleton />}>
              <VisiMisiSection/>
            </Suspense>
          </div>
        </section>

        {/* Struktur Organisasi Section */}
        <section id="struktur-organisasi" className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
              {strukturOrganisasi && strukturOrganisasi.length > 0 ? (
                <StrukturOrganisasiClient
                  strukturOrganisasi={strukturOrganisasi}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">Data struktur organisasi tidak tersedia</p>
                </div>
              )}
            </Suspense>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProfilPage;
