import { Suspense } from "react";
import { HeroSection } from "@/app/(root)/components/hero-section";
import Pengumuman from "@/app/(root)/components/landingpage/pengumuman/pengumuman";
import PengumumanSkeleton from "@/app/(root)/components/landingpage/pengumuman/pengumuman-skeleton";

export default function PengumumanPage() {
  return (
    <>
      <HeroSection
        variant="badge"
        title="Pengumuman"
        subtitle="Fakultas Ilmu Komputer"
        badgeText="Informasi Terbaru."
        badgeIcon="Bell"
      />

      <main className="bg-gradient-to-b from-primary-50 to-white py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Suspense fallback={<PengumumanSkeleton />}>
              <Pengumuman />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
