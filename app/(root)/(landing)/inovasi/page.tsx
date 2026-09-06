"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "@/app/(root)/components/hero-section";
import TitleSubtitle from "@/app/(root)/components/title-subtitile";
import ProgramDetails from "@/app/(root)/components/program-unggulan/program-details";
import CardProgramUnggulan from "@/app/(root)/components/program-unggulan/card-program-unggulan";
import ProgramSidebar from "@/app/(root)/components/program-unggulan/program-sidebar";
import { ProgramUnggulanSkeleton } from "@/app/(root)/components/program-unggulan/program-unggulan-skeleton";
import EmptyStateProgramUnggulan from "@/app/(root)/components/program-unggulan/empty-state-program-unggulan";
import ErrorStateProgramUnggulan from "@/app/(root)/components/program-unggulan/error-state-program-unggulan";
import { ProgramUnggulanSuperAdminService } from "@/api/superadmin";
import { PengumumanProgramUnggulanSuperAdminService } from "@/api/superadmin";
import { useProfile } from "@/context/profileUseContext";

// Types for API response
interface ProgramBenefit {
  id: number;
  program_id: number;
  benefit: string;
  created_at: string;
  updated_at: string;
}

interface ProgramRequirement {
  id: number;
  program_id: number;
  requirement: string;
  created_at: string;
  updated_at: string;
}

interface ProgramPhoto {
  id: number;
  program_id: number;
  title: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

interface ProgramStatistic {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    program_id: number;
    statistic_id: number;
    value: number;
    created_at: string;
    updated_at: string;
  };
}

interface ProgramAnnouncement {
  id: number;
  title?: string;
  description?: string;
  date?: string;
  program?: string;
  type: string;
  program_id?: number;
}

interface ProgramUnggulanData {
  id: number;
  image: string;
  title: string;
  short_desc: string;
  description: string;
  partner: string;
  duration: string;
  location: string;
  application_deadline: string;
  application_link: string;
  created_at: string;
  updated_at: string;
  program_benefits: ProgramBenefit[];
  program_photos: ProgramPhoto[];
  program_requirements: ProgramRequirement[];
  pengumuman_programs: ProgramAnnouncement[];
  statistics: ProgramStatistic[];
}

