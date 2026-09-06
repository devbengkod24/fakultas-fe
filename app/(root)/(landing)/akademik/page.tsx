import { HeroSection } from "@/app/(root)/components/hero-section";
import TitleSubtitle from "@/app/(root)/components/title-subtitile";
import ProfesiLulusanSection from "@/app/(root)/components/akademik/profesi-lulusan";
import AnimatedDasarHukum from "@/app/(root)/components/akademik/dasar-hukum";
import AnimatedMataKuliah from "@/app/(root)/components/akademik/mata-kuliah";
import AnimatedMataKuliahPeminatan from "@/app/(root)/components/akademik/mata-kuliah-peminatan";
import CapaianPembelajaranSection from "@/app/(root)/components/akademik/capaian-pembelajaran";

const AkademikPage = () => {
  return (
    <>
      <main className="flex-grow" id="AkademikPage">
        {/* Hero Banner */}
        <HeroSection
          variant="badge"
          title="Kurikulum Akademik"
          subtitle="Program Studi Teknik Informatika"
          badgeText="144 SKS Minimum Kelulusan."
          badgeIcon="School"
        />

        {/* Dasar Hukum Section */}
        <section id="dasar-hukum" className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                <TitleSubtitle title="Dasar Hukum" accentColor="blue" />
              </div>
              <AnimatedDasarHukum />
            </div>
          </div>
        </section>

        {/* Profil Lulusan Section */}
        <section id="profil-lulusan" className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <TitleSubtitle title="Profil Lulusan" accentColor="blue" />
            </div>
            <ProfesiLulusanSection />
          </div>
        </section>

        {/* Capaian Pembelajaran Section */}
        <section id="capaian-pembelajaran" className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <TitleSubtitle title="Capaian Pembelajaran" accentColor="blue" />
            </div>
            <CapaianPembelajaranSection />
          </div>
        </section>

        {/* Mata Kuliah Section */}
        <section id="mata-kuliah" className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <TitleSubtitle title="Daftar Mata Kuliah" accentColor="blue" />
            </div>
            {/* Semester Navigation */}
            <AnimatedMataKuliah />
          </div>
        </section>

        {/* Mata Kuliah Peminatan Section */}
        <section id="mata-kuliah-peminatan" className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <TitleSubtitle title="Mata Kuliah Peminatan" accentColor="blue" />
            </div>
            {/* Peminatan Navigation */}
            <AnimatedMataKuliahPeminatan />
          </div>
        </section>
      </main>
    </>
  );
};

export default AkademikPage;
