"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Calendar, Users } from "lucide-react";
import Image from "next/image";
import { API_URL } from "@/lib/constant";
import KegiatanGallery from "./kegiatan-gallery";

// Helper function to construct image URLs
const getImageUrl = (imagePath: string | null): string => {
  if (!imagePath || imagePath === "null") {
    return "/placeholder.svg";
  }

  const cleanPath = imagePath.replace(/\\/g, "/");

  if (cleanPath.startsWith("http")) {
    return cleanPath;
  }

  // Get base URL without /api/v1
  const baseUrl =
    API_URL?.replace("/api/v1", "") || "https://api-dev-sti.dinus.id";

  if (cleanPath.startsWith("/storage/")) {
    return `${baseUrl}${cleanPath}`;
  } else {
    return `${baseUrl}/storage/${cleanPath}`;
  }
};

type ActivityPhoto = {
  title: string;
  description: string;
  image: string;
};

type ProgramProps = {
  defaultProgram: {
    id: number;
    title: string;
    partner: string;
    description: string;
    duration: string;
    location: string;
    image?: string;
    benefits: string[];
    requirements: string[];
    activityPhotos: ActivityPhoto[];
  };
  isAdmin?: boolean;
  showGalleryFilter?: boolean;
  prodiId?: number;
};

export default function ProgramDetails({ 
  defaultProgram, 
  isAdmin = false,
  showGalleryFilter = true,
  prodiId
}: ProgramProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Program Banner */}
      <div className="h-32 md:h-48 lg:h-64 relative ">
        <Image
          src={getImageUrl(defaultProgram.image || null)}
          alt={defaultProgram.title}
          fill
          className="object-cover bg-white"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 md:p-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
            {defaultProgram.title}
          </h2>
          <Badge variant="primary" className="mt-2 text-xs md:text-sm">
            {defaultProgram.partner}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full pb-3 border-b"
        >
          <TabsList className="grid w-full grid-cols-3 ">
            <TabsTrigger
              value="overview"
              className="py-3 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-600 rounded-none text-xs md:text-sm "
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="requirements"
              className="py-3 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-600 rounded-none text-xs md:text-sm"
            >
              Persyaratan
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="py-3 data-[state=active]:bg-white data-[state=active]:text-primary-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary-600 rounded-none text-xs md:text-sm"
            >
              Kegiatan
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className="p-4 md:p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-3">
                Tentang Program
              </h3>
              <p className="text-gray-600 text-sm md:text-base text-justify">
                {defaultProgram.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 md:h-5 md:w-5 text-primary-600 mr-2 flex-shrink-0" />
                <div>
                  <span className="text-gray-500">Durasi:</span>{" "}
                  {defaultProgram.duration}
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-primary-600 mr-2 flex-shrink-0" />
                <div>
                  <span className="text-gray-500">Lokasi:</span>{" "}
                  {defaultProgram.location}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-bold mb-3">
                Manfaat Program
              </h3>
              <ul className="space-y-2">
                {defaultProgram.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "requirements" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-3">
                Persyaratan Program
              </h3>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                Berikut adalah persyaratan yang harus dipenuhi untuk mengikuti
                program {defaultProgram.title}:
              </p>
              <ul className="space-y-2">
                {defaultProgram.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm md:text-base">
                Proses Seleksi
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 text-sm md:text-base">
                <li>Pendaftaran online dan pengumpulan dokumen</li>
                <li>Seleksi administrasi</li>
                <li>Tes kemampuan teknis</li>
                <li>Wawancara</li>
                <li>Pengumuman hasil seleksi</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === "activities" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-3">
                Kegiatan Program
              </h3>
              <p className="text-gray-600 mb-6 text-sm md:text-base">
                Lihat berbagai kegiatan menarik dalam program{" "}
                {defaultProgram.title}
              </p>
            </div>

            <KegiatanGallery
              programName={defaultProgram.title}
              programId={defaultProgram.id}
              prodiId={prodiId}
              isAdmin={isAdmin}
              showFilter={showGalleryFilter}
            />
          </div>
        )}
      </div>
    </div>
  );
}