const ProgramUnggulanPage = () => {
  const { activeProdiId, profile: user } = useProfile();
  const [programData, setProgramData] = useState<ProgramUnggulanData[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<ProgramAnnouncement[]>([]);

  const isAdmin = user?.roles === "admin" || user?.roles === "superadmin";

  // Function to fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const programResponse =
        await ProgramUnggulanSuperAdminService.getProgramUnggulanList(
          1, 
          100,
          activeProdiId ?? undefined
        );

      let programs: ProgramUnggulanData[] = [];
      if (Array.isArray(programResponse.data)) {
        programs = programResponse.data;
      } else if (
        programResponse.data &&
        Array.isArray(programResponse.data.data)
      ) {
        programs = programResponse.data.data;
      }

      if (programs.length > 0) {
        setProgramData(programs);
        setSelectedProgramId(programs[0].id);
      } else {
        setProgramData([]);
        setSelectedProgramId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching program data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response =
        await PengumumanProgramUnggulanSuperAdminService.getProgramUnggulanPenggumuman(
          1,
          100
        );
      setAnnouncements(response.data.data || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  // Fetch data on component mount and when activeProdiId changes
  useEffect(() => {
    fetchData();
    fetchAnnouncements();
  }, [activeProdiId]);

  // Transform API data to component format
  const transformProgramData = (apiData: ProgramUnggulanData) => {
    const stats: Record<string, number> = {
      students: 0,
      projects: 0,
      apps: 0,
      companies: 0,
      placements: 0,
      countries: 0,
      universities: 0,
      partners: 0,
    };

    if (apiData.statistics && Array.isArray(apiData.statistics)) {
      apiData.statistics.forEach((stat) => {
        switch (stat.name.toLowerCase()) {
          case "mahasiswa":
            stats.students = stat.pivot.value;
            break;
          case "proyek":
            stats.projects = stat.pivot.value;
            break;
          case "aplikasi":
            stats.apps = stat.pivot.value;
            break;
          case "perusahaan":
            stats.companies = stat.pivot.value;
            break;
          case "penempatan":
            stats.placements = stat.pivot.value;
            break;
          case "negara":
            stats.countries = stat.pivot.value;
            break;
          case "universitas":
            stats.universities = stat.pivot.value;
            break;
          case "mitra":
            stats.partners = stat.pivot.value;
            break;
        }
      });
    }

    const activityPhotos =
      apiData.program_photos && Array.isArray(apiData.program_photos)
        ? apiData.program_photos.map((photo) => {
            return {
              title: photo.title || "Kegiatan Program",
              description:
                photo.description || "Dokumentasi kegiatan program unggulan",
              image: photo.image,
            };
          })
        : [];

    const programAnnouncements = announcements.filter(
      (a) => a.program_id === apiData.id
    );

    return {
      id: apiData.id,
      image: apiData.image,
      title: apiData.title || "Program Unggulan",
      shortDesc: apiData.short_desc || "",
      description: apiData.description || "Deskripsi program belum tersedia",
      partner: apiData.partner || "Mitra Program",
      duration: apiData.duration || "1 Semester",
      location: apiData.location || "Lokasi Belum Ditentukan",
      benefits:
        apiData.program_benefits && Array.isArray(apiData.program_benefits)
          ? apiData.program_benefits.map((benefit) => benefit.benefit)
          : ["Pengalaman belajar yang berharga"],
      requirements:
        apiData.program_requirements &&
        Array.isArray(apiData.program_requirements)
          ? apiData.program_requirements.map((req) => req.requirement)
          : ["Mahasiswa aktif Program Studi"],
      activityPhotos: activityPhotos,
      stats: stats,
      statistics: apiData.statistics,
      application_deadline: apiData.application_deadline
        ? new Date(apiData.application_deadline).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Belum ditentukan",
      application_link: apiData.application_link || "#",
      pengumuman_programs: programAnnouncements,
    };
  };

  const selectedProgram = selectedProgramId
    ? programData.find((program) => program.id === selectedProgramId)
    : programData[0];

  const transformedProgram = selectedProgram
    ? transformProgramData(selectedProgram)
    : null;

  const transformedPrograms = programData.map(transformProgramData);

  const handleProgramSelect = (program: { id: number }) => {
    setSelectedProgramId(program.id);
  };

  if (isLoading) {
    return <ProgramUnggulanSkeleton />;
  }

  if (error && !programData.length) {
    return (
      <main className="min-h-screen bg-gray-50">
        <HeroSection
          variant="badge"
          title="Inovasi"
          subtitle="Fakultas Ilmu Komputer"
          badgeText="Jejaring Luas, Kesempatan Tanpa Batas."
          badgeIcon="GraduationCap"
        />
        <section className="pt-4 pb-16 md:pt-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <TitleSubtitle
              title="Inovasi"
              subtitle="Pilih program yang sesuai dengan minat dan bakat Anda"
              accentColor="blue"
            />
            <div className="max-w-2xl mx-auto p-16">
              <ErrorStateProgramUnggulan error={error} onRetry={fetchData} />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!programData.length) {
    return (
      <main className="min-h-screen bg-gray-50">
        <HeroSection
          variant="badge"
          title="Inovasi"
          subtitle="Fakultas Ilmu Komputer"
          badgeText="Jejaring Luas, Kesempatan Tanpa Batas."
          badgeIcon="GraduationCap"
        />
        <section className="pt-4 md:pt-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <TitleSubtitle
              title="Inovasi"
              subtitle="Pilih program yang sesuai dengan minat dan bakat Anda"
              accentColor="blue"
            />
            <div className="max-w-2xl mx-auto p-16">
              <EmptyStateProgramUnggulan onRefresh={fetchData} />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <HeroSection
        variant="badge"
        title="Inovasi"
        subtitle="Fakultas Ilmu Komputer"
        badgeText="Jejaring Luas, Kesempatan Tanpa Batas."
        badgeIcon="GraduationCap"
      />

      <section className="pt-4 pb-0 md:pt-16 bg-gradient-to-b from-blue-50 to-white relative">
        <div className="container mx-auto px-4 pb-0">
          <TitleSubtitle
            title="Inovasi"
            subtitle="Pilih program yang sesuai dengan minat dan bakat Anda"
            accentColor="blue"
          />
          <div className="relative max-w-6xl mx-auto">
            <CardProgramUnggulan
              programs={transformedPrograms}
              activeProgram={transformedProgram}
              onProgramSelect={handleProgramSelect}
              onRefresh={fetchData}
            />
          </div>
        </div>
      </section>

      <section className="pt-8 md:pt-6 pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <div className="lg:col-span-8 order-2 lg:order-1">
                {transformedProgram ? (
                  <ProgramDetails 
                    defaultProgram={transformedProgram} 
                    isAdmin={isAdmin}
                    showGalleryFilter={false}
                    prodiId={activeProdiId ?? undefined}
                  />
                ) : (
                  <div className="bg-white rounded-xl p-6">
                    <p className="text-gray-500">Detail program tidak tersedia</p>
                  </div>
                )}
              </div>
              <div className="lg:col-span-4 order-1 lg:order-2">
                {transformedProgram ? (
                  <ProgramSidebar activeProgram={transformedProgram} />
                ) : (
                  <div className="bg-white rounded-xl p-6">
                    <p className="text-gray-500">Informasi program tidak tersedia</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProgramUnggulanPage;
