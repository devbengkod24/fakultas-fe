"use client";

import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmptyStateDosen from "./empty-state-dosen";
import ErrorStateDosen from "./error-state-dosen";

import { AuthorDetailSuperAdminServices } from "@/api/superadmin";

interface LecturerData {
  id: string;
  name: string;
  department: string;
  subjects: string[];
  scores: {
    sintaScore3Yr: number;
    sinta_score_total: number;
    affilScore3Yr: number;
    affil_score_total: number;
  };
  avatar: string;
}

interface ProfilDosenSectionProps {
  dosenId: string;
}

const ProfilDosenSection = ({ dosenId }: ProfilDosenSectionProps) => {
  const [lecturerData, setLecturerData] = useState<LecturerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthorDetail = async () => {
      try {
        setIsLoading(true);
        // Use the dosenId from props
        const authorId = dosenId;

        const response = await AuthorDetailSuperAdminServices.getAuthorDetail({
          id: authorId,
        });
        if (response.success && response.data) {
          // Map the API response to our interface
          const authorData = response.data;
          setLecturerData({
            id: authorData.id || authorId,
            name: authorData.name || "Unknown Author",
            department: authorData.department || "Teknik Informatika - S2",
            subjects: authorData.subjects || [
              "Computer Science",
              "Artificial Intelligence",
            ],
            scores: {
              sintaScore3Yr: authorData.sinta_score_3yr || 0,
              sinta_score_total: authorData.sinta_score_total || 0,
              affilScore3Yr: authorData.affil_score_3yr || 0,
              affil_score_total: authorData.affil_score_total || 0,
            },
            avatar:
              authorData.avatar || "/assets/landingpage/img/dosen/default.jpeg",
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorDetail();
  }, [dosenId]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="text-center space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full mt-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="text-center">
                <Skeleton className="h-8 w-12 mx-auto mb-1" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorStateDosen
        error={
          "Terjadi kesalahan saat memuat data artikel. Silakan coba lagi atau hubungi administrator jika masalah berlanjut."
        }
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!lecturerData) {
    return (
      <EmptyStateDosen
        title="Profil Dosen Tidak Ditemukan"
        description="Profil dosen tidak ditemukan. Silakan periksa kembali atau muat ulang."
        onRefresh={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col items-center gap-4">
          {/* Profile Image */}
          <Avatar className="h-32 w-32">
            <AvatarImage src={lecturerData.avatar} alt={lecturerData.name} />
            <AvatarFallback>{lecturerData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {/* Basic Info */}
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">
              {lecturerData.name}
            </h1>
            <p className="text-gray-600 mb-3">{lecturerData.department}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {lecturerData.subjects.map((subject, index) => (
                <Badge key={index} variant="primary">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
          {/* Academic Metrics */}
          <div className="grid grid-cols-2 gap-4 w-full mt-2">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {lecturerData.scores.sintaScore3Yr}
              </p>
              <p className="text-sm text-gray-600">SINTA Score 3Yr</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {lecturerData.scores.sinta_score_total}
              </p>
              <p className="text-sm text-gray-600">SINTA Score Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {lecturerData.scores.affilScore3Yr}
              </p>
              <p className="text-sm text-gray-600">Affil Score 3Yr</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {lecturerData.scores.affil_score_total}
              </p>
              <p className="text-sm text-gray-600">Affil Score</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilDosenSection;
